This is the knowledge base:
<knowledge-base>
<document>
    <title>YingQiang Yuan Resume</title>
    <markdown_content>
# YingQiang Yuan

AI Developer / Data Engineer

Santa Clara, CA, USA, (509) 288-2111, yingqiang.yuan@gmail.com, Open to Relocation

## Summary

For AI Developer:

AI Developer focused on building LLM-powered systems that solve real business problems, with experience spanning agentic applications, retrieval-augmented generation, and LLM evaluation infrastructure on AWS.

For Data Engineer:

Data Engineer with production experience building real-time and batch data pipelines on AWS for financial services, covering ingestion, ETL, orchestration, governance, and analytics across two enterprise data platforms.

## Education

- Santa Clara University, Master of Science in Computer Science	          Sep 2023 - Jun 2025, Santa Clara, CA
- Washington State University, Bachelor of Science in Computer Science	  Aug 2026 - May 2022, Pullman, WA

## Skills

- Languages & Tools: Python, Java, JavaScript, TypeScript, SQL, Git, GitHub Actions
- Backend & Web Development: Node.js, Spring Boot, Flask, FastAPI, REST APIs
- Data Engineering: Spark, Delta Lake, Polars, dbt, Kafka, Airflow, Apache Kafka (Pub/Sub)
- AWS: Lambda, Kinesis, S3, Redshift, Athena, Lake Formation, Step Functions, CloudWatch, Bedrock
- Cloud & DevOps: Docker, Azure App Service, Linux
- Databases: Snowflake, MySQL, PostgreSQL, Redis
- AI/LLM: Strands Agents, RAG, Prompt Engineering, LLM-as-Judge
- Testing & Tools: PyTest, JUnit, Jest, Postman

## Professional Experiences

### EasyScaleCloud - AI Agent Engineer Intern

Dec 2025 - March 2026, Rockville, MD

Agentic BI Application for Small Business Lending Analytics

- Built an AI-powered BI agent for lending analytics, owning both engineering and domain knowledge translation. Partnered with credit risk experts to encode analytical frameworks into structured prompts and RAG materials, enabling the agent to plan and execute multi-step SQL analyses from natural language.
- Developed the Text-to-SQL agent using AWS Bedrock and Strands Agents with RAG generation backed by AWS S3 vector store, enabling natural language querying against a 7-table Snowflake schema.
- Translated domain-specific methods such as vintage cohort analysis, implied default probability modeling, and borrower similarity scoring into prompt templates and retrievable reference documents.
- Designed and tested agent workflows for scenarios such as risk pricing gap analysis, false rejection identification, and early warning detection, validating multi-step SQL correctness.

### Apexus Tech - AI Developer Intern

Aug 2025 - Dec 2025, New Brunswick, NJ

Prompt Evaluation & Adversarial Testing Pipeline

- Built a prompt evaluation pipeline for an enterprise LLM system, automating correctness testing and adversarial attack resistance across 6 use cases with ~200 annotated test cases (25% adversarial).
- Implemented two LLM-as-Judge pipelines using AWS Bedrock Converse API: an evaluation judge that validates business correctness of prompt outputs against ground-truth assertions, and a security judge that scores prompts across 5 risk dimensions (e.g., over-permissive authorization, injection guardrails).
- Integrated the evaluation pipeline into GitHub Actions CI with deployment approval gates and S3-persisted regression metrics, establishing the team's first prompt QA process before production releases.
- Enabled the team to iterate prompts by validating improvements against benchmarks, onboard new use cases with standardized evaluation, and assess adversarial risk against malicious input.

### CSC Financial Hong Kong - Data Engineer Intern

June 2024 - Dec 2024, Hong Kong

Enterprise Data Lake for Regulatory Analytics & Data Governance

- Built an enterprise data lake on AWS for a fintech company (2M cardholders, 800M annual transactions), unifying 5 siloed data sources into a Bronze > Silver > Gold architecture with Delta Lake, serving analytics via Redshift and Athena for regulatory compliance.
- Developed real-time and batch ingestion pipelines using AWS Kinesis (2.2M daily transactions), Kafka, and Step Functions + Lambda, with quarantine isolation and Dead Letter Queue for fault-tolerant data delivery.
- Implemented ETL pipelines using delta-rs and Polars on Lambda, replacing Spark/Glue, processing 50K daily incremental (upsert) records into 2M-row tables with Delta Lake for ACID transactions and Time Travel.
- Configured fine-grained access control via LakeFormation (column-level ACL), built 3-tier alerting (P0/P1/P2) with CloudWatch custom metrics, reducing regulatory audit response from 3 weeks to under 24 hours.
    </markdown_content>
</document>
<document>
    <title>Case Study — Building a Vertical-Domain BI Agent for SMB Lending Analytics</title>
    <markdown_content>
# Case Study — Building a Vertical-Domain BI Agent for SMB Lending Analytics

> A three-month internship retrospective. From "I have never built an Agent" to "the credit team can ask the database questions in plain English and get auditable answers." Written as a single long-form case study so future me — and anyone evaluating this work — can understand not just what got built, but why each choice was made.

---

## The Project In One Paragraph

I spent three months as an AI Agent intern embedded with a California-based FinTech client that does SMB (small-to-medium business) lending. My job was to design and build a vertical-domain BI Agent — an AI assistant that lets credit analysts ask analytical questions about the lending portfolio in plain English ("what's the actual default rate of our C-grade loans?", "are we falsely rejecting borrowers who would have paid us back?") and get back trustworthy, auditable answers backed by SQL the system wrote and ran itself. By the end of the internship the Agent had been deployed as an internal tool on Vercel, sat on top of a NeonDB PostgreSQL replica, used AWS Bedrock for reasoning through the Strands Agents SDK, retrieved domain-specific business rules from an S3 Vector index, and shipped with a chat UI that exposed both the answer and the reasoning trace. It was not production; it was a paradigm — a working internal pilot that demonstrated the pattern, with documented gaps before it could carry real lending decisions.

---

## The Client and the Problem

The client is a California-based FinTech specializing in lending to small-to-medium businesses — restaurants, retail, construction, healthcare services, technology companies, the usual SMB mix. Their credit team handles the full lifecycle: applications come in, get assessed, get approved or rejected, the approved ones turn into disbursed loans, those loans either pay off cleanly or default. Behind that lifecycle sits a relational database with about ten core tables and roughly 50,000 rows covering two years of operations.

The team's analytical questions are bread-and-butter credit analytics:

1. **Risk pricing alignment** — does the interest rate we charge a given risk grade actually cover the defaults we see in that grade? In particular, are C-grade loans mispriced (the implied default rate baked into pricing was 6%, but actuals were running over 11%)?
2. **Portfolio concentration** — what fraction of outstanding balance sits in any single industry? Restaurants, in particular, were trending toward 28% concentration, well above any internal soft cap.
3. **Approval leakage / false rejection** — among rejected applications, how many had a credit profile statistically indistinguishable from approved-and-performing borrowers? Each one is foregone interest income.
4. **Early warning signals** — can late-payment patterns and partial payments three months before default be used to flag at-risk loans early, since around 72% of defaults showed warning signs in the prior quarter?
5. **Customer lifetime value** — how do repeat customers (about 15% of the book) actually compare to first-time borrowers in terms of default rate and amount?

