"use client";
import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { SplineScene, preloadSplineScene } from "@/components/ui/splite"
import { supabase } from "@/lib/supabase"

// Kick off CDN preconnect + scene prefetch the moment this module is parsed
if (typeof window !== 'undefined') preloadSplineScene()

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

/* ─── Hook: detect screen size ─── */
function useScreenSize() {
    const [size, setSize] = useState<"xs" | "sm" | "md" | "lg">("lg");
    useEffect(() => {
        const check = () => {
            const w = window.innerWidth;
            if (w <= 480) setSize("xs");
            else if (w <= 768) setSize("sm");
            else if (w <= 1024) setSize("md");
            else setSize("lg");
        };
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);
    return size;
}

/* ─── Circular corner button with rotating dashed ring ─── */
function CornerButton({
    href, icon, label, gradient, color, delay, position, className,
}: {
    href: string; icon: string; label: string; gradient?: string; color: string;
    delay: number;
    position: { top?: string; bottom?: string; left?: string; right?: string };
    className?: string;
}) {
    const isFilled = !!gradient;
    const size = useScreenSize();
    const btnSize = size === "xs" ? 54 : size === "sm" ? 60 : 68;
    const fontSize = size === "xs" ? "16px" : size === "sm" ? "18px" : "20px";
    const labelSize = size === "xs" ? "6px" : "7px";

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, duration: 0.6, type: "spring", stiffness: 120 }}
            style={{ position: "absolute", ...position, zIndex: 10 }}
            className={`corner-btn-container ${className || ""}`}
        >
            <Link href={href} style={{ textDecoration: "none" }}>
                <motion.div
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.93 }}
                    style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                >
                    <svg
                        width={btnSize + 32}
                        height={btnSize + 32}
                        viewBox="0 0 110 110"
                        style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", pointerEvents: "none" }}
                        className="dashed-ring"
                    >
                        <circle cx="55" cy="55" r="50" fill="none" stroke={color} strokeWidth="2.5" strokeDasharray="8 6" strokeLinecap="round" opacity="0.7">
                            <animateTransform attributeName="transform" type="rotate" from="0 55 55" to="360 55 55" dur="12s" repeatCount="indefinite" />
                        </circle>
                    </svg>
                    <div style={{
                        width: `${btnSize}px`, height: `${btnSize}px`, borderRadius: "50%",
                        background: isFilled ? gradient : "rgba(18, 18, 42, 0.7)",
                        border: isFilled ? "none" : `1.5px solid ${color}40`,
                        backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3px", cursor: "pointer",
                        boxShadow: isFilled ? `0 4px 24px ${color}50, 0 0 40px ${color}20` : `0 4px 20px rgba(0,0,0,0.3)`,
                        transition: "all 0.3s ease",
                    }}>
                        <span style={{ fontSize, lineHeight: 1 }}>{icon}</span>
                        <span style={{ fontSize: labelSize, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: isFilled ? "white" : color, letterSpacing: "0.5px", textTransform: "uppercase", textAlign: "center", lineHeight: 1.1, maxWidth: "48px" }}>{label}</span>
                    </div>
                </motion.div>
            </Link>
        </motion.div>
    );
}

