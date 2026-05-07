# 前端代码详解

本文档详细介绍前端代码的目录结构、每个文件的职责，以及 AI SDK 的使用方式。

---

## 目录结构

```
├── app/                           # Next.js App Router
│   ├── layout.tsx                 # 根布局：Google 字体（Unbounded/Manrope/JetBrains Mono）、SEO、暗色主题
│   ├── globals.css                # 全局 CSS 变量、颜色系统、工具类
│   │
│   ├── (marketing)/               # Landing Page 路由组（括号表示不影响 URL）
│   │   ├── page.tsx               # 首页入口（带 generateMetadata）→ 渲染 HomePageContent
│   │   ├── layout.tsx             # Marketing 布局（CircuitBackground + Navigation）
│   │   ├── loading.tsx            # 加载状态 UI
│   │   ├── HomePageContent.tsx    # 首页主内容组织（Hero + Stats + Contact + Footer）
│   │   └── _components/           # Landing Page 专用组件
│   │       ├── Hero.tsx           # 英雄区（大标题、CTA 按钮）
│   │       ├── StatsSection.tsx   # 数据统计展示
│   │       └── ContactSection.tsx # 联系方式
│   │
│   ├── chat/                      # Chat 页面
│   │   ├── page.tsx               # Chat 页面入口 → 渲染 Chat 组件
│   │   ├── layout.tsx             # Chat 布局（Navigation + 顶部留白）
│   │   └── loading.tsx            # 加载状态
│   │
│   ├── _components/               # 跨页面共享组件
│   │   ├── layouts/Navigation.tsx # 顶部导航栏
│   │   └── common/
│   │       ├── CircuitBackground.tsx  # Marketing 页面背景动效
│   │       └── MarkdownModal.tsx      # 通用 Markdown 弹窗
│   │
│   └── test-api/                  # API 测试页面（开发用）
│
├── components/                    # 通用 React 组件
│   ├── chat/                      # Chat 核心组件
│   │   ├── chat.tsx               # 主聊天组件（useChat Hook + FingerprintJS）
│   │   ├── message.tsx            # 单条消息渲染（PreviewMessage + ThinkingMessage）
│   │   ├── multimodal-input.tsx   # 输入框 + 快捷按钮
│   │   ├── overview.tsx           # Chat 欢迎屏（头像 + 介绍）
│   │   ├── markdown.tsx           # Markdown 渲染（带 onQuestionClick 回调）
│   │   └── icons/                 # Chat 相关图标（ArrowUp, Stop, Loader, Sparkles）
│   │
│   ├── ui/                        # shadcn/ui 基础组件
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   └── ... (50+ 组件)
│   │
│   └── theme-provider.tsx         # 主题切换 Provider
│
├── lib/                           # 工具函数
│   ├── constants.ts               # 常量（METADATA、CDN_ASSETS、ROUTES）
│   ├── utils.ts                   # 工具函数（cn 合并类名、sanitizeUIMessages）
│   └── seo/                       # SEO 配置
│       ├── config.ts
│       └── generateMetadata.ts
│
├── data/                          # 静态数据
│   ├── achievement-stats.ts       # Landing Page 统计数据
│   └── suggested-actions.json     # Chat 快捷按钮配置（4 条建议问题）
│
├── hooks/                         # 自定义 React Hooks
│   ├── use-mobile.tsx             # 移动端检测
│   └── use-scroll-to-bottom.tsx   # 自动滚动到底部
│
├── types/                         # TypeScript 类型定义
├── public/                        # 静态资源（图片等）
└── styles/                        # 额外样式
```

---

## 关键文件详解

### `app/layout.tsx` - 根布局

- 引入三个 Google 字体并暴露为 CSS 变量：
  - `Unbounded` → `--font-display`（标题）
  - `Manrope` → `--font-body`（正文）
  - `JetBrains_Mono` → `--font-mono`（代码）
- 通过 `generateSEOMetadata()` 生成 SEO 元数据
- 默认使用暗色主题（`<html className="dark">`）
- 引入 `globals.css`

### `app/globals.css` - 全局样式

- CSS 变量定义颜色系统（黑白主题 + 强调色）
- 工具类：`bold-card`, `bold-button`, `bold-nav` 等
- 暗色模式支持

### `components/chat/chat.tsx` - 核心聊天组件

这是 AI 交互的核心，使用 Vercel AI SDK v5：

```tsx
import { useChat } from "@ai-sdk/react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

const {
  messages,
  setMessages,
  sendMessage,
  status,    // 'idle' | 'submitted' | 'streaming'
  stop,
} = useChat({
  onError: (error) => {
    if (error.message.includes("Too many requests") || error.message.includes("429")) {
      toast.error("You have reached the usage limit, please try again in 60 minutes");
    } else {
      toast.error(error.message);
    }
  },
});
```

**关键实现：**
1. **浏览器指纹**：用 `FingerprintJS` 生成 `visitorId`，存到 `useRef`
2. **fetch 拦截**：在 `useEffect` 里覆盖 `window.fetch`，对 `/api/chat` 请求注入 `X-Client-Fingerprint` Header
3. **Streaming 处理**：`useChat` 自动解析后端 SSE 响应，实时更新 `messages` 列表
4. **自动滚动**：通过 `useScrollToBottom` Hook 让消息列表始终滚到底部
5. **欢迎屏 / 上下文条**：`messages.length === 0` 时显示 `<Overview />`，否则显示可关闭的"AI ASSISTANT"提示条