Every one of those questions was answerable in SQL — but each one was a custom investigation that took an analyst anywhere from an hour to half a day. Multiply by the cadence of asks across a credit team and you have a steady stream of "can you pull this for me?" tickets that absorbed analyst time without producing structurally reusable artifacts. Worse, the answer to "what's our C-grade default rate?" today and three weeks from now might use slightly different assumptions, slightly different filters, slightly different join logic — making decisions that depended on those numbers harder to compare over time.

The problem statement, distilled: **build an AI assistant that turns recurring analytical questions into a self-serve workflow, with enough transparency that an analyst would actually trust the number it returns.** Not "replace the analyst." Closer to "give the analyst a tireless junior who handles the SQL gymnastics and shows their work."

---

## Why an Agent (and Not Just a Chatbot, or Just Text-to-SQL)

Before writing a line of code, I had to be clear with myself about what I was building. Three categories looked superficially similar but were actually very different products:

**A chatbot** is conversational. It can talk about the database in the abstract — "yes, you have a `loan` table, here's what columns it might contain" — but it cannot reach out and pull a real number. Useful for documentation Q&A. Useless for decisions.

**A text-to-SQL widget** is one-shot. Natural language goes in, a SQL string comes out, the user pastes it into their query tool. It works for simple questions but breaks the moment a real analytical task requires multiple steps: explore the schema, write a probe query, examine the data, refine the question, write the final query, sanity-check the result. Also, it offloads correctness to the user — they have to read the SQL and decide if it's right.

**An Agent** is multi-step and tool-using. It owns the full loop: read the question, check the schema, decide what tools it needs, run them, observe results, decide whether to keep going or stop, finally produce a written answer. The user gets a number plus a paper trail. This is the shape that fits credit analytics, where the questions are rarely answerable by a single SELECT.

So I committed to the Agent shape. That decision drove every architectural choice afterward — the tool registry, the reasoning loop, the way I represented the schema to the LLM, the audit trail, the validation layer between the LLM-generated SQL and the database.

Worth saying explicitly: **the smartness lives in the tool stack, not in the model.** The Bedrock model on its own already knows SQL better than I do. What it doesn't know is *this* database, *this* business, *these* analysts' conventions. The whole project was about building the scaffolding that gives the model that context, then getting out of the way.

---

## The Three-Month Arc

The three months broke roughly into three phases, each with a clear deliverable and a clear theme.

| Month | Theme | Deliverable |
|-------|-------|-------------|
| Month 1 | Foundations | Project scaffolding, SQLite + NeonDB pipeline, schema encoding, hand-written SQL covering all five business questions |
| Month 2 | The Agent | Strands Agent with tools (schema, query, debug-report), S3 Vector RAG layer with two-stage retrieval, system prompt and reasoning loop |
| Month 3 | Internal Tool | Test harness for non-deterministic outputs, web UI with collapsible thinking trace, deploy to Vercel, internal pilot, documentation |

I want to be honest about the rhythm: the months were not clean. I rebuilt the schema-encoding logic in Month 2 because the version I shipped in Month 1 was too verbose. I added a SQL safety validator in Month 2 that I thought I'd need in Month 3. The frontend got a first pass in Month 1 (a stub) and was rebuilt in Month 3. Plans are fiction; what's real is the order in which I learned things and the order in which I shipped things.

---

## Month 1 — Foundations

### The opening trap I almost fell into

When I cloned the scaffolding repo on day one, the localhost dev server already showed a slick chat UI with pre-built suggestion buttons. Click a button, the "AI" replied. For about 30 seconds I thought the project was further along than it was. Then I read the code: the responses were canned strings.

That was actually a gift. The scaffolding had already drawn the *shape* of the finished product — what the inputs and outputs looked like, what the chat surface needed to render, what state the frontend needed to track. My job for the next three months was to make the inside real. Knowing where the goalposts were turned out to be more valuable than starting from a blank file.

### Architecture: the One Ring

Before writing real logic I committed to a structural pattern that paid for itself many times over: a singleton entry point.

```python
from smb_loan_ai.api import one

one.config    # configuration
one.engine    # active database engine
one.agent     # the Bedrock agent
```

`One` is a class that inherits from a stack of mixins — `ConfigMixin`, `DbMixin`, `Boto3Mixin`, `AgentMixin`. Each mixin owns one slice of capability. Each capability is exposed as a `@cached_property` on the singleton, so it isn't actually constructed until the first time something asks for it.

Two reasons this mattered:

1. **Lazy initialization kills entire categories of bugs by design.** Importing the module does basically nothing. No database connection is opened, no AWS session is established, no Bedrock client is built — until something specifically needs it. That meant test files could import freely without spinning up the world. It also kept circular-import landmines out of the codebase, since modules don't trigger each other at import time.
2. **The mixin stack means new capabilities snap on as bricks.** When I needed a Boto3 layer mid-Month 2, it was a single mixin and a single line in the inheritance list. No sprawling refactor.

The whole pattern is "one door to enter, everything else lives behind it." I stole the design idea from libraries that hide complexity behind a clean facade, and adapted it to the project's scope.

### Tests as a second brain

I set up pytest and started writing tests early — even when "the thing being tested" was tiny. Coverage reports became a habit. Green lines, red lines, an exact list of code paths the tests had visited.

I had not previously appreciated how much of a gift a coverage report is. Most feedback in life is vague — "this needs work," "we went a different direction." A coverage report is the opposite: it points at line 47 and says, in effect, "you never tested this." That kind of pinpoint feedback is the only reason anyone can manage a system bigger than what fits in one person's head.

I leaned on tests as **cognitive offloading** for the project. I knew the codebase would grow past what I could mentally hold. I wanted a system that remembered for me which behaviors had been verified.

### The database, which is just a file

I had braced for a fight with database setup. Servers, ports, users, permissions. Instead, the project used SQLite for local development: a single `.sqlite` file in `tmp/`. One command downloaded it. Open it in a viewer, and there were ten tables fully populated.

No server. No Docker. No credentials.

Once I got over the surprise, I understood why this was the right local choice. The thing I was supposed to be learning was AI Agent design, not database operations. SQLite removed an entire layer of friction so I could focus on the actual problem.

The schema itself was clean: ten tables, organized in four conceptual layers.

| Layer | Tables | Role |
|-------|--------|------|
| Lookup tables | `industry`, `risk_grade`, `loan_status`, `loan_officer` | Reference data with no foreign keys |
| Core entity | `customer` | The business borrower |
| Process | `application`, `loan` | Application → approval → disbursement pipeline |
| Transactions | `repayment_schedule`, `payment`, `default_event` | Monthly schedule, actual payments, defaults |

