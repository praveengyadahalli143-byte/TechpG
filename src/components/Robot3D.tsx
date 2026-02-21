"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function Robot3D() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
            setMousePos({ x: x * 15, y: y * -15 });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div ref={containerRef} className="robot-container">
            <div className="robot-glow" />
            <motion.div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    perspective: "1000px",
                }}
                animate={{
                    rotateY: mousePos.x,
                    rotateX: mousePos.y,
                }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
                <svg
                    viewBox="0 0 400 400"
                    width="100%"
                    height="100%"
                    style={{ filter: "drop-shadow(0 0 40px rgba(108, 99, 255, 0.5))" }}
                >
                    {/* Robot Head */}
                    <defs>
                        <linearGradient id="headGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#6C63FF" />
                            <stop offset="100%" stopColor="#00D9FF" />
                        </linearGradient>
                        <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#1A1A3A" />
                            <stop offset="100%" stopColor="#2A2A5A" />
                        </linearGradient>
                        <linearGradient id="eyeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#00FF88" />
                            <stop offset="100%" stopColor="#00D9FF" />
                        </linearGradient>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Antenna */}
                    <motion.g
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <line x1="200" y1="75" x2="200" y2="55" stroke="#6C63FF" strokeWidth="3" />
                        <circle cx="200" cy="50" r="6" fill="#00D9FF" filter="url(#glow)">
                            <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
                        </circle>
                    </motion.g>

                    {/* Head */}
                    <motion.g
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <rect x="140" y="75" width="120" height="95" rx="20" fill="url(#bodyGrad)" stroke="url(#headGrad)" strokeWidth="2" />

                        {/* Eyes */}
                        <motion.ellipse
                            cx="170"
                            cy="115"
                            rx="14"
                            ry="14"
                            fill="url(#eyeGrad)"
                            filter="url(#glow)"
                            animate={{ scaleY: [1, 0.1, 1] }}
                            transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
                        />
                        <motion.ellipse
                            cx="230"
                            cy="115"
                            rx="14"
                            ry="14"
                            fill="url(#eyeGrad)"
                            filter="url(#glow)"
                            animate={{ scaleY: [1, 0.1, 1] }}
                            transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
                        />

                        {/* Eye pupils */}
                        <motion.circle
                            cx="170"
                            cy="115"
                            r="5"
                            fill="#0A0A1A"
                            animate={{ cx: [170, 173, 170] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        />
                        <motion.circle
                            cx="230"
                            cy="115"
                            r="5"
                            fill="#0A0A1A"
                            animate={{ cx: [230, 233, 230] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        />

                        {/* Mouth */}
                        <motion.path
                            d="M 175 145 Q 200 160 225 145"
                            fill="none"
                            stroke="#00D9FF"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            filter="url(#glow)"
                            animate={{ d: ["M 175 145 Q 200 160 225 145", "M 175 148 Q 200 155 225 148", "M 175 145 Q 200 160 225 145"] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </motion.g>

                    {/* Neck */}
                    <rect x="185" y="170" width="30" height="15" fill="url(#bodyGrad)" stroke="#6C63FF" strokeWidth="1" />

                    {/* Body */}
                    <motion.g
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                    >
                        <rect x="130" y="185" width="140" height="110" rx="15" fill="url(#bodyGrad)" stroke="url(#headGrad)" strokeWidth="2" />

                        {/* Chest light */}
                        <circle cx="200" cy="230" r="18" fill="none" stroke="#6C63FF" strokeWidth="2" opacity="0.6" />
                        <circle cx="200" cy="230" r="10" fill="#6C63FF" opacity="0.3">
                            <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" />
                        </circle>
                        <circle cx="200" cy="230" r="5" fill="#00D9FF" filter="url(#glow)">
                            <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite" />
                        </circle>

                        {/* Body details */}
                        <line x1="155" y1="265" x2="245" y2="265" stroke="#6C63FF" strokeWidth="1" opacity="0.4" />
                        <rect x="165" y="275" width="20" height="8" rx="2" fill="#6C63FF" opacity="0.3" />
                        <rect x="195" y="275" width="20" height="8" rx="2" fill="#00D9FF" opacity="0.3" />
                        <rect x="225" y="275" width="10" height="8" rx="2" fill="#00FF88" opacity="0.3" />
                    </motion.g>

                    {/* Arms */}
                    <motion.g
                        animate={{ rotate: [0, 5, 0, -5, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        style={{ transformOrigin: "130px 200px" }}
                    >
                        <rect x="95" y="195" width="35" height="80" rx="10" fill="url(#bodyGrad)" stroke="#6C63FF" strokeWidth="1.5" />
                        <circle cx="112" cy="285" r="12" fill="url(#bodyGrad)" stroke="#6C63FF" strokeWidth="1.5" />
                    </motion.g>
                    <motion.g
                        animate={{ rotate: [0, -5, 0, 5, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        style={{ transformOrigin: "270px 200px" }}
                    >
                        <rect x="270" y="195" width="35" height="80" rx="10" fill="url(#bodyGrad)" stroke="#6C63FF" strokeWidth="1.5" />
                        <circle cx="288" cy="285" r="12" fill="url(#bodyGrad)" stroke="#6C63FF" strokeWidth="1.5" />
                    </motion.g>

                    {/* Legs */}
                    <rect x="155" y="295" width="30" height="55" rx="8" fill="url(#bodyGrad)" stroke="#6C63FF" strokeWidth="1.5" />
                    <rect x="215" y="295" width="30" height="55" rx="8" fill="url(#bodyGrad)" stroke="#6C63FF" strokeWidth="1.5" />
                    <rect x="148" y="345" width="44" height="15" rx="6" fill="url(#bodyGrad)" stroke="#6C63FF" strokeWidth="1.5" />
                    <rect x="208" y="345" width="44" height="15" rx="6" fill="url(#bodyGrad)" stroke="#6C63FF" strokeWidth="1.5" />

                    {/* Floating data nodes around robot */}
                    <motion.g
                        animate={{ y: [0, -10, 0], opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 0 }}
                    >
                        <circle cx="80" cy="130" r="4" fill="#00D9FF" filter="url(#glow)" />
                        <line x1="84" y1="130" x2="135" y2="120" stroke="#00D9FF" strokeWidth="0.5" opacity="0.3" />
                    </motion.g>
                    <motion.g
                        animate={{ y: [0, -8, 0], opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
                    >
                        <circle cx="320" cy="100" r="3" fill="#00FF88" filter="url(#glow)" />
                        <line x1="316" y1="100" x2="265" y2="110" stroke="#00FF88" strokeWidth="0.5" opacity="0.3" />
                    </motion.g>
                    <motion.g
                        animate={{ y: [0, -12, 0], opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
                    >
                        <circle cx="340" cy="250" r="3.5" fill="#6C63FF" filter="url(#glow)" />
                    </motion.g>
                </svg>
            </motion.div>
        </div>
    );
}
