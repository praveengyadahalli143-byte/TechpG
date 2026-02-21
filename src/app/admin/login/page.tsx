"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { data, error: dbError } = await supabase
                .from("admin_users")
                .select("*")
                .eq("email", email.trim())
                .eq("password_hash", password.trim())
                .single();

            if (dbError || !data) {
                setError("Invalid email or password");
                setLoading(false);
                return;
            }

            localStorage.setItem("admin_session", JSON.stringify(data));
            router.push("/admin/dashboard");
        } catch {
            setError("An error occurred. Please try again.");
        }
        setLoading(false);
    };

    const inputStyle = {
        width: "100%",
        padding: "14px 16px",
        borderRadius: "12px",
        border: "1px solid var(--border)",
        background: "var(--surface)",
        color: "white",
        fontSize: "14px",
        fontFamily: "'Inter', sans-serif",
        outline: "none",
        transition: "all 0.3s ease",
        boxSizing: "border-box" as const,
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px",
                position: "relative",
                zIndex: 1,
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="glass-card"
                style={{ width: "100%", maxWidth: "420px", padding: "48px 36px" }}
            >
                <Link href="/" style={{ textDecoration: "none", display: "block", textAlign: "center", marginBottom: "32px" }}>
                    <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "var(--gradient-1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "24px", color: "white" }}>T</div>
                    <h1 style={{ fontSize: "1.5rem", fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>Admin Login</h1>
                    <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "6px" }}>Sign in to access the dashboard</p>
                </Link>

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 500, display: "block", marginBottom: "8px" }}>Email Address</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter admin email" required style={inputStyle}
                            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(108, 99, 255, 0.15)"; }}
                            onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}
                        />
                    </div>
                    <div style={{ marginBottom: "24px" }}>
                        <label style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 500, display: "block", marginBottom: "8px" }}>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required style={inputStyle}
                            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(108, 99, 255, 0.15)"; }}
                            onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}
                        />
                    </div>

                    {error && (
                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                            style={{ padding: "12px 16px", borderRadius: "10px", background: "rgba(255, 107, 107, 0.1)", border: "1px solid rgba(255, 107, 107, 0.3)", color: "#FF6B6B", fontSize: "13px", marginBottom: "16px" }}>
                            ⚠️ {error}
                        </motion.div>
                    )}

                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading}
                        style={{
                            width: "100%", padding: "14px", borderRadius: "12px", border: "none",
                            background: loading ? "var(--surface)" : "var(--gradient-1)",
                            color: "white", fontSize: "15px", fontWeight: 600,
                            cursor: loading ? "wait" : "pointer",
                            fontFamily: "'Space Grotesk', sans-serif",
                            boxShadow: loading ? "none" : "0 4px 20px rgba(108, 99, 255, 0.4)",
                            transition: "all 0.3s ease",
                        }}
                    >
                        {loading ? "Signing in..." : "Sign In →"}
                    </motion.button>
                </form>

                <div style={{ textAlign: "center", marginTop: "24px" }}>
                    <Link href="/" style={{ fontSize: "13px", color: "var(--text-muted)", textDecoration: "none" }}>← Back to home</Link>
                </div>
            </motion.div>
        </div>
    );
}