The first piece of real work was understanding this schema well enough to write the five business questions in SQL by hand, without an Agent. That sounds like a detour, but it wasn't — it was the only way to know what the Agent would eventually need to be capable of. I could not validate the Agent's answers against ground truth if I didn't know the ground truth myself.

### Learning SQL through real questions

I had used SQL before, but only at the `SELECT … WHERE` level. The five business questions stretched me into joins, aggregates, CTEs, and window functions. The breakthrough on window functions came from a small experiment: I removed `PARTITION BY` from a `ROW_NUMBER() OVER` and reran the query. With `PARTITION BY`, each loan's payments were numbered separately. Without it, the entire table was numbered as one giant sequence. Seeing both side by side made the abstraction concrete in a way no tutorial had managed.

That was the lesson I kept coming back to: when an abstraction won't click, **change one piece, rerun, compare.** The instant feedback loop is the actual learning environment.

### Cloud database without cloud ops

By the end of Month 1, I needed to push the SQLite data somewhere reachable so that whatever I built next wouldn't be tied to a file on my laptop. The choice between options was instructive:

| Option | Pros | Cons for my situation |
|--------|------|-----------------------|
| Amazon RDS | Battle-tested, full-featured | VPC, security groups, subnets, IAM — a separate skill tree |
| Self-hosted PostgreSQL | Full control | I'd own ops |
| **NeonDB** | Serverless Postgres, scale-to-zero | None for my use case |

I picked NeonDB. The reasoning was deliberate: I was not yet at a stage where ops complexity would teach me anything I needed for this project. NeonDB gave me a connection string and a database that hibernated when idle. That was the entire feature surface I needed. The rest of my attention stayed on the Agent.

I also wrote the sync script to be **idempotent** — `DROP TABLE IF EXISTS` then `CREATE TABLE` then bulk insert — so I could rerun it any number of times without state weirdness. Simplifying tools is fine; simplifying principles like idempotency is not.

By the end of Month 1 the foundation looked like this:

- A singleton-based Python package with mixin architecture and lazy-loaded resources
- SQLite locally, NeonDB remotely, an engine selector that picked between them based on runtime
- A `runtime.py` that detected whether the process was running locally or in a Vercel-style serverless context
- A `paths.py` enum that centralized every file path in the project
- A test suite with a coverage report I actually checked
- All five business questions answered by hand-written SQL

Nothing AI yet. But the surface the AI would later attach to was already clean.

---

## Month 2 — The Agent

This was the month where the project went from "infrastructure exercise" to "AI system." It was also the month where my mental model of "what software is" had to bend.

### Reframing the question: I was not teaching SQL

My first instinct was to think of the Agent as something I had to teach. I started drafting SQL conventions in my head: when to use which join, how to name CTEs, where to put `WHERE` clauses, etc.

That instinct was wrong, and it took me longer than it should have to notice why. The Bedrock model already knows SQL better than I ever will. It has seen more SQL than any human. What it does not know is **this specific database**: which tables exist, what the columns are called, how the foreign keys are wired, which fields are dates and which are decimals.

So the actual problem was not "teach AI to write SQL." It was **"feed AI the context it needs to write SQL that fits this specific schema."**

That reframing changed the work. Instead of a long system prompt full of "rules," I started writing utilities to extract and compress schema information into a form the model could consume cheaply. The DDL for `customer` looks like:

```sql
CREATE TABLE customer (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    business_name VARCHAR(200) NOT NULL,
    tax_id VARCHAR(20) NOT NULL,
    industry_id INTEGER NOT NULL,
    credit_score INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (industry_id) REFERENCES industry(id)
);
```

In compressed form:

```
Table customer(
  id:int*PK,
  business_name:str*NN,
  tax_id:str*NN,
  industry_id:int*NN*FK->industry.id,
  credit_score:int*NN,
  created_at:ts*NN,
)
```

Roughly 70% fewer tokens. Same information. The point was never "teach the LLM what a primary key is" — it was high-signal, low-noise context transfer. I came to think of the work as **information design for AI consumption** more than programming in the traditional sense.

### The first real Agent

The agent framework was the Strands Agents SDK with AWS Bedrock as the model backend. The first usable Agent looked roughly like this:

```python
Agent(
    model=self.bedrock_model,
    tools=[
        self.tool_get_database_schema,
    ],
    system_prompt=self.system_prompt,
)
```

One tool: a function that returned the compressed schema string. I asked it: "what tables are in the database?" It paused. Then it called `get_database_schema` *on its own* without me telling it which tool to use, retrieved the schema, and explained it back in plain English.

That was the first moment the project felt different from anything I had built before. The Agent wasn't following a script — it was deciding which capability to invoke based on the question. I knew the theory. Watching it actually happen in my own code shifted something.

### Reasoning patterns that I made peace with

I dug into the literature on Agent reasoning patterns, and the two that came up most were:

- **ReAct** (Reasoning + Acting). Loop: observe → think → act → observe. Each step is small and adjusts to the previous result. Strength: flexibility. Weakness: can drift on long-horizon tasks because there's no map.
- **Plan-and-Execute**. Build a complete plan upfront, then walk through it. Strength: stability on complex tasks. Weakness: brittle if the plan was based on wrong assumptions.

In practice I let the framework run a hybrid: a coarse plan implicit in the system prompt, ReAct-style tool calls within each step, with permission to re-plan if a tool result invalidated an earlier assumption. The key behavior I wanted, and got, was: **strategic intent, tactical flexibility.**

I also stopped over-engineering this. Strands handled the reasoning loop. My job was to give it good tools and good prompts, not to reimplement the loop.

### Tool design as capability boundary

Once the Agent could see the schema, the next tool was `execute_sql_query` — the ability to actually run a SELECT against the database and get rows back. That single addition turned the Agent from "describes the database" to "answers questions about the data."

This was when one of the more useful framings of the whole project landed for me:

> **The brain determines how the Agent thinks. The tools determine what the Agent can do.**

Tools are the capability boundary. No SQL execution tool, no data answers — no matter how smart the model. No RAG retrieval tool, no domain-specific knowledge — no matter how smart the model. Tool design is product design.

By the end of Month 2 the Agent's tool list was:

| Tool | What it does | Why it earned a slot |
|------|--------------|----------------------|
| `tool_get_database_schema` | Returns the compressed schema string | Without it, every SQL the Agent writes is a guess |
| `tool_execute_sql_query` | Validates and executes a SELECT, returns Markdown | The action the Agent has to take to actually answer anything |
| `tool_retrieve_business_rules` | Two-stage retrieval against S3 Vector | Domain context the model can't know on its own |
| `tool_write_debug_report` | Writes the reasoning trace to a Markdown file | Auditability — see "Managing the Smarter" below |

Each tool is a small Python method decorated with `@tool`. The Agent decides when to call which.

### S3 Vector RAG: the domain layer

This is the piece of the system that does not appear in the public demo, but mattered most for making the Agent actually useful inside the client's workflow. SMB lending analytics has its own vocabulary and its own patterns. "Pricing gap," "vintage analysis," "approval leakage," "loss severity" — those are not abstract terms. They each map to specific tables, specific joins, specific calculations. A vanilla LLM can guess at the meaning, but a vertical Agent should not have to guess.

