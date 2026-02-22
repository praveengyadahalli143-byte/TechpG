"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════
   Feature Tour Data
══════════════════════════════════════════════════════════ */
const features = [
    {
        id: "welcome",
        emoji: "🚀",
        label: "Welcome",
        title: "Welcome to TechpG",
        subtitle: "Your AI-powered project registration portal",
        color: "#6C63FF",
        gradient: "linear-gradient(135deg, #6C63FF 0%, #00D9FF 100%)",
        description:
            "TechpG connects students with expert developers to build and deliver real-world mini & major projects — with full reports, code walkthroughs, and weekly task updates.",
        preview: <WelcomePreview />,
        cta: null,
    },
    {
        id: "register",
        emoji: "✍️",
        label: "Registration",
        title: "Chat-Based Registration",
        subtitle: "Register in minutes via AI chat",
        color: "#00D9FF",
        gradient: "linear-gradient(135deg, #00D9FF 0%, #6C63FF 100%)",
        description:
            "Our friendly bot guides you step-by-step: enter your details, pick Mini or Major project, share your idea (or let us suggest one), and submit — all in a conversational chat interface.",
        preview: <RegisterPreview />,
        cta: { label: "Start Registration →", href: "/register" },
    },
    {
        id: "dashboard",
        emoji: "📋",
        label: "Dashboard",
        title: "Your Project Dashboard",
        subtitle: "Track progress in real-time",
        color: "#FFE66D",
        gradient: "linear-gradient(135deg, #F97316 0%, #FFE66D 100%)",
        description:
            "After registering, log in to your personal dashboard. See your project status (Pending → Approved → In Progress → Completed), download reports, and message the team.",
        preview: <DashboardPreview />,
        cta: { label: "View Dashboard →", href: "/dashboard" },
    },
    {
        id: "proof",
        emoji: "📊",
        label: "Portfolio",
        title: "Proof of Work",
        subtitle: "Real projects, real impact",
        color: "#00FF88",
        gradient: "linear-gradient(135deg, #00FF88 0%, #00D9FF 100%)",
        description:
            "Browse our portfolio of completed major projects (live demos, videos) and 20+ mini-project Colab notebooks — proof of what we deliver before you register.",
        preview: <ProofPreview />,
        cta: { label: "See Portfolio →", href: "/proof-of-work" },
    },
    {
        id: "team",
        emoji: "👥",
        label: "Team",
        title: "Meet the Team",
        subtitle: "Passionate developers, your success",
        color: "#EC4899",
        gradient: "linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)",
        description:
            "Praveen G Y (Creator & Lead), Suraja Goudar (Frontend), and Manoj M (Backend) — a tight-knit team with a shared mission to make your project shine.",
        preview: <TeamPreview />,
        cta: { label: "Meet the Team →", href: "/team" },
    },
    {
        id: "process",
        emoji: "⚡",
        label: "Process",
        title: "How the Process Works",
        subtitle: "Simple 5-step journey",
        color: "#F97316",
        gradient: "linear-gradient(135deg, #F97316 0%, #EF4444 100%)",
        description:
            "From registration to delivery — here's exactly what happens after you submit your project request.",
        preview: <ProcessPreview />,
        cta: { label: "Register Now →", href: "/register" },
    },
];

/* ═══════════════════════════════════════════════════════
   Inline Preview Components
══════════════════════════════════════════════════════════ */

function WelcomePreview() {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
            {[
                { icon: "💻", title: "Mini Projects", desc: "Quick, focused 1-2 week builds" },
                { icon: "🏗️", title: "Major Projects", desc: "Full-stack apps with LaTeX reports" },
                { icon: "📄", title: "LaTeX Reports", desc: "Publication-ready documentation" },
                { icon: "🔄", title: "End-to-End Support", desc: "Ideation → Deployment" },
            ].map((item, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.12 }}
                    style={{
                        display: "flex", alignItems: "center", gap: "14px",
                        padding: "14px 18px",
                        borderRadius: "12px",
                        background: "rgba(108,99,255,0.08)",
                        border: "1px solid rgba(108,99,255,0.2)",
                    }}
                >
                    <span style={{ fontSize: "22px", flexShrink: 0 }}>{item.icon}</span>
                    <div>
                        <div style={{ fontSize: "13px", fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", color: "white", marginBottom: "2px" }}>{item.title}</div>
                        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>{item.desc}</div>
                    </div>
                    <div style={{ marginLeft: "auto", width: "8px", height: "8px", borderRadius: "50%", background: "#00FF88", flexShrink: 0 }} />
                </motion.div>
            ))}
        </div>
    );
}

