# 前端代码详解

本文档详细介绍前端代码的目录结构、每个文件的职责，以及 AI SDK 的使用方式。当前 UI 采用 **Neural Fabric** 主题：深色 PCB / HUD 风格，配合青蓝（cyan）→ 紫（violet）→ 粉（signal）渐变和等宽字体标签。

---

## 目录结构

```
├── app/                           # Next.js App Router
│   ├── layout.tsx                 # 根布局：Google 字体（Unbounded/Manrope/JetBrains Mono）、SEO、暗色主题
│   ├── globals.css                # Neural Fabric 颜色 token + glass / panel-edge / chip-button / hud-label 等工具类
│   │
│   ├── (marketing)/               # Landing Page 路由组（括号表示不影响 URL）
│   │   ├── page.tsx               # 首页入口（带 generateMetadata）→ 渲染 HomePageContent
│   │   ├── layout.tsx             # Marketing 布局（CircuitBackground + Navigation）
│   │   ├── loading.tsx            # 加载状态 UI
│   │   ├── HomePageContent.tsx    # 首页主内容组织（Hero + Stats + Contact + Footer）
│   │   └── _components/           # Landing Page 专用组件
│   │       ├── Hero.tsx           # 英雄区（左侧文字 + 右侧人像/Token Usage 卡片 + 技能 ticker）
│   │       ├── StatsSection.tsx   # SHIPPED IN PRODUCTION（2×3 项目卡片网格）
│   │       └── ContactSection.tsx # GET IN TOUCH（Email / LinkedIn / GitHub 三通道）
│   │
│   ├── chat/                      # Chat 页面
│   │   ├── page.tsx               # Chat 页面入口 → 渲染 Chat 组件
│   │   ├── layout.tsx             # Chat 布局（CircuitBackground + Navigation + 顶部留白）
│   │   └── loading.tsx            # 加载状态
│   │
│   ├── _components/               # 跨页面共享组件
│   │   ├── layouts/Navigation.tsx # 顶部导航栏（minimal-nav，含 INITIATE CHAT CTA）
│   │   └── common/
│   │       ├── CircuitBackground.tsx  # 全屏 PCB / 网格 / 扫描线背景动效
│   │       └── MarkdownModal.tsx      # 通用 Markdown 弹窗
│   │
│   └── test-api/                  # API 测试页面（开发用）
│
├── components/                    # 通用 React 组件
│   ├── chat/                      # Chat 核心组件
│   │   ├── chat.tsx               # 主聊天组件（useChat Hook + FingerprintJS + AI TWIN 上下文条）
│   │   ├── message.tsx            # 单条消息渲染（PreviewMessage + ThinkingMessage）
│   │   ├── multimodal-input.tsx   # 输入框 + SUGGESTED PROMPTS 网格 + HUD footer
│   │   ├── overview.tsx           # Chat 欢迎屏（HUD strip + 头像 + capability chips）
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
│   ├── achievement-stats.ts       # Landing Page 项目卡片数据（title/subtitle/tags/href/accent）
│   └── suggested-actions.json     # Chat 快捷按钮配置（4 条建议问题）
│
├── hooks/                         # 自定义 React Hooks
│   ├── use-mobile.tsx             # 移动端检测
│   └── use-scroll-to-bottom.tsx   # 自动滚动到底部
│
├── types/                         # TypeScript 类型定义（含 AchievementStat、NavItem 等）
├── public/                        # 静态资源（图片等）
├── tailwind.config.ts             # Neural Fabric 调色盘 + 字号 + 动画 + 阴影
└── styles/                        # 额外样式
```

---

## 设计系统：Neural Fabric

### 调色盘（`tailwind.config.ts`）

| Token | HEX | 用途 |
|-------|-----|------|
| `ink` | `#04060B` | 最底层背景（深 substrate） |
| `substrate` | `#070B14` | 卡片基底 |
| `wafer` | `#0B1322` | 抬升 glass 面板 |
| `trace` | `#13203A` | PCB trace 线条 |
| `foam` | `#E7EEF7` | 主文本 |
| `ash` | `#8597B0` | 次级文本 |
| `slate` | `#3A4860` | 禁用态 |
| `cyan` | `#5BE9FF` | 主强调色（含 `cyan-soft`、`cyan-deep`） |
| `violet` | `#7C5CFF` | 次强调色（含 `violet-soft`、`violet-deep`） |
| `mint` | `#9CFF7B` | 在线 / 成功 |
| `signal` | `#FF4FB8` | 警示 / 亮点 |
| `amber` | `#FFB347` | 中性提醒 |

### 自定义字号

