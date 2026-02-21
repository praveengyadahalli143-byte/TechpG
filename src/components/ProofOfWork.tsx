"use client";
import { motion } from "framer-motion";
import { useRef } from "react";

const stats = [
    { number: "500+", label: "Projects Completed", icon: "📊" },
    { number: "98%", label: "Success Rate", icon: "🏆" },
    { number: "200+", label: "Students Enrolled", icon: "👨‍🎓" },
    { number: "50+", label: "Industry Partners", icon: "🤝" },
];

const projects = [
    {
        title: "AI-Powered Chatbot",
        type: "Major Project",
        tech: ["Python", "TensorFlow", "React"],
        description: "Intelligent customer support chatbot with NLP capabilities and multi-language support.",
        gradient: "linear-gradient(135deg, #6C63FF 0%, #00D9FF 100%)",
    },
    {
        title: "Smart IoT Dashboard",
        type: "Mini Project",
        tech: ["Arduino", "Node.js", "MongoDB"],
        description: "Real-time IoT sensor monitoring dashboard with automated alerts and analytics.",
        gradient: "linear-gradient(135deg, #00FF88 0%, #00D9FF 100%)",
    },
    {
        title: "E-Commerce Platform",
        type: "Major Project",
        tech: ["Next.js", "Stripe", "PostgreSQL"],
        description: "Full-stack e-commerce platform with payment processing and inventory management.",
        gradient: "linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)",
    },
];

export default function ProofOfWork() {
    const sectionRef = useRef<HTMLElement>(null);

    return (
        <section
            ref={sectionRef}
            id="proof-of-work"
            style={{
                padding: "100px 24px",
                position: "relative",
                zIndex: 1,
            }}
        >
            <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="section-title">Proof of Work</h2>
                    <p className="section-subtitle">
                        Our track record speaks for itself. See what our students have built
                        and achieved through our project programs.
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "20px",
                        marginBottom: "60px",
                    }}
                >
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            className="glass-card"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            style={{
                                padding: "30px 24px",
                                textAlign: "center",
                            }}
                        >
                            <span style={{ fontSize: "32px", display: "block", marginBottom: "12px" }}>{stat.icon}</span>
                            <div
                                style={{
                                    fontSize: "2.2rem",
                                    fontWeight: 800,
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    background: "var(--gradient-1)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    marginBottom: "6px",
                                }}
                            >
                                {stat.number}
                            </div>
                            <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Featured Projects */}
                <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{
                        textAlign: "center",
                        fontSize: "1.5rem",
                        fontWeight: 600,
                        color: "var(--text-secondary)",
                        marginBottom: "30px",
                        fontFamily: "'Space Grotesk', sans-serif",
                    }}
                >
                    Featured Projects
                </motion.h3>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                        gap: "24px",
                    }}
                >
                    {projects.map((project, i) => (
                        <motion.div
                            key={i}
                            className="glass-card"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15, duration: 0.5 }}
                            style={{
                                padding: "28px",
                                overflow: "hidden",
                                position: "relative",
                            }}
                        >
                            {/* Top gradient line */}
                            <div
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "3px",
                                    background: project.gradient,
                                }}
                            />
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginBottom: "12px",
                                }}
                            >
                                <h4
                                    style={{
                                        fontSize: "1.15rem",
                                        fontWeight: 600,
                                        fontFamily: "'Space Grotesk', sans-serif",
                                    }}
                                >
                                    {project.title}
                                </h4>
                                <span
                                    style={{
                                        fontSize: "11px",
                                        padding: "4px 10px",
                                        borderRadius: "8px",
                                        background: "rgba(108, 99, 255, 0.15)",
                                        color: "var(--primary-light)",
                                        fontWeight: 600,
                                    }}
                                >
                                    {project.type}
                                </span>
                            </div>
                            <p
                                style={{
                                    fontSize: "14px",
                                    color: "var(--text-secondary)",
                                    lineHeight: 1.6,
                                    marginBottom: "16px",
                                }}
                            >
                                {project.description}
                            </p>
                            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                {project.tech.map((t, j) => (
                                    <span
                                        key={j}
                                        style={{
                                            fontSize: "11px",
                                            padding: "4px 10px",
                                            borderRadius: "6px",
                                            background: "rgba(0, 217, 255, 0.1)",
                                            color: "var(--accent)",
                                            border: "1px solid rgba(0, 217, 255, 0.2)",
                                        }}
                                    >
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
