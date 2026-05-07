import { Metadata } from "next"
import { generateSEOMetadata } from "@/lib/seo/generateMetadata"
import HomePageContent from "./HomePageContent"

export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata({
    title: "John Doe - Solution Architect & Builder",
    description: "Solution Architect and Open Source Developer with 150+ Python libraries, 10M+ monthly downloads, and 600+ repositories. Specialized in cloud architecture, AI, and enterprise solutions.",
    keywords: [
      "Open Source Developer",
      "Python Libraries",
      "Cloud Architecture",
      "Enterprise Solutions",
      "Automation",
      "Software Engineering",
      "Tech Leadership",
    ],
    url: "https://johndoe.me",
    ogTitle: "John Doe - Solution Architect & Open Source Builder",
    ogDescription: "Experienced Solution Architect and prolific Open Source Developer. Creator of 160+ Python libraries with 10M+ monthly downloads. Specialized in cloud architecture, automation, and enterprise solutions.",
    imageAlt: "John Doe Profile Photo - Solution Architect & Builder",
    twitterTitle: "John Doe - Solution Architect & Builder",
    twitterDescription: "Solution Architect and Open Source Developer with 160+ Python libraries, 10M+ monthly downloads, and 600+ repositories. Specialized in cloud architecture, AI, and enterprise solutions.",
  })
}

export default function HomePage() {
  return <HomePageContent />
}
