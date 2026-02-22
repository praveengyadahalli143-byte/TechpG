"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AdminLoginPanel() {
    return (
        <section
            id="admin-login"
            style={{
                padding: "clamp(48px, 8vw, 80px) clamp(16px, 4vw, 24px) clamp(40px, 6vw, 60px)",
                position: "relative",
                zIndex: 1,
            }}
        >
            {/* Responsive container: full-width on mobile, narrower on larger screens */}
            <div className="admin-panel-container">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="glass-card"
                    style={{
                        padding: "clamp(28px, 5vw, 40px) clamp(20px, 4vw, 32px)",
                        textAlign: "center",
                    }}
                >
                    {/* Admin icon */}
                    <div
                        style={{
                            width: "clamp(52px, 8vw, 60px)",
                            height: "clamp(52px, 8vw, 60px)",
                            borderRadius: "16px",
                            background: "rgba(108, 99, 255, 0.15)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 18px",
                            fontSize: "clamp(22px, 4vw, 28px)",
                        }}
                    >
                        🔐
                    </div>

                    <h3
                        style={{
                            fontSize: "clamp(1.2rem, 3vw, 1.5rem)",
                            fontWeight: 700,
                            fontFamily: "'Space Grotesk', sans-serif",
                            marginBottom: "8px",
                        }}
                    >
                        Admin Panel
                    </h3>
                    <p
                        style={{
                            fontSize: "clamp(13px, 2vw, 14px)",
                            color: "var(--text-secondary)",
                            marginBottom: "24px",
                            lineHeight: 1.6,
                        }}
                    >
                        Access the admin dashboard to manage registrations, track project
                        progress, and communicate with students.
                    </p>

                    <Link href="/admin/login" style={{ textDecoration: "none" }}>
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="glow-btn glow-btn-primary"
                            style={{
                                width: "100%",
                                padding: "clamp(12px, 2vw, 14px)",
                                fontSize: "clamp(14px, 2vw, 15px)",
                            }}
                        >
                            Login to Dashboard →
                        </motion.button>
                    </Link>
                </motion.div>
            </div>

            {/* Footer */}
            <motion.footer
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                style={{
                    textAlign: "center",
                    marginTop: "clamp(36px, 5vw, 60px)",
                    padding: "clamp(20px, 3vw, 30px) 0",
                    borderTop: "1px solid var(--border)",
                    fontSize: "clamp(11px, 1.5vw, 13px)",
                    color: "var(--text-muted)",
                }}
            >
                <p style={{ marginBottom: "8px" }}>
                    © {new Date().getFullYear()} TechpG. All rights reserved.
                </p>
                <p>
                    Built with 💜 for student project registration
                </p>
            </motion.footer>
        </section>
    );
}
