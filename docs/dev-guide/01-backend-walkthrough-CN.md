# 后端代码详解

本文档详细介绍后端代码的目录结构、每个文件的职责，以及 AWS Bedrock 的调用流程。

---

## 目录结构

```
├── api/                                              # FastAPI 入口（Vercel Serverless）
│   └── index.py                                      # 所有 API 路由定义
│
└── yingqiangyuan_me/                                 # 核心业务逻辑（Python 包）
    ├── __init__.py                                   # 暴露 `one` 单例
    ├── api.py                                        # 对外暴露的入口（`from yingqiangyuan_me.api import one`）
    ├── runtime.py                                    # 运行时检测（local vs Vercel）
    ├── paths.py                                      # 文件路径枚举（prompts 位置 + 内容缓存）
    ├── utils.py                                      # 工具函数（debug 打印到 stderr）
    ├── multi_round_bedrock_runtime_chat_manager.py   # Bedrock 多轮对话管理（ChatSession）
    ├── ai_sdk_adapter.py                             # AI SDK ↔ Bedrock 格式转换
    │
    ├── config/                                       # 配置相关代码
    │   ├── __init__.py
    │   └── conf_00_def.py                            # 配置类定义（环境检测、AWS credentials、model_id）
    │
    ├── one/                                          # 主类和 Mixin 的文件夹（组合模式）
    │   ├── __init__.py
    │   ├── api.py                                    # 导出 `one = One()` 单例
    │   ├── one_00_main.py                            # 主类 One，组合所有 Mixin
    │   ├── one_01_config.py                          # ConfigMixin，提供 `self.config`
    │   └── one_02_boto3.py                           # Boto3Mixin，提供 `self.bedrock_runtime_client`
    │
    └── prompts/                                      # Prompt 模板
        ├── instruction.md                            # System Prompt（AI 行为定义）
        └── knowledge-base.md                         # 知识库（AI 参考的背景信息）
```

---

## 关键文件详解

### `api/index.py` - API 入口

这是 FastAPI 应用的入口，定义了两个端点：

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/hello` | GET | 健康检查 |
| `/api/chat` | POST | 主聊天端点，处理 AI 对话 |

**`/api/chat` 核心流程：**

```python
@app.post("/api/chat")
async def handle_chat_data(request: Request, protocol: str = Query("data")):
    # 1. 解析 AI SDK 请求格式
    request_body_data = await debug_ai_sdk_request(request=request)
    request_body = RequestBody(**request_body_data)

    # 2. 初始化 Bedrock 会话（带 cachePoint 节省成本）
    chat_session = ChatSession(
        client=one.bedrock_runtime_client,
        model_id=one.config.model_id,
        system=[
            {"text": path_enum.instruction_content},   # System Prompt
            {"cachePoint": {"type": "default"}},       # 缓存 system prompt
        ],
    )
    chat_session._session_id = request_body.id  # 保留前端会话 ID

    # 3. 注入知识库（同样使用 cachePoint 缓存）
    chat_session_messages = [
        {"role": "user", "content": [
            {"text": path_enum.knowledge_base_content},
            {"cachePoint": {"type": "default"}},
        ]},
        {"role": "assistant", "content": [
            {"text": "I've reviewed the knowledge base and I'm ready..."},
        ]},
    ]

    # 4. 追加前端传来的对话历史
    messages = request_body_to_bedrock_converse_messages(request_body)
    chat_session_messages.extend(messages)
    chat_session._messages = chat_session_messages

    # 5. 调用 Bedrock 生成回复
    response = chat_session.send_message([])
    output_text = chat_session.debug_response(response)

    # 6. 返回 SSE Streaming 响应（AI SDK v5 Data Stream 协议）
    response = StreamingResponse(
        ai_sdk_message_generator(output_text=output_text),
        media_type="text/event-stream",
    )
    response.headers["x-vercel-ai-ui-message-stream"] = "v1"  # AI SDK v5 必需
    response.headers["Cache-Control"] = "no-cache"
    response.headers["Connection"] = "keep-alive"
    return response
```

> 注意：本项目目前没有使用工具调用（tools/agent），完全依赖 Bedrock Converse API 直接生成回复。System Prompt + 知识库已经足以支撑「介绍个人简历」这类问答场景。

---

### `yingqiangyuan_me/config/conf_00_def.py` - 配置管理

**设计模式：** Config Pattern

核心思想：把所有环境相关的配置集中在一个地方，其他代码只需要 `from yingqiangyuan_me.config.conf_00_def import Config` 即可。

```python
@dataclasses.dataclass
class Config:
    aws_region: str | None = dataclasses.field(default=None)
    aws_access_key_id: str | None = dataclasses.field(default=None)
    aws_secret_access_key: str | None = dataclasses.field(default=None)
    model_id: str | None = dataclasses.field(default="us.amazon.nova-micro-v1:0")

    @classmethod
    def _load_env_var(cls):
        return cls(
            aws_region="us-east-1",
            aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
            aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
        )

    @classmethod
    def new_in_local_runtime(cls):
        # 本地：先 load_dotenv 再读环境变量
        from dotenv import load_dotenv
        load_dotenv()
        return cls._load_env_var()

    @classmethod
    def new_in_vercel_runtime(cls):
        # Vercel：直接从环境变量读取
        return cls._load_env_var()

    @classmethod
    def new(cls):
        # 启动时自动检测运行时环境
        if runtime.is_local():
            return cls.new_in_local_runtime()
        elif runtime.is_vercel():
            return cls.new_in_vercel_runtime()
        else:
            raise RuntimeError
