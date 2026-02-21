"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import type { User, Project, Message, ProjectMember } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";

export default function UserDashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [project, setProject] = useState<Project | null>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [uploading, setUploading] = useState(false);
    const chatEndRef = useRef<null | HTMLDivElement>(null);
    const inputRef = useRef<null | HTMLInputElement>(null);

    // Team management
    const [teamMembers, setTeamMembers] = useState<ProjectMember[]>([]);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviting, setInviting] = useState(false);

    const lastLoadedDraftUserId = useRef<string | null>(null);

    const fetchTeamMembers = useCallback(async () => {
        if (!project) return;
        const { data } = await supabase.from("project_members").select("*").eq("project_id", project.id);
        if (data) setTeamMembers(data);
    }, [project]);

    // Advanced Messaging States
    const [isAdminOnline, setIsAdminOnline] = useState(false);
    const [isAdminTyping, setIsAdminTyping] = useState(false);

    // Save draft
    useEffect(() => {
        if (!user) return;

        // Only load draft once when user changes
        if (lastLoadedDraftUserId.current !== user.id) {
            const saved = localStorage.getItem(`draft_student_${user.id}`);
            if (saved) {
                setTimeout(() => setNewMessage(saved), 0);
            }
            lastLoadedDraftUserId.current = user.id || null;
        }

        setTimeout(() => fetchTeamMembers(), 0);
    }, [user, fetchTeamMembers]);

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteEmail.trim() || !project) return;
        setInviting(true);
        const { error } = await supabase.from("project_members").insert({ project_id: project.id, email: inviteEmail.trim().toLowerCase() });
        if (!error) {
            setInviteEmail("");
            fetchTeamMembers();
        } else {
            alert("Already a member or error inviting.");
        }
        setInviting(false);
    };

    // Auto-focus input
    useEffect(() => {
        if (user && !uploading) {
            inputRef.current?.focus();
        }
    }, [user, messages, uploading]);

    // 1. Auth Logic
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const { data: userData, error: userError } = await supabase
            .from("users")
            .select("*, projects(*, users(*))")
            .eq("email", email.trim())
            .eq("password", password.trim())
            .single();

        if (userError || !userData) {
            setError("Invalid email or password. Please try again.");
            setLoading(false);
            return;
        }

        // Check if user is the owner or a team member
        let activeProject = userData.projects?.[0];

        if (!activeProject) {
            // Check project_members table
            const { data: memberData } = await supabase
                .from("project_members")
                .select("project_id")
                .eq("email", email.trim().toLowerCase())
                .limit(1);

            if (memberData && memberData.length > 0) {
                const { data: projData } = await supabase
                    .from("projects")
                    .select("*, users(*)")
                    .eq("id", memberData[0].project_id)
                    .single();
                activeProject = projData;
            }
        }

        if (!activeProject) {
            setError("You don't have any active projects or invitations.");
            setLoading(false);
            return;
        }

        setUser(userData);
        setProject(activeProject);
        fetchMessages(activeProject.id);
        setLoading(false);
    };

    // 2. Chat Logic
    const fetchMessages = async (projectId: string) => {
        const { data } = await supabase
            .from("messages")
            .select("*")
            .eq("project_id", projectId)
            .order("created_at", { ascending: true });
        if (data) setMessages(data as Message[]);
    };

    const sendMessage = async (e?: React.FormEvent, fileData?: Partial<Message>) => {
        if (e) e.preventDefault();
        if (!newMessage.trim() && !fileData) return;

        const msg = {
            project_id: project?.id,
            user_id: user?.id,
            sender_type: "user",
            content: newMessage,
            ...fileData
        };

        const { error } = await supabase.from("messages").insert([msg]);
        if (!error) setNewMessage("");
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${project?.id}/${fileName}`;
        if (!project) return;

        const { error: uploadError } = await supabase.storage
            .from('Sources')
            .upload(filePath, file);

        if (uploadError) {
            console.error("Upload Error:", uploadError);
            alert("File upload failed: " + uploadError.message);
        } else {
            const { data: { publicUrl } } = supabase.storage
                .from('Sources')
                .getPublicUrl(filePath);

            sendMessage(undefined, {
                file_url: publicUrl,
                file_name: file.name,
                file_type: file.type
            });
        }
        setUploading(false);
    };

    // Realtime listener
    useEffect(() => {
        if (!project || !user) return;

        // 1. Message Channel
        const channel = supabase
            .channel(`chat:${project.id}`)
            .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `project_id=eq.${project.id}` },
                (payload) => {
                    if (project && payload.new.project_id === project.id) {
                        setMessages(prev => {
                            if (prev.some(m => m.id === payload.new.id)) return prev;
                            return [...prev, payload.new as Message];
                        });
                        // Mark as read if from admin
                        if (payload.new.sender_type === 'admin') {
                            supabase.from('messages').update({ is_read: true }).eq('id', payload.new.id).then();
                        }
                    }
                })
            .on("postgres_changes", { event: "UPDATE", schema: "public", table: "messages", filter: `project_id=eq.${project.id}` },
                (payload) => {
                    setMessages(prev => prev.map(m => m.id === payload.new.id ? payload.new as Message : m));
                })
            .subscribe();

        // 2. Presence & Typing Channel
        const presenceChannel = supabase.channel(`presence:${project.id}`);
        presenceChannel
            .on('presence', { event: 'sync' }, () => {
                const state = presenceChannel.presenceState();
                const isAdmin = Object.values(state).flat().some((u: unknown) => (u as { user_id: string }).user_id === 'admin');
                setIsAdminOnline(isAdmin);
            })
            .on('broadcast', { event: 'typing' }, ({ payload }) => {
                if (payload.sender === 'admin' && payload.projectId === project.id) {
                    setIsAdminTyping(payload.isTyping);
                    if (payload.isTyping) {
                        setTimeout(() => setIsAdminTyping(false), 3000);
                    }
                }
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await presenceChannel.track({ user_id: user.id, online_at: new Date().toISOString() });
                }
            });

        return () => {
            supabase.removeChannel(channel);
            supabase.removeChannel(presenceChannel);
        };
    }, [project, user]);

    const handleTyping = (isTyping: boolean) => {
        if (!project) return;
        supabase.channel(`presence:${project.id}`).send({
            type: 'broadcast',
            event: 'typing',
            payload: { projectId: project.id, isTyping, sender: 'user' }
        });
    };

    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (!user) {
        return (
            <div style={{ minHeight: "100vh", background: "#0A0A1A", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
                <Link href="/" style={{ position: "absolute", top: "24px", left: "24px", color: "var(--text-muted)", textDecoration: "none" }}>← Home</Link>
                <div className="glass-card" style={{ width: "100%", maxWidth: "420px", padding: "40px" }}>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: 700, textAlign: "center", marginBottom: "30px" }}>🔐 User Dashboard</h2>
                    <form onSubmit={handleLogin}>
                        <div style={{ marginBottom: "20px" }}>
                            <label style={{ fontSize: "13px", color: "var(--text-secondary)", display: "block", marginBottom: "8px" }}>Email Address</label>
                            <input type="email" placeholder="Enter your email" required value={email} onChange={e => setEmail(e.target.value)} style={{ width: "100%", padding: "14px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", color: "white" }} />
                        </div>
                        <div style={{ marginBottom: "24px" }}>
                            <label style={{ fontSize: "13px", color: "var(--text-secondary)", display: "block", marginBottom: "8px" }}>Password</label>
                            <input type="password" placeholder="Enter your password" required value={password} onChange={e => setPassword(e.target.value)} style={{ width: "100%", padding: "14px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", color: "white" }} />
                        </div>
                        {error && <div style={{ color: "#FF6B6B", fontSize: "13px", marginBottom: "16px" }}>{error}</div>}
                        <button type="submit" disabled={loading} style={{ width: "100%", padding: "14px", borderRadius: "12px", background: "var(--gradient-1)", color: "white", fontWeight: 600, border: "none", cursor: "pointer" }}>
                            {loading ? "Authenticating..." : "Login to Dashboard"}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-layout">
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="sidebar-overlay"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar: Project Info */}
            <div className={`mobile-sidebar ${sidebarOpen ? 'open' : ''}`} style={{ background: "rgba(18,18,42,0.95)", borderRight: "1px solid var(--border)", padding: "24px", overflowY: "auto", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
                    <div>
                        <h3 style={{ fontSize: "1.2rem", color: "white", marginBottom: "4px" }}>Hi, {user?.full_name?.split(' ')[0] || "User"} 👋</h3>
                        <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "unknown"}</p>
                    </div>
                    {/* Hide toggle for desktop but show in mobile sidebar to close */}
                    <button onClick={() => setSidebarOpen(false)} style={{ background: "none", border: "none", color: "white", fontSize: "20px", display: "block" }} className="md:hidden">✕</button>
                </div>

                {project && (
                    <>
                        <div className="glass-card" style={{ padding: "16px", marginBottom: "20px" }}>
                            <div style={{ fontSize: "11px", color: "var(--primary)", fontWeight: 700, textTransform: "uppercase", marginBottom: "12px" }}>Project Status</div>
                            <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "white", marginBottom: "8px", textTransform: "capitalize" }}>{project.status.replace('_', ' ')}</div>
                            <div style={{ height: "4px", width: "100%", background: "rgba(255,255,255,0.1)", borderRadius: "2px" }}>
                                <div style={{ height: "100%", width: project.status === "completed" ? "100%" : project.status === "in_progress" ? "75%" : "25%", background: "var(--primary)", borderRadius: "2px" }} />
                            </div>
                        </div>

                        <div>
                            <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", marginBottom: "12px" }}>Details</div>
                            <div style={{ fontSize: "13px", marginBottom: "12px" }}>
                                <span style={{ color: "var(--text-secondary)" }}>Type:</span> <span style={{ color: "white", textTransform: "capitalize" }}>{project.project_type}</span>
                            </div>
                            <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.6 }}>{project.problem_statement}</p>
                        </div>

                        <div style={{ marginTop: "24px" }}>
                            <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", marginBottom: "12px" }}>Team Members</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "white" }}>
                                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px" }}>👑</div>
                                    <span>{(project as Project & { users?: User }).users?.full_name || user?.full_name || "Owner"} (Leader)</span>
                                </div>
                                {teamMembers.map(m => (
                                    <div key={m.id} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>
                                        <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px" }}>👤</div>
                                        <span>{m.email} {m.email === user?.email ? "(You)" : ""}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                <form onSubmit={handleInvite} style={{ position: "relative" }}>
                    <input
                        type="email"
                        placeholder="Add team member email..."
                        value={inviteEmail}
                        onChange={e => setInviteEmail(e.target.value)}
                        style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", background: "rgba(0,0,0,0.2)", border: "1px solid var(--border)", color: "white", fontSize: "12px" }}
                    />
                    <button
                        type="submit"
                        disabled={inviting}
                        style={{ position: "absolute", right: "6px", top: "50%", transform: "translateY(-50%)", background: "var(--primary)", border: "none", color: "white", padding: "4px 8px", borderRadius: "4px", fontSize: "10px", cursor: "pointer" }}
                    >
                        {inviting ? "..." : "Add"}
                    </button>
                </form>

                <div style={{ marginTop: "auto", paddingTop: "40px" }}>
                    <Link href="/" style={{ fontSize: "13px", color: "#FF6B6B", textDecoration: "none" }}>Logout</Link>
                </div>
            </div>

            {/* Main Content: Real-time Chat */}
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                {/* Chat Header */}
                <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(10,10,26,0.8)", backdropFilter: "blur(10px)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <button
                            onClick={() => setSidebarOpen(true)}
                            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", color: "white", padding: "8px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                            className="md:hidden"
                        >
                            ☰
                        </button>
                        <div>
                            <h4 style={{ margin: 0, fontSize: "14px" }}>Project Support</h4>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: isAdminOnline ? "#00FF88" : "rgba(255,255,255,0.1)" }}></div>
                                <span style={{ fontSize: "10px", color: isAdminOnline ? "#00FF88" : "var(--text-muted)" }}>{isAdminOnline ? "Online" : "Offline"}</span>
                            </div>
                        </div>
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", display: "none" }} className="md:block">Direct conversation with developers</div>
                </div>

                {/* Chat Messages */}
                <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "16px" : "32px", display: "flex", flexDirection: "column", gap: "20px" }}>
                    {messages.map((msg, i) => (
                        <div key={i} style={{ alignSelf: msg.sender_type === "user" ? "flex-end" : "flex-start", maxWidth: "70%" }}>
                            <div style={{ background: msg.sender_type === "user" ? "var(--primary)" : "rgba(255,255,255,0.05)", padding: "12px 18px", borderRadius: msg.sender_type === "user" ? "18px 18px 2px 18px" : "18px 18px 18px 2px", border: msg.sender_type === "user" ? "none" : "1px solid var(--border)" }}>
                                {msg.content && <div style={{ fontSize: "14px", lineHeight: 1.5, marginBottom: msg.file_url ? "12px" : 0 }}>{msg.content}</div>}
                                {msg.file_url && (
                                    <div style={{ marginTop: "10px" }}>
                                        {msg.file_type?.startsWith('image/') ? (
                                            <div style={{ position: "relative" }}>
                                                <Image
                                                    src={msg.file_url!}
                                                    alt={msg.file_name || "Attachment"}
                                                    width={500}
                                                    height={300}
                                                    style={{
                                                        maxWidth: "100%",
                                                        height: "auto",
                                                        maxHeight: "300px",
                                                        borderRadius: "12px",
                                                        display: "block",
                                                        border: "1px solid rgba(255,255,255,0.1)"
                                                    }}
                                                    unoptimized
                                                />
                                                <a
                                                    href={msg.file_url}
                                                    download={msg.file_name}
                                                    target="_blank"
                                                    style={{
                                                        position: "absolute",
                                                        top: "10px",
                                                        right: "10px",
                                                        padding: "6px 10px",
                                                        fontSize: "10px",
                                                        background: "rgba(0,0,0,0.6)",
                                                        color: "white",
                                                        borderRadius: "6px",
                                                        textDecoration: "none"
                                                    }}
                                                >
                                                    Download ⬇️
                                                </a>
                                            </div>
                                        ) : (
                                            <div style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "12px",
                                                padding: "12px 16px",
                                                borderRadius: "12px",
                                                background: "rgba(0,0,0,0.25)",
                                                border: "1px solid rgba(255,255,255,0.1)",
                                                minWidth: "220px"
                                            }}>
                                                <div style={{ fontSize: "28px" }}>
                                                    {msg.file_type?.includes('pdf') ? "📄" : "📁"}
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{
                                                        fontWeight: 600,
                                                        fontSize: "13px",
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        color: "white"
                                                    }}>
                                                        {msg.file_name}
                                                    </div>
                                                    <div style={{ fontSize: "10px", opacity: 0.6, textTransform: "uppercase", color: "white" }}>
                                                        {(msg.file_type || '').split('/')[1] || 'FILE'}
                                                    </div>
                                                </div>
                                                <a
                                                    href={msg.file_url}
                                                    download={msg.file_name}
                                                    target="_blank"
                                                    style={{
                                                        background: "white",
                                                        color: "black",
                                                        padding: "6px 10px",
                                                        borderRadius: "6px",
                                                        fontSize: "11px",
                                                        textDecoration: "none",
                                                        fontWeight: 700
                                                    }}
                                                >
                                                    ⬇️
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px", justifyContent: msg.sender_type === "user" ? "flex-end" : "flex-start" }}>
                                <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                {msg.sender_type === 'user' && (
                                    <span style={{ fontSize: "10px", color: msg.is_read ? "#00FF88" : "var(--text-muted)" }}>
                                        {msg.is_read ? '✓✓' : '✓'}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                    {isAdminTyping && (
                        <div style={{ alignSelf: "flex-start", fontSize: "11px", color: "var(--text-muted)", background: "rgba(255,255,255,0.05)", padding: "4px 10px", borderRadius: "10px" }}>
                            Admin is typing...
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* Chat Input */}
                <div style={{ padding: "24px 32px", background: "rgba(18,18,42,0.6)", borderTop: "1px solid var(--border)" }}>
                    {/* Quick Replies */}
                    <div style={{ display: "flex", gap: "8px", marginBottom: "12px", overflowX: "auto", paddingBottom: "4px" }}>
                        {["Hello Team!", "Checking update.", "Shared the files.", "Need help with node."].map(reply => (
                            <button
                                key={reply}
                                onClick={() => setNewMessage(reply)}
                                style={{ padding: "6px 12px", borderRadius: "20px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", color: "var(--text-secondary)", fontSize: "11px", cursor: "pointer", whiteSpace: "nowrap" }}
                            >
                                {reply}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={sendMessage} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                        <label style={{ cursor: "pointer", fontSize: "20px", padding: "8px" }}>
                            📎
                            <input type="file" onChange={handleFileUpload} style={{ display: "none" }} />
                        </label>
                        <input
                            ref={inputRef}
                            type="text"
                            value={newMessage}
                            onChange={e => {
                                setNewMessage(e.target.value);
                                handleTyping(e.target.value.length > 0);
                            }}
                            onBlur={() => handleTyping(false)}
                            placeholder="Type your message or queries here..."
                            style={{ flex: 1, padding: "14px 20px", borderRadius: "12px", background: "rgba(0,0,0,0.2)", border: "1px solid var(--border)", color: "white", outline: "none" }}
                        />
                        <button type="submit" style={{ padding: "14px 24px", borderRadius: "12px", background: "var(--gradient-1)", color: "white", fontWeight: 600, border: "none", cursor: "pointer" }}>Send</button>
                    </form>
                    {uploading && <div style={{ fontSize: "11px", color: "var(--primary)", marginTop: "8px" }}>Uploading file...</div>}
                </div>
            </div>
        </div>
    );
}
