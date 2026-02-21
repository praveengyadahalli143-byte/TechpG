"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Suspense } from "react";

type Message = {
    id: number;
    type: "bot" | "user";
    text: string;
};

type FormData = {
    project_type: string;
    full_name: string;
    email: string;
    phone_number: string;
    college_name: string;
    course_branch: string;
    password: string;
    problem_source: string;
    problem_statement: string;
};

type Step = {
    question: string | ((formData: FormData) => string);
    field: keyof FormData;
    validate: (val: string) => string | null;
    options?: { label: string; value: string }[];
};

const STEPS: Step[] = [
    {
        question: "Hello! 👋 Welcome to TechpG Project Registration!\n\nTo get started, please select the **type of project** you are registering for:",
        field: "project_type",
        validate: (val) => (["mini", "major"].includes(val.toLowerCase()) ? null : "Please select a valid project type."),
        options: [
            { label: "🔬 Mini Project", value: "mini" },
            { label: "🚀 Major Project", value: "major" },
        ],
    },
    {
        question: (fd: FormData) =>
            `Awesome! You've selected a **${fd.project_type === "major" ? "Major" : "Mini"} Project**.\n\nLet's continue! What is your **full name**?`,
        field: "full_name",
        validate: (val) => (val.trim().length >= 2 ? null : "Please enter a valid name (at least 2 characters)."),
    },
    {
        question: "Great! Now, please share your **email address** 📧",
        field: "email",
        validate: (val) =>
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? null : "Please enter a valid email address.",
    },
    {
        question: "Perfect! What's your **phone number**? 📱 (10 digits)",
        field: "phone_number",
        validate: (val) => {
            const cleaned = val.replace(/[\s\-\.\(\)\+]/g, "").replace(/^91/, "");
            return /^\d{10}$/.test(cleaned) ? null : "Please enter a valid 10-digit phone number.";
        },
    },
    {
        question: "Awesome! Which **college/institution** are you from? 🏫",
        field: "college_name",
        validate: (val) => (val.trim().length >= 2 ? null : "Please enter a valid college name."),
    },
    {
        question: "Nice! What's your **course and branch**? (e.g., B.Tech CSE) 📚",
        field: "course_branch",
        validate: (val) => (val.trim().length >= 2 ? null : "Please enter a valid course/branch."),
    },
    {
        question: "Security check! 🔐 Please create a **password** for your dashboard access.\n\nKeep it safe - you'll need it to track your project progress and chat with us.",
        field: "password",
        validate: (val) => (val.length >= 6 ? null : "Password must be at least 6 characters long."),
    },
    {
        question: (fd: FormData) =>
            `Almost done! 🎯\n\nHow would you like to choose your **${fd.project_type === "major" ? "Major" : "Mini"} Project** problem statement?\n\nType **1** or **2**:`,
        field: "problem_source",
        validate: (val) => {
            const cleaned = val.trim().toLowerCase();
            if (["1", "2"].includes(cleaned)) return null;
            if (cleaned.includes("own") || cleaned.includes("prefer") || cleaned.includes("my")) return null;
            if (cleaned.includes("suggest") || cleaned.includes("team") || cleaned.includes("dev")) return null;
            return "Please type **1** for your own idea or **2** for team suggestion.";
        },
        options: [
            { label: "1️⃣  My own problem statement", value: "1" },
            { label: "2️⃣  Suggestion by the development team", value: "2" },
        ],
    },
    {
        question: "💡 Please describe your **project idea** in detail.\n\nInclude the problem you want to solve, technologies you plan to use, and any specific goals.",
        field: "problem_statement",
        validate: (val) => (val.trim().length >= 10 ? null : "Please describe your project idea in at least 10 characters."),
    },
];

function ChatRegistrationContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const projectType = searchParams.get("type") || "mini";

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<FormData>({
        project_type: projectType || "",
        full_name: "",
        email: "",
        phone_number: "",
        college_name: "",
        course_branch: "",
        password: "",
        problem_source: "",
        problem_statement: "",
    });
    const [isTyping, setIsTyping] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [waitingForInput, setWaitingForInput] = useState(false);
    const [emailCheckMode, setEmailCheckMode] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const addBotMessage = useCallback((text: string, onDone?: () => void) => {
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            setMessages((prev) => [
                ...prev,
                { id: Date.now(), type: "bot", text },
            ]);
            onDone?.();
        }, 800 + Math.random() * 600);
    }, []);

    // Focus input whenever waiting for it
    useEffect(() => {
        if (waitingForInput && !isTyping && !isSubmitting) {
            inputRef.current?.focus();
        }
    }, [waitingForInput, isTyping, isSubmitting]);

    // Show first question on mount
    useEffect(() => {
        const step = STEPS[0];
        const question = typeof step.question === "function" ? step.question(formData) : step.question;
        addBotMessage(question, () => setWaitingForInput(true));
    }, [addBotMessage, formData]);

    const handleOptionSelect = (value: string) => {
        if (!waitingForInput || isTyping || isSubmitting) return;
        setInput(value);
        // Auto-submit
        setTimeout(() => {
            processInput(value);
        }, 100);
    };

    const processInput = async (rawInput: string) => {
        const userInput = rawInput.trim();
        if (!userInput) return;

        setWaitingForInput(false);
        setInput("");

        // Add user message
        const step = STEPS[currentStep];
        const isOption = step.options;
        let displayText = userInput;
        if (isOption) {
            const opt = step.options?.find((o) => o.value === userInput);
            displayText = opt ? opt.label : userInput;
        }

        setMessages((prev) => [
            ...prev,
            { id: Date.now(), type: "user", text: displayText },
        ]);

        // Validate
        const validationError = step.validate(userInput);
        if (validationError) {
            setError(validationError);
            addBotMessage(`⚠️ ${validationError}\n\nPlease try again.`, () => setWaitingForInput(true));
            return;
        }

        setError(null);

        // Store value
        let valueToStore = userInput;
        if (step.field === "phone_number") {
            valueToStore = userInput.replace(/[\s\-\.\(\)\+]/g, "").replace(/^91/, "");
        }
        if (step.field === "problem_source") {
            const cleaned = userInput.trim().toLowerCase();
            valueToStore = cleaned === "1" || cleaned.includes("own") || cleaned.includes("prefer") || cleaned.includes("my")
                ? "own"
                : "team_suggestion";
        }

        // --- Email Duplication Check ---
        if (step.field === "email" && !emailCheckMode) {
            const { data: existing } = await supabase.from("users").select("id").eq("email", userInput.toLowerCase()).single();
            if (existing) {
                setEmailCheckMode(true);
                addBotMessage(
                    `🤔 **Email already exists!**\n\nIt looks like you've already registered with this email address.\n\n` +
                    `1️⃣ **Continue to Login**\n` +
                    `2️⃣ **Use different email**`,
                    () => setWaitingForInput(true)
                );
                return;
            }
        }

        // Handle email options if in check mode
        if (emailCheckMode) {
            const choice = userInput.toLowerCase();
            if (choice === "1" || choice.includes("login") || choice.includes("continue")) {
                router.push("/dashboard");
                return;
            } else {
                setEmailCheckMode(false);
                addBotMessage(`No problem! Please enter a **different email address** to continue.`, () => setWaitingForInput(true));
                return;
            }
        }

        const updatedFormData = { ...formData, [step.field]: valueToStore };
        setFormData(updatedFormData);

        const nextStepIndex = currentStep + 1;
        const shouldSkipFinal = step.field === "problem_source" && valueToStore === "team_suggestion";

        // If this was the last step OR we chose team suggestion → submit
        if (nextStepIndex >= STEPS.length || shouldSkipFinal) {
            setIsSubmitting(true);

            try {
                // Insert user
                const { data: userData, error: userError } = await supabase
                    .from("users")
                    .insert({
                        full_name: updatedFormData.full_name,
                        email: updatedFormData.email,
                        phone_number: updatedFormData.phone_number,
                        college_name: updatedFormData.college_name,
                        course_branch: updatedFormData.course_branch,
                        password: updatedFormData.password,
                    })
                    .select()
                    .single();

                if (userError) throw userError;

                const finalStatement = shouldSkipFinal
                    ? "Requested team suggestion [User opted for team-curated project idea]"
                    : updatedFormData.problem_statement;

                // Insert project
                const { error: projectError } = await supabase
                    .from("projects")
                    .insert({
                        user_id: userData.id,
                        project_type: projectType,
                        problem_statement: finalStatement,
                        status: "pending",
                    });

                if (projectError) throw projectError;

                setIsSubmitting(false);
                setIsComplete(true);

                addBotMessage(
                    `🎉 **Registration Complete!**\n\n` +
                    `👤 **Name:** ${updatedFormData.full_name}\n` +
                    `📝 **Project:** ${projectType === "major" ? "Major" : "Mini"} Project\n` +
                    `🎯 **Source:** ${shouldSkipFinal ? "Team Suggestion" : "Own Idea"}\n\n` +
                    `**Great choice!** Since you requested a suggestion, our development team will analyze your profile and assign the **best trending project idea** in your domain.\n\n` +
                    `Redirecting you to your dashboard in 5 seconds... 🚀`
                );

                setTimeout(() => {
                    router.push("/dashboard");
                }, 5000);
            } catch (err: unknown) {
                console.error("Full Registration Error:", err);
                setIsSubmitting(false);

                // Construct a readable message from Supabase or standard error
                const errorObj = err as { message?: string, details?: string, code?: string };
                const errorMessage = errorObj?.message || errorObj?.details || (typeof err === 'string' ? err : "An unknown error occurred");
                const errorCode = errorObj?.code ? ` [Code: ${errorObj.code}]` : "";

                addBotMessage(
                    `❌ **Registration Failed**\n\n` +
                    `**Error:** ${errorMessage}${errorCode}\n\n` +
                    `**Possible Fix:** This usually happens if the Supabase tables aren't updated. Please ensure you ran the SQL fix script in the Supabase Editor.`
                );
            }
            return;
        }

        setCurrentStep(nextStepIndex);
        const nextStep = STEPS[nextStepIndex];
        const nextQ = typeof nextStep.question === "function" ? nextStep.question(updatedFormData) : nextStep.question;

        addBotMessage(nextQ, () => setWaitingForInput(true));
    };

    const handleSubmit = async () => {
        if (!input.trim() || isTyping || isSubmitting || !waitingForInput) return;
        processInput(input.trim());
    };

    const progressPercent = Math.min(
        ((currentStep) / (STEPS.length - 1)) * 100,
        100
    );

    const currentStepData = STEPS[currentStep];
    const showOptions = waitingForInput && currentStepData?.options && !isTyping && !emailCheckMode;
    const showEmailOptions = waitingForInput && emailCheckMode && !isTyping;

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                zIndex: 1,
            }}
        >
            {/* Header */}
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    zIndex: 100,
                    background: "rgba(10, 10, 26, 0.9)",
                    backdropFilter: "blur(20px)",
                    borderBottom: "1px solid var(--border)",
                }}
            >
                <div
                    style={{
                        maxWidth: "800px",
                        margin: "0 auto",
                        padding: "16px 24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <Link
                            href="/"
                            style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "10px",
                                background: "var(--surface)",
                                border: "1px solid var(--border)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                textDecoration: "none",
                                color: "white",
                                fontSize: "16px",
                            }}
                        >
                            ←
                        </Link>
                        <div>
                            <h2
                                style={{
                                    fontSize: "calc(14px + 0.5vw)",
                                    fontWeight: 600,
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    lineHeight: 1.2
                                }}
                            >
                                {projectType === "major" ? "🚀 Major" : "🔬 Mini"} Project
                                Registration
                            </h2>
                            <div
                                style={{
                                    fontSize: "12px",
                                    color: "var(--text-muted)",
                                    marginTop: "2px",
                                }}
                            >
                                Chat with our AI assistant
                            </div>
                        </div>
                    </div>

                    {/* Progress */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                        }}
                    >
                        <span
                            style={{
                                fontSize: "12px",
                                color: "var(--text-muted)",
                                fontWeight: 500,
                            }}
                        >
                            {Math.round(progressPercent)}%
                        </span>
                        <div
                            style={{
                                width: "clamp(40px, 10vw, 80px)",
                                height: "6px",
                                borderRadius: "3px",
                                background: "var(--surface)",
                                overflow: "hidden",
                            }}
                        >
                            <motion.div
                                animate={{ width: `${progressPercent}%` }}
                                transition={{ duration: 0.5 }}
                                style={{
                                    height: "100%",
                                    borderRadius: "3px",
                                    background: "var(--gradient-1)",
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat area */}
            <div
                style={{
                    flex: 1,
                    maxWidth: "800px",
                    margin: "0 auto",
                    width: "100%",
                    padding: "90px 24px 160px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                }}
            >
                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            style={{
                                display: "flex",
                                justifyContent: msg.type === "user" ? "flex-end" : "flex-start",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "flex-end",
                                    gap: "8px",
                                    maxWidth: "80%",
                                    flexDirection: msg.type === "user" ? "row-reverse" : "row",
                                }}
                            >
                                {/* Avatar */}
                                <div
                                    style={{
                                        width: "32px",
                                        height: "32px",
                                        borderRadius: "50%",
                                        background:
                                            msg.type === "bot"
                                                ? "var(--gradient-1)"
                                                : "var(--gradient-3)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "14px",
                                        flexShrink: 0,
                                    }}
                                >
                                    {msg.type === "bot" ? "🤖" : "👤"}
                                </div>

                                <div
                                    className={
                                        msg.type === "bot" ? "chat-bubble chat-bubble-bot" : "chat-bubble chat-bubble-user"
                                    }
                                    style={{ whiteSpace: "pre-wrap" }}
                                    dangerouslySetInnerHTML={{
                                        __html: msg.text
                                            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                                            .replace(/\n/g, "<br/>"),
                                    }}
                                />
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Typing indicator */}
                {(isTyping || isSubmitting) && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ display: "flex", alignItems: "flex-end", gap: "8px" }}
                    >
                        <div
                            style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                background: "var(--gradient-1)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "14px",
                            }}
                        >
                            🤖
                        </div>
                        <div className="chat-bubble chat-bubble-bot">
                            <div className="typing-indicator">
                                <span />
                                <span />
                                <span />
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Option buttons */}
                {showOptions && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                            paddingLeft: "40px",
                            maxWidth: "420px",
                        }}
                    >
                        {currentStepData.options!.map((opt) => (
                            <motion.button
                                key={opt.value}
                                whileHover={{ scale: 1.02, borderColor: "rgba(108, 99, 255, 0.6)" }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleOptionSelect(opt.value)}
                                style={{
                                    padding: "14px 20px",
                                    borderRadius: "14px",
                                    border: "1px solid rgba(108, 99, 255, 0.25)",
                                    background: "rgba(108, 99, 255, 0.06)",
                                    backdropFilter: "blur(8px)",
                                    color: "#FFFFFF",
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    fontWeight: 500,
                                    fontSize: "14px",
                                    cursor: "pointer",
                                    textAlign: "left",
                                    transition: "all 0.3s ease",
                                }}
                            >
                                {opt.label}
                            </motion.button>
                        ))}
                    </motion.div>
                )}

                {/* Email collision options */}
                {showEmailOptions && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            display: "flex",
                            gap: "10px",
                            paddingLeft: "40px",
                            maxWidth: "420px",
                        }}
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleOptionSelect("1")}
                            style={{
                                padding: "12px 24px",
                                borderRadius: "12px",
                                background: "var(--gradient-1)",
                                color: "white",
                                fontWeight: 600,
                                border: "none",
                                cursor: "pointer",
                                fontSize: "14px"
                            }}
                        >
                            Login to Account
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleOptionSelect("2")}
                            style={{
                                padding: "12px 24px",
                                borderRadius: "12px",
                                background: "rgba(255,255,255,0.05)",
                                color: "white",
                                fontWeight: 600,
                                border: "1px solid var(--border)",
                                cursor: "pointer",
                                fontSize: "14px"
                            }}
                        >
                            Try Different Email
                        </motion.button>
                    </motion.div>
                )}

                <div ref={chatEndRef} />
            </div>

            {/* Input area */}
            {!isComplete && (
                <div
                    style={{
                        position: "fixed",
                        bottom: 0,
                        left: 0,
                        width: "100%",
                        background: "rgba(10, 10, 26, 0.9)",
                        backdropFilter: "blur(20px)",
                        borderTop: "1px solid var(--border)",
                        padding: "16px",
                    }}
                >
                    <div
                        style={{
                            maxWidth: "800px",
                            margin: "0 auto",
                            display: "flex",
                            gap: "10px",
                        }}
                    >
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                            placeholder={showOptions ? "Or type your choice..." : "Type your response..."}
                            disabled={isTyping || isSubmitting || !waitingForInput}
                            style={{
                                flex: 1,
                                padding: "14px 20px",
                                borderRadius: "14px",
                                border: error
                                    ? "1px solid rgba(255, 107, 107, 0.5)"
                                    : "1px solid var(--border)",
                                background: "var(--surface)",
                                color: "white",
                                fontSize: "14px",
                                fontFamily: "'Inter', sans-serif",
                                outline: "none",
                                transition: "all 0.3s ease",
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = "var(--primary)";
                                e.currentTarget.style.boxShadow = "0 0 20px rgba(108, 99, 255, 0.2)";
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = "var(--border)";
                                e.currentTarget.style.boxShadow = "none";
                            }}
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSubmit}
                            disabled={isTyping || isSubmitting || !input.trim() || !waitingForInput}
                            style={{
                                padding: "14px 24px",
                                borderRadius: "14px",
                                border: "none",
                                background:
                                    isTyping || isSubmitting || !input.trim() || !waitingForInput
                                        ? "var(--surface)"
                                        : "var(--gradient-1)",
                                color: "white",
                                fontSize: "14px",
                                fontWeight: 600,
                                cursor:
                                    isTyping || isSubmitting || !input.trim() || !waitingForInput
                                        ? "not-allowed"
                                        : "pointer",
                                fontFamily: "'Space Grotesk', sans-serif",
                                opacity: isTyping || isSubmitting || !input.trim() || !waitingForInput ? 0.5 : 1,
                                transition: "all 0.3s ease",
                            }}
                        >
                            Send ↑
                        </motion.button>
                    </div>
                    {error && (
                        <div
                            style={{
                                maxWidth: "800px",
                                margin: "8px auto 0",
                                fontSize: "12px",
                                color: "#FF6B6B",
                            }}
                        >
                            ⚠️ {error}
                        </div>
                    )}
                </div>
            )}

            {/* Completion CTA */}
            {isComplete && !isTyping && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        position: "fixed",
                        bottom: 0,
                        left: 0,
                        width: "100%",
                        background: "rgba(10, 10, 26, 0.9)",
                        backdropFilter: "blur(20px)",
                        borderTop: "1px solid var(--border)",
                        padding: "20px",
                    }}
                >
                    <div
                        style={{
                            maxWidth: "800px",
                            margin: "0 auto",
                            display: "flex",
                            gap: "12px",
                            justifyContent: "center",
                        }}
                    >
                        <Link href="/" style={{ textDecoration: "none" }}>
                            <button className="glow-btn glow-btn-outline">
                                ← Back to Home
                            </button>
                        </Link>
                        <Link href="/dashboard" style={{ textDecoration: "none" }}>
                            <button className="glow-btn glow-btn-primary">
                                View Dashboard →
                            </button>
                        </Link>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense
            fallback={
                <div
                    style={{
                        minHeight: "100vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--text-secondary)",
                    }}
                >
                    Loading...
                </div>
            }
        >
            <ChatRegistrationContent />
        </Suspense>
    );
}
