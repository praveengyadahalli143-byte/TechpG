"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const team = [
    {
        name: "Praveen G Y",
        role: "Creator & Lead Developer",
        expertise: "Full-Stack Development · Architecture · UI/UX",
        avatar: "PG",
        color: "#6C63FF",
        tagline: "Architect of TechpG — turning vision into code.",
        github: "https://github.com/praveengyadahalli143-byte",
        phone: "7353605383",
        email: "praveengyadahalli143@gmail.com",
        socials: { github: true },
        isLead: true,
    },
    {
        name: "Suraja Goudar",
        role: "Developer",
        expertise: "Frontend Development · React · Next.js",
        avatar: "SG",
        color: "#00D9FF",
        phone: "+91 91085 83236",
        email: "surajearlybird@gmail.com",
        tagline: "Crafting polished interfaces and seamless interactions.",
        socials: {},
        isLead: false,
    },
    {
        name: "Manoj M",
        role: "Developer",
        expertise: "Backend Development · Database · APIs",
        avatar: "MM",
        color: "#00FF88",
        tagline: "Building robust systems and scalable backends.",
        socials: {},
        isLead: false,
    },
];

export default function TeamPage() {
    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#0A0A1A",
                padding: "60px 24px 80px",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Ambient gradient */}
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                    zIndex: 0,
                    background:
                        "radial-gradient(ellipse at 30% 20%, rgba(108, 99, 255, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(0, 217, 255, 0.06) 0%, transparent 50%)",
                }}
            />

            {/* Back button */}
            <Link
                href="/"
                style={{
                    position: "fixed",
                    top: "24px",
                    left: "24px",
                    zIndex: 50,
                    textDecoration: "none",
                }}
            >
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                        padding: "10px 20px",
                        borderRadius: "10px",
                        border: "1px solid rgba(108, 99, 255, 0.3)",
                        background: "rgba(108, 99, 255, 0.08)",
                        backdropFilter: "blur(12px)",
                        color: "#8B83FF",
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 500,
                        fontSize: "13px",
                        cursor: "pointer",
                    }}
                >
                    ← Back
                </motion.button>
            </Link>

            <div style={{ maxWidth: "960px", margin: "0 auto", paddingTop: "40px", position: "relative", zIndex: 1 }}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: "center", marginBottom: "56px" }}
                >
                    <h1
                        className="section-title"
                        style={{ marginBottom: "12px", fontSize: "2.5rem" }}
                    >
                        Meet the Team
                    </h1>
                    <p
                        style={{
                            fontSize: "1rem",
                            color: "var(--text-secondary)",
                            maxWidth: "520px",
                            margin: "0 auto",
                            lineHeight: 1.7,
                        }}
                    >
                        The people behind <strong style={{ color: "var(--primary-light)" }}>TechpG</strong> — passionate developers
                        building the future of project registration.
                    </p>
                </motion.div>

                {/* Lead Developer — Hero Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    style={{
                        background: "linear-gradient(135deg, rgba(108, 99, 255, 0.1) 0%, rgba(0, 217, 255, 0.06) 100%)",
                        border: "1px solid rgba(108, 99, 255, 0.25)",
                        borderRadius: "24px",
                        padding: "40px 36px",
                        marginBottom: "28px",
                        position: "relative",
                        overflow: "hidden",
                        backdropFilter: "blur(20px)",
                    }}
                >
                    {/* Subtle glow accent */}
                    <div
                        style={{
                            position: "absolute",
                            top: "-60px",
                            right: "-60px",
                            width: "200px",
                            height: "200px",
                            borderRadius: "50%",
                            background: "radial-gradient(circle, rgba(108,99,255,0.15) 0%, transparent 70%)",
                            pointerEvents: "none",
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            bottom: "-80px",
                            left: "-40px",
                            width: "220px",
                            height: "220px",
                            borderRadius: "50%",
                            background: "radial-gradient(circle, rgba(0,217,255,0.1) 0%, transparent 70%)",
                            pointerEvents: "none",
                        }}
                    />

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "28px",
                            flexWrap: "wrap",
                            position: "relative",
                            zIndex: 1,
                        }}
                    >
                        <motion.div
                            whileHover={{ scale: 1.08, rotate: 3 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            style={{
                                width: "90px",
                                height: "90px",
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #6C63FF40, #6C63FF)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "28px",
                                fontWeight: 800,
                                fontFamily: "'Space Grotesk', sans-serif",
                                color: "white",
                                border: "3px solid #6C63FF",
                                boxShadow: "0 0 30px rgba(108, 99, 255, 0.4)",
                                flexShrink: 0,
                            }}
                        >
                            PG
                        </motion.div>
                        <div style={{ flex: 1, minWidth: "200px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "4px" }}>
                                <h2
                                    style={{
                                        fontSize: "1.5rem",
                                        fontWeight: 700,
                                        fontFamily: "'Space Grotesk', sans-serif",
                                        color: "white",
                                    }}
                                >
                                    Praveen G Y
                                </h2>
                                <span
                                    style={{
                                        padding: "4px 12px",
                                        borderRadius: "20px",
                                        background: "rgba(108, 99, 255, 0.15)",
                                        border: "1px solid rgba(108, 99, 255, 0.3)",
                                        color: "#8B83FF",
                                        fontSize: "11px",
                                        fontWeight: 600,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.5px",
                                    }}
                                >
                                    ⭐ Creator
                                </span>
                            </div>
                            <div
                                style={{
                                    fontSize: "14px",
                                    color: "#6C63FF",
                                    fontWeight: 600,
                                    marginBottom: "8px",
                                    letterSpacing: "0.3px",
                                }}
                            >
                                Creator & Lead Developer
                            </div>
                            <p
                                style={{
                                    fontSize: "14px",
                                    color: "var(--text-secondary)",
                                    lineHeight: 1.6,
                                    marginBottom: "12px",
                                }}
                            >
                                Architect of TechpG — turning vision into code. Leading the development
                                of the entire platform from concept to deployment.
                            </p>
                            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
                                {team[0].expertise.split(" · ").map((skill) => (
                                    <span
                                        key={skill}
                                        style={{
                                            padding: "4px 12px",
                                            borderRadius: "8px",
                                            background: "rgba(108, 99, 255, 0.1)",
                                            color: "#A0A0C0",
                                            fontSize: "11px",
                                            fontWeight: 500,
                                            border: "1px solid rgba(108, 99, 255, 0.15)",
                                        }}
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    gap: "16px",
                                    paddingTop: "12px",
                                    borderTop: "1px solid rgba(108, 99, 255, 0.15)",
                                }}
                            >
                                {team[0].phone && (
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <span style={{ fontSize: "14px" }}>📱</span>
                                        <span style={{ fontSize: "13px", color: "white", fontWeight: 500 }}>{team[0].phone}</span>
                                    </div>
                                )}
                                {team[0].email && (
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <span style={{ fontSize: "14px" }}>📧</span>
                                        <a href={`mailto:${team[0].email}`} style={{ fontSize: "13px", color: "var(--primary-light)", textDecoration: "none", fontWeight: 500 }}>{team[0].email}</a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Other Team Members */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                        gap: "20px",
                        marginBottom: "48px",
                    }}
                >
                    {team
                        .filter((m) => !m.isLead)
                        .map((member, i) => (
                            <motion.div
                                key={member.name}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + i * 0.12 }}
                                className="glass-card"
                                style={{
                                    padding: "32px 24px",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    textAlign: "center",
                                }}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                    style={{
                                        width: "72px",
                                        height: "72px",
                                        borderRadius: "50%",
                                        background: `linear-gradient(135deg, ${member.color}40, ${member.color})`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "22px",
                                        fontWeight: 700,
                                        fontFamily: "'Space Grotesk', sans-serif",
                                        color: "white",
                                        border: `2px solid ${member.color}`,
                                        boxShadow: `0 0 20px ${member.color}30`,
                                        marginBottom: "18px",
                                    }}
                                >
                                    {member.avatar}
                                </motion.div>
                                <h3
                                    style={{
                                        fontSize: "1.1rem",
                                        fontWeight: 600,
                                        fontFamily: "'Space Grotesk', sans-serif",
                                        marginBottom: "4px",
                                        color: "white",
                                    }}
                                >
                                    {member.name}
                                </h3>
                                <div
                                    style={{
                                        fontSize: "13px",
                                        color: member.color,
                                        fontWeight: 600,
                                        marginBottom: "8px",
                                    }}
                                >
                                    {member.role}
                                </div>
                                <p
                                    style={{
                                        fontSize: "13px",
                                        color: "var(--text-secondary)",
                                        lineHeight: 1.5,
                                        marginBottom: "14px",
                                    }}
                                >
                                    {member.tagline}
                                </p>
                                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center", marginBottom: "16px" }}>
                                    {member.expertise.split(" · ").map((skill) => (
                                        <span
                                            key={skill}
                                            style={{
                                                padding: "3px 10px",
                                                borderRadius: "6px",
                                                background: `${member.color}12`,
                                                color: "#A0A0C0",
                                                fontSize: "11px",
                                                border: `1px solid ${member.color}20`,
                                            }}
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                                <div style={{
                                    width: "100%",
                                    paddingTop: "12px",
                                    borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "6px"
                                }}>
                                    {member.phone && (
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                                            <span style={{ fontSize: "12px" }}>📱</span>
                                            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)" }}>{member.phone}</span>
                                        </div>
                                    )}
                                    {member.email && (
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                                            <span style={{ fontSize: "12px" }}>📧</span>
                                            <a href={`mailto:${member.email}`} style={{ fontSize: "11px", color: member.color, textDecoration: "none" }}>{member.email}</a>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                </div>

                {/* Tech Stack / Built With */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="glass-card"
                    style={{
                        padding: "32px",
                        textAlign: "center",
                        marginBottom: "32px",
                    }}
                >
                    <h3
                        style={{
                            fontSize: "1rem",
                            fontWeight: 600,
                            fontFamily: "'Space Grotesk', sans-serif",
                            color: "var(--text-secondary)",
                            marginBottom: "20px",
                        }}
                    >
                        🛠️ Built With
                    </h3>
                    <div
                        style={{
                            display: "flex",
                            gap: "12px",
                            justifyContent: "center",
                            flexWrap: "wrap",
                        }}
                    >
                        {[
                            { name: "Next.js", color: "#ffffff" },
                            { name: "React", color: "#61DAFB" },
                            { name: "TypeScript", color: "#3178C6" },
                            { name: "Supabase", color: "#3FCF8E" },
                            { name: "Framer Motion", color: "#E91BCC" },
                            { name: "Vercel", color: "#ffffff" },
                        ].map((tech) => (
                            <motion.span
                                key={tech.name}
                                whileHover={{ scale: 1.08, y: -2 }}
                                style={{
                                    padding: "8px 18px",
                                    borderRadius: "10px",
                                    background: "rgba(255,255,255,0.04)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    color: tech.color,
                                    fontSize: "13px",
                                    fontWeight: 500,
                                    cursor: "default",
                                    transition: "all 0.2s",
                                }}
                            >
                                {tech.name}
                            </motion.span>
                        ))}
                    </div>
                </motion.div>

                {/* Footer tagline */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    style={{
                        textAlign: "center",
                        fontSize: "13px",
                        color: "var(--text-muted)",
                        lineHeight: 1.6,
                    }}
                >
                    Made with 💜 by Team TechpG • {new Date().getFullYear()}
                </motion.p>
            </div>
        </div>
    );
}