The solution was an S3 Vector index of distilled domain knowledge, organized into multiple namespaces. I'll cover the architecture in detail in its own section — but the short version is that **the Agent retrieved relevant business rules before deciding what to query**, which made its answers feel domain-aware rather than schema-aware.

### Defense in depth for SQL safety

Once `execute_sql_query` was real, I had to solve a problem that should have been obvious from day one: **the LLM writes the SQL.** The system prompt politely asks for SELECT-only queries. A polite request is not enforcement.

The textbook answer is database-level: a read-only role, IAM-bound, stored procedures for any sensitive operations, an audit pipeline for every query. That's the right answer for a production deployment. It was not the right answer for a three-month internship pilot.

Instead I went with a Python-side validator using `sqlparse`:

```python
def ensure_valid_select_query(query: str) -> None:
    parsed = sqlparse.parse(query)
    if len(parsed) != 1:
        raise ValueError("Only one statement allowed.")
    stmt = parsed[0]
    if stmt.get_type() != "SELECT":
        raise ValueError(f"Only SELECT allowed, got: {stmt.get_type()}")
    # additional checks for forbidden keywords, parameter binding hygiene
```

Three guarantees:

1. **Single statement only.** Multi-statement payloads (the `;` injection vector) blocked.
2. **SELECT only.** Any `UPDATE`, `DELETE`, `DROP`, `TRUNCATE`, `INSERT` rejected before the database sees it.
3. **Parameterized binding.** No raw string interpolation in the execution path.

This is twenty lines of code that eliminates roughly 99% of the threat surface for the project's actual scope. It does not replace database-level controls; it complements them, and it covered the gap until those controls would be put in place. I framed this in my own notes as **good enough is good enough** — choose the smallest intervention that removes the largest bucket of risk, then move on. Perfectionism is a momentum killer on a three-month timeline.

### The debug-report tool: making the Agent show its work

The hardest problem with LLMs in a high-stakes domain is not that they're wrong. It's that **when they're wrong, they're wrong with confidence**. There is no stack trace. No line number. Just a number that sounds authoritative.

The fix I landed on was treating the Agent like a human report. Humans manage humans they can't out-skill by making them report. CTOs aren't the best coders. Hospital directors aren't the best surgeons. They manage by visibility — standups, design memos, decision logs. The visibility is what makes oversight possible.

So I added `tool_write_debug_report`, which the system prompt instructed the Agent to call after any non-trivial analysis. The report captured:

- The user's question, restated
- Which tables the Agent inspected
- Which business rules it retrieved from RAG
- The SQL it ran, verbatim
- The intermediate results
- Its final answer and how it derived it

Once that was in place, "C-grade default rate is 11.2%" stopped being a black-box assertion and started being a checkable claim. An analyst could open the debug report, see the JOIN and the filter, and decide whether the Agent's interpretation matched the question they asked. Trust now had something to attach to.

This is the line I keep returning to: **explainability equals trustworthiness.** The same principle applies to managing humans, managing AI, and managing yourself.

### The system prompt

The system prompt for the agent — `smb_loan_ai/prompts/bi-agent-system-prompt.md` — went through several drafts. The version that worked best did three things:

1. **Set the role** — "You are a BI analyst for an SMB lending portfolio. Your job is to answer questions accurately and show your work."
2. **List the tools and when to use each** — schema first, RAG second when domain terms appear, query third, debug-report last.
3. **Codify constraints** — SELECT only, no destructive operations, always cite the SQL in the report, prefer LIMIT on exploratory queries.

I avoided the temptation to teach SQL in the prompt. The prompt's job was to teach the *workflow* — what the Agent should do in what order — not the underlying skills, which the model already had.

By the end of Month 2 the Agent could answer all five business questions when asked in natural language, retrieved domain rules from RAG, ran validated SELECTs, and wrote audit reports. It still only ran in the terminal.

---

## Month 3 — From Notebook to Internal Tool

The third month is where most engineering projects either ship or quietly die. The Agent worked on my machine. That was meaningless to anyone who wasn't me.

### Testing a non-deterministic system

The first hard problem was: how do you test something that writes a different SQL every time it's asked the same question?

Traditional unit tests want determinism. Same input, same output. An Agent's intermediate output is non-deterministic by design — it might join `loan` first then `default_event`, or vice versa, or use a CTE, or use a subquery. The exact bytes change run to run.

The framework that worked was **Before / Action / After**, scoped on the *answer* rather than the *path*:

| Step | Action | What I assert |
|------|--------|---------------|
| Before | Seed a test DB with a known shape — for example, 10 C-grade loans, 2 with default events | I know the ground-truth answer is 20% |
| Action | Ask the Agent the question in natural language | No exception, debug report exists |
| After | Parse the Agent's answer for the numeric value | Within tolerance of 20% |

I learned to use regex with tolerance instead of string equality:

```python
import re
match = re.search(r"(\d+(?:\.\d+)?)\s*%", agent_response)
assert match is not None
assert abs(float(match.group(1)) - 20.0) < 0.5
```

The Agent might say "the default rate is 20%" or "20% of C-grade loans defaulted" or "C-grade loans default 20% of the time." All correct. All worded differently. Asserting prose style is brittle and misses the point.

I extended this pattern across the five business questions, plus a set of edge-case tests:

- An ambiguous question to confirm the Agent asked for clarification
- A question that required multi-step reasoning to confirm the Agent didn't shortcut to a wrong answer
- A question whose correct answer was "I don't know from this data" to confirm the Agent didn't hallucinate

This wasn't a complete observability story. I documented the gap explicitly: in production you'd also want logging for every question/SQL/result tuple, sampled spot-checks against analyst-written ground truth, and drift detection that flags when an answer changes meaningfully week over week. None of that was in scope for the internship — but it was in the writeup as the next thing to build.

### The frontend: from "it runs" to "they can use it"

The scaffolding had a Next.js chat UI from day one. In Month 3 I rebuilt it to actually integrate with the FastAPI backend that wrapped the Agent.

The interesting design problem was: **how much of the Agent's thinking should the user see?**

My first instinct was "none — just show the answer." Then I tried it from the analyst's perspective: if I got "11.2%" back from a system I didn't fully trust yet, I would absolutely want to see the SQL it ran. But if I just wanted a quick sanity number for a report, I wouldn't want to wade through reasoning.

The answer was to **give the user the choice.** I built a collapsible "Thinking" block that defaulted to collapsed:

```tsx
const ReasoningBlock = ({ text }: { text: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="border border-amber-200 rounded-lg bg-amber-50">
      <button onClick={() => setIsExpanded(!isExpanded)}>
        <span>Thinking</span>
      </button>
      {isExpanded && <div>{text}</div>}
    </div>
  );
};
```

On the backend, I parsed the Agent's raw output to separate `<thinking>` tags from the final answer:

```python
all_thinking = []
for msg in messages:
    thinking_matches = re.findall(r"<thinking>(.*?)</thinking>", text, re.DOTALL)
    all_thinking.extend(thinking_matches)

final_answer = re.sub(r"<thinking>.*?</thinking>", "", last_text, flags=re.DOTALL)
```

