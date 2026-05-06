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
</knowledge-base>