> 注意：本项目没有维护 `chatId` 多会话的概念，`chatId` 写死为 `"001"`。每次刷新页面就是新会话。

### `components/chat/multimodal-input.tsx` - 输入组件

- `<Textarea>` 文本输入框（自动调整高度，按 `Enter` 发送，`Shift+Enter` 换行）
- 输入框内容用 `useLocalStorage("input", "")` 持久化（刷新不丢）
- 快捷按钮：从 `data/suggested-actions.json` 加载，渲染成网格
- `isLoading` 时按钮变成「停止」按钮，调用 `stop()` 中断 streaming

### `components/chat/message.tsx` - 消息渲染

- `PreviewMessage`：单条消息组件
  - 用户消息：右侧黑底白字 + 头像（来自 `CDN_ASSETS.PROFILE_PHOTO`）
  - AI 消息：左侧白底黑字 + "AI" 字样
  - 渲染 AI SDK v5 的 `message.parts`（数组），目前只处理 `type === 'text'`
  - 通过 `<Markdown>` 渲染文本，支持 `onQuestionClick` 回调（点击问题自动追问）
- `ThinkingMessage`：用户消息发出后、AI 回复未到时的「THINKING...」加载占位

### `components/chat/overview.tsx` - 欢迎屏

显示头像 + "HI! I'M JOHN'S AI ASSISTANT" 大标题。`AI_ASSISTANT_NAME` 来自 `lib/constants.ts`。

### `lib/constants.ts` - 常量配置

```ts
export const METADATA = {
  TITLE: "YingQiang Yuan - AI Developer & Data Engineer",
  DESCRIPTION: "Personal website and portfolio of YingQiang Yuan",
  AI_ASSISTANT_NAME: "AI Assistant",
} as const;

export const CDN_ASSETS = {
  HERO_IMAGE_LOW_MARGIN: "...",
  PROFILE_PHOTO: "/images/profile.png",
} as const;

export const ROUTES = {
  HOME: "/",
  CHAT: "/chat",
} as const;
```

### `data/suggested-actions.json` - 快捷问题

定义 Chat 欢迎屏上的 4 个建议按钮，每条包含 `title` / `label` / `action`，例如：

```json
{
  "title": "👤 About Me",
  "label": "Understanding YingQiang's background",
  "action": "Tell me about YingQiang's professional background."
}
```

点击后会以 `action` 文本作为用户消息发送给后端。

---

## AI SDK 依赖说明

### `package.json` 中的 AI 相关依赖

| 包名 | 版本 | 用途 |
|------|------|------|
| `ai` | ^6.0.72 | Vercel AI SDK 核心，定义 streaming 协议和类型（`UIMessage`、`ChatRequestOptions`） |
| `@ai-sdk/react` | ^3.0.79 | React Hooks (`useChat`) |

### AI SDK 工作原理（v5）

```
前端 useChat()
    ↓ POST /api/chat（带 X-Client-Fingerprint header）
后端 FastAPI
    ↓ 调用 Bedrock 生成回复
    ↓ 返回 SSE Stream（header: x-vercel-ai-ui-message-stream: v1）
useChat 解析事件并更新 UI
```

**v5 SSE 事件格式：**

每行以 `data: ` 开头，后跟 JSON。文本流采用三阶段模式：

| 事件 | 用途 |
|------|------|
| `text-start` | 文本块开始（带 `id`） |
| `text-delta` | 文本片段（可多次发送） |
| `text-end` | 文本块结束 |
| `finish-message` | 整条消息完成（`finishReason: "stop"`） |
| `[DONE]` | SSE 流终止标记 |

前端不需要手动解析，`useChat` Hook 自动处理并把消息合并到 `messages` 数组。

---

## 其他重要依赖

| 包名 | 用途 |
|------|------|
| `@radix-ui/*` | 无障碍 UI 组件（shadcn/ui 底层） |
| `tailwind-merge` / `clsx` | 智能合并 Tailwind 类名（`cn` 工具函数） |
| `framer-motion` | 动画库（消息进入动画、Hero 动效） |
| `react-markdown` + `remark-gfm` | Markdown 渲染（带 GFM 表格、删除线等） |
| `react-syntax-highlighter` | 代码块高亮 |
| `lucide-react` / `react-icons` | 图标库 |
| `sonner` | Toast 通知 |
| `@fingerprintjs/fingerprintjs` | 浏览器指纹生成（限流追踪） |
| `usehooks-ts` | React Hooks 工具库（`useLocalStorage`、`useWindowSize`） |
| `next-themes` | 主题切换（暗色模式） |
| `recharts` | 图表（统计数据展示） |
| `concurrently` | 同时启动 Next.js 和 FastAPI（`npm run dev`） |

---

## 路由结构

| URL | 文件 | 说明 |
|-----|------|------|
| `/` | `app/(marketing)/page.tsx` | Landing Page（个人简介） |
| `/chat` | `app/chat/page.tsx` | AI Chat 页面 |
| `/test-api` | `app/test-api/page.tsx` | API 测试（开发用） |

**注意：** `(marketing)` 括号表示路由组，不影响 URL 路径，只用于在 `app/` 下组织文件。

---

## 启动命令

| 命令 | 说明 |
|------|------|
| `mise run dev` | 同时启动 Next.js (3000) + FastAPI (8000)，自动重启旧进程 |
| `mise run next-dev` | 仅启动 Next.js |
| `mise run fastapi-dev` | 仅启动 FastAPI |
| `mise run kill` | 杀掉所有开发服务器（运行 `kill-dev-servers.py`） |
