"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const navLinks = [
    { href: "/", label: "Home", emoji: "🏠" },
    { href: "/register", label: "Register", emoji: "✍️" },
    { href: "/proof-of-work", label: "Proof of Work", emoji: "📊" },
    { href: "/team", label: "Team", emoji: "👥" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Close mobile menu on outside click
    useEffect(() => {
        if (!mobileOpen) return;
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest("nav")) setMobileOpen(false);
        };
        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, [mobileOpen]);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                zIndex: 100,
                background: scrolled
                    ? "rgba(10, 10, 26, 0.92)"
                    : "transparent",
                backdropFilter: scrolled ? "blur(20px)" : "none",
                WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
                borderBottom: scrolled
                    ? "1px solid rgba(108, 99, 255, 0.15)"
                    : "none",
                transition: "all 0.3s ease",
            }}
        >
            {/* Main Bar */}
            <div
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    padding: scrolled ? "10px 20px" : "18px 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "padding 0.3s ease",
                }}
            >
                {/* Logo */}
                <Link href="/" style={{ textDecoration: "none", zIndex: 2, flexShrink: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div
                            style={{
                                width: "38px",
                                height: "38px",
                                borderRadius: "10px",
                                background: "var(--gradient-1)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontFamily: "'Space Grotesk', sans-serif",
                                fontWeight: 800,
                                fontSize: "18px",
                                color: "white",
                                flexShrink: 0,
                            }}
                        >
                            T
                        </div>
                        <span
                            style={{
                                fontFamily: "'Space Grotesk', sans-serif",
                                fontWeight: 700,
                                fontSize: "clamp(16px, 3vw, 20px)",
                                color: "white",
                            }}
                        >
                            Tech<span style={{ color: "var(--primary)" }}>pG</span>
                        </span>
                    </div>
                </Link>

                {/* Desktop Nav Links */}
                <div className="desktop-nav" style={{ alignItems: "center", gap: "6px" }}>
                    {navLinks.slice(1).map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            style={{ textDecoration: "none" }}
                        >
                            <motion.button
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                style={{
                                    padding: "9px 18px",
                                    borderRadius: "10px",
                                    border: "1px solid rgba(108, 99, 255, 0.2)",
                                    background: "rgba(108, 99, 255, 0.06)",
                                    color: "rgba(255,255,255,0.85)",
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    fontWeight: 500,
                                    fontSize: "13px",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                    minHeight: "44px",
                                }}
                            >
                                {link.label}
                            </motion.button>
                        </Link>
                    ))}
                    <Link href="/register?type=mini" style={{ textDecoration: "none" }}>
                        <button className="glow-btn glow-btn-outline" style={{ fontSize: "13px", padding: "10px 18px" }}>
                            🔬 Mini Project
                        </button>
                    </Link>
                    <Link href="/register?type=major" style={{ textDecoration: "none" }}>
                        <button className="glow-btn glow-btn-primary" style={{ fontSize: "13px", padding: "10px 18px" }}>
                            🚀 Major Project
                        </button>
                    </Link>
                </div>

                {/* Mobile Hamburger */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="mobile-menu-btn"
                    aria-label="Toggle menu"
                    aria-expanded={mobileOpen}
                    style={{
                        background: mobileOpen ? "rgba(108, 99, 255, 0.15)" : "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(108, 99, 255, 0.3)",
                        borderRadius: "10px",
                        cursor: "pointer",
                        padding: "10px",
                        zIndex: 2,
                        minHeight: "44px",
                        minWidth: "44px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s ease",
                    }}
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={mobileOpen ? "#8B83FF" : "white"}
                        strokeWidth="2"
                        strokeLinecap="round"
                    >
                        {mobileOpen ? (
                            <path d="M18 6L6 18M6 6l12 12" />
                        ) : (
                            <path d="M3 12h18M3 6h18M3 18h18" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Dropdown Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        style={{
                            background: "rgba(10, 10, 26, 0.97)",
                            backdropFilter: "blur(24px)",
                            WebkitBackdropFilter: "blur(24px)",
                            borderTop: "1px solid rgba(108, 99, 255, 0.15)",
                            overflow: "hidden",
                        }}
                    >
                        <div
                            style={{
                                padding: "16px 20px 20px",
                                display: "flex",
                                flexDirection: "column",
                                gap: "10px",
                                maxWidth: "1200px",
                                margin: "0 auto",
                            }}
                        >
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    style={{ textDecoration: "none" }}
                                >
                                    <motion.div
                                        whileTap={{ scale: 0.98 }}
                                        style={{
                                            padding: "14px 18px",
                                            borderRadius: "12px",
                                            border: "1px solid rgba(108, 99, 255, 0.15)",
                                            background: "rgba(108, 99, 255, 0.06)",
                                            color: "rgba(255,255,255,0.9)",
                                            fontFamily: "'Space Grotesk', sans-serif",
                                            fontWeight: 500,
                                            fontSize: "15px",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "12px",
                                            minHeight: "52px",
                                        }}
                                    >
                                        <span style={{ fontSize: "18px" }}>{link.emoji}</span>
                                        {link.label}
                                    </motion.div>
                                </Link>
                            ))}
                            <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                                <Link
                                    href="/register?type=mini"
                                    onClick={() => setMobileOpen(false)}
                                    style={{ textDecoration: "none", flex: 1 }}
                                >
                                    <button
                                        className="glow-btn glow-btn-outline"
                                        style={{ width: "100%", fontSize: "14px" }}
                                    >
                                        🔬 Mini
                                    </button>
                                </Link>
                                <Link
                                    href="/register?type=major"
                                    onClick={() => setMobileOpen(false)}
                                    style={{ textDecoration: "none", flex: 1 }}
                                >
                                    <button
                                        className="glow-btn glow-btn-primary"
                                        style={{ width: "100%", fontSize: "14px" }}
                                    >
                                        🚀 Major
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