Reasoning rendered in the collapsible block, answer in the main flow. Separation of concerns isn't just a backend principle — it's a product principle.

This was the moment the project flipped from "engineering" to "product" in my head. Engineering thinking asks: does the code work? Product thinking asks: can the person on the other end of the screen actually use it, and would they choose to?

### The Vercel AI SDK adapter

One small but real piece of plumbing: the frontend used the Vercel AI SDK message format, and the backend produced Bedrock-shaped messages. They are not the same shape. I wrote `ai_sdk_adapter.py` whose only job was bidirectional translation — Vercel format in, Bedrock format out, and vice versa. It was the kind of file you write once, never change, and quietly love because it isolates a translation layer that would otherwise leak into both sides.

### Deployment

Deployment was a non-event. That was actually the lesson.

I had built it up in my head as the moment everything could break. I copied the `.env` variables into Vercel's settings, hooked up the NeonDB connection string, configured the Bedrock credentials, hit deploy, waited a few minutes. The build went green. The URL was no longer `localhost:3000`.

The fear of deployment was wildly out of proportion to the actual difficulty. Most things turn out to be like that — they look impossible until you do them once.

I ran the test suite against the deployed instance, walked through the five business questions in the chat UI on my phone, watched the debug reports appear, and accepted that the project had crossed the line from "code on my laptop" to "internal tool the team can hit."

### The internal pilot

The Agent went out to a small internal cohort of credit analysts as a pilot. The framing was deliberately conservative: this is a paradigm, not a production system. Don't make decisions on it. Use it for first-pass exploration, then verify in your usual tools.

Adoption wasn't the goal. Validation was. The questions I wanted feedback on were:

- Does the Agent's answer match what the analyst would have written by hand?
- Is the debug report clear enough to verify the reasoning?
- Are there question types where the Agent reliably fails?
- Where does the chat UI get in the way?

I'll cover the qualitative results in the **Outcomes** section. For now, the headline: the pattern worked, the pattern's gaps were also clear, and both were valuable to know.

### Documentation as deliverable

The last thing I did before the internship ended was write down everything I had learned. Fifteen short blog posts, each one capturing a single lesson from a single phase. A CLAUDE.md file with the architecture map, the file-by-file modification guide, the test mapping. An ER diagram of the database. A walkthrough of the schema in business terms. A reference of the fifteen analytical concepts (pricing gap, vintage analysis, etc.) each with the simplified SQL.

The reason for the documentation wasn't completeness theater. It was that **process and asset are not the same thing**. The three months of learning are a process — they end. The documents are an asset — they persist. Three months from now, when I have forgotten half of this, the documents will still be exactly correct.

A good rule I want to keep: every nontrivial thing I learn gets ten minutes of writeup, while it's still fresh. AI now does most of the first-draft mechanical work, so the cost is mostly review. The excuse "I don't have time to write it up" no longer holds.

---

## Architecture Deep Dive

A flatter description of what the system actually looked like by the end.

### Top-level package layout

```
smb_loan_ai/
├── api.py              # exports the singleton `one`
├── paths.py            # PathEnum, every file path lives here
├── runtime.py          # detects local vs. serverless
├── constants.py        # shared enums
├── sql_utils.py        # pure functions for SQL execution & formatting
├── ai_sdk_adapter.py   # Vercel AI SDK <-> Bedrock translator
├── config/
│   └── conf_00_def.py  # Config dataclass with env vars
├── one/
│   ├── one_00_main.py  # the One class composed from mixins
│   ├── one_01_config.py
│   ├── one_02_db.py
│   ├── one_03_boto3.py
│   ├── one_04_agent.py
│   └── api.py          # `one = One()`
├── prompts/
│   └── bi-agent-system-prompt.md
└── db_schema/          # encoded schema artifacts
```

### Class hierarchy

```
One
├── ConfigMixin              -> self.config
├── DbMixin                  -> self.engine, local & remote variants
├── Boto3Mixin               -> self.boto_ses, self.bedrock_runtime_client()
└── AgentMixin               -> self.agent and the @tool methods
```

The split between **pure functions** (in `sql_utils.py`) and **bound methods** (on the singleton) was deliberate. Pure functions take the engine as a parameter — they work in tests, in scripts, in notebooks. Bound methods use `self.config` and `self.engine` — they're convenient but stateful. When in doubt I wrote pure functions and let the bound method be a thin wrapper.

### The runtime selector

```python
@cached_property
def engine(self):
    if runtime.is_local():
        return self.local_sqlite_engine
    return self.remote_postgres_engine
```

One line that meant the rest of the code never had to care. Tests ran against SQLite. Vercel ran against NeonDB. The Agent didn't know the difference.

### Key singletons exposed to callers

```python
from smb_loan_ai.api import one           # the app
from smb_loan_ai.paths import path_enum   # all paths
from smb_loan_ai.runtime import runtime   # runtime detection
```

That's the entire surface area someone needs to know to use the package. Behind it: configuration, engines, AWS clients, Bedrock model, agent, tools, prompt loading. Hidden by design. **One door to enter.**

---

## The S3 Vector RAG Layer (Deep Dive)

This is the chapter where the case study departs most clearly from the public demo. The deployed Vercel demo does not include the RAG layer; for cost and complexity reasons, the demo Agent answers using only the schema and the model's general knowledge. Inside the client's environment, the full system included a vector retrieval layer over S3 Vector that I want to describe in detail.

### Why a vector layer at all

Vanilla LLMs handle SQL syntax just fine. What they struggle with in a vertical domain is the **mapping from business vocabulary to schema operations.** "Pricing gap" is not in the table names. "Vintage analysis" isn't a column. "Approval leakage" is a multi-table comparison that requires knowing which fields define the "successful borrower profile."

You can stuff all of that into the system prompt. I tried. It bloats fast: even fifteen analytical concepts with their SQL templates push past a comfortable token budget, and most of that content is irrelevant to any given question. Stuffing it all in every turn is wasteful. The right pattern is retrieval — pull only the rules relevant to the current question.

S3 Vector was the storage and retrieval layer. The choice was driven by: it lived in the same AWS account as Bedrock, it was cheap for the project's scale (tens of thousands of records, not millions), and it integrated cleanly with Bedrock embeddings. RDS+pgvector or a dedicated vector DB would have worked too — the design was largely portable across backends.

### Index structure: multiple namespaces

I split the index into separate namespaces (collections) by content type, so the retrieval at query time could be targeted rather than hitting one giant pile of mixed content.

| Namespace | Content | Why separate |
|-----------|---------|--------------|
| `concepts` | Definitions of business terms (pricing gap, vintage analysis, etc.) with the tables and columns each one touches | Some questions need a concept lookup but not a SQL recipe |
| `recipes` | SQL templates for common analytical patterns, with metadata on inputs and outputs | Some questions match an established recipe almost exactly |
| `qa_pairs` | Past analyst-written questions with their SQL and a brief explanation | Few-shot grounding for questions that resemble historical asks |
| `schema_notes` | Caveats and gotchas that aren't visible from DDL alone (e.g. "C-grade is intentionally underpriced — implied default 6%, actual ~11.2%") | The kind of institutional knowledge that lives in heads and Slack threads |