| 类名 | 取值 | 用途 |
|------|------|------|
| `text-display-xl` | `clamp(3.5rem, 11vw, 9rem)` | 巨型 wordmark |
| `text-display-lg` | `clamp(2.5rem, 7vw, 5.5rem)` | Hero 主标题 |
| `text-display-md` | `clamp(1.75rem, 4vw, 3rem)` | 章节标题 |

### 自定义动画

`pulse-dot`（呼吸点）、`scan`（扫描线）、`float-slow`（缓慢浮动）、`drift`（PCB 漂移）、`ticker`（无缝滚动跑马灯）。

### 自定义阴影

`shadow-glass`、`shadow-glass-strong`、`shadow-glow-cyan`、`shadow-glow-violet`、`shadow-ring-cyan`。

### 全局工具类（`app/globals.css`）

| 类名 | 用途 |
|------|------|
| `.glass` / `.glass-strong` | 玻璃拟物面板（半透明 + 模糊 + 内描边） |
| `.panel-edge` | 给卡片加双层 PCB 风格描边（`::before` / `::after`） |
| `.chip-button` / `.chip-button-ghost` | 等宽小按钮（实心 / 镂空两种风格） |
| `.mono-tag` | 等宽小标签（带圆点和方括号） |
| `.hud-label` | `[ 01 / IDENTITY ]` 这类章节标号 |
| `.text-cyan-grad` / `.text-foam-grad` | 文字渐变填充 |
| `.bg-grid-fine` | 细网格背景 |
| `.minimal-nav` | 顶部导航栏的 backdrop-blur 容器 |

新加 / 替换组件的 className 大量使用这些工具类，写新代码时优先复用。

---

## 关键文件详解

### `app/layout.tsx` - 根布局

- 引入三个 Google 字体并暴露为 CSS 变量：
  - `Unbounded` → `--font-display`（标题，配合 `font-display`）
  - `Manrope` → `--font-body`（正文，配合 `font-body`）
  - `JetBrains_Mono` → `--font-mono`（代码 / HUD 标签，配合 `font-mono`）
- 通过 `generateSEOMetadata()` 生成 SEO 元数据
- `viewport.themeColor` 设为 `#04060B`（与 `ink` 一致）
- 默认使用暗色主题（`<html className="dark">`）
- `body` 默认配色：`bg-ink text-foam`，选中态 `selection:bg-cyan/30`

### `app/globals.css` - 全局样式

- 定义 `--ink / --substrate / --wafer / --trace / --foam / --ash / --cyan / --violet / --mint / --signal` 等 CSS 变量
- 兼容 shadcn 的 HSL 变量（`--primary` / `--card` / `--border` 等）
- 在 `@layer components` 里集中定义上一节列出的工具类

### `app/(marketing)/layout.tsx` - Marketing 布局

只做两件事：渲染全屏背景 `<CircuitBackground />` 和顶部 `<Navigation />`，再放置 `children`。

### `app/_components/common/CircuitBackground.tsx` - 背景动效

固定定位、`-z-10`、`pointer-events-none`，由多层叠加：

1. **径向色块**：左上 cyan、右上 violet、底部中央 signal 的 radial-gradient。
2. **细网格**：44px × 44px 网格，配 mask 让中心更亮、四角衰减。
3. **PCB SVG**：芯片、走线、节点的 SVG 图案，配合 `animate-drift` 缓慢漂移。
4. （可选）扫描线（`showScan`）和 noise 层。

通过 `variant="full" | "subtle"` 控制整体透明度。

### `app/_components/layouts/Navigation.tsx` - 导航栏

- `fixed top-0` + `minimal-nav`（backdrop-blur）
- 左侧品牌：呼吸点（`animate-ping` + `bg-cyan`）+ "Yingqiang Yuan" + 副标题 "AI DEVELOPER · DATA ENGINEER"
- 桌面右侧：普通 nav item 加上一个特殊的 `INITIATE CHAT` chip-button（带 `pulse-dot` 和 `ArrowUpRight` 图标），指向 `/chat`
- 移动端：汉堡菜单展开后底部显示同样的 `INITIATE CHAT` 块状按钮

### `app/(marketing)/_components/Hero.tsx` - 英雄区

布局是 12 列网格，左 7 / 右 5：

**左列（IDENTITY）：**
- HUD label `[ 01 / IDENTITY ]`
- 大字 wordmark：`YINGQIANG`（foam 渐变）+ `YUAN`（cyan 渐变），用 `text-display-lg`
- 副标题 "AI DEVELOPER · DATA ENGINEER" 配水平渐变线
- 一段定位文案，关键词用 cyan / violet 着色
- 主 CTA `TALK TO MY AI TWIN`：渐变描边 + glass 背景 + Sparkles 图标 + `LIVE` 状态点 + hover shimmer
- 次级渠道 chip：EMAIL / GITHUB / LINKEDIN（用 `chip-button-ghost`）

