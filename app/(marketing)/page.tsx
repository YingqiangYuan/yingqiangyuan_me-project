import { Metadata } from "next"
import { generateSEOMetadata } from "@/lib/seo/generateMetadata"
import HomePageContent from "./HomePageContent"

export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata({
    title: "YingQiang Yuan - AI Developer & Data Engineer",
    description: "AI Developer and Data Engineer building LLM-powered agentic systems, RAG pipelines, and enterprise data platforms on AWS. Experience spans Bedrock, Strands Agents, Delta Lake, Kinesis, and Snowflake across financial services and AI evaluation infrastructure.",
    keywords: [
      "AI Developer",
      "Data Engineer",
      "LLM",
      "RAG",
      "Agentic AI",
      "AWS Bedrock",
      "Strands Agents",
      "Delta Lake",
      "Snowflake",
      "Data Pipelines",
      "Prompt Engineering",
      "LLM-as-Judge",
    ],
    url: "https://yingqiangyuan.me",
    ogTitle: "YingQiang Yuan - AI Developer & Data Engineer",
    ogDescription: "AI Developer focused on LLM-powered agentic applications, retrieval-augmented generation, and evaluation infrastructure on AWS, with production data engineering experience building real-time and batch pipelines for financial services.",
    imageAlt: "YingQiang Yuan Profile Photo - AI Developer & Data Engineer",
    twitterTitle: "YingQiang Yuan - AI Developer & Data Engineer",
    twitterDescription: "AI Developer and Data Engineer building LLM-powered agents, RAG pipelines, and enterprise data lakes on AWS — Bedrock, Strands Agents, Delta Lake, Kinesis, Snowflake.",
  })
}

export default function HomePage() {
  return <HomePageContent />
}