```

**好处：** 添加新配置只需修改这一个文件，不需要到处加 `if runtime.is_vercel()` 检查。

> 注意：本项目本地和 Vercel 都使用环境变量加载凭证（`_load_env_var` 通用方法），区别在于本地会先调用 `load_dotenv()` 读取 `.env` 文件。

---

### `yingqiangyuan_me/runtime.py` - 运行时检测

检测当前是本地开发还是 Vercel 环境：

```python
class RuntimeEnum(str, enum.Enum):
    LOCAL = "LOCAL"
    VERCEL = "VERCEL"


class Runtime:
    @cached_property
    def name(self) -> str:
        if os.environ.get("VERCEL", "NOTHING") == "1":
            return RuntimeEnum.VERCEL.value
        else:
            return RuntimeEnum.LOCAL.value

    def is_local(self) -> bool:
        return self.name == RuntimeEnum.LOCAL.value

    def is_vercel(self) -> bool:
        return self.name == RuntimeEnum.VERCEL.value


runtime = Runtime()
```

---

### `yingqiangyuan_me/paths.py` - 路径管理 & 内容缓存

把项目里所有重要的文件路径集中定义在一起，并通过 `@cached_property` 缓存 Prompt 文件内容（只读取一次）。

```python
class PathEnum:
    dir_package = Path(__file__).absolute().parent
    dir_project_root = dir_package.parent
    dir_prompts = dir_package / "prompts"
    path_instruction_md = dir_prompts / "instruction.md"
    path_knowledge_base_md = dir_prompts / "knowledge-base.md"

    @cached_property
    def instruction_content(self) -> str:
        return self.path_instruction_md.read_text(encoding="utf-8")

    @cached_property
    def knowledge_base_content(self) -> str:
        return self.path_knowledge_base_md.read_text(encoding="utf-8")


path_enum = PathEnum()
```

---

### `yingqiangyuan_me/multi_round_bedrock_runtime_chat_manager.py` - 对话管理

封装 AWS Bedrock Converse API，管理多轮对话：

```python
@dataclasses.dataclass
class ChatSession:
    client: "Client"           # boto3 Bedrock Runtime client
    model_id: str              # e.g., "us.amazon.nova-micro-v1:0"
    system: T.Sequence[...]    # System Prompt（可包含 cachePoint）
    _session_id: str           # 会话 ID（默认 "abc"，可被前端覆盖）
    _messages: list            # 对话历史

    def send_message(self, messages):
        """发送消息并获取 AI 回复，自动维护对话历史"""
        self._messages.extend(messages)
        kwargs = remove_optional(
            modelId=self.model_id,
            messages=self._messages,
            system=self.system,
        )
        response = self.client.converse(**kwargs)
        # 用 boto3_dataclass 把字典转成有类型的 dataclass，便于 IDE 自动补全
        response = boto3_dataclass_bedrock_runtime.caster.converse(response)
        # 把 AI 回复也加入历史，供下一轮使用
        self._messages.append(response.output.message.boto3_raw_data)
        return response

    def send_text_message(self, message: str):
        """便捷方法：直接发文本消息"""
        ...

    def debug_response(self, response) -> str:
        """打印响应内容和 token 用量，并返回输出文本"""
        ...
```

**功能：**
- 自动管理对话历史
- 封装 Bedrock Converse API 调用
- 用 `boto3_dataclass` 提供类型化响应（IDE 自动补全）
- 提供调试方法（打印 token 用量）

---

### `yingqiangyuan_me/ai_sdk_adapter.py` - 格式转换

AI SDK（前端）和 Bedrock（后端）使用不同的消息格式，这个模块负责转换：

**AI SDK 格式：**
```json
{
  "messages": [
    {"role": "user", "parts": [{"type": "text", "text": "Hello"}]}
  ]
}
```

**Bedrock 格式：**
```json
{
  "messages": [
    {"role": "user", "content": [{"text": "Hello"}]}
  ]
}
```

**关键函数：**

| 函数 | 用途 |
|------|------|
| `part_to_bedrock_content()` | 单个 message part 转 Bedrock content block（目前仅支持 text，扩展图片/文件需在此添加） |
| `message_to_bedrock_message()` | 单条消息转 Bedrock 格式（system 角色被跳过，因为 Bedrock 单独传 system） |
| `request_body_to_bedrock_converse_messages()` | 批量转换整个对话历史 |
| `get_last_user_message_text()` | 提取最后一条用户消息的文本（用于长度校验等） |
| `debug_ai_sdk_request()` | 打印请求头和 body 到 stderr，便于排查 |
| `ai_sdk_message_generator()` | 生成 AI SDK v5 Data Stream 格式的 SSE 响应 |

**SSE 协议说明（AI SDK v5）：**

`ai_sdk_message_generator` 按 `text-start → text-delta → text-end → finish-message → [DONE]` 五个事件发送数据，前端 `useChat` 会自动解析并渲染。

---

### `yingqiangyuan_me/one/` - 主类和 Mixin

采用「组合模式」把不同功能拆分到不同 Mixin，再通过多继承组合到一个 `One` 主类。

```python
# one/one_00_main.py
class One(
    ConfigMixin,
    Boto3Mixin,
):
    """Central class that combines all mixin functionalities for the application."""