Each item was a JSON document with an `embedding` field generated from a representative natural-language description, plus the raw payload. The embedding model was a Bedrock embedding model — same provider as the reasoning model, which kept the auth surface small.

### Two-stage retrieval

The most useful design decision was making retrieval two-stage rather than one-shot.

**Stage 1 — query rewriting.** The user's literal question is often not the best embedding query. "Are we mispricing C-grade?" maps poorly to the embedding of a recipe titled "Pricing Gap by Risk Grade." So before embedding, I had the LLM rewrite the question into a retrieval-friendly form — a short paragraph that named the concepts likely to be relevant, even if the user didn't.

```
User question: "Are we mispricing C-grade?"
Rewritten: "Compare implied default rate from risk_grade.implied_default_rate
against actual default rate computed from loan and default_event tables,
filtered to risk grade C, to surface pricing gap and inform pricing
calibration."
```

This rewrite happened cheaply with a small prompt; the cost was a single short LLM call before the retrieval, and the precision lift was substantial.

**Stage 2 — namespace-scoped retrieval.** The rewritten query was embedded once, then queried against each relevant namespace with a top-K. The retrieval call returned hits along with metadata, and the Agent used that metadata to decide whether to also pull related items.

The retrieved snippets were concatenated into a structured prompt fragment:

```
RELEVANT BUSINESS RULES
=======================
[CONCEPT: Pricing Gap]
Pricing gap = implied_default_rate (from risk_grade) minus
actual_default_rate (from loan/default_event). Negative values mean
the grade is underpriced. Currently grade C runs ~-5pp.

[RECIPE: Default Rate by Grade]
Tables: risk_grade, loan, default_event.
Pattern: LEFT JOIN default_event on loan, GROUP BY risk_grade.
Watch out: do not double-count by joining application as well.

[SCHEMA NOTE]
risk_grade.implied_default_rate is a percentage (6.0 = 6%), not a
fraction (not 0.06). Multiply downstream calcs accordingly.
```

That fragment was injected into the agent's working context for the turn. The Agent then proceeded with its usual think→act loop, but with domain rules in hand.

### Why a tool, not auto-prepend

The retrieval step lived behind a tool (`tool_retrieve_business_rules`) rather than as an automatic prepend on every turn. Two reasons.

First, **not every question needs domain rules.** "How many loans are in the database?" is a count. There's no concept lookup needed. Auto-prepending would burn tokens for no value.

Second, **the Agent's decision to call retrieval is itself diagnostic.** If the Agent doesn't think a question needs business rules, that's a signal — either the question is simpler than it looks, or the Agent is missing context the user assumed. Either way I want that signal exposed in the debug report, not hidden behind invisible automation.

The system prompt nudged the Agent toward calling retrieval whenever the user's question contained domain vocabulary or implied a comparison against pricing or business expectations.

### Trade-offs I'm aware of

The two-stage approach added one extra LLM call per turn and one S3 Vector query per turn. For interactive use that was fine; at higher throughput I'd want to cache rewrites for repeated questions and consider batching.

The bigger trade-off was **maintenance**. The vector index is only as good as the rules in it. If the schema evolves or the business definitions shift, the index has to be re-indexed. I documented the indexing pipeline as an idempotent script — extract source documents, embed, upsert — so the maintenance loop was at least clear, even if no one was running it yet.

I'm also aware that "RAG" can become a buzzword that hides what's actually retrieval over a curated knowledge base. The work that mattered most was not the retrieval itself; it was **distilling the right rules into the right shape in the first place.** The infrastructure was easy. The taxonomy was hard.

---

## Tool Design — Each Tool, Why It Exists

Every tool was a deliberate capability. Here is the reasoning for each.

### `tool_get_database_schema`

Returns the compressed schema string for the connected database. Always available.

Why: the Agent has to know the surface before it can write to it. Without this, every query is a guess. With this, the Agent grounds itself before reaching for SQL.

Cost: one read-from-disk per call. The schema string is generated once at startup and cached on `self`.

### `tool_execute_sql_query`

Validates a query string and runs it. Returns results as a Markdown table.

Why: this is the action. The Agent needs to be able to actually pull numbers from the database, not just talk about them.

Implementation:

1. `ensure_valid_select_query(query)` — raises if anything is non-SELECT, multi-statement, or otherwise suspicious.
2. `engine.execute(query)` — parameterized, no string interpolation.
3. `format_result(result)` — turn rows into a Markdown table the Agent can read back.

The Markdown formatting is small but non-trivial. Returning raw tuples gives the Agent more work to interpret. Returning Markdown means the Agent can summarize directly from a table it already understands.

### `tool_retrieve_business_rules`

The S3 Vector retrieval call. Takes a natural-language query, returns a structured block of relevant rules.

Why: covered in the RAG section. This is the tool that makes the Agent vertical rather than generic.

### `tool_write_debug_report`

Writes a Markdown report with the Agent's reasoning trace to a configured path.

Why: auditability. The Agent calls this at the end of any non-trivial analysis, capturing the question, the tools called, the SQL run, the intermediate results, and the final answer.

The report is the artifact a human reviewer reads to decide whether to trust the answer. It is also the thing that, if logged centrally in a future production version, gives the team a record of every Agent-driven analysis ever performed.

### Tools I considered and didn't ship

I want to be honest about what I scoped out and why.

- **`tool_visualize`** — auto-generate a chart for the result. Tempting but out of scope; the chat UI was the deliverable, not a dashboarding tool.
- **`tool_export_to_sheets`** — push the result to a Google Sheet. Would have required OAuth flows that didn't fit the timeline.
- **`tool_run_python`** — let the Agent execute arbitrary Python on results. Powerful and dangerous; the safety story would have to be much stronger before I'd ship this.
- **`tool_email_summary`** — let the Agent send a summary email to a stakeholder. Side effects on external systems require a different review bar than read-only SQL.

The pattern: every tool is a permission. Adding a tool isn't free — it widens the blast radius. Ship the smallest set that delivers the use case.

---

## Reasoning Patterns — Why I Stopped Overthinking the Loop

A frequent temptation in Agent development is to write your own reasoning loop. Read papers, implement ReAct from scratch, hand-roll Plan-and-Execute, instrument every step.

I tried. I deleted it.

The Strands Agents SDK already implements a competent loop. My value-add was not in re-doing what the framework did. It was in **the inputs to the loop** — the system prompt, the tools, the schema encoding, the RAG layer. The loop itself was a solved problem; my job was to feed it well.

The behaviors I cared about were:

- **The Agent decides which tool to use, not me.** That's the whole point of the abstraction. If I'm hardcoding tool calls, I should just write a script.
- **The Agent re-plans when a tool result invalidates its assumption.** The framework handled this; the system prompt nudged it.
- **The Agent stops when it has enough.** This was prompt engineering, not loop engineering.

