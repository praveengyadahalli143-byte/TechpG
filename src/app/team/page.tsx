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
                padding: "clamp(48px, 8vw, 60px) clamp(16px, 4vw, 24px) clamp(48px, 8vw, 80px)",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Ambient gradient */}
            <div
                style={{
                    position: "fixed",
                    top: 0, left: 0, width: "100%", height: "100%",
                    pointerEvents: "none", zIndex: 0,
                    background:
                        "radial-gradient(ellipse at 30% 20%, rgba(108, 99, 255, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(0, 217, 255, 0.06) 0%, transparent 50%)",
                }}
            />

            {/* Back button */}
            <Link
                href="/"
                style={{
                    position: "fixed",
                    top: "clamp(12px, 2vw, 24px)",
                    left: "clamp(12px, 2vw, 24px)",
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
                        minHeight: "44px",
                    }}
                >
                    ← Back
                </motion.button>
            </Link>

            <div style={{
                maxWidth: "960px",
                margin: "0 auto",
                paddingTop: "clamp(32px, 5vw, 40px)",
                position: "relative",
                zIndex: 1,
            }}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: "center", marginBottom: "clamp(32px, 6vw, 56px)" }}
                >
                    <h1
                        className="section-title"
                        style={{ marginBottom: "12px" }}
                    >
                        Meet the Team
                    </h1>
                    <p
                        style={{
                            fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
                            color: "var(--text-secondary)",
                            maxWidth: "520px",
                            margin: "0 auto",
                            lineHeight: 1.7,
                            padding: "0 8px",
                        }}
                    >
                        The people behind{" "}
                        <strong style={{ color: "var(--primary-light)" }}>TechpG</strong> — passionate developers
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
                        padding: "clamp(24px, 4vw, 40px) clamp(18px, 3vw, 36px)",
                        marginBottom: "24px",
                        position: "relative",
                        overflow: "hidden",
                        backdropFilter: "blur(20px)",
                    }}
                >
                    {/* Subtle glow accents */}
                    <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "200px", height: "200px", borderRadius: "50%", background: "radial-gradient(circle, rgba(108,99,255,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
                    <div style={{ position: "absolute", bottom: "-80px", left: "-40px", width: "220px", height: "220px", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,217,255,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

                    {/* Responsive flex: column on mobile, row on sm+ */}
                    <div className="team-lead-card-inner" style={{ position: "relative", zIndex: 1 }}>
                        <motion.div
                            whileHover={{ scale: 1.08, rotate: 3 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            style={{
                                width: "clamp(72px, 12vw, 90px)",
                                height: "clamp(72px, 12vw, 90px)",
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #6C63FF40, #6C63FF)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "clamp(22px, 4vw, 28px)",
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
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "4px" }}>
                                <h2
                                    style={{
                                        fontSize: "clamp(1.2rem, 3.5vw, 1.5rem)",
                                        fontWeight: 700,
                                        fontFamily: "'Space Grotesk', sans-serif",
                                        color: "white",
                                    }}
                                >
                                    Praveen G Y
                                </h2>
                                <span
                                    style={{
                                        padding: "3px 10px",
                                        borderRadius: "20px",
                                        background: "rgba(108, 99, 255, 0.15)",
                                        border: "1px solid rgba(108, 99, 255, 0.3)",
                                        color: "#8B83FF",
                                        fontSize: "10px",
                                        fontWeight: 600,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.5px",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    ⭐ Creator
                                </span>
                            </div>
                            <div style={{ fontSize: "13px", color: "#6C63FF", fontWeight: 600, marginBottom: "8px", letterSpacing: "0.3px" }}>
                                Creator &amp; Lead Developer
                            </div>
                            <p style={{ fontSize: "clamp(13px, 2vw, 14px)", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "12px" }}>
                                Architect of TechpG — turning vision into code. Leading the development
                                of the entire platform from concept to deployment.
                            </p>
                            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
                                {team[0].expertise.split(" · ").map((skill) => (
                                    <span
                                        key={skill}
                                        style={{
                                            padding: "3px 10px",
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
                            <div style={{ display: "flex", gap: "clamp(10px, 3vw, 16px)", paddingTop: "12px", borderTop: "1px solid rgba(108, 99, 255, 0.15)", flexWrap: "wrap" }}>
                                {team[0].phone && (
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <span style={{ fontSize: "14px" }}>📱</span>
                                        <span style={{ fontSize: "clamp(12px, 2vw, 13px)", color: "white", fontWeight: 500 }}>{team[0].phone}</span>
                                    </div>
                                )}
                                {team[0].email && (
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <span style={{ fontSize: "14px" }}>📧</span>
                                        <a
                                            href={`mailto:${team[0].email}`}
                                            style={{ fontSize: "clamp(11px, 1.8vw, 13px)", color: "var(--primary-light)", textDecoration: "none", fontWeight: 500, wordBreak: "break-all" }}
                                        >
                                            {team[0].email}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Other Team Members — responsive 2-col grid */}
                <div
                    className="responsive-grid-cards"
                    style={{ marginBottom: "clamp(32px, 6vw, 48px)" }}
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
                                    padding: "clamp(22px, 3.5vw, 32px) clamp(16px, 2.5vw, 24px)",
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
                                        width: "clamp(60px, 10vw, 72px)",
                                        height: "clamp(60px, 10vw, 72px)",
                                        borderRadius: "50%",
                                        background: `linear-gradient(135deg, ${member.color}40, ${member.color})`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "clamp(18px, 3vw, 22px)",
                                        fontWeight: 700,
                                        fontFamily: "'Space Grotesk', sans-serif",
                                        color: "white",
                                        border: `2px solid ${member.color}`,
                                        boxShadow: `0 0 20px ${member.color}30`,
                                        marginBottom: "16px",
                                    }}
                                >
                                    {member.avatar}
                                </motion.div>
                                <h3 style={{ fontSize: "clamp(1rem, 2.5vw, 1.1rem)", fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", marginBottom: "4px", color: "white" }}>
                                    {member.name}
                                </h3>
                                <div style={{ fontSize: "13px", color: member.color, fontWeight: 600, marginBottom: "8px" }}>
                                    {member.role}
                                </div>
                                <p style={{ fontSize: "clamp(12px, 1.8vw, 13px)", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "12px" }}>
                                    {member.tagline}
                                </p>
                                <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", justifyContent: "center", marginBottom: "14px" }}>
                                    {member.expertise.split(" · ").map((skill) => (
                                        <span
                                            key={skill}
                                            style={{
                                                padding: "3px 9px",
                                                borderRadius: "6px",
                                                background: `${member.color}12`,
                                                color: "#A0A0C0",
                                                fontSize: "10px",
                                                border: `1px solid ${member.color}20`,
                                            }}
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                                <div style={{ width: "100%", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", gap: "6px" }}>
                                    {member.phone && (
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                                            <span style={{ fontSize: "12px" }}>📱</span>
                                            <span style={{ fontSize: "clamp(11px, 1.8vw, 12px)", color: "rgba(255,255,255,0.7)" }}>{member.phone}</span>
                                        </div>
                                    )}
                                    {member.email && (
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", flexWrap: "wrap" }}>
                                            <span style={{ fontSize: "12px" }}>📧</span>
                                            <a href={`mailto:${member.email}`} style={{ fontSize: "clamp(10px, 1.6vw, 11px)", color: member.color, textDecoration: "none", wordBreak: "break-all" }}>{member.email}</a>
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
                    style={{ padding: "clamp(22px, 4vw, 32px)", textAlign: "center", marginBottom: "28px" }}
                >
                    <h3
                        style={{
                            fontSize: "clamp(0.9rem, 2vw, 1rem)",
                            fontWeight: 600,
                            fontFamily: "'Space Grotesk', sans-serif",
                            color: "var(--text-secondary)",
                            marginBottom: "18px",
                        }}
                    >
                        🛠️ Built With
                    </h3>
                    <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
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
                                    padding: "7px 16px",
                                    borderRadius: "10px",
                                    background: "rgba(255,255,255,0.04)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    color: tech.color,
                                    fontSize: "clamp(11px, 1.8vw, 13px)",
                                    fontWeight: 500,
                                    cursor: "default",
                                    transition: "all 0.2s",
                                    minHeight: "36px",
                                    display: "inline-flex",
                                    alignItems: "center",
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
                    style={{ textAlign: "center", fontSize: "clamp(11px, 1.6vw, 13px)", color: "var(--text-muted)", lineHeight: 1.6 }}
                >
                    Made with 💜 by Team TechpG • {new Date().getFullYear()}
                </motion.p>
            </div>
        </div>
    );
}