one = One()
```

**当前包含的 Mixin：**

| Mixin | 文件 | 提供的能力 |
|-------|------|-----------|
| `ConfigMixin` | `one_01_config.py` | `self.config` → `Config` 实例（懒加载，cached_property） |
| `Boto3Mixin` | `one_02_boto3.py` | `self.bsm`、`self.boto_ses`、`self.bedrock_runtime_client` |

**`Boto3Mixin` 说明：**

```python
class Boto3Mixin:
    @cached_property
    def bsm(self: "One") -> BotoSesManager:
        return BotoSesManager(
            region_name=self.config.aws_region,
            aws_access_key_id=self.config.aws_access_key_id,
            aws_secret_access_key=self.config.aws_secret_access_key,
        )

    @cached_property
    def boto_ses(self: "One") -> boto3.Session:
        return self.bsm.boto_ses

    @cached_property
    def bedrock_runtime_client(self: "One") -> "BedrockRuntimeClient":
        return self.boto_ses.client("bedrock-runtime")
```

通过 `from yingqiangyuan_me.one.api import one` 拿到全局单例后，就可以直接 `one.config.model_id` 或 `one.bedrock_runtime_client` 了。

---

### `yingqiangyuan_me/prompts/` - Prompt 模板

| 文件 | 用途 |
|------|------|
| `instruction.md` | System Prompt，定义 AI Agent 的角色、行为和回答风格 |
| `knowledge-base.md` | 知识库内容（个人简历、项目经验等），作为对话第一轮 user message 注入 |

这些文件通过 `paths.py` 的 `@cached_property` 加载（只读一次，常驻内存）。

---

## 数据流

```
前端 useChat()
    ↓ POST /api/chat (AI SDK v5 格式)
api/index.py
    ↓ debug_ai_sdk_request 打印请求
    ↓ RequestBody(**data) 解析
    ↓ 构建 ChatSession（system + cachePoint）
    ↓ 注入 knowledge-base 作为首轮对话
    ↓ request_body_to_bedrock_converse_messages 转换历史
    ↓
ChatSession.send_message
    ↓ client.converse(...)
    ↓
AWS Bedrock (Nova / 其他模型)
    ↓ 生成回复
    ↓
ai_sdk_message_generator
    ↓ text-start / text-delta / text-end / finish-message / [DONE]
    ↓ SSE Streaming
前端 useChat() 渲染
```

---

## Python 依赖说明

| 包名 | 用途 |
|------|------|
| `fastapi` | Web 框架 |
| `uvicorn` | ASGI 服务器 |
| `boto3` | AWS SDK |
| `boto3-dataclass[bedrock-runtime]` | 把 boto3 字典响应转成有类型的 dataclass，IDE 自动补全友好 |
| `boto-session-manager` | 简化 AWS Session 创建（`BotoSesManager`） |
| `vercel-ai-sdk-mate` | AI SDK 请求/响应格式解析 |
| `func-args` | 处理可选参数（`OPT` / `remove_optional`） |
| `pydantic` | 数据校验 |
| `python-dotenv` | 本地从 `.env` 读取环境变量 |
| `rich` | 彩色调试输出 |
| `pynamodb`、`pynamodb-session-manager` | DynamoDB SDK（已声明依赖，目前未在主链路使用） |

---

## 添加新功能的位置

| 需求 | 修改位置 |
|------|----------|
| 换 AI 模型 | `yingqiangyuan_me/config/conf_00_def.py` 的 `model_id` 默认值 |
| 改 System Prompt | `yingqiangyuan_me/prompts/instruction.md` |
| 改知识库 | `yingqiangyuan_me/prompts/knowledge-base.md` |
| 添加新 API 端点 | `api/index.py` |
| 添加新配置项 | `yingqiangyuan_me/config/conf_00_def.py`（加字段并在工厂方法中赋值） |
| 添加新 AWS 客户端（如 S3） | `yingqiangyuan_me/one/one_02_boto3.py`（在 `Boto3Mixin` 中加 `@cached_property`） |
| 添加新 Mixin（如 DB 能力） | 新建 `one/one_0X_xxx.py`，在 `one_00_main.py` 的 `One` 多继承中加上 |
| 支持图片/文件输入 | `yingqiangyuan_me/ai_sdk_adapter.py` 的 `part_to_bedrock_content` |
