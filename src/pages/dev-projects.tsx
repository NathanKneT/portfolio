import React from "react"
import Layout from "@lekoarts/gatsby-theme-jodie/src/components/layout"
import { Box, Heading, Text, Link as ThemeLink } from "theme-ui"

type Project = {
  id: string
  title: string
  mission: string
  problem: string
  solution: string
  challenge: string
  impact: string
  stack: string
  learnings: string
  tech: string
  color: string
  gradient: string
  link: string
  isExternal: boolean
  category: string
  completion: string
  metrics: string[]
  year: string
  type: string
  featured?: boolean
  demo?: string
}

type Stat = {
  value: string
  label: string
  color: string
  numericTarget?: number
  suffix?: string
}

const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : "59, 130, 246"
}

const CountUp: React.FC<{ target: number; duration?: number; suffix?: string; sx?: any }> = ({
  target,
  duration = 1200,
  suffix = "",
  sx
}) => {
  const [value, setValue] = React.useState(0)
  const startRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    let raf: number
    const step = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp
      const progress = Math.min((timestamp - startRef.current) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.floor(eased * target))
      if (progress < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])

  return (
    <Heading as="h3" sx={{ margin: 0, ...sx }}>
      {value.toLocaleString()}
      {suffix}
    </Heading>
  )
}

