"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AdminLoginPanel() {
    return (
        <section
            id="admin-login"
            style={{
                padding: "80px 24px 60px",
                position: "relative",
                zIndex: 1,
            }}
        >
            <div style={{ maxWidth: "500px", margin: "0 auto" }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="glass-card"
                    style={{
                        padding: "40px 32px",
                        textAlign: "center",
                    }}
                >
                    {/* Admin icon */}
                    <div
                        style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "16px",
                            background: "rgba(108, 99, 255, 0.15)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 20px",
                            fontSize: "28px",
                        }}
                    >
                        🔐
                    </div>

                    <h3
                        style={{
                            fontSize: "1.5rem",
                            fontWeight: 700,
                            fontFamily: "'Space Grotesk', sans-serif",
                            marginBottom: "8px",
                        }}
                    >
                        Admin Panel
                    </h3>
                    <p
                        style={{
                            fontSize: "14px",
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
                                padding: "14px",
                                fontSize: "15px",
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
                    marginTop: "60px",
                    padding: "30px 0",
                    borderTop: "1px solid var(--border)",
                    fontSize: "13px",
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