/* ─── Hover-expandable info button ─── */
function HoverInfoButton({
    icon, label, color, delay, position, items, expandDirection, className,
}: {
    icon: string; label: string; color: string; delay: number;
    position: { top?: string; bottom?: string; left?: string; right?: string };
    items: { icon: string; title: string; desc: string }[];
    expandDirection: "right" | "left";
    className?: string;
}) {
    const [hovered, setHovered] = useState(false);
    const size = useScreenSize();
    const btnSize = size === "xs" ? 54 : size === "sm" ? 60 : 68;
    const panelWidth = size === "xs" ? "min(260px, calc(100vw - 100px))" : size === "sm" ? "min(280px, calc(100vw - 100px))" : "300px";

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, duration: 0.6, type: "spring", stiffness: 120 }}
            style={{ position: "absolute", ...position, zIndex: 20 }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={className}
        >
            <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                {/* Circle button */}
                <motion.div
                    whileHover={{ scale: 1.08 }}
                    style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                    onClick={() => setHovered(!hovered)}
                >
                    <svg width={btnSize + 32} height={btnSize + 32} viewBox="0 0 110 110"
                        style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", pointerEvents: "none" }}
                        className="dashed-ring"
                    >
                        <circle cx="55" cy="55" r="50" fill="none" stroke={color} strokeWidth="2.5" strokeDasharray="8 6" strokeLinecap="round" opacity="0.7">
                            <animateTransform attributeName="transform" type="rotate" from="0 55 55" to="360 55 55" dur="12s" repeatCount="indefinite" />
                        </circle>
                    </svg>
                    <div style={{
                        width: `${btnSize}px`, height: `${btnSize}px`, borderRadius: "50%",
                        background: "rgba(18, 18, 42, 0.7)",
                        border: `1.5px solid ${color}40`,
                        backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3px",
                        boxShadow: `0 4px 20px rgba(0,0,0,0.3)`,
                        transition: "all 0.3s ease",
                    }}>
                        <span style={{ fontSize: size === "xs" ? "16px" : "20px", lineHeight: 1 }}>{icon}</span>
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
                                ...(expandDirection === "right" ? { left: `${btnSize + 16}px` } : { right: `${btnSize + 16}px` }),
                                width: panelWidth,
                                maxHeight: "70vh",
                                overflowY: "auto",
                                padding: size === "xs" ? "14px" : "20px",
                                borderRadius: "18px",
                                background: "rgba(12, 12, 32, 0.95)",
                                backdropFilter: "blur(20px)",
                                WebkitBackdropFilter: "blur(20px)",
                                border: `1px solid ${color}30`,
                                boxShadow: `0 8px 40px rgba(0,0,0,0.5), 0 0 30px ${color}10`,
                                zIndex: 100,
                            }}
                        >
                            <div style={{ fontSize: "11px", fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color, marginBottom: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>
                                {label}
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                {items.map((item) => (
                                    <div key={item.title} style={{ display: "flex", gap: "8px", alignItems: "flex-start", padding: "8px 10px", borderRadius: "10px", background: `${color}08`, border: `1px solid ${color}15` }}>
                                        <span style={{ fontSize: "14px", flexShrink: 0, marginTop: "1px" }}>{item.icon}</span>
                                        <div>
                                            <div style={{ fontSize: "11px", fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", color: "white", marginBottom: "2px" }}>{item.title}</div>
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
    const size = useScreenSize();

    useEffect(() => {
        // Also run on component mount in case module-level call was SSR-skipped
        preloadSplineScene()
    }, [])

    const fetchData = useCallback(async () => {
        supabase.rpc("track_visitor").then();
        supabase.from("projects").select("id", { count: "exact", head: true }).eq("status", "completed")
            .then(({ count }) => {
                if (count) setCompletedCount(count + 140);
            });
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    // Responsive positions
    const cornerOffset = size === "xs" ? "14px" : size === "sm" ? "20px" : "28px";
    const centerTopOffset = size === "xs" ? "14px" : size === "sm" ? "20px" : "28px";

    return (
        <section
            className="hero-section"
            style={{
                position: "relative",
                width: "100vw",
                height: "100dvh", // dvh for mobile browser chrome
                minHeight: "560px",
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
                    top: centerTopOffset,
                    left: cornerOffset,
                    zIndex: 10,
                }}
            >
                <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
                    <motion.div
                        whileHover={{ rotate: 5, scale: 1.05 }}
                        style={{
                            width: size === "xs" ? "40px" : "48px",
                            height: size === "xs" ? "40px" : "48px",
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
                        <img src="/favicon.ico" alt="TechpG" width={36} height={36} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    </motion.div>
                    {/* Hide text logo on xs to save space */}
                    {size !== "xs" && (
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <span style={{
                                fontSize: size === "sm" ? "16px" : "20px",
                                fontWeight: 800,
                                fontFamily: "'Space Grotesk', sans-serif",
                                color: "white",
                                letterSpacing: "1px",
                                lineHeight: 1
                            }}>
                                Tech<span style={{ color: "#8B83FF" }}>pG</span>
                            </span>
                            <span style={{ fontSize: "8px", color: "rgba(255,255,255,0.4)", letterSpacing: "2px", fontWeight: 600, textTransform: "uppercase", marginTop: "2px" }}>
                                Innovation Hub
                            </span>
                        </div>
                    )}
                </Link>
            </motion.div>

            {/* ═══ Top Center — Dashboard (Rectangle) — hide on xs ═══ */}
            {size !== "xs" && (
                <motion.div
                    initial={{ opacity: 0, y: -20, x: "-50%" }}
                    animate={{ opacity: 1, y: 0, x: "-50%" }}
                    transition={{ delay: 0.5, duration: 0.6, type: "spring", stiffness: 120 }}
                    className="hero-dashboard-btn"
                    style={{
                        position: "absolute",
                        top: centerTopOffset,
                        left: "50%",
                        zIndex: 10,
                        width: "auto",
                    }}
                >
                    <Link href="/dashboard" style={{ textDecoration: "none" }}>
                        <motion.div
                            whileHover={{ scale: 1.06, boxShadow: "0 0 30px rgba(255, 230, 109, 0.3)" }}
                            whileTap={{ scale: 0.95 }}
                            style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                            <svg width={size === "sm" ? "160" : "200"} height="70" viewBox="0 0 200 70" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", pointerEvents: "none" }}>
                                <rect x="4" y="4" width="192" height="62" rx="31" ry="31" fill="none" stroke="#FFE66D" strokeWidth="2.5" strokeDasharray="8 6" strokeLinecap="round" opacity="0.7">
                                    <animate attributeName="stroke-dashoffset" from="0" to="-56" dur="4s" repeatCount="indefinite" />
                                </rect>
                            </svg>
                            <div style={{
                                padding: size === "sm" ? "10px 24px" : "12px 36px",
                                borderRadius: "30px",
                                background: "rgba(18, 18, 42, 0.75)",
                                border: "1.5px solid rgba(255, 230, 109, 0.25)",
                                backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
                                display: "flex", alignItems: "center", gap: "10px", cursor: "pointer",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                                transition: "all 0.3s ease",
                                whiteSpace: "nowrap"
                            }}>
                                <span style={{ fontSize: size === "sm" ? "16px" : "20px", lineHeight: 1 }}>📋</span>
                                <span style={{ fontSize: size === "sm" ? "12px" : "14px", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: "#FFE66D", letterSpacing: "1px", textTransform: "uppercase" }}>Dashboard</span>
                            </div>
                        </motion.div>
                    </Link>
                </motion.div>
            )}

            {/* ═══ Top Right — Registration ═══ */}
            <CornerButton
                href="/register"
                icon="✍️"
                label="Register"
                gradient="linear-gradient(135deg, #00FF88 0%, #00D9FF 100%)"
                color="#00D9FF"
                delay={0.4}
                position={{ top: cornerOffset, right: cornerOffset }}
                className="hero-btn-top-right"
            />

            {/* ═══ Center Left — What We Offer (hover) ═══ */}
            <HoverInfoButton
                icon="🎁"
                label="What We Offer"
                color="#00FF88"
                delay={0.7}
                position={{ top: "50%", left: cornerOffset }}
                items={offerItems}
                expandDirection="right"
                className="hero-btn-center-left"
            />

            {/* ═══ Center Right — What We Accept (hover) ═══ */}
            <HoverInfoButton
                icon="📋"
                label="What We Accept"
                color="#FF6B6B"
                delay={0.8}
                position={{ top: "50%", right: cornerOffset }}
                items={acceptItems}
                expandDirection="left"
                className="hero-btn-center-right"
            />

            {/* ═══ Bottom Left — Team ═══ */}
            <CornerButton
                href="/team"
                icon="👥"
                label="Team"
                color="#00FF88"
                delay={0.6}
                position={{ bottom: cornerOffset, left: cornerOffset }}
                className="hero-btn-bottom-left"
            />

            {/* ═══ Bottom Right — Proof of Work ═══ */}
            <CornerButton
                href="/proof-of-work"
                icon="📊"
                label={completedCount ? `Done: ${completedCount}` : "Portfolio"}
                color="#00D9FF"
                delay={0.7}
                position={{ bottom: cornerOffset, right: cornerOffset }}
                className="hero-btn-bottom-right"
            />

            {/* Recently Delivered Projects removed per design update */}

            {/* Subtle Admin Access */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.1 }}
                whileHover={{ opacity: 0.6 }}
                style={{
                    position: "absolute",
                    bottom: "14px",
                    right: "20px",
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