function RegisterPreview() {
    const messages = [
        { from: "bot", text: "👋 Hey! I'm TechBot. What's your full name?", delay: 0 },
        { from: "user", text: "Praveen G Y", delay: 0.3 },
        { from: "bot", text: "Great, Praveen! What's your college email?", delay: 0.6 },
        { from: "user", text: "praveen@college.edu", delay: 0.9 },
        { from: "bot", text: "Which project type? Mini or Major?", delay: 1.2 },
        { from: "user", text: "Major 🚀", delay: 1.5 },
        { from: "bot", text: "✅ Almost done! Tell me your project idea.", delay: 1.8 },
    ];
    return (
        <div style={{
            background: "rgba(10,10,26,0.8)",
            borderRadius: "16px",
            border: "1px solid rgba(0,217,255,0.2)",
            overflow: "hidden",
            width: "100%",
        }}>
            {/* Chat header */}
            <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#00FF88" }} />
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", fontFamily: "'Space Grotesk', sans-serif" }}>TechBot — Online</span>
            </div>
            {/* Messages */}
            <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: "10px", maxHeight: "260px", overflowY: "auto" }}>
                {messages.map((msg, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: msg.delay }}
                        style={{
                            display: "flex",
                            justifyContent: msg.from === "user" ? "flex-end" : "flex-start",
                        }}
                    >
                        <div style={{
                            maxWidth: "78%",
                            padding: "10px 14px",
                            borderRadius: msg.from === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                            background: msg.from === "user" ? "linear-gradient(135deg, #6C63FF, #00D9FF)" : "rgba(22,22,58,0.9)",
                            border: msg.from === "user" ? "none" : "1px solid rgba(255,255,255,0.08)",
                            fontSize: "12px",
                            lineHeight: 1.5,
                            color: "white",
                        }}>
                            {msg.text}
                        </div>
                    </motion.div>
                ))}
                {/* Typing indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.2 }}
                    style={{ display: "flex", gap: "4px", padding: "4px 0" }}
                >
                    {[0, 0.2, 0.4].map((d, i) => (
                        <motion.div
                            key={i}
                            animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                            transition={{ repeat: Infinity, duration: 1, delay: d }}
                            style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#6C63FF" }}
                        />
                    ))}
                </motion.div>
            </div>
        </div>
    );
}

function DashboardPreview() {
    const statItems = [
        { label: "Status", value: "In Progress", color: "#00D9FF", icon: "⚡" },
        { label: "Progress", value: "72%", color: "#00FF88", icon: "📈" },
        { label: "Days Left", value: "8", color: "#FFE66D", icon: "⏳" },
        { label: "Reports", value: "2 Ready", color: "#6C63FF", icon: "📄" },
    ];
    return (
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "12px" }}>
            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {statItems.map((s, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        style={{
                            padding: "14px",
                            borderRadius: "12px",
                            background: "rgba(18,18,42,0.8)",
                            border: `1px solid ${s.color}25`,
                            textAlign: "center",
                        }}
                    >
                        <span style={{ fontSize: "18px" }}>{s.icon}</span>
                        <div style={{ fontSize: "16px", fontWeight: 700, color: s.color, fontFamily: "'Space Grotesk', sans-serif", margin: "4px 0" }}>{s.value}</div>
                        <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>{s.label}</div>
                    </motion.div>
                ))}
            </div>
            {/* Progress bar */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{ padding: "14px 16px", borderRadius: "12px", background: "rgba(18,18,42,0.8)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)", fontFamily: "'Space Grotesk', sans-serif" }}>Project: AI-Powered Chatbot</span>
                    <span style={{ fontSize: "11px", color: "#00FF88" }}>72%</span>
                </div>
                <div style={{ height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "3px", overflow: "hidden" }}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "72%" }}
                        transition={{ delay: 0.7, duration: 1, ease: "easeOut" }}
                        style={{ height: "100%", background: "linear-gradient(90deg, #6C63FF, #00FF88)", borderRadius: "3px" }}
                    />
                </div>
            </motion.div>
        </div>
    );
}

