import React from "react"
import Layout from "@lekoarts/gatsby-theme-jodie/src/components/layout"
import { Box, Heading, Text, Link as ThemeLink, Flex, Button } from "theme-ui"

// --- Reusable Section Component ---
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Box as="section" sx={{ mb: [5, 5] }}>
    <Heading as="h2" sx={{
      fontSize: 4,
      mb: 4,
      display: "flex",
      alignItems: "center",
      gap: 3,
      borderBottom: "1px solid",
      borderColor: "rgba(255, 255, 255, 0.08)",
      pb: 3,
    }}>
      <Box sx={{ width: "4px", height: "24px", bg: "var(--primary)", borderRadius: "2px" }} />
      {title}
    </Heading>
    <Box className="glass-card" sx={{ p: [3, 4] }}>
      {children}
    </Box>
  </Box>
)

const ResumePage = () => {
  const skills = {
    "Tech & Frameworks": "TypeScript, Python, React, FastAPI, Next.js, LangChain, Angular, Node.js",
    "Databases & Vector": "MongoDB (Atlas), PostgreSQL, FAISS, Pinecone",
    "DevOps & Tools": "Git, Docker, Terraform, CI/CD (GitHub Actions, Jenkins), AWS, Azure",
    "Languages": "French (Native), English (Professional), Japanese (N5+)"
  }

  const workExperience = [
    {
      company: "FREELANCE",
      location: "Osaka, Japan",
      title: "Full Stack AI Engineer & SaaS Founder",
      period: "Mar 2025 – Present",
      bullets: [
        "Launched DocsRetriever, a production B2B RAG SaaS serving 10+ paying enterprise customers.",
        "Architected and delivered 2 full-stack MVPs, each with custom APIs, dashboards, authentication, and automated CI/CD deployment.",
        "Currently developing second B2B SaaS (Suru [する]) for the Japanese market with full i18n support."
      ]
    },
    {
      company: "CAPGEMINI",
      location: "Valbonne, France",
      title: "Software Engineer (1-Year Contract)",
      period: "Apr 2024 – Mar 2025",
      bullets: [
        "Led development of 2 production GenAI applications using FastAPI, LangChain, and React, deployed on Azure with Docker and Terraform.",
        "Engineered a Flask-to-FastAPI migration, achieving a 60% performance boost (p95 latency from 500ms to 200ms) by leveraging async operations.",
        "Implemented a hybrid search RAG system combining semantic (sentence-transformers) and keyword search (BM25) for high-relevancy results.",
        "Built a secure document processing pipeline featuring role-based access control (RBAC) and comprehensive audit logging."
      ]
    },
    {
      company: "CAWITA TECHNOLOGIES",
      location: "Antibes, France",
      title: "Full Stack Developer",
      period: "Sep 2022 – Aug 2023",
      bullets: [
        "Developed and maintained scalable web applications using the MEAN stack (MongoDB, Express, Angular, Node.js).",
        "Automated deployment workflows by implementing a Jenkins CI/CD pipeline, reducing deployment time from 2 hours to under 15 minutes."
      ]
    }
  ]

  const education = [
    {
      degree: "Master of Computer Science in Applied Artificial Intelligence (MIAGE)",
      school: "Université Côte d'Azur",
      location: "Nice, France",
      period: "2022 – 2024",
    },
    {
      degree: "Master's Exchange Program in Computer Science (AI Specialization)",
      school: "Université Laval",
      location: "Quebec, Canada",
      period: "2023 – 2024"
    },
  ]

  const handlePrint = () => {
    window.print()
  }

  return (
    <Layout>
      <Box sx={{ maxWidth: "1000px", mx: "auto", px: [3, 4], py: [4, 5] }}>

        {/* --- PRINT BUTTON --- */}
        <Button
          as="a" // Use the 'as' prop to render this as an <a> tag
          href="/nathan-rihet-resume.pdf" // Link to your PDF in the /static folder
          download // This attribute triggers the download
          className="contact-btn"
          sx={{
            position: "fixed",
            bottom: 4,
            right: 4,
            cursor: "pointer",
            zIndex: 9999,
            textDecoration: "none !important", // Ensure no underline
            "@media print": { display: "none" },
          }}
        >
          📄 Download PDF
        </Button>

        {/* --- HEADER --- */}
        <Box sx={{ textAlign: "center", mb: 6, pb: 4 }}>
          <Heading as="h1" className="text-gradient" sx={{
            fontSize: [5, 6, 7],
            fontWeight: "800",
            letterSpacing: "-0.02em",
            mb: 0,
          }}>
            NATHAN RIHET
          </Heading>
          <Text sx={{ fontSize: [2, 3], color: "text", mb: 4, lineHeight: 1.6, maxWidth: "720px", mx: "auto" }}>
            Full-Stack Engineer specializing in GenAI/RAG systems with 3+ years building scalable applications.
            <br />
            📍 Osaka, Japan
          </Text>
          <Flex sx={{
            justifyContent: "center",
            flexWrap: "wrap",
            gap: [3, 4],
            fontSize: 1,
            "& a": {
              color: "muted !important",
              textDecoration: "none !important",
              fontWeight: 500,
              "&:hover": {
                color: "primary !important",
              }
            },
            "& > div": { display: "flex", alignItems: "center", gap: 2 }
          }}>
          </Flex>
        </Box>

        {/* --- TECHNICAL SKILLS --- */}
        <Section title="Technical Skills">
          <Box sx={{ display: "grid", gap: 3 }}>
            {Object.entries(skills).map(([category, items]) => (
              <Flex key={category} sx={{ flexDirection: ['column', 'row'], gap: [1, 3], borderBottom: "1px solid", borderColor: "rgba(255,255,255,0.05)", pb: 3, "&:last-of-type": { border: "none", pb: 0 } }}>
                <Text sx={{ fontWeight: 700, minWidth: ["auto", "180px"], color: "text", fontSize: 1 }}>
                  {category}
                </Text>
                <Text sx={{ flex: 1, color: "muted", lineHeight: 1.7 }}>{items}</Text>
              </Flex>
            ))}
          </Box>
        </Section>

        {/* --- WORK EXPERIENCE --- */}
        <Section title="Work Experience">
          {workExperience.map((job, index) => (
            <Box key={index} sx={{ mb: 4, "&:last-of-type": { mb: 0 } }}>
              <Flex sx={{ justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 1, mb: 2 }}>
                <Box>
                  <Heading as="h4" sx={{ fontSize: 2, color: "text", m: 0, mb: 1 }}>{job.company}{" "}</Heading>
                  <Text sx={{ color: "text", fontWeight: 500, mb: 1 }}>{job.title}</Text>
                  <Text sx={{ color: "muted", fontSize: 1 }}>{" "}{job.location}</Text>
                </Box>
                <Text sx={{ color: "muted", fontSize: 1, whiteSpace: "nowrap", fontWeight: 500, pt: 1, flexShrink: 0 }}>{job.period}</Text>
              </Flex>
              <Box as="ul" sx={{ listStyle: "none", pl: 0, mt: 3 }}>
                {job.bullets.map((bullet, i) => (
                  <Box as="li" key={i} sx={{
                    position: "relative", pl: "20px", mb: 2, fontSize: 1, color: "text",
                    "&::before": {
                      content: '"▸"', position: "absolute", left: 0, color: "primary", top: "2px"
                    }
                  }}>
                    {bullet}
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Section>

        {/* --- EDUCATION & TEACHING --- */}
        <Section title="Education & Teaching">
            {/* Education Items */}
            {education.map((edu, index) => (
              <Box key={index} sx={{ mb: 3, pb: 3, borderBottom: "1px solid", borderColor: "rgba(255,255,255,0.05)" }}>
                <Heading as="h5" sx={{ fontWeight: "bold", color: "text", fontSize: 2, m: 0, mb: 1 }}>{edu.degree}</Heading>
                <Text sx={{ color: "muted", fontSize: 1 }}>
                  {edu.school} • {edu.location} • {edu.period}
                </Text>
              </Box>
            ))}
            {/* Teaching Item */}
            <Box sx={{ pt: 3 }}>
              <Heading as="h5" sx={{ fontWeight: "bold", color: "text", fontSize: 2, m: 0, mb: 1 }}>
                Academic Instructor – Conversational Agents & LLMs
              </Heading>
              <Text sx={{ display: 'block', color: "muted", fontSize: 1, mb: 2 }}>
                Université Côte d'Azur • Nice, France • Dec 2024 – Jan 2025
              </Text>
              <Text sx={{ display: 'block', fontSize: 1, color: "text", lineHeight: 1.7 }}>
                Designed and delivered 7 practical workshops for 20+ Master's students, covering applied prompt engineering, RAG systems, and FastAPI deployment. {" "}
                <ThemeLink href="https://github.com/NathanKneT/Master-AI-Chatbot-Course-2024" target="_blank" sx={{ color: "primary !important", fontWeight: 600 }}>
                  View Course Materials →
                </ThemeLink>
              </Text>
            </Box>
        </Section>

        {/* --- COMMUNITY & CREATIVE --- */}
        <Section title="Community & Creative Initiatives">
            {/* Photography */}
            <Box sx={{ mb: 3, pb: 3, borderBottom: "1px solid", borderColor: "rgba(255,255,255,0.05)" }}>
              <Heading as="h5" sx={{ fontWeight: "bold", color: "text", fontSize: 2, m: 0, mb: 1 }}>Freelance Photographer & Visual Storyteller</Heading>
              <Text sx={{ display: 'block', color: "muted", fontSize: 1, mb: 2 }}>
                Canada, France, Japan • 2019 – Present
              </Text>
               <Text sx={{ display: 'block', fontSize: 1, color: "text", lineHeight: 1.7 }}>
                Built and maintain a high-performance photography portfolio with Next.js, applying visual storytelling to improve layout, accessibility, and engagement (300K+ views). {" "}
                <ThemeLink href="https://nathanglhf.com" target="_blank" sx={{ color: "primary !important", fontWeight: 600 }}>
                  View Portfolio →
                </ThemeLink>
              </Text>
            </Box>
            {/* Student Association */}
            <Box sx={{ pt: 3 }}>
              <Heading as="h5" sx={{ fontWeight: "bold", color: "text", fontSize: 2, m: 0, mb: 1 }}>MIAGE Student Association Lead</Heading>
              <Text sx={{ display: 'block', color: "muted", fontSize: 1, mb: 2 }}>
                Université Côte d'Azur • Nice, France • 2022 – 2023
              </Text>
              <Text sx={{ display: 'block', fontSize: 1, color: "text", lineHeight: 1.7 }}>
                Managed a 7-member team to launch a university-wide DevTalk series and organize AI-focused workshops, reaching over 150 attendees per session.
              </Text>
            </Box>
        </Section>

        {/* --- PRINT STYLES --- */}
        <style jsx global>{`
          @media print {
            body {
              font-size: 10.5pt;
              background: #fff !important;
              color: #000 !important;
            }
            .glass-card, .layout-container {
              background: transparent !important;
              box-shadow: none !important;
              border: none !important;
              color: #000 !important;
              padding: 0 !important;
            }
            h1, h2, h3, h4, h5, h6, p, a, span, li, div {
              color: #000 !important;
              background: transparent !important;
            }
            a {
              text-decoration: none !important;
            }
            .css-sngorz {
              padding: 0 !important;
            }
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            @page {
              margin: 0.7in;
            }
          }
        `}</style>
      </Box>
    </Layout>
  )
}

export default ResumePage

export const Head = () => (
  <>
    <title>Nathan RIHET - Full-Stack Software Engineer | Resume</title>
    <meta name="description" content="Resume of Nathan RIHET - Full-Stack Software Engineer in Osaka, Japan. 3+ years experience in TypeScript, React, Python, AI/RAG systems. Seeking opportunities with visa sponsorship." />
    <meta name="keywords" content="software engineer Osaka, full stack developer Japan, AI engineer resume, React developer CV, TypeScript developer Japan" />
  </>
)