**右列（Portrait + Token Usage 卡片）：**
- 四角 corner brackets 装饰
- Portrait 卡片：window 控制点 + `NODE://YINGQIANG-01` 文本 + 头像（`/images/profile.png`）+ HUD 标 `AGENT · ACTIVE` + 底部 `SCU · MS CS · 2025`
- Token Usage 卡片：`TOKEN USAGE / 24H` 标题 + LIVE 呼吸点 + 显示当日 token 用量（如 `12.4M tokens`）+ 渐变进度条

> **Token usage 是确定性伪造数据**：`tokenUsageForToday()` 用 FNV-1a + xorshift 把 `YYYY-MM-DD` 哈希成 `[2M, 20M]` 区间内的均匀采样。同一天页面显示固定值，第二天会变。仅作视觉点缀，**没有真正调用 API 统计**。

**底部技能 ticker：**
`SKILL_GROUPS` 数组（AI / LLM、AWS、DATA、STREAMING、BACKEND、LANG、DB、DEVOPS）通过 `animate-ticker` 无缝滚动，左右两侧用 mask 渐隐。

### `app/(marketing)/_components/StatsSection.tsx` - 项目展示

- HUD label `[ 02 / FEATURED WORK ]` + 大标题 "SHIPPED IN PRODUCTION"
- 右侧统计 chip：项目数 + 呼吸点 + `INDEXED`
- 主体：1 / 2 / 3 列响应式网格，渲染 `data/achievement-stats.ts` 中的每条 `AchievementStat`
- 每张卡片包含：
  - 序号 `/ 01` `/ 02`（按 accent 着色）
  - 标题（`text-foam-grad`）
  - 副标题（一段简介）
  - tags（等宽小标签）
  - 底部状态条：内容齐全显示 `READY`（mint 点），否则 `DRAFT`（slate 点）；带 `href` 时右侧显示 `OPEN ↗`
  - 角落 radial-gradient 光晕，颜色由 `accent` 字段决定（cyan / violet / mint / signal / amber）
- 有 `href` 的卡片会包一层 `<Link>`，外链自动加 `target="_blank"`

### `app/(marketing)/_components/ContactSection.tsx` - 联系方式

- HUD label `[ 03 / GET IN TOUCH ]` + 大标题 "LET'S BUILD TOGETHER"
- 左 5 列：自我介绍（强调 MS CS、找新岗位、Santa Clara）+ `chip-button` "ASK MY AI TWIN FIRST" 跳转 `/chat`
- 右 7 列：3 个 CHANNEL 卡片（EMAIL 标 `◇ PRIMARY CHANNEL`，LinkedIn / GitHub 标 `SECONDARY`），每张卡片用对应 accent 渐变背景、glass + panel-edge 样式

### `app/(marketing)/HomePageContent.tsx` - 首页装配

简单串联 `Hero → StatsSection → ContactSection`，再加一个 footer 显示 `© YINGQIANG YUAN`、`ALL SIGNALS RESERVED` 以及 `SYSTEM ONLINE · LATENCY 12MS` 状态条。

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
5. **AI TWIN 上下文条**：`messages.length > 0 && isContextBannerVisible` 时显示 "AI TWIN · ACTIVE" 卡片（带 mint 呼吸点和关闭按钮）；初始 `messages.length === 0` 时显示 `<Overview />`

> 注意：本项目没有维护 `chatId` 多会话的概念，`chatId` 写死为 `"001"`。每次刷新页面就是新会话。

### `components/chat/multimodal-input.tsx` - 输入组件

整体是 `panel-edge glass-strong` 包裹的输入面板：

- **空对话时**：上方显示 `[ SUGGESTED PROMPTS ]` 网格，从 `data/suggested-actions.json` 读取 4 条建议（每条带序号 `/ 01`、标题、label、点击发送）
- **输入框**：左侧固定 `>` 等宽提示符；占位 `ask the ai twin · ⏎ to transmit`；自动调整高度；按 `Enter` 发送、`Shift+Enter` 换行；内容用 `useLocalStorage("input", "")` 持久化
- **HUD footer**：左侧显示 `⌘+⏎ NEWLINE · {n} CHR`；右侧 `ENCRYPTED` 状态点 + 发送按钮（cyan→violet 渐变；`isLoading` 时切换为 `StopIcon` 红色按钮，调用 `stop()` 中断）

### `components/chat/message.tsx` - 消息渲染

