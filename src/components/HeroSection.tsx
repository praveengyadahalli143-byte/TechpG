import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { SplineScene } from "@/components/ui/splite"
import { supabase } from "@/lib/supabase"

/* ─── Offer / Accept content ─── */
const offerItems = [
    { icon: "💻", title: "Full Major & Mini Projects", desc: "All software domains (no IoT)" },
    { icon: "📄", title: "Report in LaTeX Format", desc: "Publication-ready academic reports" },
    { icon: "🔄", title: "End-to-End Support", desc: "Ideation to deployment guidance" },
    { icon: "🛠️", title: "Major Changes Included", desc: "Significant revisions handled" },
    { icon: "🎓", title: "Code Walkthrough", desc: "Understand every line of code" },
    { icon: "✏️", title: "Learn Minor Changes", desc: "We teach you to modify independently" },
    { icon: "📅", title: "Weekly Task Updates", desc: "For diary/logbook maintenance" },
];

const acceptItems = [
    { icon: "💰", title: "Development & Report Cost", desc: "Required when we undertake your project" },
    { icon: "🔒", title: "Strict Confidentiality", desc: "Everything must be kept 100% secret" },
    { icon: "💬", title: "Chat-Only Communication", desc: "Use integrated chat for all queries" },
    { icon: "✅", title: "Admin Approval Process", desc: "You'll receive confirmation email after approval" },
];

/* ─── Circular corner button with rotating dashed ring ─── */
function CornerButton({
    href, icon, label, gradient, color, delay, position,
}: {
    href: string; icon: string; label: string; gradient?: string; color: string;
    delay: number;
    position: { top?: string; bottom?: string; left?: string; right?: string };
}) {
    const isFilled = !!gradient;
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, duration: 0.6, type: "spring", stiffness: 120 }}
            style={{
                position: "absolute",
                ...position,
                zIndex: 10,
                // Responsiveness adjustments
                transform: "scale(var(--btn-scale, 1))"
            }}
            className="corner-btn-container"
        >
            <Link href={href} style={{ textDecoration: "none" }}>
                <motion.div
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.93 }}
                    style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                >
                    <svg width="100" height="100" viewBox="0 0 110 110" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", pointerEvents: "none" }} className="dashed-ring">
                        <circle cx="55" cy="55" r="50" fill="none" stroke={color} strokeWidth="2.5" strokeDasharray="8 6" strokeLinecap="round" opacity="0.7">
                            <animateTransform attributeName="transform" type="rotate" from="0 55 55" to="360 55 55" dur="12s" repeatCount="indefinite" />
                        </circle>
                    </svg>
                    <div style={{
                        width: "68px", height: "68px", borderRadius: "50%",
                        background: isFilled ? gradient : "rgba(18, 18, 42, 0.7)",
                        border: isFilled ? "none" : `1.5px solid ${color}40`,
                        backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3px", cursor: "pointer",
                        boxShadow: isFilled ? `0 4px 24px ${color}50, 0 0 40px ${color}20` : `0 4px 20px rgba(0,0,0,0.3)`,
                        transition: "all 0.3s ease",
                    }}>
                        <span style={{ fontSize: "20px", lineHeight: 1 }}>{icon}</span>
                        <span style={{ fontSize: "7px", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: isFilled ? "white" : color, letterSpacing: "0.5px", textTransform: "uppercase", textAlign: "center", lineHeight: 1.1, maxWidth: "52px" }}>{label}</span>
                    </div>
                </motion.div>
            </Link>
        </motion.div>
    );
}

