from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    KeepTogether,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "static" / "nathan-rihet-resume.pdf"

INK = colors.HexColor("#17171c")
MUTED = colors.HexColor("#55565f")
ACCENT = colors.HexColor("#4257c9")
LINE = colors.HexColor("#d9dae1")


def section_heading(text, styles):
    return [
        Spacer(1, 2.5 * mm),
        Paragraph(text.upper(), styles["Section"]),
        Spacer(1, 1.2 * mm),
    ]


def role(company, title, period, location, bullets, styles):
    heading = Table(
        [
            [
                Paragraph(f"<b>{company}</b><br/>{title}", styles["Role"]),
                Paragraph(f"{period}<br/>{location}", styles["RoleMeta"]),
            ]
        ],
        colWidths=[126 * mm, 48 * mm],
    )
    heading.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )
    items = [heading, Spacer(1, 0.8 * mm)]
    items.extend(
        Paragraph(f"- {bullet}", styles["ResumeBullet"]) for bullet in bullets
    )
    items.append(Spacer(1, 1.6 * mm))
    return KeepTogether(items)


def build_resume():
    styles = getSampleStyleSheet()
    styles.add(
        ParagraphStyle(
            "Name",
            parent=styles["Title"],
            fontName="Helvetica-Bold",
            fontSize=24,
            leading=26,
            textColor=INK,
            alignment=TA_CENTER,
            spaceAfter=1.5 * mm,
        )
    )
    styles.add(
        ParagraphStyle(
            "Tagline",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=10,
            leading=13,
            textColor=MUTED,
            alignment=TA_CENTER,
        )
    )
    styles.add(
        ParagraphStyle(
            "Contact",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=8.2,
            leading=10.5,
            textColor=ACCENT,
            alignment=TA_CENTER,
        )
    )
    styles.add(
        ParagraphStyle(
            "Section",
            parent=styles["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=9.2,
            leading=11,
            textColor=ACCENT,
            spaceAfter=0,
            borderWidth=0,
        )
    )
    styles.add(
        ParagraphStyle(
            "Body",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=8.5,
            leading=11.2,
            textColor=INK,
            spaceAfter=0,
        )
    )
    styles.add(
        ParagraphStyle(
            "Role",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=8.8,
            leading=11,
            textColor=INK,
        )
    )
    styles.add(
        ParagraphStyle(
            "RoleMeta",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=8,
            leading=10,
            textColor=MUTED,
            alignment=TA_LEFT,
        )
    )
    styles.add(
        ParagraphStyle(
            "ResumeBullet",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=8.15,
            leading=10.3,
            leftIndent=3 * mm,
            firstLineIndent=-3 * mm,
            textColor=INK,
            spaceAfter=0.5 * mm,
        )
    )
    styles.add(
        ParagraphStyle(
            "Small",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=7.8,
            leading=10,
            textColor=INK,
        )
    )

    document = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        rightMargin=18 * mm,
        leftMargin=18 * mm,
        topMargin=13 * mm,
        bottomMargin=12 * mm,
        title="Nathan Rihet - Full Stack Engineer Resume",
        author="Nathan Rihet",
        subject="Full Stack Engineer resume",
    )

    story = [
        Paragraph("NATHAN RIHET", styles["Name"]),
        Paragraph("Full Stack Engineer - Osaka, Japan", styles["Tagline"]),
        Paragraph(
            '<a href="mailto:nathan.rihet06@gmail.com">nathan.rihet06@gmail.com</a>'
            '  |  <a href="https://github.com/NathanKneT">github.com/NathanKneT</a>'
            '  |  <a href="https://www.linkedin.com/in/nathan-rihet/">linkedin.com/in/nathan-rihet</a>'
            '  |  <a href="https://nathanglhf.com">nathanglhf.com</a>',
            styles["Contact"],
        ),
    ]

    story += section_heading("Profile", styles)
    story.append(
        Paragraph(
            "Full Stack Engineer building scalable SaaS applications with TypeScript, "
            "Next.js, Python and FastAPI. Experienced in APIs, secure data workflows, "
            "automated testing, CI/CD, generative AI and retrieval-augmented generation.",
            styles["Body"],
        )
    )

    story += section_heading("Core Skills", styles)
    skills = Table(
        [
            [
                Paragraph("<b>Frontend</b>", styles["Small"]),
                Paragraph("TypeScript, React, Next.js, Angular", styles["Small"]),
            ],
            [
                Paragraph("<b>Backend</b>", styles["Small"]),
                Paragraph("Python, FastAPI, Node.js, NestJS", styles["Small"]),
            ],
            [
                Paragraph("<b>Data & AI</b>", styles["Small"]),
                Paragraph(
                    "PostgreSQL, MongoDB, generative AI, RAG, LangChain",
                    styles["Small"],
                ),
            ],
            [
                Paragraph("<b>Delivery</b>", styles["Small"]),
                Paragraph(
                    "Docker, GitHub Actions, Terraform, AWS, Azure, Jenkins",
                    styles["Small"],
                ),
            ],
        ],
        colWidths=[28 * mm, 146 * mm],
    )
    skills.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LINEBELOW", (0, 0), (-1, -2), 0.35, LINE),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 2 * mm),
                ("TOPPADDING", (0, 0), (-1, -1), 1.1 * mm),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 1.1 * mm),
            ]
        )
    )
    story.append(skills)

    story += section_heading("Experience", styles)
    story.extend(
        [
            role(
                "ROKKEN",
                "Full Stack Engineer",
                "Sep 2025 - Present",
                "Osaka, Japan",
                [
                    "Develop full-stack SaaS features with TypeScript, Next.js, Python and FastAPI.",
                    "Build APIs, secure data workflows and interactive medical-imaging interfaces.",
                    "Contribute to automated testing, CI/CD, code reviews and technical documentation.",
                ],
                styles,
            ),
            role(
                "FREELANCE",
                "Full Stack Developer",
                "Jan 2025 - Jun 2025",
                "Remote",
                [
                    "Launched DocsRetriever, a B2B document-search SaaS, from concept to production; the service is no longer online.",
                    "Designed a multi-tenant retrieval architecture and automated deployment workflow.",
                    "Delivered working MVPs with custom APIs and real-time dashboards.",
                ],
                styles,
            ),
            role(
                "CAPGEMINI",
                "Software Engineer",
                "Apr 2024 - Mar 2025",
                "Valbonne, France",
                [
                    "Developed enterprise generative-AI applications with React, Python and FastAPI.",
                    "Migrated backend services from Flask to FastAPI, reducing p95 latency from 500 ms to 200 ms.",
                    "Implemented document-retrieval workflows combining semantic and keyword search.",
                    "Automated Azure deployments with Docker, Terraform and CI/CD.",
                ],
                styles,
            ),
            role(
                "CAWITA TECHNOLOGIES",
                "Full Stack Developer",
                "Sep 2022 - Aug 2023",
                "Antibes, France",
                [
                    "Developed and maintained applications with MongoDB, Express, Angular and Node.js.",
                    "Automated deployment workflows with Jenkins and Linux-based infrastructure.",
                ],
                styles,
            ),
        ]
    )

    story += section_heading("Education & Teaching", styles)
    story.append(
        Paragraph(
            "<b>Master's in Applied Artificial Intelligence (MIAGE)</b> - "
            "Universit&eacute; C&ocirc;te d'Azur, 2022-2024<br/>"
            "<b>Computer Science Exchange - AI specialization</b> - "
            "Universit&eacute; Laval, 2023-2024<br/>"
            "<b>Academic Instructor - Conversational Agents</b> - "
            "Seven practical workshops delivered to more than 20 Master's students, 2024-2025",
            styles["Small"],
        )
    )

    story += section_heading("Additional", styles)
    story.append(
        Paragraph(
            "<b>Languages:</b> French (native), English (professional), Japanese (basic)<br/>"
            "<b>Creative practice:</b> Gatsby 5 photography portfolio covering portrait, urban, night and live-performance work.",
            styles["Small"],
        )
    )

    document.build(story)


if __name__ == "__main__":
    build_resume()
