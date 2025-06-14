import React from "react"
import Layout from "@lekoarts/gatsby-theme-jodie/src/components/layout"
import { Box, Heading, Text, Link as ThemeLink, Flex, Button } from "theme-ui"

const ResumePage = () => {
  const skills = {
    "Tech & Frameworks": "TypeScript, Python, React, FastAPI, Next.js, Angular, Node.js",
    "Databases": "MongoDB, PostgreSQL",
    "DevOps & Tools": "Git, Docker, CI/CD, Jenkins",
    "Languages": "French (Native), English (Professional), Japanese (Elementary)"
  }

  const workExperience = [
    {
      company: "CAPGEMINI",
      subtitle: "Global technology consulting company",
      location: "Valbonne, France",
      title: "Software Engineer (1-Year Contract)",
      period: "Apr 2024 – Mar 2025",
      bullets: [
        "Built 2 GenAI applications using FastAPI, Langchain, and React, deployed via Docker/Terraform (Azure)",
        "Optimized Flask-to-FastAPI migration: reduced p95 latency from 500ms to 200ms through async operations",
        "Implemented hybrid search RAG system combining semantic (sentence-transformers) and keyword search",
        "Implemented secure document processing pipeline with role-based access control and audit logging"
      ]
    },
    {
      company: "FREELANCE",
      location: "Remote",
      title: "Full Stack Developer",
      period: "Mar 2025 – Present",
      bullets: [
        "Delivered 2 MVPs, each with custom APIs, dashboards, auth, and CI/CD deployment",
        "Launched DocsRetriever, a production B2B SaaS serving 10 paying enterprise customers",
        "Currently developing second MVP (Suru [する]) for Japanese market with i18n support"
      ]
    },
    {
      company: "CAWITA TECHNOLOGIES",
      location: "Antibes, France",
      title: "Full Stack Developer",
      period: "Sep 2022 – Aug 2023",
      bullets: [
        "Developed scalable web applications using MEAN stack (MongoDB, Express, Angular, Node.js)",
        "Implemented Jenkins CI/CD pipeline reducing deployment time from 2 hours to 15 minutes"
      ]
    }
  ]

  const education = [
    {
      degree: "Master of Computer Science in Applied Artificial Intelligence (MIAGE)",
      school: "Université Côte d'Azur",
      location: "Nice, France",
      period: "Sep 2022 – Sep 2024",
      details: "Relevant Coursework: Algorithms, System Design, DevOps, Software Architecture"
    },
    {
      degree: "Master's Exchange Program in Computer Science (AI Specialization)",
      school: "Université Laval",
      location: "Quebec, Canada",
      period: "Sep 2023 – Mar 2024"
    },
    {
      degree: "Bachelor's Degree in Computer Methods Applied to Business Management",
      school: "Université Côte d'Azur",
      location: "Nice, France",
      period: "Sep 2021 – Sep 2022"
    }
  ]

  const projects = [
    {
      name: "DocsRetriever – French Enterprise Document AI",
      tech: "Langchain, FastAPI, Next.js, MongoDB Atlas",
      link: "https://docsretriever.com/",
      linkText: "docsretriever.com",
      period: "May 2024 – Present",
      bullets: [
        "Implemented hybrid RAG pipeline: semantic search + BM25, achieving <2s query on 10K docs",
        "Architected async document processing handling PDF/DOCX/TXT with job queue system",
        "Deployed on VPS with custom Docker orchestration, 99.9% uptime since launch"
      ]
    },
    {
      name: "RTHT-3D – Hand Tracking Interface",
      tech: "Python, Blender, Mediapipe",
      link: "https://github.com/NathanKneT/RTHT-3D",
      linkText: "github.com/NathanKneT/RTHT-3D",
      period: "April 2025",
      bullets: [
        "Built real-time gesture recognition system for 3D object manipulation using Python and MediaPipe",
        "Implemented dual-hand tracking at 30 FPS using MediaPipe's hand landmark detection",
        "Featured on SNS with 200k+ reach and video demonstration"
      ]
    },
    {
      name: "Asylum – Interactive Storytelling Platform",
      tech: "Next.js, Tailwind, React",
      link: "https://github.com/NathanKneT/asylum-interactive-story-nextjs",
      linkText: "github.com/NathanKneT/asylum-interactive-story-nextjs",
      period: "May 2025 – Present",
      bullets: [
        "Designed visual editor using React Flow with specialized node types (Start, Scene, End) and dynamic connections",
        "Architected system with strict TypeScript, lazy loading, and modular components"
      ]
    }
  ]

  const handlePrint = () => {
    window.print()
  }

  return (
    <Layout>
      <Box sx={{ maxWidth: "900px", mx: "auto", px: [3, 4], py: [4, 5] }}>
        {/* Print Button */}
        <Button
          onClick={handlePrint}
          sx={{
            position: "fixed",
            bottom: 4,
            right: 4,
            bg: "#FFA500",
            color: "#0c0c0c",
            fontWeight: "bold",
            px: 3,
            py: 2,
            borderRadius: "25px",
            cursor: "pointer",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s",
            zIndex: 9999,
            "@media print": { display: "none" },
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)"
            }
          }}
        >
          📄 Print Resume
        </Button>

        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 5, pb: 4, borderBottom: "2px solid", borderColor: "muted" }}>
          <Heading as="h1" sx={{ fontSize: [5, 6], mb: 2, fontWeight: "bold" }}>
            NATHAN RIHET
          </Heading>
          <Text sx={{ fontSize: [2, 3], color: "text", mb: 3, lineHeight: 1.5 }}>
            Full-Stack Engineer specializing in GenAI/RAG systems with 3+ years building scalable applications.
            <br />Currently in Japan, open to opportunities requiring visa sponsorship.
          </Text>
          <Flex sx={{ 
            justifyContent: "center", 
            flexWrap: "wrap", 
            gap: [2, 3],
            fontSize: [1, 2],
            "& > div": { display: "flex", alignItems: "center", gap: 1 }
          }}>
            <Box>📍 Osaka, Japan</Box>
            <Box>
              📱 <ThemeLink href="tel:+81708544481" sx={{ color: "primary" }}>+81 7 08 54 46 481</ThemeLink>
            </Box>
            <Box>
              ✉️ <ThemeLink href="mailto:nathan.rihet06@gmail.com" sx={{ color: "primary" }}>nathan.rihet06@gmail.com</ThemeLink>
            </Box>
            <Box>
              💼 <ThemeLink href="https://linkedin.com/in/nathan-rihet" target="_blank" sx={{ color: "primary" }}>LinkedIn</ThemeLink>
            </Box>
            <Box>
              🐙 <ThemeLink href="https://github.com/NathanKneT" target="_blank" sx={{ color: "primary" }}>GitHub</ThemeLink>
            </Box>
          </Flex>
        </Box>

        {/* Technical Skills */}
        <Box sx={{ mb: 5 }}>
          <Heading as="h2" sx={{ fontSize: 3, mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ width: "4px", height: "20px", bg: "primary", borderRadius: "2px" }} />
            TECHNICAL SKILLS
          </Heading>
          <Box sx={{ 
            display: "grid", 
            gap: 2,
            bg: "rgb(36 37 39 / 43%)",
            p: 3,
            borderRadius: "8px"
          }}>
            {Object.entries(skills).map(([category, items]) => (
              <Flex key={category} sx={{ gap: 3, alignItems: "flex-start", flexWrap: ["wrap", "nowrap"] }}>
                <Text sx={{ fontWeight: "bold", minWidth: ["auto", "150px"], color: "#abbcbd", fontSize: 1 }}>
                  {category}:
                </Text>
                <Text sx={{ flex: 1 }}>{items}</Text>
              </Flex>
            ))}
          </Box>
        </Box>

        {/* Work Experience */}
        <Box sx={{ mb: 5 }}>
          <Heading as="h2" sx={{ fontSize: 3, mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ width: "4px", height: "20px", bg: "primary", borderRadius: "2px" }} />
            WORK EXPERIENCE
          </Heading>
          {workExperience.map((job, index) => (
            <Box key={index} sx={{ 
              mb: 4, 
              p: 3, 
              bg: "rgb(36 37 39 / 43%)", 
              borderRadius: "8px",
              transition: "box-shadow 0.2s",
              "&:hover": { boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }
            }}>
              <Flex sx={{ justifyContent: "space-between", flexWrap: "wrap", gap: 2, mb: 2 }}>
                <Box>
                  <Text sx={{ fontWeight: "bold", fontSize: 2, mb: 1 }}>{job.company}</Text>
                  {job.subtitle && (
                    <Text sx={{ color: "#abbcbd", fontSize: 1, mb: 2 }}>{job.subtitle} • {job.location}</Text>
                  )}
                  {!job.subtitle && (
                    <Text sx={{ color: "#abbcbd", fontSize: 1, mb: 2 }}>{job.location}</Text>
                  )}
                  <Text sx={{ fontWeight: "medium" }}>{job.title}</Text>
                </Box>
                <Text sx={{ color: "#abbcbd", fontSize: 1, whiteSpace: "nowrap" }}>{job.period}</Text>
              </Flex>
              <Box as="ul" sx={{ listStyle: "none", pl: 0, mt: 2 }}>
                {job.bullets.map((bullet, i) => (
                  <Box as="li" key={i} sx={{ 
                    position: "relative", 
                    pl: 3, 
                    mb: 2,
                    fontSize: 1,
                    lineHeight: 1.6,
                    "&::before": {
                      content: '"▸"',
                      position: "absolute",
                      left: 0,
                      color: "primary"
                    }
                  }}>
                    {bullet}
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>

        {/* Education */}
        <Box sx={{ mb: 5 }}>
          <Heading as="h2" sx={{ fontSize: 3, mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ width: "4px", height: "20px", bg: "primary", borderRadius: "2px" }} />
            EDUCATION
          </Heading>
          {education.map((edu, index) => (
            <Box key={index} sx={{ mb: 3, p: 3, bg: "rgb(36 37 39 / 43%)", borderRadius: "8px" }}>
              <Text sx={{ fontWeight: "bold", mb: 1 }}>{edu.degree}</Text>
              <Text sx={{ color: "#abbcbd", fontSize: 1 }}>
                {edu.school} • {edu.location} • {edu.period}
              </Text>
              {edu.details && (
                <Text sx={{ mt: 1, fontSize: 1 }}>{edu.details}</Text>
              )}
            </Box>
          ))}
        </Box>

        {/* Teaching Experience */}
        <Box sx={{ mb: 5 }}>
          <Heading as="h2" sx={{ fontSize: 3, mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ width: "4px", height: "20px", bg: "primary", borderRadius: "2px" }} />
            TEACHING EXPERIENCE
          </Heading>
          <Box sx={{ 
            p: 3, 
            bg: "rgb(36 37 39 / 43%)", 
            borderRadius: "8px",
            transition: "box-shadow 0.2s",
            "&:hover": { boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }
          }}>
            <Flex sx={{ justifyContent: "space-between", flexWrap: "wrap", gap: 2, mb: 2 }}>
              <Box>
                <Text sx={{ fontWeight: "bold", fontSize: 2, mb: 1 }}>Université Côte d'Azur</Text>
                <Text sx={{ color: "#abbcbd", fontSize: 1, mb: 2 }}>Nice, France</Text>
                <Text sx={{ fontWeight: "medium" }}>
                  Academic Instructor (Part-time, 7 workshops) – Conversational Agents & LLMs (AI Course)
                </Text>
              </Box>
              <Text sx={{ color: "#abbcbd", fontSize: 1, whiteSpace: "nowrap" }}>Dec 2024 – Jan 2025</Text>
            </Flex>
            <Box sx={{ my: 2 }}>
              <Text sx={{ color: "#abbcbd", fontSize: 1 }}>
                Tech: FastAPI, Langchain, React{" "}
                <ThemeLink href="https://github.com/NathanKneT/Master-AI-Chatbot-Course-2024" target="_blank" sx={{ ml: 2 }}>
                  View Course Materials
                </ThemeLink>
              </Text>
            </Box>
            <Box as="ul" sx={{ listStyle: "none", pl: 0 }}>
              <Box as="li" sx={{ 
                position: "relative", 
                pl: 3, 
                mb: 2,
                fontSize: 1,
                "&::before": {
                  content: '"▸"',
                  position: "absolute",
                  left: 0,
                  color: "primary"
                }
              }}>
                Designed and delivered 7 practical workshops on conversational agents and LLM development for Master's students
              </Box>
              <Box as="li" sx={{ 
                position: "relative", 
                pl: 3,
                fontSize: 1,
                "&::before": {
                  content: '"▸"',
                  position: "absolute",
                  left: 0,
                  color: "primary"
                }
              }}>
                Trained 20+ students in building LLM-powered apps, prompt engineering, and FastAPI-based deployment
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Projects */}
        <Box sx={{ mb: 5 }}>
          <Heading as="h2" sx={{ fontSize: 3, mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ width: "4px", height: "20px", bg: "primary", borderRadius: "2px" }} />
            PROJECTS
          </Heading>
          {projects.map((project, index) => (
            <Box key={index} sx={{ 
              mb: 3, 
              p: 3, 
              borderLeft: "3px solid",
              borderColor: "primary",
              bg: "rgb(36 37 39 / 43%)",
              borderRadius: "0 8px 8px 0"
            }}>
              <Flex sx={{ justifyContent: "space-between", flexWrap: "wrap", gap: 2, mb: 2 }}>
                <Box>
                  <Text sx={{ fontWeight: "bold", fontSize: 2 }}>{project.name}</Text>
                  <Text sx={{ color: "#abbcbd", fontSize: 1, mb: 1 }}>Tech: {project.tech}</Text>
                  <ThemeLink href={project.link} target="_blank" sx={{ fontSize: 1 }}>
                    {project.linkText}
                  </ThemeLink>
                </Box>
                <Text sx={{ color: "#abbcbd", fontSize: 1 }}>{project.period}</Text>
              </Flex>
              <Box as="ul" sx={{ listStyle: "none", pl: 0, mt: 2 }}>
                {project.bullets.map((bullet, i) => (
                  <Box as="li" key={i} sx={{ 
                    position: "relative", 
                    pl: 3, 
                    mb: 2,
                    fontSize: 1,
                    lineHeight: 1.6,
                    "&::before": {
                      content: '"▸"',
                      position: "absolute",
                      left: 0,
                      color: "primary"
                    }
                  }}>
                    {bullet}
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>

        {/* Community & Creative */}
        <Box sx={{ mb: 5 }}>
          <Heading as="h2" sx={{ fontSize: 3, mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ width: "4px", height: "20px", bg: "primary", borderRadius: "2px" }} />
            COMMUNITY & CREATIVE INITIATIVES
          </Heading>
          
          {/* Photography */}
          <Box sx={{ 
            mb: 3,
            p: 3, 
            bg: "rgb(36 37 39 / 43%)", 
            borderRadius: "8px",
            transition: "box-shadow 0.2s",
            "&:hover": { boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }
          }}>
            <Flex sx={{ justifyContent: "space-between", flexWrap: "wrap", gap: 2, mb: 2 }}>
              <Box>
                <Text sx={{ fontWeight: "bold", fontSize: 2, mb: 1 }}>Freelance Photographer</Text>
                <Text sx={{ color: "#abbcbd", fontSize: 1 }}>Canada, France, Japan</Text>
              </Box>
              <Text sx={{ color: "#abbcbd", fontSize: 1, whiteSpace: "nowrap" }}>2019 – Present</Text>
            </Flex>
            <Box sx={{ mb: 2 }}>
              <Text sx={{ color: "#abbcbd", fontSize: 1 }}>
                Tech: Next.js{" "}
                <ThemeLink href="https://nathanglhf.com" target="_blank" sx={{ ml: 2 }}>
                  nathanglhf.com
                </ThemeLink>
              </Text>
            </Box>
            <Box as="ul" sx={{ listStyle: "none", pl: 0 }}>
              <Box as="li" sx={{ 
                position: "relative", 
                pl: 3, 
                mb: 2,
                fontSize: 1,
                "&::before": {
                  content: '"▸"',
                  position: "absolute",
                  left: 0,
                  color: "primary"
                }
              }}>
                Built and maintained a high-performance photography portfolio with Next.js
              </Box>
              <Box as="li" sx={{ 
                position: "relative", 
                pl: 3,
                fontSize: 1,
                "&::before": {
                  content: '"▸"',
                  position: "absolute",
                  left: 0,
                  color: "primary"
                }
              }}>
                Applied visual storytelling and user testing to improve layout, accessibility, and engagement (40K+ views)
              </Box>
            </Box>
          </Box>

          {/* Student Association */}
          <Box sx={{ 
            p: 3, 
            bg: "rgb(36 37 39 / 43%)", 
            borderRadius: "8px",
            transition: "box-shadow 0.2s",
            "&:hover": { boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }
          }}>
            <Flex sx={{ justifyContent: "space-between", flexWrap: "wrap", gap: 2, mb: 2 }}>
              <Box>
                <Text sx={{ fontWeight: "bold", fontSize: 2, mb: 1 }}>MIAGE Student Association – Université Côte d'Azur</Text>
                <Text sx={{ color: "#abbcbd", fontSize: 1 }}>Nice, France</Text>
              </Box>
              <Text sx={{ color: "#abbcbd", fontSize: 1, whiteSpace: "nowrap" }}>Sep 2022 – Jun 2023</Text>
            </Flex>
            <Box as="ul" sx={{ listStyle: "none", pl: 0 }}>
              <Box as="li" sx={{ 
                position: "relative", 
                pl: 3, 
                mb: 2,
                fontSize: 1,
                "&::before": {
                  content: '"▸"',
                  position: "absolute",
                  left: 0,
                  color: "primary"
                }
              }}>
                Launched university-wide DevTalk series reaching 150+ attendees per session
              </Box>
              <Box as="li" sx={{ 
                position: "relative", 
                pl: 3,
                fontSize: 1,
                "&::before": {
                  content: '"▸"',
                  position: "absolute",
                  left: 0,
                  color: "primary"
                }
              }}>
                Managed a 7-member team to organize AI-focused workshops, panels, and hackathons
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Print styles */}
        <style jsx global>{`
          @media print {
            body {
              font-size: 11pt;
            }
            
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            
            @page {
              margin: 0.5in;
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