function ProofPreview() {
    const projects = [
        { name: "MittUp", badge: "Major", color: "#3B82F6", icon: "🤝", tech: "Next.js + Supabase" },
        { name: "Talent Flow", badge: "Major", color: "#10B981", icon: "💼", tech: "AI + Supabase" },
        { name: "EngiPath", badge: "Major", color: "#6C63FF", icon: "🧭", tech: "AI/ML + Full-Stack" },
    ];
    const mini = ["📊 Data Viz", "🤖 ML Class.", "🧠 Neural Net", "💬 NLP", "📈 Regression"];
    return (
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
            {projects.map((p, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.12 }}
                    style={{
                        display: "flex", alignItems: "center", gap: "12px",
                        padding: "12px 16px",
                        borderRadius: "12px",
                        background: "rgba(18,18,42,0.8)",
                        border: `1px solid ${p.color}20`,
                    }}
                >
                    <span style={{ fontSize: "22px" }}>{p.icon}</span>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "13px", fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", color: "white" }}>{p.name}</div>
                        <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>{p.tech}</div>
                    </div>
                    <span style={{ fontSize: "10px", padding: "3px 9px", borderRadius: "6px", background: `${p.color}20`, color: p.color, fontWeight: 600 }}>{p.badge}</span>
                </motion.div>
            ))}
            {/* Mini chips */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{ display: "flex", flexWrap: "wrap", gap: "6px", paddingTop: "4px" }}
            >
                {mini.map((m, i) => (
                    <span key={i} style={{ fontSize: "10px", padding: "4px 10px", borderRadius: "8px", background: "rgba(0,255,136,0.08)", color: "#00FF88", border: "1px solid rgba(0,255,136,0.15)" }}>
                        {m}
                    </span>
                ))}
                <span style={{ fontSize: "10px", padding: "4px 10px", borderRadius: "8px", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)" }}>+17 more</span>
            </motion.div>
        </div>
    );
}