/* ─── Hover-expandable info button with rotating dashed ring ─── */
function HoverInfoButton({
    icon, label, color, delay, position, items, expandDirection,
}: {
    icon: string; label: string; color: string; delay: number;
    position: { top?: string; bottom?: string; left?: string; right?: string };
    items: { icon: string; title: string; desc: string }[];
    expandDirection: "right" | "left";
}) {
    const [hovered, setHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, duration: 0.6, type: "spring", stiffness: 120 }}
            style={{ position: "absolute", ...position, zIndex: 20 }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                {/* The circle button */}
                <motion.div
                    whileHover={{ scale: 1.08 }}
                    style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                    onClick={() => setHovered(!hovered)}
                >
                    <svg width="100" height="100" viewBox="0 0 110 110" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", pointerEvents: "none" }} className="dashed-ring">
                        <circle cx="55" cy="55" r="50" fill="none" stroke={color} strokeWidth="2.5" strokeDasharray="8 6" strokeLinecap="round" opacity="0.7">
                            <animateTransform attributeName="transform" type="rotate" from="0 55 55" to="360 55 55" dur="12s" repeatCount="indefinite" />
                        </circle>
                    </svg>
                    <div style={{
                        width: "68px", height: "68px", borderRadius: "50%",
                        background: "rgba(18, 18, 42, 0.7)",
                        border: `1.5px solid ${color}40`,
                        backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3px",
                        boxShadow: `0 4px 20px rgba(0,0,0,0.3)`,
                        transition: "all 0.3s ease",
                    }}>
                        <span style={{ fontSize: "20px", lineHeight: 1 }}>{icon}</span>
                        <span style={{ fontSize: "7px", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color, letterSpacing: "0.3px", textTransform: "uppercase", textAlign: "center", lineHeight: 1.1, maxWidth: "52px" }}>{label}</span>
                    </div>
                </motion.div>

                {/* Hover panel */}
                <AnimatePresence>
                    {hovered && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, x: expandDirection === "right" ? -10 : 10 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9, x: expandDirection === "right" ? -10 : 10 }}
                            transition={{ duration: 0.25 }}
                            style={{
                                position: "absolute",
                                top: "50%",
                                transform: "translateY(-50%)",
                                ...(expandDirection === "right" ? { left: "100px" } : { right: "100px" }),
                                width: "calc(100vw - 120px)",
                                maxWidth: "300px",
                                padding: "20px",
                                borderRadius: "18px",
                                background: "rgba(12, 12, 32, 0.92)",
                                backdropFilter: "blur(20px)",
                                WebkitBackdropFilter: "blur(20px)",
                                border: `1px solid ${color}30`,
                                boxShadow: `0 8px 40px rgba(0,0,0,0.5), 0 0 30px ${color}10`,
                                zIndex: 100,
                            }}
                        >
                            <div style={{ fontSize: "12px", fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color, marginBottom: "14px", textTransform: "uppercase", letterSpacing: "1px" }}>
                                {label}
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                {items.map((item) => (
                                    <div key={item.title} style={{ display: "flex", gap: "10px", alignItems: "flex-start", padding: "8px 10px", borderRadius: "10px", background: `${color}08`, border: `1px solid ${color}15` }}>
                                        <span style={{ fontSize: "15px", flexShrink: 0, marginTop: "1px" }}>{item.icon}</span>
                                        <div>
                                            <div style={{ fontSize: "12px", fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", color: "white", marginBottom: "2px" }}>{item.title}</div>
                                            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.45)", lineHeight: 1.4 }}>{item.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

export default function HeroSection() {
    const [completedCount, setCompletedCount] = useState(0);

    useEffect(() => {
        // Track visitor
        supabase.rpc("track_visitor").then();

        // Fetch completed count
        supabase.from("projects").select("id", { count: "exact", head: true }).eq("status", "completed")
            .then(({ count }) => {
                if (count) setCompletedCount(count + 140); // Base success count + real data
            });
    }, []);

    return (
        <section
            className="hero-section"
            style={{
                position: "relative",
                width: "100vw",
                height: "100vh",
                overflow: "hidden",
                background: "#0A0A1A",
            }}
        >
            {/* Full-screen Spline 3D Robot */}
            <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
                <SplineScene
                    scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                    className="w-full h-full"
                />
            </div>

            {/* ═══ Top Left — Logo ═══ */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                style={{
                    position: "absolute",
                    top: "28px",
                    left: "28px",
                    zIndex: 10,
                }}
            >
                <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "12px" }}>
                    <motion.div
                        whileHover={{ rotate: 5, scale: 1.05 }}
                        style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "14px",
                            background: "rgba(18, 18, 42, 0.7)",
                            backdropFilter: "blur(12px)",
                            border: "1px solid rgba(139, 131, 255, 0.3)",
                            padding: "6px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 0 20px rgba(139, 131, 255, 0.15)"
                        }}
                    >
                        <Image src="/favicon.ico" alt="TechpG" width={36} height={36} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    </motion.div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{
                            fontSize: "20px",
                            fontWeight: 800,
                            fontFamily: "'Space Grotesk', sans-serif",
                            color: "white",
                            letterSpacing: "1px",
                            lineHeight: 1
                        }}>
                            Tech<span style={{ color: "#8B83FF" }}>pG</span>
                        </span>
                        <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.4)", letterSpacing: "2px", fontWeight: 600, textTransform: "uppercase", marginTop: "2px" }}>
                            Innovation Hub
                        </span>
                    </div>
                </Link>
            </motion.div>

            {/* ═══ Top Center — Dashboard (Rectangle) ═══ */}
            <motion.div
                initial={{ opacity: 0, y: -20, x: "-50%" }}
                animate={{ opacity: 1, y: 0, x: "-50%" }}
                transition={{ delay: 0.5, duration: 0.6, type: "spring", stiffness: 120 }}
                style={{
                    position: "absolute",
                    top: "28px",
                    left: "50%",
                    zIndex: 10,
                    width: "auto"
                }}
            >
                <Link href="/dashboard" style={{ textDecoration: "none" }}>
                    <motion.div
                        whileHover={{ scale: 1.06, boxShadow: "0 0 30px rgba(255, 230, 109, 0.3)" }}
                        whileTap={{ scale: 0.95 }}
                        style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                        {/* Rotating dashed rounded-rectangle ring */}
                        <svg width="200" height="70" viewBox="0 0 200 70" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", pointerEvents: "none" }}>
                            <rect x="4" y="4" width="192" height="62" rx="31" ry="31" fill="none" stroke="#FFE66D" strokeWidth="2.5" strokeDasharray="8 6" strokeLinecap="round" opacity="0.7">
                                <animate attributeName="stroke-dashoffset" from="0" to="-56" dur="4s" repeatCount="indefinite" />
                            </rect>
                        </svg>
                        <div style={{
                            padding: "12px 36px",
                            borderRadius: "30px",
                            background: "rgba(18, 18, 42, 0.75)",
                            border: "1.5px solid rgba(255, 230, 109, 0.25)",
                            backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
                            display: "flex", alignItems: "center", gap: "10px", cursor: "pointer",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                            transition: "all 0.3s ease",
                            whiteSpace: "nowrap"
                        }}>
                            <span style={{ fontSize: "20px", lineHeight: 1 }}>📋</span>
                            <span style={{ fontSize: "14px", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: "#FFE66D", letterSpacing: "1px", textTransform: "uppercase" }}>Dashboard</span>
                        </div>
                    </motion.div>
                </Link>
            </motion.div>

            {/* ═══ Top Right — Unified Registration ═══ */}
            <CornerButton
                href="/register"
                icon="✍️"
                label="Register Now"
                gradient="linear-gradient(135deg, #00FF88 0%, #00D9FF 100%)"
                color="#00D9FF"
                delay={0.4}
                position={{ top: "28px", right: "28px" }}
            />

            {/* ═══ Center Left — What We Offer (hover) ═══ */}
            <HoverInfoButton
                icon="🎁"
                label="What We Offer"
                color="#00FF88"
                delay={0.7}
                position={{ top: "50%", left: "28px" }}
                items={offerItems}
                expandDirection="right"
            />

            {/* ═══ Center Right — What We Accept (hover) ═══ */}
            <HoverInfoButton
                icon="📋"
                label="What We Accept"
                color="#FF6B6B"
                delay={0.8}
                position={{ top: "50%", right: "28px" }}
                items={acceptItems}
                expandDirection="left"
            />

            {/* ═══ Bottom Left — Team ═══ */}
            <CornerButton
                href="/team"
                icon="👥"
                label="Team"
                color="#00FF88"
                delay={0.6}
                position={{ bottom: "28px", left: "28px" }}
            />

            {/* ═══ Bottom Right — Proof of Work ═══ */}
            <CornerButton
                href="/proof-of-work"
                icon="📊"
                label={`Done: ${completedCount}`}
                color="#00D9FF"
                delay={0.7}
                position={{ bottom: "28px", right: "28px" }}
            />

            {/* ═══ Center Preview Section for First Visitors ═══ */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                style={{
                    position: "absolute",
                    bottom: "120px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 5,
                    textAlign: "center"
                }}
            >
                <div style={{ color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "16px" }}>🔥 Recently Delivered Projects</div>
                <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
                    {[
                        { img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=120&h=80&fit=crop", title: "AI Chatbot" },
                        { img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=120&h=80&fit=crop", title: "E-commerce" },
                        { img: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=120&h=80&fit=crop", title: "IoT Panel" }
                    ].map((p, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -5, scale: 1.05 }}
                            style={{
                                width: "120px", height: "80px", borderRadius: "10px", overflow: "hidden",
                                border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.5)",
                                position: "relative"
                            }}
                        >
                            <Image src={p.img} alt={p.title} width={120} height={80} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.6 }} unoptimized />
                            <div style={{ position: "absolute", bottom: "4px", left: "0", width: "100%", fontSize: "9px", color: "white", fontWeight: 600 }}>{p.title}</div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Subtle Admin Access - Bottom Right */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.1 }}
                whileHover={{ opacity: 0.6 }}
                style={{
                    position: "absolute",
                    bottom: "20px",
                    right: "24px",
                    zIndex: 100
                }}
            >
                <Link
                    href="/admin/login"
                    style={{
                        fontSize: "10px",
                        color: "white",
                        textDecoration: "none",
                        fontFamily: "'Inter', sans-serif",
                        letterSpacing: "1px",
                        textTransform: "uppercase"
                    }}
                >
                    Admin Access
                </Link>
            </motion.div>

        </section>
    )
}
