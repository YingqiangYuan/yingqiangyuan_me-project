import { AchievementStat } from "@/types"

// Featured projects. Layout renders 2 rows × 3 cols.
// Empty entries are intentional placeholders to be filled in later.
export const achievementStats: AchievementStat[] = [
  {
    title: "Agentic BI for Lending Analytics",
    subtitle:
      "An AI agent that turns natural-language questions into multi-step SQL analyses across a seven-table Snowflake schema. Built on AWS Bedrock with Strands Agents and RAG over an S3 vector store, it encodes credit-risk methods like vintage cohort analysis, implied default probability, and borrower similarity scoring as retrievable references the agent can ground every answer in.",
    tags: [
      "AWS Bedrock",
      "Strands Agents",
      "RAG",
      "S3 Vector Store",
      "Snowflake",
      "Text-to-SQL",
      "Python",
    ],
    href: "",
    accent: "cyan",
  },
  {
    title: "Prompt Eval & Adversarial Testing",
    subtitle:
      "An LLM-as-Judge evaluation pipeline for an enterprise LLM system. Roughly 200 annotated test cases (25% of them adversarial) cover six use cases and are scored on business correctness plus five security risk dimensions. Wired into GitHub Actions CI with deployment gates and S3-persisted regression metrics, it became the team's first formal prompt QA process before production releases.",
    tags: [
      "AWS Bedrock Converse",
      "LLM-as-Judge",
      "GitHub Actions",
      "S3",
      "CI/CD",
      "Adversarial Testing",
      "Python",
    ],
    href: "",
    accent: "violet",
  },
  {
    title: "Enterprise Data Lake for Fintech",
    subtitle:
      "A Bronze, Silver, and Gold lakehouse on AWS for a fintech with 2M cardholders and 800M annual transactions. Real-time and batch ingestion run through Kinesis (2.2M transactions per day), Kafka, and Step Functions, while Delta Lake ACID upserts execute on Lambda using delta-rs and Polars. LakeFormation column-level ACLs and three-tier CloudWatch alerts cut regulatory audit response from three weeks to under twenty-four hours.",
    tags: [
      "AWS Kinesis",
      "Kafka",
      "Step Functions",
      "Lambda",
      "Delta Lake",
      "Polars",
      "Redshift",
      "Athena",
      "Lake Formation",
      "CloudWatch",
    ],
    accent: "mint",
  },
]