The lesson, in a sentence I want to remember: **don't reimplement frameworks; design what they consume.**

---

## Safety, Guardrails, and the Production Gap

Worth being explicit about what's in the system and what would need to be added before this could carry real lending decisions.

### What's in

- Python-side SELECT-only validator (`sqlparse` based)
- Single-statement enforcement
- Parameterized binding throughout the execution path
- Audit-style debug reports written to disk after every non-trivial analysis
- Test harness that asserts answer correctness against seeded ground truth

### What's not in (documented in the writeup as next steps)

- Database-level role separation. The validator is at the application layer; in production you'd want a read-only DB role as well, so a bug in the validator can't escalate.
- IAM-bound access. The Agent's database credentials are environment-bound, not tied to a specific identity.
- Audit pipeline. Reports are local files, not shipped to a central log/store with retention.
- Drift detection. No automated comparison of "today's answer to the same question" against "yesterday's."
- Spot-check sampling. No human-in-the-loop QA on a percentage of answers.
- SSO. The deployed UI is open to anyone with the link.

I framed this for myself as **defense in depth, layered over time**. The validator is layer one. Database roles are layer two. Audit pipeline is layer three. Each layer adds resilience without invalidating the layers below it. The internship covered layer one; the writeup made the rest legible to whoever picks up the project next.

---

## Testing a Non-Deterministic System (Expanded)

The Before/Action/After framework I touched on earlier deserves a second pass because it generalizes beyond this project.

### The wrong test

```python
def test_default_rate():
    assert agent("default rate of C-grade") == "11.2%"
```

This fails for a hundred reasons unrelated to correctness. Phrasing varies. Significant figures vary. The Agent might add context ("based on the past four quarters, the C-grade default rate was 11.2%") that breaks string equality.

### The wrong test, version two

```python
def test_default_rate_sql():
    assert agent_generated_sql == "SELECT ... GROUP BY rg.id"
```

This fails almost every run, because the Agent legitimately uses different SQL paths to reach the same answer.

### The right test

```python
def test_default_rate():
    seed_test_db(c_grade_loans=10, c_grade_defaults=2)  # ground truth: 20%
    response = agent("what's the default rate of C-grade loans?")
    assert called_tool(response, "tool_execute_sql_query")
    match = re.search(r"(\d+(?:\.\d+)?)\s*%", response.text)
    assert match is not None
    assert abs(float(match.group(1)) - 20.0) < 0.5
```

Three properties:

1. The test sets up reality so we know the right answer.
2. It checks the answer, not the path.
3. It allows tolerance for natural language variation and floating-point precision.

This pattern applies to anything where the same input is allowed to produce different intermediate steps but should produce the same final answer — search, recommendation, any LLM-driven analysis. The general rule: **if the system is non-deterministic, anchor your tests to ground truth, not to traces.**

### The observability gap

Tests cover dev. Production runs don't have asserts. I documented (but did not implement) the production observability story:

- Log every (question, retrieved rules, SQL, result, final answer, timestamp, user_id) tuple.
- Sample N% daily for human spot-check against analyst-written truth.
- Compute a weekly drift metric: are answers to the same canonical question stable?
- Alert when answer variance crosses a threshold — that's usually a schema change, a prompt regression, or upstream data drift.

The framework framework is **black-box → observable system**. The Agent is opaque by default; you make it transparent by instrumenting every step.

---

## The Last Mile — Product Thinking Beats Engineering Thinking

The biggest mindset shift in Month 3 was the gap between "it works" and "people use it."

I had been thinking like an engineer for two months: does the code run? Does the test pass? Are the imports clean? Is the architecture extensible?

In Month 3 I had to start asking different questions: When the analyst opens the chat, what do they see? Do they trust it on first look? Can they quickly verify a number? When they want detail, can they get it? When they don't, can they hide it? What does the very first interaction look like?

That's product thinking, and it doesn't come from staring at the code. It comes from staring at the screen and pretending I am someone who has never seen this before.

The collapsible "Thinking" block was the concrete outcome. The deeper takeaway was:

> Engineers default to "I think this is good." Products require "the user thinks this is good."

The two are not the same.

---

## What I'd Do Differently

A handful of things I would change with another three months.

### Build the test harness first, not third

I built tests early for the foundation but late for the Agent. The Agent's correctness story would have been clearer if I had defined the Before/Action/After harness in Month 2 at the same time as the first tool. Defining "correct" up front shapes design choices in the right direction.

### Index domain rules earlier

The S3 Vector index landed mid-Month 2. The hand-written SQL in Month 1 was actually *the* source material for the recipe namespace — I just didn't realize it at the time. If I'd structured the Month 1 SQL work as "write the SQL and a one-paragraph description of when to use it," I'd have had the seed of the index for free.

### Separate the demo from the product earlier

The Vercel demo (no RAG) and the internal pilot (with RAG) ended up sharing a codebase, which created small awkwardnesses around feature flags. If I were doing it again, I'd factor the RAG layer behind a clearer interface from day one — `BusinessRulesProvider` with a `S3VectorProvider` and a `NoOpProvider` implementation — so the demo and the internal version differ only by configuration.

### Write the ER document myself before writing any code

I had a great ER document handed to me. I should have rewritten it in my own words on day one. I would have caught some schema subtleties (the intentional C-grade mispricing, the 1:1 nature of `loan ↔ application`, the fact that not every defaulted loan has every payment recorded) earlier than I did.

### Keep a running "next-steps" doc from day one

The list of things-I-am-not-doing-but-someone-should — drift detection, IAM, audit pipeline, SSO — got written down at the end. It would have been more useful written down as I made each decision. A continuously updated "deferred work" document is a cheap deliverable that keeps the project legible to whoever inherits it.

---

## What I Took Away

The technical bullets are well covered above. The meta-lessons are what I want to hold onto.

### Pick something a stretch beyond your current ability — but not insane

If I had only worked on things I already knew how to do, I would have learned nothing. If I had picked something five orders of magnitude beyond my level, I would have drowned. The right zone is "hard enough that I'll struggle, structured enough that I won't disappear." This project hit that zone.

### Think Big, Code Small

Architecture choices made in week one determined how easy week ten was. Singletons, mixins, lazy loading, central path enums, central runtime detection — none of them were impressive on their own, all of them compounded. The opposite — hack it together first, refactor later — never actually leaves time for the refactor.

### AI doesn't need teaching; it needs context

The shift from "how do I teach AI to write SQL" to "how do I give AI the right context for this database" was the hinge of the project. Almost every problem after Month 1 reduced to: am I giving the model enough information? Schema encoding, RAG, debug reports, the system prompt — they were all variations on **information design for AI consumption**.

### Tools are capability boundaries

What an Agent can do is exactly what its tools allow. Tool design is product design. Add tools deliberately; each one widens the blast radius.

### Manage the smarter the same way you manage humans — make it report

I do not have to be smarter than the model to manage it. I do have to be able to see what it's thinking. Reporting is the universal management primitive. Apply it to humans, AI, and your own past self.

