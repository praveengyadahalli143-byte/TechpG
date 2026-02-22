"use client";
import { motion } from "framer-motion";
import Link from "next/link";

/* ─── Project Data ─── */
const majorProjects = [
    {
        title: "EngiPath",
        description: "AI-powered career guidance platform for engineering students. Features personalized learning paths and skill assessments.",
        type: "video",
        embedUrl: "https://drive.google.com/file/d/10tJRSzTVUlfllNGFL1lUsn9MpTvhHI_6/preview",
        link: "https://drive.google.com/file/d/10tJRSzTVUlfllNGFL1lUsn9MpTvhHI_6/view?usp=sharing",
        tech: ["AI/ML", "Full-Stack", "Career Tech"],
        gradient: "linear-gradient(135deg, #6C63FF 0%, #00D9FF 100%)",
        icon: "🧭",
    },
    {
        title: "MittUp",
        description: "The ultimate college social platform — connect, share achievements, participate in polls, and stay updated with campus life.",
        type: "link",
        link: "https://mittup.vercel.app/",
        tech: ["Next.js", "Supabase", "React"],
        gradient: "linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)",
        icon: "🤝",
    },
    {
        title: "HackMitten",
        description: "Full-stack hackathon project showcasing web development, coding excellence, and competitive programming skills.",
        type: "link",
        link: "https://www.linkedin.com/posts/praveen-goudappa-yadahalli-a88528317_webdev-coding-fullstack-activity-7362383259059568640-ZzPx",
        tech: ["Web Dev", "Full-Stack", "Hackathon"],
        gradient: "linear-gradient(135deg, #F97316 0%, #EF4444 100%)",
        icon: "🏆",
    },
    {
        title: "Video Analyzer",
        description: "AI-powered video analysis tool built during a hackathon. Performs intelligent content analysis with machine learning models.",
        type: "link",
        link: "https://www.linkedin.com/posts/praveen-goudappa-yadahalli-a88528317_adhityamurari-hackathon-ai-activity-7374112073934565377-8uhl",
        tech: ["AI", "Python", "Hackathon"],
        gradient: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
        icon: "🎬",
    },
    {
        title: "Talent Flow",
        description: "Comprehensive HR and talent management platform. Features resume parsing, job matching, candidate tracking, and admin dashboards.",
        type: "link",
        link: "https://talent-flow-delta-liard.vercel.app/",
        tech: ["Next.js", "Supabase", "AI"],
        gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
        icon: "💼",
    },
];