function TeamPreview() {
    const members = [
        { avatar: "PG", name: "Praveen G Y", role: "Creator & Lead Dev", color: "#6C63FF", badge: "⭐ Creator" },
        { avatar: "SG", name: "Suraja Goudar", role: "Frontend Developer", color: "#00D9FF", badge: "" },
        { avatar: "MM", name: "Manoj M", role: "Backend Developer", color: "#00FF88", badge: "" },
    ];
    return (
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
            {members.map((m, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.14 }}
                    style={{
                        display: "flex", alignItems: "center", gap: "14px",
                        padding: "14px 16px",
                        borderRadius: "14px",
                        background: "rgba(18,18,42,0.8)",
                        border: `1px solid ${m.color}20`,
                    }}
                >
                    <div style={{
                        width: "44px", height: "44px", borderRadius: "50%",
                        background: `linear-gradient(135deg, ${m.color}40, ${m.color})`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "14px", fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif",
                        color: "white", border: `2px solid ${m.color}`,
                        flexShrink: 0,
                    }}>
                        {m.avatar}
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "13px", fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", color: "white", display: "flex", alignItems: "center", gap: "6px" }}>
                            {m.name}
                            {m.badge && <span style={{ fontSize: "9px", padding: "2px 7px", borderRadius: "4px", background: `${m.color}20`, color: m.color }}>{m.badge}</span>}
                        </div>
                        <div style={{ fontSize: "11px", color: m.color, marginTop: "2px" }}>{m.role}</div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

function ProcessPreview() {
    const steps = [
        { num: "01", icon: "✍️", title: "Register via Chat", desc: "Fill out our chat-based form in ~3 min", color: "#6C63FF" },
        { num: "02", icon: "⏳", title: "Admin Reviews", desc: "We review & approve within 24 hours", color: "#00D9FF" },
        { num: "03", icon: "💬", title: "Confirmation Email", desc: "Receive pricing & project details", color: "#FFE66D" },
        { num: "04", icon: "⚡", title: "Development Begins", desc: "Weekly updates to your dashboard", color: "#00FF88" },
        { num: "05", icon: "🎓", title: "Delivery & Walkthrough", desc: "Code + report + full explanation", color: "#EC4899" },
    ];
    return (
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
            {steps.map((s, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    style={{ display: "flex", alignItems: "center", gap: "12px", position: "relative" }}
                >
                    {/* Vertical connector */}
                    {i < steps.length - 1 && (
                        <div style={{ position: "absolute", left: "20px", top: "42px", width: "2px", height: "20px", background: `linear-gradient(to bottom, ${s.color}60, transparent)` }} />
                    )}
                    <div style={{
                        width: "40px", height: "40px", borderRadius: "12px",
                        background: `${s.color}15`,
                        border: `1px solid ${s.color}30`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "18px", flexShrink: 0,
                    }}>
                        {s.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "9px", fontWeight: 700, color: s.color, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "0.5px" }}>STEP {s.num}</span>
                        </div>
                        <div style={{ fontSize: "12px", fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", color: "white" }}>{s.title}</div>
                        <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.45)", marginTop: "1px" }}>{s.desc}</div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════
   Main HowItWorks Component
══════════════════════════════════════════════════════════ */
export default function HowItWorks() {
    const [isOpen, setIsOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [autoProgress, setAutoProgress] = useState(true);

    /* Auto-progress between features while tour is open */
    useEffect(() => {
        if (!isOpen || !autoProgress) return;
        const timer = setTimeout(() => {
            setActiveIndex((prev) => {
                if (prev < features.length - 1) return prev + 1;
                setAutoProgress(false);
                return prev;
            });
        }, 5000);
        return () => clearTimeout(timer);
    }, [isOpen, activeIndex, autoProgress]);

    /* Show toast invite on first visit (after 2s) */
    useEffect(() => {
        const seen = localStorage.getItem("techpg_tour_seen");
        if (!seen) {
            const timer = setTimeout(() => setShowToast(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const startTour = useCallback(() => {
        setShowToast(false);
        setActiveIndex(0);
        setAutoProgress(true);
        setIsOpen(true);
        localStorage.setItem("techpg_tour_seen", "1");
    }, []);

    const dismissToast = useCallback(() => {
        setShowToast(false);
        localStorage.setItem("techpg_tour_seen", "1");
    }, []);

    const handleTabClick = useCallback((i: number) => {
        setActiveIndex(i);
        setAutoProgress(false);
    }, []);

    const handleNext = useCallback(() => {
        if (activeIndex < features.length - 1) {
            setActiveIndex(activeIndex + 1);
            setAutoProgress(false);
        } else {
            setIsOpen(false);
        }
    }, [activeIndex]);

    const handlePrev = useCallback(() => {
        if (activeIndex > 0) {
            setActiveIndex(activeIndex - 1);
            setAutoProgress(false);
        }
    }, [activeIndex]);

    const feature = features[activeIndex];

    return (
        <>
            {/* ── Toast Invite (first-visit only, bottom-right) ── */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        key="tour-toast"
                        initial={{ opacity: 0, y: 32, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 320, damping: 28 }}
                        style={{
                            position: "fixed",
                            bottom: "clamp(20px, 4vw, 36px)",
                            right: "clamp(16px, 4vw, 36px)",
                            zIndex: 8000,
                            background: "rgba(14,14,32,0.97)",
                            border: "1px solid rgba(108,99,255,0.35)",
                            borderRadius: "20px",
                            padding: "20px 22px",
                            maxWidth: "clamp(280px, 90vw, 340px)",
                            boxShadow: "0 16px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(108,99,255,0.1), 0 0 40px rgba(108,99,255,0.12)",
                            backdropFilter: "blur(20px)",
                            WebkitBackdropFilter: "blur(20px)",
                        }}
                    >
                        {/* Glowing accent line at top */}
                        <div style={{
                            position: "absolute", top: 0, left: "20%", right: "20%", height: "2px",
                            background: "linear-gradient(90deg, transparent, #6C63FF, #00D9FF, transparent)",
                            borderRadius: "0 0 4px 4px",
                        }} />

                        {/* Avatar + message */}
                        <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", marginBottom: "16px" }}>
                            <motion.div
                                animate={{ rotate: [0, -8, 8, 0] }}
                                transition={{ repeat: Infinity, duration: 2.5, repeatDelay: 1 }}
                                style={{
                                    width: "44px", height: "44px", borderRadius: "14px", flexShrink: 0,
                                    background: "linear-gradient(135deg, rgba(108,99,255,0.15), rgba(108,99,255,0.3))",
                                    border: "1px solid rgba(108,99,255,0.3)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: "22px",
                                }}
                            >
                                👋
                            </motion.div>
                            <div>
                                <div style={{
                                    fontSize: "14px", fontWeight: 700,
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    color: "white", marginBottom: "5px", lineHeight: 1.3,
                                }}>
                                    New here? Take a quick tour!
                                </div>
                                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", lineHeight: 1.55 }}>
                                    See how registration, your dashboard, our portfolio &amp; team work — in 30 sec.
                                </div>
                            </div>
                        </div>

                        {/* Feature preview chips */}
                        <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginBottom: "16px" }}>
                            {features.map((f) => (
                                <span key={f.id} style={{
                                    fontSize: "10px", padding: "3px 9px", borderRadius: "8px",
                                    background: `${f.color}12`,
                                    border: `1px solid ${f.color}25`,
                                    color: f.color, fontWeight: 600,
                                    fontFamily: "'Space Grotesk', sans-serif",
                                }}>
                                    {f.emoji} {f.label}
                                </span>
                            ))}
                        </div>

                        {/* CTA buttons */}
                        <div style={{ display: "flex", gap: "8px" }}>
                            <motion.button
                                onClick={startTour}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                style={{
                                    flex: 1, padding: "11px 16px",
                                    borderRadius: "12px", border: "none",
                                    background: "linear-gradient(135deg, #6C63FF, #00D9FF)",
                                    color: "white",
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    fontWeight: 700, fontSize: "13px",
                                    cursor: "pointer", minHeight: "44px",
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                                    boxShadow: "0 4px 20px rgba(108,99,255,0.35)",
                                }}
                            >
                                ✨ Yes, show me!
                            </motion.button>
                            <button
                                onClick={dismissToast}
                                style={{
                                    padding: "11px 14px",
                                    borderRadius: "12px",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    background: "rgba(255,255,255,0.04)",
                                    color: "rgba(255,255,255,0.4)",
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    fontWeight: 500, fontSize: "12px",
                                    cursor: "pointer", minHeight: "44px",
                                    whiteSpace: "nowrap",
                                    transition: "all 0.2s",
                                }}
                            >
                                Maybe later
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Full-screen Tour Modal ── */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="tour-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
                        style={{
                            position: "fixed",
                            inset: 0,
                            zIndex: 9999,
                            background: "rgba(5,5,15,0.88)",
                            backdropFilter: "blur(12px)",
                            WebkitBackdropFilter: "blur(12px)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "clamp(12px, 3vw, 24px)",
                            overflowY: "auto",
                        }}
                    >
                        <motion.div
                            key="tour-panel"
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            transition={{ type: "spring", stiffness: 260, damping: 30 }}
                            style={{
                                width: "100%",
                                maxWidth: "780px",
                                maxHeight: "90vh",
                                background: "rgba(14,14,32,0.98)",
                                border: `1px solid ${feature.color}30`,
                                borderRadius: "clamp(18px, 3vw, 28px)",
                                overflow: "hidden",
                                boxShadow: `0 32px 80px rgba(0,0,0,0.6), 0 0 60px ${feature.color}15`,
                                display: "flex",
                                flexDirection: "column",
                                transition: "border-color 0.4s ease, box-shadow 0.4s ease",
                            }}
                        >
                            {/* ── Progress bar ── */}
                            <div style={{ height: "3px", background: "rgba(255,255,255,0.06)", position: "relative", flexShrink: 0 }}>
                                <motion.div
                                    layoutId={undefined}
                                    animate={{ width: `${((activeIndex + 1) / features.length) * 100}%` }}
                                    transition={{ duration: 0.4, ease: "easeInOut" }}
                                    style={{ position: "absolute", top: 0, left: 0, height: "100%", background: feature.gradient, borderRadius: "2px" }}
                                />
                                {/* Auto-countdown bar (only when auto-progressing) */}
                                {autoProgress && activeIndex < features.length - 1 && (
                                    <motion.div
                                        key={`auto-${activeIndex}`}
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 5, ease: "linear" }}
                                        style={{
                                            position: "absolute", top: 0, left: 0,
                                            height: "100%",
                                            background: `${feature.color}50`,
                                            borderRadius: "2px",
                                            transformOrigin: "left",
                                        }}
                                    />
                                )}
                            </div>

                            {/* ── Header ── */}
                            <div style={{
                                padding: "clamp(14px, 2.5vw, 20px) clamp(16px, 3vw, 28px)",
                                borderBottom: "1px solid rgba(255,255,255,0.05)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                flexShrink: 0,
                                flexWrap: "wrap",
                                gap: "10px",
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <div style={{
                                        width: "36px", height: "36px", borderRadius: "10px",
                                        background: `${feature.color}18`,
                                        border: `1px solid ${feature.color}30`,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: "18px", flexShrink: 0,
                                    }}>
                                        {feature.emoji}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: "clamp(11px, 1.6vw, 12px)", color: feature.color, fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", textTransform: "uppercase", letterSpacing: "0.8px" }}>
                                            Feature Tour • {activeIndex + 1} / {features.length}
                                        </div>
                                        <div style={{ fontSize: "clamp(13px, 2vw, 15px)", fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: "white" }}>{feature.title}</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    aria-label="Close tour"
                                    style={{
                                        width: "36px", height: "36px", borderRadius: "10px",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        background: "rgba(255,255,255,0.05)",
                                        color: "rgba(255,255,255,0.6)",
                                        cursor: "pointer", fontSize: "18px",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        flexShrink: 0,
                                    }}
                                >
                                    ×
                                </button>
                            </div>

                            {/* ── Tab Pills ── */}
                            <div style={{
                                padding: "10px clamp(16px, 3vw, 28px)",
                                display: "flex",
                                gap: "6px",
                                overflowX: "auto",
                                flexShrink: 0,
                                borderBottom: "1px solid rgba(255,255,255,0.05)",
                                scrollbarWidth: "none",
                            }}>
                                {features.map((f, i) => (
                                    <button
                                        key={f.id}
                                        onClick={() => handleTabClick(i)}
                                        style={{
                                            padding: "7px 14px",
                                            borderRadius: "20px",
                                            border: `1px solid ${i === activeIndex ? f.color + "50" : "rgba(255,255,255,0.07)"}`,
                                            background: i === activeIndex ? `${f.color}18` : "transparent",
                                            color: i === activeIndex ? f.color : "rgba(255,255,255,0.4)",
                                            fontFamily: "'Space Grotesk', sans-serif",
                                            fontWeight: 600,
                                            fontSize: "11px",
                                            cursor: "pointer",
                                            whiteSpace: "nowrap",
                                            transition: "all 0.25s ease",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "5px",
                                        }}
                                    >
                                        <span>{f.emoji}</span>
                                        <span>{f.label}</span>
                                    </button>
                                ))}
                            </div>

                            {/* ── Content ── */}
                            <div style={{ flex: 1, overflowY: "auto", padding: "clamp(16px, 3vw, 28px)" }}>
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={feature.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                        style={{ display: "flex", flexDirection: "column", gap: "clamp(16px, 3vw, 24px)" }}
                                    >
                                        {/* Description */}
                                        <div style={{
                                            padding: "clamp(14px, 2.5vw, 20px)",
                                            borderRadius: "14px",
                                            background: `${feature.color}08`,
                                            border: `1px solid ${feature.color}18`,
                                        }}>
                                            <h3 style={{
                                                fontSize: "clamp(1rem, 2.5vw, 1.15rem)",
                                                fontWeight: 700,
                                                fontFamily: "'Space Grotesk', sans-serif",
                                                color: "white",
                                                marginBottom: "8px",
                                                lineHeight: 1.4,
                                            }}>
                                                {feature.title}
                                            </h3>
                                            <p style={{
                                                fontSize: "clamp(13px, 1.8vw, 14px)",
                                                color: "rgba(255,255,255,0.7)",
                                                lineHeight: 1.7,
                                            }}>
                                                {feature.description}
                                            </p>
                                        </div>

                                        {/* Live Preview */}
                                        <div>
                                            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>
                                                ▸ Live Preview
                                            </div>
                                            {feature.preview}
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* ── Footer ── */}
                            <div style={{
                                padding: "clamp(12px, 2vw, 18px) clamp(16px, 3vw, 28px)",
                                borderTop: "1px solid rgba(255,255,255,0.05)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                flexShrink: 0,
                                gap: "10px",
                                flexWrap: "wrap",
                            }}>
                                {/* Step dots */}
                                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                                    {features.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleTabClick(i)}
                                            style={{
                                                width: i === activeIndex ? "20px" : "6px",
                                                height: "6px",
                                                borderRadius: "3px",
                                                background: i === activeIndex ? feature.color : "rgba(255,255,255,0.15)",
                                                border: "none",
                                                cursor: "pointer",
                                                transition: "all 0.3s ease",
                                                padding: 0,
                                            }}
                                        />
                                    ))}
                                </div>

                                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                    {/* CTA to actual page */}
                                    {feature.cta && (
                                        <Link href={feature.cta.href} onClick={() => setIsOpen(false)} style={{ textDecoration: "none" }}>
                                            <motion.button
                                                whileHover={{ scale: 1.04 }}
                                                whileTap={{ scale: 0.97 }}
                                                style={{
                                                    padding: "10px 20px",
                                                    borderRadius: "10px",
                                                    border: "none",
                                                    background: feature.gradient,
                                                    color: "white",
                                                    fontFamily: "'Space Grotesk', sans-serif",
                                                    fontWeight: 600,
                                                    fontSize: "clamp(12px, 1.8vw, 13px)",
                                                    cursor: "pointer",
                                                    minHeight: "44px",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                {feature.cta.label}
                                            </motion.button>
                                        </Link>
                                    )}
                                    {/* Prev */}
                                    <button
                                        onClick={handlePrev}
                                        disabled={activeIndex === 0}
                                        style={{
                                            padding: "10px 18px",
                                            borderRadius: "10px",
                                            border: "1px solid rgba(255,255,255,0.1)",
                                            background: "rgba(255,255,255,0.04)",
                                            color: activeIndex === 0 ? "rgba(255,255,255,0.2)" : "white",
                                            fontFamily: "'Space Grotesk', sans-serif",
                                            fontWeight: 500,
                                            fontSize: "13px",
                                            cursor: activeIndex === 0 ? "default" : "pointer",
                                            minHeight: "44px",
                                            transition: "all 0.2s",
                                        }}
                                    >
                                        ← Prev
                                    </button>
                                    {/* Next / Done */}
                                    <motion.button
                                        onClick={handleNext}
                                        whileHover={{ scale: 1.04 }}
                                        whileTap={{ scale: 0.97 }}
                                        style={{
                                            padding: "10px 22px",
                                            borderRadius: "10px",
                                            border: "none",
                                            background: feature.gradient,
                                            color: "white",
                                            fontFamily: "'Space Grotesk', sans-serif",
                                            fontWeight: 600,
                                            fontSize: "13px",
                                            cursor: "pointer",
                                            minHeight: "44px",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {activeIndex === features.length - 1 ? "🎉 Get Started" : "Next →"}
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