- `PreviewMessage`：单条消息组件
  - **AI 消息**：左侧带 `AI` 渐变方块头像；气泡用 `glass`，内部左侧有一条 cyan→violet 渐变 accent bar；顶部 role tag `AI · TWIN`
  - **用户消息**：右侧带头像（`CDN_ASSETS.PROFILE_PHOTO`）；气泡是 `cyan/15 → violet/10 → substrate/80` 渐变 + cyan 描边；role tag `YOU`
  - 渲染 AI SDK v5 的 `message.parts`（数组），目前只处理 `type === 'text'`
  - 通过 `<Markdown>` 渲染文本，支持 `onQuestionClick` 回调（点击问题自动追问）
- `ThinkingMessage`：用户消息发出后、AI 回复未到时的占位卡片，显示 `PROCESSING`、三个交错动画的 `pulse-dot`，以及 `streaming…` 标签

### `components/chat/overview.tsx` - 欢迎屏

- 整体是一张 `panel-edge glass-strong` 卡片，顶部一条 HUD strip（三色窗口点 + `NEURAL.CORE / READY` + `SESSION 001`）
- 中间圆形头像加 cyan→violet→signal 渐变描边和 cyan 模糊光晕
- HUD label `[ AI TWIN · BRIEFING ]`
- 大标题 `HI, I'M YINGQIANG'S AI TWIN`（`AI TWIN` 文本来自 `METADATA.AI_ASSISTANT_NAME`）
- 一段介绍文案，关键词彩色高亮
- 底部 capability chips：`MODEL OPS` / `DATA + RAG` / `PROD READY`（来自本地 `CAPABILITIES` 数组，不是从外部传入）
- 最下方提示 `type below or pick a suggestion · enter to transmit`

### `lib/constants.ts` - 常量配置

```ts
export const METADATA = {
  TITLE: "Yingqiang Yuan - AI Developer & Data Engineer",
  DESCRIPTION: "Personal website and portfolio of Yingqiang Yuan",
  AI_ASSISTANT_NAME: "AI TWIN",
  FULL_NAME: "Yingqiang Yuan",
  EMAIL: "yingqiang.yuan@gmail.com",
  LOCATION: "Santa Clara, CA",
  HEADLINE_AI:
    "AI Developer focused on building LLM-powered systems that solve real business problems, ...",
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

`AI_ASSISTANT_NAME` 已统一为 `"AI TWIN"`，多个 UI 文案（导航、欢迎屏、上下文条）都使用这个品牌名。

### `data/achievement-stats.ts` - 项目数据

类型定义在 `types/index.ts`：

```ts
export interface AchievementStat {
  title: string
  subtitle: string
  tags: string[]
  href?: string
  accent?: "cyan" | "violet" | "mint" | "signal" | "amber"
}
```

当前 3 条记录：
1. **Agentic BI for Lending Analytics**（cyan）：Strands Agents + Bedrock + RAG over S3 vector store + Snowflake text-to-SQL
2. **Prompt Eval & Adversarial Testing**（violet）：LLM-as-Judge + GitHub Actions CI + S3 持久化回归指标
3. **Enterprise Data Lake for Fintech**（mint）：Bronze / Silver / Gold lakehouse、Kinesis + Kafka + Step Functions + Delta Lake + Polars + LakeFormation

留空的卡片会显示 `DRAFT` 占位（`StatsSection` 渲染逻辑处理）。

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

### `types/index.ts` - 类型定义

集中定义前端共享类型：

| 类型 | 用途 |
|------|------|
| `Project` | 通用项目卡片接口 |
| `AchievementStat` | Landing Page 项目卡片（含 `accent` 配色） |
| `ProjectSection` | 30 Voice AI Challenge 章节 |
| `SEOConfig` | `generateSEOMetadata` 的入参类型 |
| `NavItem` / `NavigationProps` | 导航栏 |
| `MarkdownModalProps` / `SolutionCardProps` | Modal 与解决方案卡片 |

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
| `tailwindcss-animate` | Tailwind 动画插件 |
| `framer-motion` | 动画库（消息进入动画、Hero / Overview 动效） |
| `react-markdown` + `remark-gfm` | Markdown 渲染（带 GFM 表格、删除线等） |
| `react-syntax-highlighter` | 代码块高亮 |
| `lucide-react` / `react-icons` | 图标库（Cpu / Sparkles / ArrowUpRight 等大量用于 HUD） |
| `sonner` | Toast 通知 |
| `@fingerprintjs/fingerprintjs` | 浏览器指纹生成（限流追踪） |
| `usehooks-ts` | React Hooks 工具库（`useLocalStorage`、`useWindowSize`） |
| `next-themes` | 主题切换（暗色模式） |
| `recharts` | 图表（备用，目前 Hero 的 token 卡用自绘进度条） |
| `concurrently` | 同时启动 Next.js 和 FastAPI（`npm run dev`） |

---

## 路由结构

| URL | 文件 | 说明 |
|-----|------|------|
| `/` | `app/(marketing)/page.tsx` | Landing Page（Hero + Stats + Contact） |
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
