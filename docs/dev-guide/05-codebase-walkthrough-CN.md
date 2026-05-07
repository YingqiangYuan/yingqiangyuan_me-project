# 代码库架构概览

本文档提供项目的高层架构视图，帮助你快速理解代码组织结构。

---

## 项目结构

```
yingqiangyuan_me-project/
│
├── yingqiangyuan_me/       # Python 后端核心代码，包含配置、AWS 客户端、Bedrock 对话管理等所有业务逻辑
├── api/                    # FastAPI 入口文件，部署到 Vercel 时作为 Serverless Function 运行
├── app/                    # Next.js 前端页面（App Router），用户看到的 Landing Page 和 Chat 界面
├── components/             # React 组件库，包含按钮、输入框、聊天气泡等可复用的 UI 组件
├── lib/                    # 前端工具函数（cn 类名合并、SEO 元数据生成等）
├── data/                   # 静态数据（Landing Page 统计、Chat 快捷问题）
├── hooks/                  # 自定义 React Hooks
├── types/                  # TypeScript 类型定义
├── public/                 # 静态资源（图片、图标）
├── styles/                 # 额外样式
├── tests_python/           # Python 测试文件，用 pytest 框架运行（mise.toml 已配置；初始化项目时按需创建）
├── tests_node/             # Node.js 测试文件，用 node --test 运行
├── kill-dev-servers.py     # 杀掉占用端口的开发服务器进程
├── mise.toml               # 开发任务配置文件，定义了 `mise run dev` 等快捷命令和工具版本
├── pyproject.toml          # Python 项目配置文件，列出了所有需要安装的 Python 包（如 FastAPI、boto3）
├── package.json            # Node.js 项目配置文件，列出了所有需要安装的前端包（如 React、Next.js）
├── next.config.js          # Next.js 配置
├── tailwind.config.ts      # Tailwind CSS 配置
├── tsconfig.json           # TypeScript 配置
└── vercel.json             # Vercel 部署配置
```

---

## yingqiangyuan_me 模块结构

这是整个项目的「大脑」，所有后端业务逻辑都在这里。

```
yingqiangyuan_me/
│
├── __init__.py                                       # 暴露 `one` 单例（`from yingqiangyuan_me import one`）
├── api.py                                            # 对外暴露的入口文件
├── runtime.py                                        # 运行环境检测器，自动判断代码是跑在本地还是 Vercel 上
├── paths.py                                          # 路径管理器，把 prompts 路径集中定义并缓存内容
├── utils.py                                          # 工具函数（`debug` 把消息打到 stderr）
├── multi_round_bedrock_runtime_chat_manager.py      # ChatSession，封装 Bedrock Converse API 多轮对话
├── ai_sdk_adapter.py                                 # 格式转换器，前端 AI SDK 格式 ↔ Bedrock 格式
│
├── config/                                           # 配置相关代码的文件夹
│   ├── __init__.py
│   └── conf_00_def.py                                # 配置类定义，读取环境变量（AWS 密钥、model_id）并提供给其他代码
│
├── one/                                              # 主类和 Mixin 的文件夹，采用「组合模式」把不同功能拆分到不同文件
│   ├── __init__.py
│   ├── api.py                                        # 导出 `one = One()` 单例
│   ├── one_00_main.py                                # 主类 One，通过多继承把下面的 Mixin 组合在一起
│   ├── one_01_config.py                              # ConfigMixin，提供 `self.config` 属性
│   └── one_02_boto3.py                               # Boto3Mixin，提供 `self.bedrock_runtime_client` 等 AWS 客户端
│
└── prompts/                                          # AI 提示词模板文件夹
    ├── instruction.md                                # System Prompt，告诉 AI 它的角色和行为
    └── knowledge-base.md                             # 知识库（个人简历、项目经验等），作为对话首轮 user message 注入
```

---

## 类继承结构

`One` 类采用 Mixin 模式，把不同功能拆分到不同的类中，然后组合在一起。这样代码更容易维护。

```
One (one_00_main.py)
│   Main class, inherits all Mixins below, has config + AWS capabilities
│
├── ConfigMixin (one_01_config.py)
│   │   Provides configuration reading capability
│   └── self.config  →  Config dataclass (aws_region, aws_*_key, model_id)
│
└── Boto3Mixin (one_02_boto3.py)
        Provides AWS service access capability
    ├── self.bsm                       →  BotoSesManager wrapping configured credentials
    ├── self.boto_ses                  →  boto3.Session with configured credentials
    └── self.bedrock_runtime_client    →  Bedrock client for calling AI models (Nova / Claude / etc.)
```

> 注意：本项目目前没有数据库连接、没有 Strands Agent / 工具调用，所有对话直接走 Bedrock Converse API。如果将来需要加入这些能力，可以新增 `one_0X_db.py`、`one_0X_agent.py` 等 Mixin 并加到 `One` 的多继承列表中。

---

## 数据流