const DevProjectsPage: React.FC = () => {
  const allProjects: Project[] = [
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
      gradient: "linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)",
      link: "https://docsretriever.com",
      isExternal: true,
      category: "SaaS Online",
      completion: "85%",
      metrics: ["80% faster document retrieval", "92% user satisfaction rate", "3K+ documents indexed", "€0 external funding raised"],
      year: "2025",
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
      stack: "FastAPI for API development, LangChain for LLM orchestration, OpenAI API for demonstrations, pedagogical design principles",
      learnings: "Educational technology design, curriculum development, and bridging academic-industry knowledge gaps",
      tech: "Python, FastAPI, LangChain, OpenAI API, Pedagogical Design",
      color: "#EA580C",
      gradient: "linear-gradient(135deg, #EA580C 0%, #F97316 100%)",
      link: "https://github.com/NathanKneT/Master-AI-Chatbot-Course-2024",
      isExternal: true,
      category: "Teaching",
      completion: "100%",
      metrics: ["7 comprehensive workshop modules", "Master's AI students successfully trained", "2-month intensive curriculum delivered"],
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
      gradient: "linear-gradient(135deg, #059669 0%, #10B981 100%)",
      link: "https://github.com/NathanKneT/RTHT-3D",
      isExternal: true,
      category: "AI/Computer Vision",
      completion: "85%",
      metrics: ["Dual-hand gesture recognition", "Real-time 3D object manipulation", "Production-ready with community adoption"],
      year: "2025",
      type: "Creative Technology Tool",
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
      gradient: "linear-gradient(135deg, #0891B2 0%, #06B6D4 100%)",
      link: "https://github.com/NathanKneT/NarrativeForge-nextjs",
      isExternal: true,
      category: "Full-Stack",
      completion: "90%",
      metrics: [
        "AI-powered visual node-based editor with GPT-4 integration",
        "Create story and modify it under 60 seconds",
        "Zero TypeScript errors with 90%+ test coverage"
      ],
      year: "2023-2025",
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
      gradient: "linear-gradient(135deg, #DC2626 0%, #EF4444 100%)",
      link: "https://github.com/NathanKneT/SynesthesIA",
      isExternal: true,
      category: "AI/Computer Vision",
      completion: "50%",
      metrics: ["30 FPS real-time processing", "5 gesture patterns with 95% accuracy", "720p input with adaptive thresholds"],
      year: "2025",
      type: "Interactive Art Framework"
    },
    {
      id: "empty-my-wallet",
      title: "EmptyMyWallet - Intelligent DeFi Analysis Bot",
      mission: "Educational DeFi bot leveraging ML to detect scams and analyze token launches",
      problem: "DeFi markets are saturated with scams and rug pulls, posing high risks to uninformed users",
      solution: "Build a bot combining real-time data feeds, ML anomaly detection, and security filters to analyze tokens pre-trade",
      challenge:
        "Still under development. Integrating heterogeneous APIs (often costly), managing multi-chain data reliability, and ramping up crypto-specific domain knowledge",
      impact:
        "A hands-on exploration of ML in fintech, highlighting both the complexity and potential of on-chain intelligence",
      stack:
        "FastAPI for backend APIs, PostgreSQL for storage, Isolation Forest for anomaly detection, multi-chain API integrations (Binance, Etherscan, BscScan, DexScreener)",
      learnings:
        "Improved understanding of DeFi mechanics, anomaly detection modeling, API cost trade-offs, and security considerations in automated trading systems",
      tech: "Python, FastAPI, PostgreSQL, Binance API, Etherscan, DexScreener",
      color: "#7C3AED",
      gradient: "linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)",
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
    }
  ]

  const stats: Stat[] = [
    { value: "6", label: "Production Projects", color: "#3B82F6", numericTarget: 6 },
    { value: "100K+", label: "Data Points Processed", color: "#8B5CF6" },
    { value: "92%", label: "User Satisfaction", color: "#10B981", numericTarget: 92, suffix: "%" },
    { value: "€0", label: "Bootstrapped Funding", color: "#F59E0B" }
  ]

  const categories = ["All", "SaaS Online", "AI/Computer Vision", "Full-Stack", "FinTech/ML", "Teaching"]
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All")
  const [expandedProject, setExpandedProject] = React.useState<string | null>(null)
  const [hoveredProject, setHoveredProject] = React.useState<string | null>(null)

  const filteredProjects = selectedCategory === "All" ? allProjects : allProjects.filter((p) => p.category === selectedCategory)
  const toggleProject = (projectId: string) => setExpandedProject(expandedProject === projectId ? null : projectId)

  const handleSpotlight = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    el.style.setProperty("--mx", `${x}px`)
    el.style.setProperty("--my", `${y}px`)
  }

  return (
    <Layout>
      <Box sx={{ p: [3, 4, 6], maxWidth: "1200px", m: "0 auto" }}>
        {/* Header with soft radial glow */}
        <Box
          sx={{
            mb: [5, 6, 7],
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: "-40%",
              left: "-10%",
              right: "-10%",
              bottom: "-50%",
              background:
                "radial-gradient(800px 500px at 50% 0%, rgba(59,130,246,0.10), transparent 60%), radial-gradient(800px 500px at 50% 10%, rgba(139,92,246,0.10), transparent 70%)",
              pointerEvents: "none",
              zIndex: -1,
              filter: "blur(2px)"
            }
          }}
        >
          <Heading
            as="h1"
            sx={{
              mb: 3,
              fontSize: [5, 6, 7],
              fontWeight: "heading",
              letterSpacing: "-0.02em",
              background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            Software Engineering
          </Heading>

          <Text sx={{ color: "muted", fontSize: [2, 3], mb: 4, lineHeight: 1.6, maxWidth: "900px", m: "0 auto" }}>
            From concept to production: AI-powered solutions, real-time systems, and enterprise applications that solve
            real business problems with measurable impact.
          </Text>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: ["repeat(2, 1fr)", "repeat(4, 1fr)"],
              gap: 4,
              mt: 5,
              mb: 5
            }}
          >
            {stats.map((stat, index) => (
              <Box
                key={index}
                className="glass-card card-spotlight"
                onMouseMove={handleSpotlight}
                sx={{
                  textAlign: "center",
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: "16px",
                  borderColor: "rgba(255,255,255,0.2)",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: `0 10px 30px rgba(${hexToRgb(stat.color)}, 0.2)`,
                    borderColor: stat.color
                  }
                }}
              >
                {typeof stat.numericTarget === "number" ? (
                  <CountUp target={stat.numericTarget} suffix={stat.suffix} sx={{ color: stat.color, fontSize: [3, 4], mb: 1 }} />
                ) : (
                  <Heading as="h3" sx={{ color: stat.color, m: 0, fontSize: [3, 4], mb: 1 }}>
                    {stat.value}
                  </Heading>
                )}
                <Text sx={{ color: "muted", fontSize: 1, fontWeight: 500 }}>{stat.label}</Text>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Category filter */}
        <Box
          sx={{
            mb: 6,
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            p: 3,
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            borderRadius: "20px",
            border: "1px solid rgba(255, 255, 255, 0.1)"
          }}
        >
          {["All", ...categories.slice(1)].map((category) => {
            const isActive = selectedCategory === category
            return (
              <Box
                key={category}
                onClick={() => setSelectedCategory(category)}
                sx={{
                  px: "20px",
                  py: "10px",
                  borderRadius: "25px",
                  fontSize: 1,
                  fontWeight: 600,
                  background: isActive ? "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)" : "transparent",
                  color: isActive ? "white" : "text",
                  border: "2px solid",
                  borderColor: isActive ? "transparent" : "rgba(255, 255, 255, 0.2)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    transform: "translateY(-2px) scale(1.05)",
                    borderColor: isActive ? "transparent" : "#3B82F6",
                    boxShadow: isActive ? "0 10px 30px rgba(59, 130, 246, 0.3)" : "0 5px 15px rgba(0, 0, 0, 0.1)"
                  }
                }}
              >
                {category}
              </Box>
            )
          })}
        </Box>

        {/* Projects grid */}
        <Box sx={{ display: "grid", gap: 4, gridTemplateColumns: ["1fr", "repeat(2, 1fr)"] }}>
          {filteredProjects.map((project) => (
            <Box
              key={project.id}
              className="project-card card-spotlight"
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
              onMouseMove={handleSpotlight}
              sx={{
                position: "relative",
                p: 5,
                display: 'flex',
                flexDirection: 'column',
                minHeight: ['auto', null, '620px'],
                borderRadius: "24px",
                border: "1px solid",
                borderColor: hoveredProject === project.id ? project.color : "rgba(255, 255, 255, 0.15)",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                overflow: "hidden",
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                boxShadow:
                  hoveredProject === project.id
                    ? `0 20px 40px rgba(${hexToRgb(project.color)}, 0.18)`
                    : "0 10px 30px rgba(0,0,0,0.16)",
                transform: hoveredProject === project.id ? "translateY(-8px) scale(1.01)" : "none",

                // Aurora layer behind card content
                "&::before": {
                  content: '""',
                  position: "absolute",
                  width: "65%",
                  height: "65%",
                  top: "-22%",
                  right: "-18%",
                  background: project.gradient,
                  filter: "blur(70px)",
                  opacity: hoveredProject === project.id ? 0.32 : 0.22,
                  transform: hoveredProject === project.id ? "rotate(6deg) scale(1.06)" : "rotate(0deg) scale(1)",
                  transition: "opacity 300ms ease, transform 400ms ease",
                  pointerEvents: "none",
                  zIndex: 0
                },

                // Spotlight is provided by .card-spotlight::after from CSS
              }}
            >
              {/* Featured badge */}
              {project.featured && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 14,
                    right: 14,
                    background: project.gradient,
                    color: "white",
                    px: 3,
                    py: 1,
                    fontSize: 0,
                    fontWeight: 700,
                    borderRadius: "9999px",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                    boxShadow: `0 8px 24px rgba(${hexToRgb(project.color)}, 0.35)`,
                    zIndex: 2
                  }}
                >
                  Featured
                </Box>
              )}

              {/* Progress bar */}
              <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: "rgba(0,0,0,0.08)" }}>
                <Box
                  sx={{
                    height: "100%",
                    width: project.completion,
                    background: `linear-gradient(90deg, ${project.color}, ${project.color}dd)`,
                    transition: "width 1s ease"
                  }}
                />
              </Box>

              <Box sx={{ position: "relative", zIndex: 1, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Box
                      sx={{
                        backgroundColor: project.color,
                        color: "white",
                        px: 2,
                        py: 1,
                        borderRadius: "12px",
                        fontSize: 0,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px"
                      }}
                    >
                      {project.category}
                    </Box>
                    <Box
                      sx={{
                        backgroundColor: "rgba(0,0,0,0.08)",
                        color: "text",
                        px: 2,
                        py: 1,
                        borderRadius: "12px",
                        fontSize: 0,
                        fontWeight: 600
                      }}
                    >
                      {project.completion}
                    </Box>
                  </Box>

                  <Heading as="h3" sx={{ color: "text", m: 0, fontSize: [2, 3], lineHeight: 1.2, mb: 2 }}>
                    {project.title}
                  </Heading>

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                    <Text sx={{ color: project.color, fontSize: 1, fontWeight: 600 }}>{project.type}</Text>
                    <Text
                      sx={{
                        color: "muted",
                        fontSize: 0,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px"
                      }}
                    >
                      {project.year}
                    </Text>
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Text sx={{ color: "text", lineHeight: 1.5, fontSize: 1 }}>
                    <Text
                      as="span"
                      sx={{
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Mission:{" "}
                    </Text>
                    {project.mission}
                  </Text>
                </Box>

                {/* Problem / Solution */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ mb: 3 }}>
                    <Text sx={{ fontSize: 1, color: "text", lineHeight: 1.5 }}>
                      <Text as="span" sx={{ fontWeight: 700, color: "#DC2626" }}>
                        Problem:{" "}
                      </Text>
                      {project.problem}
                    </Text>
                  </Box>
                  <Box>
                    <Text sx={{ fontSize: 1, color: "text", lineHeight: 1.5 }}>
                      <Text as="span" sx={{ fontWeight: 700, color: "#059669" }}>
                        Solution:{" "}
                      </Text>
                      {project.solution}
                    </Text>
                  </Box>
                </Box>

                {/* Metrics */}
                <Box sx={{ mb: 3 }}>
                  <Text
                    sx={{
                      fontSize: 1,
                      fontWeight: 700,
                      color: "text",
                      mb: 2,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}
                  >
                    Key Results
                  </Text>
                  <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}>
                    {project.metrics.map((metric, index) => (
                      <Box
                        key={index}
                        sx={{ display: "flex", alignItems: "center", fontSize: 0, color: "text", fontWeight: 600 }}
                      >
                        <Box sx={{ width: "6px", height: "6px", backgroundColor: project.color, borderRadius: "50%", mr: 2, flexShrink: 0 }} />
                        {metric}
                      </Box>
                    ))}
                  </Box>
                </Box>

                {/* Expandable Technical Details */}
                <Box sx={{ mb: 4 }}>
                  <Box
                    onClick={() => toggleProject(project.id)}
                    sx={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      py: "10px",
                      borderTop: "1px solid rgba(0,0,0,0.1)",
                      color: project.color,
                      fontWeight: 600,
                      fontSize: 1,
                      transition: "all 0.2s ease",
                      "&:hover": { color: "text" }
                    }}
                  >
                    <Text>Technical Deep Dive</Text>
                    <Text sx={{ fontSize: 2 }}>{expandedProject === project.id ? "↑" : "↓"}</Text>
                  </Box>

                  <Box
                    sx={{
                      mt: 3,
                      backgroundColor: "rgba(0,0,0,0.02)",
                      borderRadius: "12px",
                      overflow: "hidden",
                      transition: "max-height 0.35s ease",
                      maxHeight: expandedProject === project.id ? 600 : 0,
                      p: expandedProject === project.id ? 3 : 0,
                      border: expandedProject === project.id ? "1px solid rgba(0,0,0,0.06)" : "1px solid transparent"
                    }}
                  >
                    {expandedProject === project.id && (
                      <Box>
                        <Box sx={{ mb: 3 }}>
                          <Text sx={{ fontWeight: 700, color: "text", fontSize: 1 }}>Technical Challenge:{" "}</Text>
                          <Text sx={{ color: "text", fontSize: 1, lineHeight: 1.5, mt: 1 }}>{project.challenge}</Text>
                        </Box>
                        <Box sx={{ mb: 3 }}>
                          <Text sx={{ fontWeight: 700, color: "text", fontSize: 1 }}>Stack Rationale:{" "}</Text>
                          <Text sx={{ color: "text", fontSize: 1, lineHeight: 1.5, mt: 1 }}>{project.stack}</Text>
                        </Box>
                        <Box sx={{ mb: 3 }}>
                          <Text sx={{ fontWeight: 700, color: "text", fontSize: 1 }}>Key Learnings:{" "}</Text>
                          <Text sx={{ color: "text", fontSize: 1, lineHeight: 1.5, mt: 1 }}>{project.learnings}</Text>
                        </Box>
                        <Box>
                          <Text sx={{ fontWeight: 700, color: "text", fontSize: 1 }}>Business Impact:{" "}</Text>
                          <Text sx={{ color: "text", fontSize: 1, lineHeight: 1.5, mt: 1 }}>{project.impact}</Text>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>

                {/* Tech stack + CTA */}
                <Box sx={{ fontSize: 1, color: "muted", mb: 4 }}>
                  <Text>
                    <Text as="span" sx={{ fontWeight: 600, color: "text" }}>
                      Technologies:{" "}
                    </Text>
                    {project.tech}
                  </Text>
                </Box>

                <ThemeLink
                  href={project.link}
                  {...(project.isExternal && { target: "_blank", rel: "noopener noreferrer" })}
                  sx={{
                    display: "inline-block",
                    color: "text",
                    backgroundColor: "transparent",
                    textDecoration: "none",
                    fontWeight: 700,
                    px: "28px",
                    py: "14px",
                    border: "2px solid",
                    borderColor: "text",
                    borderRadius: "12px",
                    textAlign: "center",
                    transition: "all 0.3s ease",
                    fontSize: 1,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    "&:hover": { backgroundColor: "text", color: "background", transform: "translateY(-2px)" }
                  }}
                >
                  {project.isExternal ? "View Project →" : "Learn More →"}
                </ThemeLink>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Layout>
  )
}

export default DevProjectsPage