const miniProjects = [
    { title: "Data Visualization", link: "https://colab.research.google.com/drive/1Hff1BTK23ZZoBocg-P69ENNKNn1sIDd_?usp=drive_link", icon: "📊", color: "#6C63FF" },
    { title: "ML Classification", link: "https://colab.research.google.com/drive/1NzIMtnXTC0kcJJQyXo2tHyqzKxOYyNXX?usp=drive_link", icon: "🤖", color: "#00D9FF" },
    { title: "Neural Network", link: "https://colab.research.google.com/drive/1CqjY63eHEPyddTmP0y5N0NOA_O2CkFkp?usp=drive_link", icon: "🧠", color: "#00FF88" },
    { title: "Data Preprocessing", link: "https://colab.research.google.com/drive/1ee8LlITdCiGwqpQnAjNfyrbvyoivsEy7?usp=drive_link", icon: "🔧", color: "#FFE66D" },
    { title: "Regression Model", link: "https://colab.research.google.com/drive/194zNEF0-fnPVyi2V2gpf9PhyHc9_sEbZ?usp=drive_link", icon: "📈", color: "#FF6B6B" },
    { title: "NLP Processing", link: "https://colab.research.google.com/drive/1fW5RcnB8-tORBAjPJ7c6lV_pDDXBAqF9?usp=drive_link", icon: "💬", color: "#8B83FF" },
    { title: "Image Processing", link: "https://colab.research.google.com/drive/1G0ln-GjOQdJrxmIYLYmgzEuLRDc9iu-f?usp=drive_link", icon: "🖼️", color: "#F97316" },
    { title: "Deep Learning", link: "https://colab.research.google.com/drive/1IV7AOWJeGUqqD6jE2ysRZTGisgQ8Wx-3?usp=drive_link", icon: "⚡", color: "#3B82F6" },
    { title: "Web Scraping", link: "https://colab.research.google.com/drive/12ROPcMb1J2eJ_FT93qhRQpeUhcZRc_-0?usp=drive_link", icon: "🕸️", color: "#10B981" },
    { title: "Sentiment Analysis", link: "https://colab.research.google.com/drive/1vRguneTxkFmNf5dt9VTNKN9-wGfa8BgA?usp=drive_link", icon: "😊", color: "#EC4899" },
    { title: "Time Series", link: "https://colab.research.google.com/drive/19QSbqicP1fcsL8fXp1qqOgBdzI4r8yoh?usp=drive_link", icon: "⏳", color: "#14B8A6" },
    { title: "Clustering", link: "https://colab.research.google.com/drive/11HCRfdMmyrA_KOhFUQiNmagLnCUo1v7Q?usp=drive_link", icon: "🎯", color: "#A855F7" },
    { title: "Decision Trees", link: "https://colab.research.google.com/drive/1jYbJ7L2N_eRg6f3qY-d3ur8HsGH9wHQO?usp=drive_link", icon: "🌳", color: "#22C55E" },
    { title: "Feature Engineering", link: "https://colab.research.google.com/drive/1aMS_0nMsrP5P5F4QErJghxulmBL7otuK?usp=drive_link", icon: "🔬", color: "#EAB308" },
    { title: "Probability & Stats", link: "https://colab.research.google.com/drive/1qVgReGUUjqffFhRLfgYgKSUtNPeLTu41?usp=drive_link", icon: "🎲", color: "#EF4444" },
    { title: "Random Forest", link: "https://colab.research.google.com/drive/1_Clu3L5vRrplRKFTt_THloT8Ivclq2zg?usp=drive_link", icon: "🌲", color: "#059669" },
    { title: "Gradient Boosting", link: "https://colab.research.google.com/drive/1PzHRMvkSEkTOGewz6hKQIzmTLtWTZBC1?usp=drive_link", icon: "🚀", color: "#7C3AED" },
    { title: "K-Means Clustering", link: "https://colab.research.google.com/drive/1rXcc97KrMnsunyhg1kEsg2NdGRZeBy3h?usp=drive_link", icon: "📍", color: "#06B6D4" },
    { title: "PCA Analysis", link: "https://colab.research.google.com/drive/1g4iwRXrfWjtDHZL5Kfb7VltK4AvpVRp3?usp=drive_link", icon: "📐", color: "#D946EF" },
    { title: "Logistic Regression", link: "https://colab.research.google.com/drive/1quvcglCc8BGf2SqFFimCRevZxmELMNn4?usp=drive_link", icon: "📉", color: "#F43F5E" },
    { title: "SVM Classifier", link: "https://colab.research.google.com/drive/1lQ0nRJp9yA9B-YG5Uoaizt9X88Iv7_MB?usp=drive_link", icon: "✂️", color: "#0EA5E9" },
    { title: "Model Evaluation", link: "https://colab.research.google.com/drive/1dR4A96T4n4SPm0_44-nonv8yev8dBBIE?usp=drive_link", icon: "✅", color: "#84CC16" },
];