### Good enough is good enough

Perfection is a momentum killer. The right move is usually the smallest intervention that closes the largest bucket of risk. Layer the rest in over time, with eyes open about what you've deferred.

### Don't test the path; test the outcome

For non-deterministic systems, anchor tests to ground truth. The intermediate steps are allowed to vary. The answer must be correct.

### The gap between "it works" and "people use it" is product

Engineering finishes at "it works." Product finishes at "they choose to use it." The distance between the two is bigger than it looks.

### Documentation turns process into asset

Three months from now I will not remember why I picked NeonDB over RDS. I will not remember the exact validator function. The blog posts and this case study are the durable form of all of that. **Knowledge is volatile. Documentation is durable.**

### Break big things into small things, then walk

The project was not a single dramatic breakthrough. It was fifteen small lessons strung together — singleton, lazy load, schema, SQL, agent, tool, RAG, validator, test, frontend, deploy, document. Each step was small. The accumulation was the project.

---

## Outcomes

A deliberately conservative summary, since this was an internship pilot rather than a production deployment.

### Functional outcomes

- A working AI BI Agent for SMB lending analytics, deployed as an internal tool on Vercel
- Coverage of the five core analytical questions (risk pricing alignment, portfolio concentration, approval leakage, early warning signals, customer lifetime value) end to end in natural language
- Audit-style debug reports for every non-trivial analysis, written to disk
- A two-stage S3 Vector retrieval layer over four namespaces of distilled domain knowledge (concepts, recipes, Q&A pairs, schema notes)
- A test harness for the five business questions plus edge cases, using the Before/Action/After framework
- A web UI with a collapsible reasoning trace and a clear separation between answer and thinking
- Documentation: a CLAUDE.md architecture guide, an ER document, a fifteen-concept analytical reference, fifteen reflective blog posts, and this case study

### Pilot reception (qualitative, internal)

- Used by a small internal cohort during the final weeks of the internship; framed as a paradigm/proof of concept rather than a decision system.
- Common reaction: the debug report is the differentiator. Several testers said the trace is what made the answer feel checkable rather than magical.
- Common gap: response latency on multi-step questions. The Agent sometimes calls four or five tools, and each tool round-trip adds time.
- Common request: ability to pin or save useful answers — a feature I scoped out as future work.

### Indicative impact (estimates, not measurements)

- Roughly the recurring analytical questions covered by the five canonical patterns are the ones a credit analyst answered weekly. The Agent reduced those from "open the SQL editor and write the query" to "ask in natural language and verify the trace." For analysts who took it up during the pilot, the time-to-first-answer on those patterns dropped meaningfully — but I am not putting a precise hours-saved number on that, because the pilot was small and short.
- The Agent did not replace the analyst's verification step. It changed where the verification happened — from "compose the SQL myself" to "read the SQL the Agent wrote." That's a real shift in cognitive load even when the wall-clock improvement is modest.

### What I'm explicitly not claiming

- No production deployment.
- No formal A/B test against analyst-written answers.
- No statistical adoption metric.
- No ROI calculation.

The honest framing is: this was a working internal pilot of a vertical Agent paradigm, with documented gaps before it could carry real lending decisions, and clear next steps for closing those gaps.

---

## Open Questions and Future Roadmap

A list of things this project surfaced that would be worth continued work.

### Productionization

- Read-only DB role for defense in depth
- IAM-bound credentials per Agent identity
- Centralized audit log for every (question, SQL, answer) tuple
- Drift detection on canonical questions
- Spot-check sampling against analyst-written ground truth
- SSO for the chat UI

### Capability extensions

- Visualization tool — pull a result, render an inline chart
- Multi-turn memory — the Agent currently treats each question as standalone; a follow-up like "now break that down by industry" requires re-stating context
- Dataset-level annotations — let analysts mark certain debug reports as "verified" so they become reusable RAG seed material
- Time-aware comparisons — automatic comparison of an answer to its previous run, with diff highlighting

### RAG quality

- Active learning loop: incorrect answers identified during spot checks become seed material for new RAG entries
- Schema-aware retrieval: combine vector similarity with structural matching against the schema graph
- Recipe versioning: when business definitions change, old recipes shouldn't silently keep matching

### Cost / performance

- Cache rewrites for repeated questions
- Batch retrieval calls when multiple tools fire in the same turn
- Profile the latency budget by tool and look for parallelization opportunities

### Generalization

- The whole pattern — encode schema, distill rules, retrieve in two stages, validate before execute, audit after — is portable to other vertical domains. Insurance underwriting, healthcare claims, e-commerce ops, supply chain. The most reusable artifact from this project may not be the code; it may be the **playbook for building vertical Agents over a relational database with curated business rules**.

---

## Tech Stack Reference

A quick cheat sheet for anyone reading this who wants the concrete stack at a glance.

| Layer | Choice | Notes |
|-------|--------|-------|
| Language (backend) | Python 3.12 | Managed with `uv` |
| Language (frontend) | TypeScript / Next.js | Managed with `pnpm` |
| Tool versioning | `mise` | Pins Python, Node, uv, pnpm versions |
| Local DB | SQLite | Single file, no ops |
| Cloud DB | NeonDB (PostgreSQL) | Serverless, scale-to-zero |
| LLM provider | AWS Bedrock | Configurable model id via config |
| Agent framework | Strands Agents SDK | Reasoning loop and `@tool` decorator |
| Vector store | S3 Vector | Indexed in four namespaces |
| Embeddings | Bedrock embedding model | Same provider as reasoning model |
| SQL safety | `sqlparse` validator | SELECT-only, single-statement |
| Backend framework | FastAPI | Wraps the Agent for HTTP |
| Frontend framework | Next.js + React | Vercel AI SDK integration |
| Deployment | Vercel | Environment variables for secrets |
| Tests | pytest | Pure-function tests + Before/Action/After harness |
| Process | Singleton with mixins, lazy-loaded properties | One-import surface for all capabilities |

---

## Closing

If I had to compress the whole three months into one paragraph for an HR conversation:

I joined a FinTech client as an AI Agent intern with no Agent experience and modest SQL. I left having designed and built a vertical-domain BI Agent for SMB lending analytics — backed by a relational database, AWS Bedrock, the Strands Agents SDK, an S3 Vector RAG layer with two-stage retrieval over four namespaces of distilled domain knowledge, a Python-side SQL safety layer, an audit-trail tool, a non-determinism-aware test harness, and a chat UI with a collapsible reasoning trace, deployed as an internal tool on Vercel. The system was a paradigm rather than a production deployment, with the gaps to production explicitly documented as next steps. The bigger lesson — bigger than any specific piece of the stack — was the shift in mindset: from "how do I teach AI to do this" to "how do I give AI the right context to do this." That one reframing reorganized everything that followed, and is the lens I now bring to any AI-assisted system.

The project is alive. The team can use it. The documents are written. Future me has a letter from past me explaining how it all works. That feels like the right place for an internship to end.

    </markdown_content>
</document>

</knowledge-base>