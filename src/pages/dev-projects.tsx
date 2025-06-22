import React from "react"
import Layout from "@lekoarts/gatsby-theme-jodie/src/components/layout"
import { Box, Heading, Text, Link as ThemeLink } from "theme-ui"

const DevProjectsPage = () => {
  const allProjects = [
    {
      id: "docsretriever",
      title: "DocsRetriever - French Sovereign Document AI",
      mission: "Enterprise-grade document search assistant built 100% in France for GDPR compliance",
      problem: "Companies waste 40% of work time searching internal documents across scattered systems",
      solution: "RAG-powered AI that indexes 50K+ documents and answers in <2 seconds with source citations",
      challenge: "Built sovereign infrastructure from 9m² workspace without external funding",
      impact: "80% reduction in document search time, 92% user satisfaction across pilot enterprises",
      stack: "Python FastAPI for microservices, React.js for UX, FAISS for vector search, French cloud hosting",
      learnings: "Mastered enterprise security patterns, GDPR-by-design architecture, and bootstrapped scaling",
      tech: "Python, FastAPI, React.js, Tailwind, RAG",
      color: "#1E40AF",
      link: "https://docsretriever.com",
      isExternal: true,
      category: "SaaS Online",
      completion: "85%",
      metrics: [
        "80% faster document retrieval",
        "92% user satisfaction rate",
        "3K+ documents indexed",
        "€0 external funding raised"
      ],
      year: "2024",
      type: "B2B SaaS Product",
    },
        {
      id: "conversational-agents",
      title: "AI Course Curriculum - University Architecture",
      mission: "Complete Master's level AI course bridging theory and production-ready applications",
      problem: "AI education often lacks practical implementation skills for real-world deployment",
      solution: "7-workshop progression from LLM basics to production FastAPI deployment with hands-on projects",
      challenge: "Designing curriculum that balances academic rigor with industry-relevant practical skills",
      impact: "Successfully trained Master's AI students at Université Côte d'Azur in modern AI development practices",
      stack: "FastAPI for API development, Langchain for LLM orchestration, OpenAI API for demonstrations, pedagogical design principles",
      learnings: "Educational technology design, curriculum development, and bridging academic-industry knowledge gaps",
      tech: "Python, FastAPI, Langchain, OpenAI API, Pedagogical Design",
      color: "#EA580C",
      link: "https://github.com/NathanKneT/Master-AI-Chatbot-Course-2024",
      isExternal: true,
      category: "Teaching",
      completion: "100%",
      metrics: [
        "7 comprehensive workshop modules",
        "Master's AI students successfully trained",
        "2-month intensive curriculum delivered"
      ],
      year: "2024-2025",
      type: "Educational Framework"
    },
        {
      id: "rtht-3d",
      title: "RTHT-3D - Hand Tracking 3D Interface",
      mission: "Minority Report-style 3D manipulation interface using natural hand gestures",
      problem: "3D modeling requires complex keyboard shortcuts and steep learning curves for non-technical users",
      solution: "Intuitive hand gesture interface for Blender with Y2K aesthetic and two-hand coordination",
      challenge: "Synchronizing hand tracking data with 3D engine while maintaining visual appeal and responsiveness",
      impact: "Featured in creative coding communities, inspiring new interaction paradigms for 3D software",
      stack: "Blender for 3D rendering, MediaPipe for hand detection, Blender Python API for integration, UDP for real-time communication",
      learnings: "Client-server architecture design, 3D transformation mathematics, and creative technology development",
      tech: "MediaPipe, Blender, Python",
      color: "#059669",
      link: "https://github.com/NathanKneT/RTHT-3D",
      isExternal: true,
      category: "AI/Computer Vision",
      completion: "85%",
      metrics: [
        "Dual-hand gesture recognition",
        "Real-time 3D object manipulation",
        "Production-ready with community adoption"
      ],
      year: "2025",
      type: "Creative Technology Tool"
    },
        {
      id: "narrativeforge-interactive",
      title: "NarrativeForge - AI-Powered Storytelling Platform",
      mission: "Cutting-edge platform for creating and experiencing interactive narratives with AI-driven content generation and visual node-based editing",
      problem: "Traditional storytelling tools lack AI integration, visual workflows, and scalable web architectures",
      solution: "AI-powered story generation with OpenAI GPT-4, React Flow-based visual editor, real-time preview, multi-format export, and 100% type-safe TypeScript",
      challenge: "Integrating complex AI generation workflows with node-based editing while optimizing performance and ensuring narrative coherence",
      impact: "Showcases mastery of full-stack development, AI integration, and enterprise-grade UI/UX for interactive applications",
      stack: "Next.js 14 for full-stack framework, React Flow for visual editing, OpenAI GPT-4 for AI content generation, Zustand for state management, TypeScript for type safety, Tailwind CSS for styling, Framer Motion for animations",
      learnings: "Advanced AI integration, optimized React patterns, complex state management, and scalable web architecture",
      tech: "TypeScript, Next.js 14, React Flow, OpenAI GPT-4, Zustand, Tailwind CSS, Framer Motion",
      color: "#0891B2",
      link: "https://github.com/NathanKneT/NarrativeForge-nextjs",
      isExternal: true,
      category: "Full-Stack",
      completion: "90%",
      metrics: [
        "AI-powered visual node-based editor with GPT-4 integration",
        "Create story and modify it under 60 seconds",
        "Zero TypeScript errors with 90%+ test coverage"
      ],
      year: "2024",
      type: "Creative Technology Platform"
    },
    {
      id: "synesthesia",
      title: "SynesthesIA - Real-Time Motion Tracking Engine",
      mission: "Interactive art installation system that translates body movements into audiovisual experiences",
      problem: "Traditional motion capture systems are expensive and require specialized hardware setups",
      solution: "Computer vision pipeline using commodity webcams for real-time gesture recognition at 30 FPS",
      challenge: "Achieving low-latency processing while maintaining accuracy across different lighting conditions",
      impact: "Democratizes motion capture for artists and interactive installations worldwide",
      stack: "MediaPipe for pose detection, OpenCV for preprocessing, OSC for audio communication, Python for orchestration",
      learnings: "Optimized real-time computer vision pipelines, calibration algorithms, and event-driven architectures",
      tech: "Python, MediaPipe, OpenCV, OSC, SoundDevice",
      color: "#DC2626",
      link: "https://github.com/NathanKneT/SynesthesIA",
      isExternal: true,
      category: "AI/Computer Vision",
      completion: "50%",
      metrics: [
        "30 FPS real-time processing",
        "5 gesture patterns with 95% accuracy",
        "720p input with adaptive thresholds"
      ],
      year: "2024",
      type: "Interactive Art Framework"
    },
    {
      id: "empty-my-wallet",
      title: "EmptyMyWallet - Intelligent DeFi Analysis Bot",
      mission: "Educational DeFi bot leveraging ML to detect scams and analyze token launches",
      problem: "DeFi markets are saturated with scams and rug pulls, posing high risks to uninformed users",
      solution: "Build a bot combining real-time data feeds, ML anomaly detection, and security filters to analyze tokens pre-trade",
      challenge: "Still under development. Integrating heterogeneous APIs (often costly), managing multi-chain data reliability, and ramping up crypto-specific domain knowledge",
      impact: "A hands-on exploration of ML in fintech, highlighting both the complexity and potential of on-chain intelligence",
      stack: "FastAPI for backend APIs, PostgreSQL for storage, Isolation Forest for anomaly detection, multi-chain API integrations (Binance, Etherscan, BscScan, DexScreener)",
      learnings: "Improved understanding of DeFi mechanics, anomaly detection modeling, API cost trade-offs, and security considerations in automated trading systems",
      tech: "Python, FastAPI, PostgreSQL, Binance API, Etherscan, DexScreener",
      color: "#7C3AED",
      link: "https://github.com/NathanKneT/empty-my-wallet-bot",
      isExternal: true,
      category: "FinTech/ML",
      completion: "40%",
      metrics: [
        "100K+ training data points processed",
        "Multi-chain support (ETH, BSC, Polygon)",
        "Risk management parameters configurable (slippage, daily loss, trade cap)"
      ],
      year: "2024",
      type: "Educational FinTech Tool"
    },
  ]

  const categories = ["SaaS Online", "AI/Computer Vision", "Full-Stack", "FinTech/ML", "Teaching"]
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null)
  const [expandedProject, setExpandedProject] = React.useState<string | null>(null)

  const filteredProjects = selectedCategory 
    ? allProjects.filter(p => p.category === selectedCategory)
    : allProjects

  const toggleProject = (projectId: string) => {
    setExpandedProject(expandedProject === projectId ? null : projectId)
  }

  return (
    <Layout>
      <Box sx={{ padding: [3, 4, 5], maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header Section */}
        <Box sx={{ textAlign: "center", marginBottom: [4, 5, 6] }}>
          <Heading 
            as="h1" 
            sx={{ 
              marginBottom: 3, 
              color: "text",
              fontSize: [5, 6, 7],
              fontWeight: "heading",
              letterSpacing: "-0.02em"
            }}
          >
            Software Engineering
          </Heading>

          <Text sx={{ 
            color: "muted", 
            fontSize: [2, 3], 
            marginBottom: 4, 
            lineHeight: 1.6,
            maxWidth: "900px",
            margin: "0 auto"
          }}>
            From concept to production: AI-powered solutions, real-time systems, and enterprise applications 
            that solve real business problems with measurable impact.
          </Text>

          {/* Quick Stats */}
          <Box sx={{ 
            display: "grid", 
            gridTemplateColumns: ["repeat(2, 1fr)", "repeat(4, 1fr)"], 
            gap: 4,
            marginTop: 5,
            marginBottom: 5
          }}>
            <Box sx={{ textAlign: "center" }}>
              <Heading as="h3" sx={{ color: "primary", margin: 0, fontSize: [3, 4] }}>
                6
              </Heading>
              <Text sx={{ color: "muted", fontSize: 1, fontWeight: "500" }}>Production Projects</Text>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Heading as="h3" sx={{ color: "primary", margin: 0, fontSize: [3, 4] }}>
                100K+
              </Heading>
              <Text sx={{ color: "muted", fontSize: 1, fontWeight: "500" }}>Data Points Processed</Text>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Heading as="h3" sx={{ color: "primary", margin: 0, fontSize: [3, 4] }}>
                92%
              </Heading>
              <Text sx={{ color: "muted", fontSize: 1, fontWeight: "500" }}>User Satisfaction</Text>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Heading as="h3" sx={{ color: "primary", margin: 0, fontSize: [3, 4] }}>
                €0
              </Heading>
              <Text sx={{ color: "muted", fontSize: 1, fontWeight: "500" }}>Bootstrapped Funding</Text>
            </Box>
          </Box>
        </Box>

        {/* Category Filter - Plus pertinent pour recruteurs */}
        <Box sx={{ 
          marginBottom: 5, 
          display: "flex", 
          gap: 3, 
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <Text sx={{ fontSize: 2, fontWeight: "600", color: "text", marginRight: 2 }}>
            Expertise
          </Text>
          <Box
            onClick={() => setSelectedCategory(null)}
            sx={{
              padding: "12px 24px",
              borderRadius: "25px",
              fontSize: 1,
              cursor: "pointer",
              fontWeight: "600",
              backgroundColor: !selectedCategory ? "text" : "transparent",
              color: !selectedCategory ? "background" : "text",
              border: "2px solid",
              borderColor: !selectedCategory ? "text" : "muted",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: !selectedCategory ? "text" : "rgba(0,0,0,0.05)",
                borderColor: "text",
                transform: "translateY(-2px)"
              }
            }}
          >
            All Projects
          </Box>
          {categories.map(category => (
            <Box
              key={category}
              onClick={() => setSelectedCategory(category)}
              sx={{
                padding: "12px 24px",
                borderRadius: "25px",
                fontSize: 1,
                cursor: "pointer",
                fontWeight: "600",
                backgroundColor: selectedCategory === category ? "text" : "transparent",
                color: selectedCategory === category ? "background" : "text",
                border: "2px solid",
                borderColor: selectedCategory === category ? "text" : "muted",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: selectedCategory === category ? "text" : "rgba(0,0,0,0.05)",
                  borderColor: "text",
                  transform: "translateY(-2px)"
                }
              }}
            >
              {category}
            </Box>
          ))}
        </Box>
        
        {/* Projects Grid */}
        <Box sx={{ 
          display: "grid", 
          gap: 6, 
          gridTemplateColumns: ["1fr", "repeat(2, 1fr)", "repeat(2, 1fr)"]
        }}>
          
          {filteredProjects.map((project) => (
            <Box key={project.id} sx={{ 
              background: "rgb(36 37 39 / 43%)", 
              padding: 5, 
              borderRadius: "20px",
              border: "1px solid",
              borderColor: "rgba(0,0,0,0.12)",
              display: "flex",
              flexDirection: "column",
              transition: "all 0.4s ease",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              "&:hover": {
                transform: "translateY(-8px)",
                boxShadow: `0 20px 40px rgba(${hexToRgb(project.color)}, 0.15)`,
                borderColor: project.color,
                background: "rgb(36 37 39 / 43%)"
              }
            }}>
              
              {/* Progress Bar */}
              <Box sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "4px",
                background: "rgba(0,0,0,0.08)"
              }}>
                <Box sx={{
                  height: "100%",
                  width: project.completion,
                  background: `linear-gradient(90deg, ${project.color}, ${project.color}dd)`,
                  transition: "width 1s ease"
                }} />
              </Box>

              {/* Header */}
              <Box sx={{ marginBottom: 3 }}>
                <Box sx={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "flex-start",
                  marginBottom: 2
                }}>
                  <Box sx={{ 
                    backgroundColor: project.color, 
                    color: "white", 
                    padding: "6px 12px", 
                    borderRadius: "12px", 
                    fontSize: 0,
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}>
                    {project.category}
                  </Box>
                  <Box sx={{ 
                    backgroundColor: "rgba(0,0,0,0.08)",
                    color: "text", 
                    padding: "6px 12px", 
                    borderRadius: "12px", 
                    fontSize: 0,
                    fontWeight: "600"
                  }}>
                    {project.completion}
                  </Box>
                </Box>
                
                <Heading as="h3" sx={{ 
                  color: "text", 
                  margin: 0, 
                  fontSize: [2, 3],
                  lineHeight: 1.2,
                  marginBottom: 2
                }}>
                  {project.title}
                </Heading>
                
                <Box sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 1
                }}>
                  <Text sx={{ 
                    color: project.color, 
                    fontSize: 1,
                    fontWeight: "600"
                  }}>
                    {project.type}
                  </Text>
                  <Text sx={{ 
                    color: "muted", 
                    fontSize: 0,
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}>
                    {project.year}
                  </Text>
                </Box>
              </Box>

              {/* Mission Statement */}
              <Box sx={{ marginBottom: 3 }}>
                <Text sx={{ 
                  fontSize: 1, 
                  fontWeight: "700", 
                  color: "text", 
                  marginBottom: 2,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  Mission
                </Text>
                <Text sx={{ 
                  color: "text", 
                  lineHeight: 1.5,
                  fontSize: 1,
                  fontWeight: "500"
                }}>
                  {project.mission}
                </Text>
              </Box>

              {/* Problem & Solution (Avec espacement correct) */}
              <Box sx={{ marginBottom: 3 }}>
                <Box sx={{ marginBottom: 3 }}>
                  <Text sx={{ 
                    fontSize: 1, 
                    color: "text", 
                    lineHeight: 1.5
                  }}>
                    <Text sx={{ fontWeight: "700", color: "#DC2626" }}>Problem: </Text>
                    {project.problem}
                  </Text>
                </Box>
                <Box>
                  <Text sx={{ 
                    fontSize: 1, 
                    color: "text", 
                    lineHeight: 1.5
                  }}>
                    <Text sx={{ fontWeight: "700", color: "#059669" }}>Solution: </Text>
                    {project.solution}
                  </Text>
                </Box>
              </Box>

              {/* Metrics */}
              <Box sx={{ marginBottom: 3 }}>
                <Text sx={{ 
                  fontSize: 1, 
                  fontWeight: "700", 
                  color: "text", 
                  marginBottom: 2,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  Key Results
                </Text>
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}>
                  {project.metrics.map((metric, index) => (
                    <Box key={index} sx={{ 
                      display: "flex", 
                      alignItems: "center", 
                      fontSize: 0,
                      color: "text",
                      fontWeight: "600"
                    }}>
                      <Box sx={{ 
                        width: "6px", 
                        height: "6px", 
                        backgroundColor: project.color, 
                        borderRadius: "50%", 
                        marginRight: 2,
                        flexShrink: 0
                      }} />
                      {metric}
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Demo Section (Optionnel - à ajouter si vous avez des GIFs/images) */}
              {project.demo && (
                <Box sx={{ marginBottom: 3 }}>
                  <Text sx={{ 
                    fontSize: 1, 
                    fontWeight: "700", 
                    color: "text", 
                    marginBottom: 2,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}>
                    Live Demo
                  </Text>
                  <Box sx={{
                    width: "100%",
                    height: "200px",
                    backgroundColor: "rgba(0,0,0,0.08)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `2px solid ${project.color}33`
                  }}>
                    <Text sx={{ color: "muted", fontSize: 1 }}>Demo Preview</Text>
                    {/* Remplacez par: <img src={project.demo} alt={`${project.title} demo`} style={{width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px"}} /> */}
                  </Box>
                </Box>
              )}

              {/* Expandable Details */}
              <Box sx={{ marginBottom: 3 }}>
                <Box
                  onClick={() => toggleProject(project.id)}
                  sx={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    borderTop: "1px solid rgba(0,0,0,0.1)",
                    color: project.color,
                    fontWeight: "600",
                    fontSize: 1,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      color: "text"
                    }
                  }}
                >
                  <Text>Technical Deep Dive</Text>
                  <Text sx={{ fontSize: 2 }}>{expandedProject === project.id ? "↑" : "↓"}</Text>
                </Box>

                {expandedProject === project.id && (
                  <Box sx={{ 
                    marginTop: 3,
                    padding: 3,
                    backgroundColor: "rgba(0,0,0,0.02)",
                    borderRadius: "12px",
                    animation: "fadeIn 0.3s ease"
                  }}>
                    <Box sx={{ marginBottom: 3 }}>
                      <Text sx={{ fontWeight: "700", color: "text", fontSize: 1 }}>Technical Challenge:</Text>
                      <Text sx={{ color: "text", fontSize: 1, lineHeight: 1.5, marginTop: 1 }}>
                        {project.challenge}
                      </Text>
                    </Box>
                    <Box sx={{ marginBottom: 3 }}>
                      <Text sx={{ fontWeight: "700", color: "text", fontSize: 1 }}>Stack Rationale:</Text>
                      <Text sx={{ color: "text", fontSize: 1, lineHeight: 1.5, marginTop: 1 }}>
                        {project.stack}
                      </Text>
                    </Box>
                    <Box sx={{ marginBottom: 3 }}>
                      <Text sx={{ fontWeight: "700", color: "text", fontSize: 1 }}>Key Learnings:</Text>
                      <Text sx={{ color: "text", fontSize: 1, lineHeight: 1.5, marginTop: 1 }}>
                        {project.learnings}
                      </Text>
                    </Box>
                    <Box>
                      <Text sx={{ fontWeight: "700", color: "text", fontSize: 1 }}>Business Impact:</Text>
                      <Text sx={{ color: "text", fontSize: 1, lineHeight: 1.5, marginTop: 1 }}>
                        {project.impact}
                      </Text>
                    </Box>
                  </Box>
                )}
              </Box>

              {/* Tech Stack */}
              <Box sx={{ fontSize: 1, color: "muted", marginBottom: 4 }}>
                <Text sx={{ fontWeight: "600", color: "text" }}>Technologies:</Text>
                <Text sx={{ marginTop: 1 }}>{project.tech}</Text>
              </Box>

              {/* CTA Button */}
              <ThemeLink 
                href={project.link} 
                {...(project.isExternal && { 
                  target: "_blank", 
                  rel: "noopener noreferrer" 
                })}
                sx={{ 
                  display: "inline-block", 
                  color: "text",
                  backgroundColor: "transparent",
                  textDecoration: "none",
                  fontWeight: "700",
                  padding: "14px 28px",
                  border: "2px solid",
                  borderColor: "text",
                  borderRadius: "12px",
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  fontSize: 1,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  "&:hover": { 
                    backgroundColor: "text",
                    color: "background",
                    transform: "translateY(-2px)"
                  }
                }}
              >
                {project.isExternal ? "View Project →" : "Learn More →"}
              </ThemeLink>
            </Box>
          ))}
        </Box>

      </Box>
    </Layout>
  )
}

// Utility function
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result 
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : "59, 130, 246"
}

export default DevProjectsPage