当用户在聊天界面发送消息时，数据会按以下路径流动：

```
┌──────────────────────────────────────────────────────────────┐
│  User Input (Chat UI)                                        │
│  User types a question in the chat box and clicks send       │
└──────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│  Next.js Frontend (components/chat/chat.tsx)                 │
│  Frontend uses useChat hook to send HTTP request             │
│  - useChat hook (Vercel AI SDK v5)                           │
│  - POST /api/chat with X-Client-Fingerprint header           │
└──────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│  FastAPI Backend (api/index.py)                              │
│  Backend API receives request, parses messages               │
│  - Parse request (ai_sdk_adapter.py)                         │
│  - Build ChatSession with system prompt + cachePoint         │
│  - Inject knowledge-base.md as first turn (cached)           │
│  - Append frontend conversation history                      │
└──────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│  ChatSession (multi_round_bedrock_runtime_chat_manager.py)   │
│  Wraps boto3.client.converse(...) for multi-turn chat        │
│  - Maintains _messages history                               │
│  - Returns typed dataclass response                          │
└──────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│  AWS Bedrock (LLM)                                           │
│  Cloud AI model (default: us.amazon.nova-micro-v1:0)         │
│  - Configurable via Config.model_id                          │
└──────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│  SSE Streaming Response (ai_sdk_message_generator)           │
│  Sends events: text-start → text-delta → text-end            │
│                → finish-message → [DONE]                     │
│  - AI SDK v5 Data Stream Protocol                            │
│  - Header: x-vercel-ai-ui-message-stream: v1                 │
└──────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│  useChat parses events, updates messages array               │
│  PreviewMessage renders Markdown content in real time        │
└──────────────────────────────────────────────────────────────┘
```

---

## 测试结构

`mise.toml` 中已配置 `tests_python/`（pytest）和 `tests_node/`（`node --test`）两个测试目录。命名规则建议：`test_<模块名>.py` 或 `test_<文件夹>_<文件名>.py`。

参考目录布局（按需创建）：

```
tests_python/
│
├── config/
│   └── test_config_conf_00_def.py      # 测试配置类是否能正确读取环境变量
│
├── one/
│   ├── test_one_one_00_main.py         # 测试 One 主类是否能正常初始化
│   ├── test_one_one_01_config.py       # 测试 ConfigMixin
│   └── test_one_one_02_boto3.py        # 测试 Boto3Mixin 的 client 创建
│
├── test_api.py                         # 测试 yingqiangyuan_me/api.py 的导出
├── test_paths.py                       # 测试 PathEnum 内容加载
├── test_runtime.py                     # 测试运行时检测
├── test_ai_sdk_adapter.py              # 测试格式转换函数
└── test_multi_round_bedrock_runtime_chat_manager.py
```

---

## 关键单例

整个程序中有三个重要的「单例」对象，它们在程序启动时创建一次，之后到处使用同一个实例：

```python
from yingqiangyuan_me.api import one             # 主对象，包含 config / Bedrock client 等所有能力
from yingqiangyuan_me.paths import path_enum     # 路径对象，通过它获取 prompts 文件路径和缓存内容
from yingqiangyuan_me.runtime import runtime     # 运行时对象，用于判断当前是本地开发还是云端部署
```

> `one` 实际定义在 `yingqiangyuan_me/one/one_00_main.py` 末尾的 `one = One()`，并通过 `one/api.py` 和 `yingqiangyuan_me/api.py` 两层 re-export 暴露。

---

## 常用命令

| 命令 | 说明 |
|------|------|
| `mise run inst` | 安装所有依赖（Python + Node.js 的包都会装好） |
| `mise run inst-python-deps` | 仅安装 Python 依赖（`uv sync --all-extras`） |
| `mise run inst-node-deps` | 仅安装 Node.js 依赖（`pnpm install`） |
| `mise run venv-create` | 创建 Python 虚拟环境（`.venv/`） |
| `mise run venv-remove` | 删除虚拟环境 |
| `mise run dev` | 启动开发服务器（Next.js + FastAPI 同时启动，自动重启旧进程） |
| `mise run kill` | 杀掉所有开发服务器进程 |
| `mise run next-dev` | 仅启动 Next.js（端口 3000） |
| `mise run fastapi-dev` | 仅启动 FastAPI（端口 8000） |
| `mise run test` | 运行所有测试（Python + Node.js） |
| `mise run test-python` | 仅运行 Python 测试 |
| `mise run test-node` | 仅运行 Node.js 测试 |
| `mise run export` | 导出 Python 依赖到 `requirements.txt`（Vercel 部署用） |

---

## 下一步

各模块的详细说明请参考后续文档：

- [02-backend-walkthrough-CN.md](./02-backend-walkthrough-CN.md) — 后端代码详解（FastAPI + Bedrock）
- [03-frontend-walkthrough-CN.md](./03-frontend-walkthrough-CN.md) — 前端代码详解（Next.js + AI SDK）
