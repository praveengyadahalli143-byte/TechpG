"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

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
                padding: scrolled ? "12px 0" : "20px 0",
                background: scrolled
                    ? "rgba(10, 10, 26, 0.85)"
                    : "transparent",
                backdropFilter: scrolled ? "blur(20px)" : "none",
                borderBottom: scrolled
                    ? "1px solid rgba(108, 99, 255, 0.15)"
                    : "none",
                transition: "all 0.3s ease",
            }}
        >
            <div
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    padding: "0 24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                {/* Logo */}
                <Link href="/" style={{ textDecoration: "none" }}>
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
                            }}
                        >
                            T
                        </div>
                        <span
                            style={{
                                fontFamily: "'Space Grotesk', sans-serif",
                                fontWeight: 700,
                                fontSize: "20px",
                                color: "white",
                            }}
                        >
                            Tech<span style={{ color: "var(--primary)" }}>pG</span>
                        </span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                    }}
                    className="desktop-nav"
                >
                    <Link href="/register?type=mini" style={{ textDecoration: "none" }}>
                        <button className="glow-btn glow-btn-outline" style={{ fontSize: "13px", padding: "10px 20px" }}>
                            🔬 Mini Project
                        </button>
                    </Link>
                    <Link href="/register?type=major" style={{ textDecoration: "none" }}>
                        <button className="glow-btn glow-btn-primary" style={{ fontSize: "13px", padding: "10px 20px" }}>
                            🚀 Major Project
                        </button>
                    </Link>
                </div>

                {/* Mobile menu button */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="mobile-menu-btn"
                    style={{
                        display: "none",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "8px",
                    }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        {mobileOpen ? (
                            <path d="M18 6L6 18M6 6l12 12" />
                        ) : (
                            <path d="M3 12h18M3 6h18M3 18h18" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{
                            background: "rgba(10, 10, 26, 0.95)",
                            backdropFilter: "blur(20px)",
                            padding: "16px 24px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                        }}
                    >
                        <Link href="/register?type=mini" onClick={() => setMobileOpen(false)} style={{ textDecoration: "none" }}>
                            <button className="glow-btn glow-btn-outline" style={{ width: "100%", fontSize: "14px" }}>
                                🔬 Register Mini Project
                            </button>
                        </Link>
                        <Link href="/register?type=major" onClick={() => setMobileOpen(false)} style={{ textDecoration: "none" }}>
                            <button className="glow-btn glow-btn-primary" style={{ width: "100%", fontSize: "14px" }}>
                                🚀 Register Major Project
                            </button>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
        }
      `}</style>
        </motion.nav>
    );
}
