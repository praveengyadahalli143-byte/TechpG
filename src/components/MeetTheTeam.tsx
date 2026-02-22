"use client";
import { motion } from "framer-motion";

const team = [
    {
        name: "Praveen G Y",
        role: "Creator & Lead Developer",
        expertise: "Full-Stack Development",
        avatar: "PG",
        color: "#6C63FF",
        bio: "Architect of TechpG — turning vision into code. Leading the development of the entire platform.",
        phone: "7353605383",
        email: "praveengyadahalli143@gmail.com",
    },
    {
        name: "Suraja Goudar",
        role: "Developer",
        expertise: "Frontend & UI/UX",
        avatar: "SG",
        color: "#00D9FF",
        bio: "Crafting polished interfaces and seamless interactions for the best user experience.",
        phone: "+91 91085 83236",
        email: "surajearlybird@gmail.com",
    },
    {
        name: "Manoj M",
        role: "Developer",
        expertise: "Backend & Systems",
        avatar: "MM",
        color: "#00FF88",
        bio: "Building robust systems and scalable backends to power the TechpG infrastructure.",
    },
];

export default function MeetTheTeam() {
    return (
        <section
            id="meet-the-team"
            style={{
                padding: "clamp(60px, 8vw, 100px) clamp(16px, 4vw, 24px)",
                position: "relative",
                zIndex: 1,
            }}
        >
            <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    style={{ textAlign: "center", marginBottom: "clamp(32px, 5vw, 60px)" }}
                >
                    <h2 className="section-title">Meet the Team</h2>
                    <p className="section-subtitle">
                        The passionate developers behind{" "}
                        <strong style={{ color: "var(--primary-light)" }}>TechpG</strong>{" "}
                        — building the future of project registration.
                    </p>
                </motion.div>

                {/* Responsive grid: 1-col mobile, 2-col tablet, 3-col desktop */}
                <div className="responsive-grid-cards">
                    {team.map((member, i) => (
                        <motion.div
                            key={i}
                            className="glass-card"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.12, duration: 0.5 }}
                            style={{
                                padding: "clamp(24px, 3vw, 32px) clamp(18px, 2.5vw, 24px)",
                                textAlign: "center",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            {/* Avatar */}
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                style={{
                                    width: "clamp(64px, 10vw, 80px)",
                                    height: "clamp(64px, 10vw, 80px)",
                                    borderRadius: "50%",
                                    background: `linear-gradient(135deg, ${member.color}40, ${member.color})`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    margin: "0 auto 18px",
                                    fontSize: "clamp(18px, 3vw, 24px)",
                                    fontWeight: 700,
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    color: "white",
                                    border: `2px solid ${member.color}`,
                                    boxShadow: `0 0 20px ${member.color}40`,
                                    flexShrink: 0,
                                }}
                            >
                                {member.avatar}
                            </motion.div>

                            <h4
                                style={{
                                    fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
                                    fontWeight: 700,
                                    marginBottom: "4px",
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    color: "white"
                                }}
                            >
                                {member.name}
                            </h4>
                            <div
                                style={{
                                    fontSize: "clamp(12px, 2vw, 14px)",
                                    color: member.color,
                                    fontWeight: 600,
                                    marginBottom: "10px",
                                }}
                            >
                                {member.role}
                            </div>
                            <div
                                style={{
                                    fontSize: "11px",
                                    padding: "4px 12px",
                                    borderRadius: "8px",
                                    background: `${member.color}15`,
                                    color: "var(--text-secondary)",
                                    display: "inline-block",
                                    marginBottom: "14px",
                                    alignSelf: "center"
                                }}
                            >
                                {member.expertise}
                            </div>
                            <p
                                style={{
                                    fontSize: "clamp(13px, 1.8vw, 14px)",
                                    color: "var(--text-muted)",
                                    lineHeight: 1.6,
                                    marginBottom: "18px",
                                    flex: 1
                                }}
                            >
                                {member.bio}
                            </p>

                            {/* Contact Details */}
                            <div style={{
                                paddingTop: "14px",
                                borderTop: "1px solid rgba(255,255,255,0.05)",
                                display: "flex",
                                flexDirection: "column",
                                gap: "8px"
                            }}>
                                {member.phone && (
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                                        <span style={{ fontSize: "14px" }}>📱</span>
                                        <span style={{ fontSize: "clamp(11px, 1.8vw, 13px)", color: "rgba(255,255,255,0.7)" }}>{member.phone}</span>
                                    </div>
                                )}
                                {member.email && (
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", flexWrap: "wrap" }}>
                                        <span style={{ fontSize: "14px" }}>📧</span>
                                        <a
                                            href={`mailto:${member.email}`}
                                            style={{
                                                fontSize: "clamp(10px, 1.6vw, 13px)",
                                                color: member.color,
                                                textDecoration: "none",
                                                wordBreak: "break-all",
                                            }}
                                        >
                                            {member.email}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