export default function ProofOfWorkPage() {
    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#0A0A1A",
                padding: "clamp(48px, 8vw, 60px) clamp(16px, 4vw, 24px) clamp(48px, 8vw, 80px)",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Ambient */}
            <div
                style={{
                    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
                    pointerEvents: "none", zIndex: 0,
                    background: "radial-gradient(ellipse at 20% 30%, rgba(108,99,255,0.07) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(0,217,255,0.05) 0%, transparent 50%)",
                }}
            />

            {/* Back */}
            <Link href="/" style={{ position: "fixed", top: "clamp(12px, 2vw, 24px)", left: "clamp(12px, 2vw, 24px)", zIndex: 50, textDecoration: "none" }}>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ padding: "10px 20px", borderRadius: "10px", border: "1px solid rgba(108,99,255,0.3)", background: "rgba(108,99,255,0.08)", backdropFilter: "blur(12px)", color: "#8B83FF", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, fontSize: "13px", cursor: "pointer", minHeight: "44px" }}
                >
                    ← Back
                </motion.button>
            </Link>

            <div style={{ maxWidth: "1040px", margin: "0 auto", paddingTop: "clamp(28px, 5vw, 40px)", position: "relative", zIndex: 1 }}>
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: "clamp(30px, 6vw, 48px)" }}>
                    <h1 className="section-title" style={{ marginBottom: "12px" }}>🚀 Proof of Work</h1>
                    <p style={{ fontSize: "clamp(0.9rem, 2.5vw, 1rem)", color: "var(--text-secondary)", maxWidth: "560px", margin: "0 auto", lineHeight: 1.7, padding: "0 8px" }}>
                        Real projects, real impact — built by{" "}
                        <strong style={{ color: "var(--primary-light)" }}>Praveen G Y</strong> and the TechpG team.
                    </p>
                </motion.div>

                {/* ═══════ MAJOR PROJECTS ═══════ */}
                <div style={{ marginBottom: "clamp(32px, 6vw, 52px)" }}>
                    <motion.h2
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.15 }}
                        style={{
                            fontSize: "clamp(0.95rem, 2.5vw, 1.1rem)",
                            fontWeight: 600,
                            fontFamily: "'Space Grotesk', sans-serif",
                            color: "var(--text-secondary)",
                            marginBottom: "18px",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                        }}
                    >
                        <span style={{ width: "28px", height: "2px", background: "var(--gradient-1)", display: "inline-block", borderRadius: "2px", flexShrink: 0 }} />
                        Major Projects
                    </motion.h2>

                    <div className="pow-major-grid">
                        {majorProjects.map((project, i) => (
                            <motion.div
                                key={project.title}
                                initial={{ opacity: 0, y: 25 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + i * 0.08 }}
                                className="glass-card"
                                style={{ overflow: "hidden", position: "relative" }}
                            >
                                {/* Left accent bar */}
                                <div style={{ position: "absolute", top: 0, left: 0, width: "4px", height: "100%", background: project.gradient }} />

                                {/* Video embed OR gradient thumbnail */}
                                {project.type === "video" ? (
                                    <div style={{ width: "100%", aspectRatio: "16/9", maxHeight: "360px", background: "#000" }}>
                                        <iframe
                                            src={`${project.embedUrl}?autoplay=1`}
                                            width="100%"
                                            height="100%"
                                            allow="autoplay; encrypted-media"
                                            allowFullScreen
                                            style={{ border: "none", display: "block" }}
                                            title={project.title}
                                        />
                                    </div>
                                ) : (
                                    <div
                                        style={{
                                            width: "100%",
                                            height: "clamp(120px, 20vw, 180px)",
                                            background: project.gradient,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            position: "relative",
                                            overflow: "hidden",
                                        }}
                                    >
                                        <div style={{ position: "absolute", top: "-30px", right: "-30px", width: "120px", height: "120px", borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
                                        <div style={{ position: "absolute", bottom: "-40px", left: "-20px", width: "100px", height: "100px", borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
                                        <span style={{ fontSize: "clamp(36px, 8vw, 56px)", position: "relative", zIndex: 1, filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.3))" }}>{project.icon}</span>
                                    </div>
                                )}

                                {/* Info area */}
                                <div className="pow-card-info">
                                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                                        <div style={{ flex: 1, minWidth: "180px" }}>
                                            <h3 style={{ fontSize: "clamp(1rem, 2.5vw, 1.2rem)", fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: "white", marginBottom: "6px" }}>
                                                {project.title}
                                            </h3>
                                            <p style={{ fontSize: "clamp(12px, 1.8vw, 13px)", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "12px" }}>
                                                {project.description}
                                            </p>
                                            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
                                                {project.tech.map(t => (
                                                    <span key={t} style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "6px", background: "rgba(0,217,255,0.08)", color: "#00D9FF", border: "1px solid rgba(0,217,255,0.15)" }}>{t}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <a href={project.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", flexShrink: 0 }}>
                                            <motion.button
                                                whileHover={{ scale: 1.04, y: -1 }}
                                                whileTap={{ scale: 0.97 }}
                                                style={{
                                                    padding: "10px 20px",
                                                    borderRadius: "10px",
                                                    border: "none",
                                                    background: project.gradient,
                                                    color: "white",
                                                    fontFamily: "'Space Grotesk', sans-serif",
                                                    fontWeight: 600,
                                                    fontSize: "clamp(12px, 1.8vw, 13px)",
                                                    cursor: "pointer",
                                                    boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "8px",
                                                    minHeight: "44px",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                {project.type === "video" ? "▶ Watch" : "🔗 View"} →
                                            </motion.button>
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* ═══════ MINI PROJECTS ═══════ */}
                <div>
                    <motion.h2
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        style={{
                            fontSize: "clamp(0.95rem, 2.5vw, 1.1rem)",
                            fontWeight: 600,
                            fontFamily: "'Space Grotesk', sans-serif",
                            color: "var(--text-secondary)",
                            marginBottom: "18px",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            flexWrap: "wrap",
                        }}
                    >
                        <span style={{ width: "28px", height: "2px", background: "var(--gradient-3)", display: "inline-block", borderRadius: "2px", flexShrink: 0 }} />
                        Mini Projects
                        <span style={{ fontSize: "11px", padding: "2px 10px", borderRadius: "10px", background: "rgba(0,255,136,0.1)", color: "#00FF88", border: "1px solid rgba(0,255,136,0.2)", fontWeight: 500 }}>
                            {miniProjects.length} notebooks
                        </span>
                    </motion.h2>

                    {/* Responsive mini grid: 2-col mobile, 3-col tablet, 4-col desktop */}
                    <div className="responsive-grid-mini">
                        {miniProjects.map((project, i) => (
                            <motion.a
                                key={project.title}
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.65 + i * 0.025 }}
                                whileHover={{ scale: 1.03, y: -3 }}
                                style={{
                                    textDecoration: "none",
                                    color: "white",
                                    background: "rgba(18,18,42,0.7)",
                                    backdropFilter: "blur(16px)",
                                    borderRadius: "14px",
                                    border: `1px solid ${project.color}25`,
                                    overflow: "hidden",
                                    cursor: "pointer",
                                    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                                    display: "block",
                                    minHeight: "44px",
                                }}
                            >
                                {/* Gradient top */}
                                <div style={{
                                    height: "clamp(60px, 10vw, 80px)",
                                    background: `linear-gradient(135deg, ${project.color}30, ${project.color}10)`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    position: "relative",
                                    overflow: "hidden",
                                }}>
                                    <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "60px", height: "60px", borderRadius: "50%", background: `${project.color}15` }} />
                                    <span style={{ fontSize: "clamp(22px, 4vw, 28px)", position: "relative", zIndex: 1 }}>{project.icon}</span>
                                </div>
                                <div style={{ padding: "clamp(10px, 2vw, 14px) clamp(12px, 2vw, 16px)" }}>
                                    <div style={{ fontSize: "clamp(11px, 1.8vw, 13px)", fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", marginBottom: "5px" }}>
                                        {project.title}
                                    </div>
                                    <div style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "4px",
                                        fontSize: "10px",
                                        color: project.color,
                                        fontWeight: 500,
                                        padding: "2px 8px",
                                        borderRadius: "4px",
                                        background: `${project.color}12`,
                                    }}>
                                        📓 Open →
                                    </div>
                                </div>
                            </motion.a>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    style={{ textAlign: "center", fontSize: "clamp(11px, 1.6vw, 13px)", color: "var(--text-muted)", marginTop: "clamp(36px, 6vw, 56px)", lineHeight: 1.6 }}
                >
                    All projects are live and verifiable • Built by Praveen G Y
                </motion.p>
            </div>
        </div>
    );
}
