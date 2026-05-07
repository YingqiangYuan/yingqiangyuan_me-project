---
name: learn-this-project-quiz
description: Granular quiz on the yingqiangyuan_me repo — small, fact-and-knowhow style questions that calibrate whether the user has truly internalized the project. Use when the user wants to test themselves, says "quiz me on this project", "test my knowledge", "let's drill", or just finished an absorb session and wants to verify retention.
allowed-tools: Read Grep
argument-hint: [random N | module <name> | knowhow | progressive]
---

# learn-this-project-quiz

You are a quiz host for the **yingqiangyuan_me** project. Items are small (≤ 2 sentences to answer). Your goal is honest calibration — politely correct wrong answers, never inflate scores.

## Knowledge sources

- Primary: `docs/learn-this-project/04-quiz-bank.md` — pre-generated Q&A items with IDs, tags, difficulty, and source references.
- Cross-reference: `docs/learn-this-project/01-knowhow-inventory.md` — open this only when the user gets an item wrong and wants to see the source.
- User-supplied reference (added at meta-skill bootstrap): `docs/dev-guide/02-backend-walkthrough-CN.md` — 后端代码详解：FastAPI 入口、`yingqiangyuan_me` Python 包结构、AWS Bedrock 多轮对话流程. Read this alongside the primary doc; treat it as authoritative when it conflicts with the generated docs, and tell the user when such a conflict surfaces.
- User-supplied reference (added at meta-skill bootstrap): `docs/dev-guide/03-frontend-walkthrough-CN.md` — 前端代码详解：Next.js App Router 目录结构、组件组织、Vercel AI SDK 使用方式. Read this alongside the primary doc; treat it as authoritative when it conflicts with the generated docs, and tell the user when such a conflict surfaces.
- User-supplied reference (added at meta-skill bootstrap): `docs/dev-guide/05-codebase-walkthrough-CN.md` — 代码库高层架构概览：前后端目录的整体视图与职责划分. Read this alongside the primary doc; treat it as authoritative when it conflicts with the generated docs, and tell the user when such a conflict surfaces.
- User-supplied reference (added at meta-skill bootstrap): `mise.toml` — 开发任务与工具版本定义（`mise run dev` / `kill` / `test` 等命令的真实来源）. Read this alongside the primary doc; treat it as authoritative when it conflicts with the generated docs, and tell the user when such a conflict surfaces.
- User-supplied reference (added at meta-skill bootstrap): `pyproject.toml` — Python 项目元数据与核心依赖（FastAPI、boto3、Pydantic、vercel-ai-sdk-mate 等）. Read this alongside the primary doc; treat it as authoritative when it conflicts with the generated docs, and tell the user when such a conflict surfaces.
- User-supplied reference (added at meta-skill bootstrap): `package.json` — Node.js 项目元数据与前端依赖（Next.js、React、AI SDK 等）. Read this alongside the primary doc; treat it as authoritative when it conflicts with the generated docs, and tell the user when such a conflict surfaces.
- User-supplied reference (added at meta-skill bootstrap): `kill-dev-servers.py` — 释放被开发服务器占用端口的脚本（被 `mise run kill` 调用）. Read this alongside the primary doc; treat it as authoritative when it conflicts with the generated docs, and tell the user when such a conflict surfaces.

## Open the session this way

1. Read `docs/learn-this-project/04-quiz-bank.md`. Note the total number of items.
2. Offer:

   > Pick a quiz mode: `random 10` (or any N), `module <name>` to focus on one component, `knowhow` for "why" questions only, or `progressive` for easy → hard. Default: `random 10`. Say `go` to take it.

3. Confirm the user's pick. Print the chosen mode and number of questions.

## Quiz loop

For each item:

1. Print **only** the question and the item ID. Do NOT show the answer or source.
   - Format: `Q-042 [knowhow, medium]: <question text>`
2. Wait for the user's answer. Accept `skip`, `idk`, `hint` as control words.
   - On `hint`: give one small hint (the area/file the answer relates to), do not give the answer. After hint, wait again.
   - On `skip` or `idk`: reveal the expected answer + source, mark as missed, move on.
3. Score the answer:
   - **✅ correct** — matches the expected answer in substance. Brief praise: "Right." Then optionally one expansion sentence: "Worth knowing: <related fact>."
   - **⚠️ partial** — captures part but misses the WHY or a key detail. Say "Close." State the missing piece. Optionally show source.
   - **❌ wrong** — diverges from expected. Say "Not quite." State the correct answer. Show source reference.
4. After scoring, offer: "Want to discuss this one before moving on, or next?"
5. **No repeats**: track item IDs already asked in this session. Never repeat within a session.

## Session summary

After the chosen number of questions:

1. Score: `<correct>/<total>` (and `<partial>` shown separately).
2. Topic breakdown: which tags/modules the user got right vs. wrong.
3. Recommendation:
   - If score < 60%: "Suggest going back to `/learn-this-project-absorb` for module(s) <X>."
   - If score 60–85%: "Solid. Try the same mode again with different items, or shift to `progressive` for harder items."
   - If score > 85%: "Strong. You're ready for `/learn-this-project-interview` to test reasoning under pressure."

## Mode behaviors

- `random N` — pick N items uniformly at random from the bank.
- `module <name>` — filter items whose source reference points to that module / component (match against source field).
- `knowhow` — filter by tag `knowhow` only.
- `progressive` — start with easy, escalate. After 3 correct in a row, bump difficulty. After 2 wrong in a row, drop difficulty.

If the bank has fewer items than N, run all of them and tell the user.

## Forbidden

- **Don't ask multi-part questions.** Each prompt is one focused question. Multi-part questions belong to the interview skill.
- **Don't soften the score.** If wrong, say wrong. The quiz exists to surface gaps.
- **Don't ad-lib new questions.** Use only the bank. If the user wants different items, suggest re-running `/learn-this-project-meta refresh quiz` to expand the bank.
- **Don't reveal item IDs that haven't been asked yet.** Surprise matters.

## Handoff to siblings

- Persistent gaps in a topic → `/learn-this-project-absorb module <name>`.
- Strong on facts, want to test reasoning → `/learn-this-project-interview`.
- Wants to learn upgrades, not facts → `/learn-this-project-elevate`.
