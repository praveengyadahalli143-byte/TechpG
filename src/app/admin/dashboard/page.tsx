"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import type { Project, ProjectUpdate, Message } from "@/lib/supabase";
import Image from "next/image";

type RegistrationWithUser = Project & {
    users: {
        id: string;
        full_name: string;
        email: string;
        phone_number: string;
        college_name: string;
        course_branch: string;
    };
};

type AdminSession = {
    id: string;
    email: string;
    role: string;
};

type ToastNotification = {
    id: string;
    title: string;
    message: string;
    type: "new_registration" | "status_change";
    timestamp: Date;
};

const STATUS_OPTIONS = ["pending", "approved", "rejected", "in_progress", "completed"] as const;

const NOTIFICATION_TEMPLATES = [
    { label: "Project Approved - Proceed to next steps", value: "Your project has been approved! Please proceed to the next steps. Our team will contact you shortly with further instructions." },
    { label: "Project Rejected - Resubmit with changes", value: "Your project submission requires modifications. Please review the feedback and resubmit with the necessary changes." },
    { label: "Action Required - Submit documents", value: "Action required: Please submit the required documents for your project registration to proceed further." },
    { label: "Project In Progress - Welcome aboard", value: "Great news! Your project is now in progress. Welcome aboard! Check your dashboard for milestones and deadlines." },
    { label: "Project Completed - Congratulations", value: "Congratulations! Your project has been marked as completed. Thank you for your hard work!" },
    { label: "Custom message", value: "" },
];

export default function AdminDashboard() {
    const router = useRouter();
    const [admin, setAdmin] = useState<AdminSession | null>(null);
    const [registrations, setRegistrations] = useState<RegistrationWithUser[]>([]);
    const [updates, setUpdates] = useState<ProjectUpdate[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"dashboard" | "registrations" | "updates" | "stats" | "communications" | "settings" | "audit">("dashboard");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [filterType, setFilterType] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedProject, setSelectedProject] = useState<RegistrationWithUser | null>(null);
    const [updateText, setUpdateText] = useState("");
    const [newStatus, setNewStatus] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Real-time toast notifications
    const [toasts, setToasts] = useState<ToastNotification[]>([]);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Visitor Stats
    const [dailyVisitors, setDailyVisitors] = useState(0);
    const [totalVisitors, setTotalVisitors] = useState(0);

    // Send notification modal
    const [showNotifyModal, setShowNotifyModal] = useState(false);
    const [notifyProject, setNotifyProject] = useState<RegistrationWithUser | null>(null);
    const [notifyTitle, setNotifyTitle] = useState("");
    const [notifyMessage, setNotifyMessage] = useState("");
    const [notifyType, setNotifyType] = useState<string>("info");
    const [notifySending, setNotifySending] = useState(false);
    const [notifySuccess, setNotifySuccess] = useState(false);

    // Chat States
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [chatMessages, setChatMessages] = useState<Message[]>([]);
    const [adminMsg, setAdminMsg] = useState("");
    const [uploadingFile, setUploadingFile] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const chatInputRef = useRef<HTMLInputElement>(null);

    // Advanced Messaging States
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
    const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

    // Save drafts to localStorage
    useEffect(() => {
        if (!activeChatId) return;
        const savedDraft = localStorage.getItem(`draft_${activeChatId}`);
        if (savedDraft) setAdminMsg(savedDraft);
    }, [activeChatId]);

    useEffect(() => {
        if (activeChatId) {
            localStorage.setItem(`draft_${activeChatId}`, adminMsg);
        }
    }, [adminMsg, activeChatId]);

    // Auto-focus chat input
    useEffect(() => {
        if (activeTab === "communications" && activeChatId) {
            chatInputRef.current?.focus();
        }
    }, [activeTab, activeChatId, chatMessages]);

    // Check auth
    useEffect(() => {
        const session = localStorage.getItem("admin_session");
        if (!session) {
            router.push("/admin/login");
            return;
        }
        setAdmin(JSON.parse(session));
    }, [router]);

    // Fetch data
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const { data: regs } = await supabase
                .from("projects")
                .select("*, users(*)")
                .order("registration_date", { ascending: false });

            const { data: upds } = await supabase
                .from("project_updates")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(50);

            if (regs) setRegistrations(regs as RegistrationWithUser[]);
            if (upds) setUpdates(upds);

            // Fetch visitor stats
            const { data: vStats } = await supabase.from("visitor_stats").select("visitor_count");
            if (vStats) {
                const total = vStats.reduce((acc, curr) => acc + curr.visitor_count, 0);
                setTotalVisitors(total);

                const today = new Date().toISOString().split('T')[0];
                const { data: todayData } = await supabase.from("visitor_stats").select("visitor_count").eq("visit_date", today).single();
                if (todayData) setDailyVisitors(todayData.visitor_count);
            }
        } catch (err) {
            console.error("Error fetching data:", err);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (admin) fetchData();
    }, [admin, fetchData]);

    // Add toast
    const addToast = useCallback((title: string, message: string, type: "new_registration" | "status_change") => {
        const id = Date.now().toString();
        setToasts((prev) => [...prev, { id, title, message, type, timestamp: new Date() }]);
        // Auto-remove after 8 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 8000);
    }, []);

    // Real-time subscription with toast notifications
    useEffect(() => {
        const channel = supabase
            .channel("admin-realtime")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "projects" },
                async (payload) => {
                    // New registration! Fetch user details
                    const { data: userData } = await supabase
                        .from("users")
                        .select("full_name, email, college_name")
                        .eq("id", payload.new.user_id)
                        .single();

                    const name = userData?.full_name || "New Student";
                    const college = userData?.college_name || "";
                    const projectType = payload.new.project_type === "major" ? "Major" : "Mini";

                    addToast(
                        `🆕 New ${projectType} Project Registration!`,
                        `${name} from ${college} has registered.`,
                        "new_registration"
                    );
                    fetchData();
                }
            )
            .on(
                "postgres_changes",
                { event: "UPDATE", schema: "public", table: "projects" },
                () => fetchData()
            )
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "messages" },
                (payload) => {
                    if (activeChatId === payload.new.project_id) {
                        setChatMessages(prev => {
                            if (prev.some(m => m.id === payload.new.id)) return prev;
                            return [...prev, payload.new as Message];
                        });
                        // Mark as read immediately if chat is active
                        if (payload.new.sender_type === 'user') {
                            supabase.from('messages').update({ is_read: true }).eq('id', payload.new.id).then();
                        }
                    } else if (payload.new.sender_type === 'user') {
                        // Increment unread count for other chats
                        setUnreadCounts(prev => ({
                            ...prev,
                            [payload.new.project_id]: (prev[payload.new.project_id] || 0) + 1
                        }));
                    }
                }
            )
            .subscribe();

        // 2. Presence & Typing Channel
        const presenceChannel = supabase.channel(`presence_admin`);
        presenceChannel
            .on('presence', { event: 'sync' }, () => {
                const state = presenceChannel.presenceState();
                const users = Object.values(state).flat().map((u: unknown) => (u as { user_id: string }).user_id);
                setOnlineUsers(users);
            })
            .on('broadcast', { event: 'typing' }, ({ payload }) => {
                if (payload.sender === 'user') {
                    setTypingUsers(prev => ({ ...prev, [payload.projectId]: payload.isTyping }));
                    // Auto-clear typing after 3s
                    if (payload.isTyping) {
                        setTimeout(() => {
                            setTypingUsers(prev => ({ ...prev, [payload.projectId]: false }));
                        }, 3000);
                    }
                }
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await presenceChannel.track({ user_id: 'admin', online_at: new Date().toISOString() });
                }
            });

        return () => {
            supabase.removeChannel(channel);
            supabase.removeChannel(presenceChannel);
        };
    }, [fetchData, addToast, activeChatId]);

    const handleStatusUpdate = async (projectId: string, status: string, reg: RegistrationWithUser) => {
        if (!admin) return;

        await supabase
            .from("projects")
            .update({ status })
            .eq("id", projectId);

        await supabase.from("project_updates").insert({
            project_id: projectId,
            update_text: updateText || `Status changed to ${status}`,
            status_changed_to: status,
            updated_by: admin.id,
        });

        // Auto-send notification to user about status change
        if (reg.users?.id) {
            const typeMap: Record<string, string> = {
                approved: "approval",
                rejected: "rejection",
                in_progress: "info",
                completed: "info",
                pending: "status_update",
            };

            await supabase.from("notifications").insert({
                user_id: reg.users.id,
                project_id: projectId,
                title: `Project Status: ${status.replace("_", " ").toUpperCase()}`,
                message: `Your ${reg.project_type} project status has been updated to "${status.replace("_", " ")}". ${updateText || ""}`.trim(),
                type: typeMap[status] || "status_update",
                sent_by: admin.id,
            });

            // If approved, send a chat message too
            if (status === "approved") {
                await supabase.from("messages").insert({
                    project_id: projectId,
                    user_id: reg.users.id,
                    sender_type: "admin",
                    content: `🎉 **Congratulations!** Your project "${reg.project_type}" has been **APPROVED**. \n\nYou can now start the development. Our team will guide you through the next steps in this chat.`
                });
            }
        }

        setUpdateText("");
        setNewStatus("");
        setSelectedProject(null);
        fetchData();
    };

    const handleDeleteProject = async (projectId: string) => {
        if (!window.confirm("⚠️ Are you sure you want to PERMANENTLY delete this project and all its data? This action cannot be undone.")) return;

        try {
            // Delete related data first
            await supabase.from("messages").delete().eq("project_id", projectId);
            await supabase.from("project_updates").delete().eq("project_id", projectId);
            await supabase.from("notifications").delete().eq("project_id", projectId);
            await supabase.from("project_members").delete().eq("project_id", projectId);

            // Delete the project
            const { error } = await supabase.from("projects").delete().eq("id", projectId);

            if (error) throw error;

            addToast("🗑️ Project Deleted", "The project has been permanently removed.", "status_change");
            setSelectedProject(null);
            fetchData();
        } catch (err) {
            console.error("Error deleting project:", err);
            alert("Failed to delete project. Please try again.");
        }
    };

    // Send custom notification
    const handleSendNotification = async () => {
        if (!admin || !notifyProject || !notifyTitle.trim() || !notifyMessage.trim()) return;
        setNotifySending(true);

        try {
            await supabase.from("notifications").insert({
                user_id: notifyProject.users.id,
                project_id: notifyProject.id,
                title: notifyTitle,
                message: notifyMessage,
                type: notifyType,
                sent_by: admin.id,
            });

            setNotifySuccess(true);
            setTimeout(() => {
                setShowNotifyModal(false);
                setNotifySuccess(false);
                setNotifyTitle("");
                setNotifyMessage("");
                setNotifyType("info");
                setNotifyProject(null);
            }, 1500);
        } catch (err) {
            console.error("Error sending notification:", err);
        }
        setNotifySending(false);
    };

    const openNotifyModal = (reg: RegistrationWithUser) => {
        setNotifyProject(reg);
        setNotifyTitle("");
        setNotifyMessage("");
        setNotifyType("info");
        setNotifySuccess(false);
        setShowNotifyModal(true);
    };

    const handleLogout = () => {
        localStorage.removeItem("admin_session");
        router.push("/admin/login");
    };

    // Chat Logic
    useEffect(() => {
        if (!activeChatId) return;
        const fetchChat = async () => {
            const { data } = await supabase
                .from("messages")
                .select("*")
                .eq("project_id", activeChatId)
                .order("created_at", { ascending: true });
            if (data) {
                setChatMessages(data);
                // Mark all as read
                await supabase.from('messages').update({ is_read: true }).eq('project_id', activeChatId).eq('sender_type', 'user');
                setUnreadCounts(prev => ({ ...prev, [activeChatId]: 0 }));
            }
        };
        fetchChat();
    }, [activeChatId]);

    // Initial Unread Check
    useEffect(() => {
        const checkUnread = async () => {
            const { data } = await supabase.from('messages').select('project_id').eq('is_read', false).eq('sender_type', 'user');
            if (data) {
                const counts: Record<string, number> = {};
                data.forEach((m) => counts[m.project_id] = (counts[m.project_id] || 0) + 1);
                setUnreadCounts(counts);
            }
        };
        checkUnread();
    }, []);

    const handleTyping = (isTyping: boolean) => {
        if (!activeChatId) return;
        supabase.channel(`presence_admin`).send({
            type: 'broadcast',
            event: 'typing',
            payload: { projectId: activeChatId, isTyping, sender: 'admin' }
        });
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]);

    const sendAdminMessage = async (e?: React.FormEvent, fileData?: Partial<Message>) => {
        if (e) e.preventDefault();
        if (!admin || !activeChatId || (!adminMsg.trim() && !fileData)) return;

        const chat = registrations.find(r => r.id === activeChatId);
        if (!chat) return;

        const msg = {
            project_id: activeChatId,
            user_id: chat.user_id,
            sender_type: "admin",
            content: adminMsg,
            ...fileData
        };

        const { error } = await supabase.from("messages").insert([msg]);
        if (!error) setAdminMsg("");
    };

    const handleAdminFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !activeChatId) return;

        setUploadingFile(true);
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${activeChatId}/admin_${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('Sources')
            .upload(filePath, file);

        if (uploadError) {
            console.error("Admin Upload Error:", uploadError);
            alert("Upload failed: " + uploadError.message);
        } else {
            const { data: { publicUrl } } = supabase.storage
                .from('Sources')
                .getPublicUrl(filePath);

            sendAdminMessage(undefined, {
                file_url: publicUrl,
                file_name: file.name,
                file_type: file.type
            });
        }
        setUploadingFile(false);
    };

    // Filter registrations
    const filtered = registrations.filter((r) => {
        if (filterStatus !== "all" && r.status !== filterStatus) return false;
        if (filterType !== "all" && r.project_type !== filterType) return false;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            return (
                r.users?.full_name?.toLowerCase().includes(q) ||
                r.users?.email?.toLowerCase().includes(q) ||
                r.users?.college_name?.toLowerCase().includes(q) ||
                r.problem_statement?.toLowerCase().includes(q)
            );
        }
        return true;
    });

    // Stats
    const stats = {
        total: registrations.length,
        pending: registrations.filter((r) => r.status === "pending").length,
        approved: registrations.filter((r) => r.status === "approved").length,
        rejected: registrations.filter((r) => r.status === "rejected").length,
        inProgress: registrations.filter((r) => r.status === "in_progress").length,
        completed: registrations.filter((r) => r.status === "completed").length,
        mini: registrations.filter((r) => r.project_type === "mini").length,
        major: registrations.filter((r) => r.project_type === "major").length,
    };

    if (!admin) return null;

    return (
        <div style={{ display: "flex", minHeight: "100vh", position: "relative", zIndex: 1 }}>
            {/* Hidden audio for notification sound */}
            <audio ref={audioRef} preload="none">
                <source src="data:audio/wav;base64,UklGRl9vT19teleVudGhlcmVpc25vc291bmQ=" type="audio/wav" />
            </audio>

            {/* ============ TOAST NOTIFICATIONS ============ */}
            <div
                style={{
                    position: "fixed",
                    top: "20px",
                    right: "20px",
                    zIndex: 9999,
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    maxWidth: "400px",
                    width: "100%",
                    pointerEvents: "none",
                }}
            >
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 100, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 100, scale: 0.9 }}
                            transition={{ type: "spring", damping: 20, stiffness: 300 }}
                            style={{
                                background: toast.type === "new_registration"
                                    ? "linear-gradient(135deg, rgba(0, 255, 136, 0.15), rgba(0, 217, 255, 0.1))"
                                    : "linear-gradient(135deg, rgba(108, 99, 255, 0.15), rgba(139, 131, 255, 0.1))",
                                border: toast.type === "new_registration"
                                    ? "1px solid rgba(0, 255, 136, 0.3)"
                                    : "1px solid rgba(108, 99, 255, 0.3)",
                                borderRadius: "16px",
                                padding: "18px 20px",
                                backdropFilter: "blur(20px)",
                                boxShadow: toast.type === "new_registration"
                                    ? "0 8px 32px rgba(0, 255, 136, 0.2)"
                                    : "0 8px 32px rgba(108, 99, 255, 0.2)",
                                pointerEvents: "auto",
                                cursor: "pointer",
                            }}
                            onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                        >
                            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                                <div
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                        borderRadius: "12px",
                                        background: toast.type === "new_registration"
                                            ? "rgba(0, 255, 136, 0.2)"
                                            : "rgba(108, 99, 255, 0.2)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "20px",
                                        flexShrink: 0,
                                    }}
                                >
                                    {toast.type === "new_registration" ? "🔔" : "📝"}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div
                                        style={{
                                            fontWeight: 600,
                                            fontSize: "14px",
                                            fontFamily: "'Space Grotesk', sans-serif",
                                            marginBottom: "4px",
                                        }}
                                    >
                                        {toast.title}
                                    </div>
                                    <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                                        {toast.message}
                                    </div>
                                    <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "6px" }}>
                                        Just now • Click to dismiss
                                    </div>
                                </div>
                            </div>
                            {/* Progress bar */}
                            <motion.div
                                initial={{ width: "100%" }}
                                animate={{ width: "0%" }}
                                transition={{ duration: 8, ease: "linear" }}
                                style={{
                                    height: "3px",
                                    borderRadius: "2px",
                                    background: toast.type === "new_registration"
                                        ? "rgba(0, 255, 136, 0.5)"
                                        : "rgba(108, 99, 255, 0.5)",
                                    marginTop: "12px",
                                }}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* ============ SEND NOTIFICATION MODAL ============ */}
            <AnimatePresence>
                {showNotifyModal && notifyProject && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: "fixed",
                            inset: 0,
                            background: "rgba(0,0,0,0.6)",
                            backdropFilter: "blur(8px)",
                            zIndex: 10000,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "20px",
                        }}
                        onClick={() => setShowNotifyModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="glass-card"
                            style={{
                                width: "100%",
                                maxWidth: "540px",
                                padding: "32px",
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {notifySuccess ? (
                                <div style={{ textAlign: "center", padding: "20px" }}>
                                    <div style={{ fontSize: "56px", marginBottom: "16px" }}>✅</div>
                                    <h3
                                        style={{
                                            fontSize: "1.3rem",
                                            fontWeight: 700,
                                            fontFamily: "'Space Grotesk', sans-serif",
                                            marginBottom: "8px",
                                        }}
                                    >
                                        Notification Sent!
                                    </h3>
                                    <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                                        {notifyProject.users?.full_name} will see this notification.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <h3
                                        style={{
                                            fontSize: "1.2rem",
                                            fontWeight: 700,
                                            fontFamily: "'Space Grotesk', sans-serif",
                                            marginBottom: "4px",
                                        }}
                                    >
                                        📨 Send Notification
                                    </h3>
                                    <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "24px" }}>
                                        To: <strong>{notifyProject.users?.full_name}</strong> ({notifyProject.users?.email})
                                    </p>

                                    {/* Quick templates */}
                                    <div style={{ marginBottom: "16px" }}>
                                        <label style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>
                                            Quick Templates
                                        </label>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                            {NOTIFICATION_TEMPLATES.map((tpl, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => {
                                                        setNotifyTitle(tpl.label);
                                                        if (tpl.value) setNotifyMessage(tpl.value);
                                                    }}
                                                    style={{
                                                        padding: "10px 14px",
                                                        borderRadius: "8px",
                                                        border: notifyTitle === tpl.label
                                                            ? "1px solid rgba(108, 99, 255, 0.5)"
                                                            : "1px solid var(--border)",
                                                        background: notifyTitle === tpl.label
                                                            ? "rgba(108, 99, 255, 0.1)"
                                                            : "var(--surface)",
                                                        color: "white",
                                                        fontSize: "12px",
                                                        cursor: "pointer",
                                                        textAlign: "left",
                                                        fontFamily: "'Inter', sans-serif",
                                                        transition: "all 0.2s",
                                                    }}
                                                >
                                                    {tpl.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <div style={{ marginBottom: "16px" }}>
                                        <label style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "1px" }}>
                                            Title
                                        </label>
                                        <input
                                            type="text"
                                            value={notifyTitle}
                                            onChange={(e) => setNotifyTitle(e.target.value)}
                                            placeholder="Notification title..."
                                            style={{
                                                width: "100%",
                                                padding: "12px 14px",
                                                borderRadius: "10px",
                                                border: "1px solid var(--border)",
                                                background: "var(--surface)",
                                                color: "white",
                                                fontSize: "14px",
                                                outline: "none",
                                                fontFamily: "'Inter', sans-serif",
                                                boxSizing: "border-box",
                                            }}
                                        />
                                    </div>

                                    {/* Message */}
                                    <div style={{ marginBottom: "16px" }}>
                                        <label style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "1px" }}>
                                            Message
                                        </label>
                                        <textarea
                                            value={notifyMessage}
                                            onChange={(e) => setNotifyMessage(e.target.value)}
                                            placeholder="Write your message to the student..."
                                            rows={4}
                                            style={{
                                                width: "100%",
                                                padding: "12px 14px",
                                                borderRadius: "10px",
                                                border: "1px solid var(--border)",
                                                background: "var(--surface)",
                                                color: "white",
                                                fontSize: "14px",
                                                outline: "none",
                                                fontFamily: "'Inter', sans-serif",
                                                resize: "vertical",
                                                boxSizing: "border-box",
                                            }}
                                        />
                                    </div>

                                    {/* Type */}
                                    <div style={{ marginBottom: "24px" }}>
                                        <label style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "1px" }}>
                                            Notification Type
                                        </label>
                                        <select
                                            value={notifyType}
                                            onChange={(e) => setNotifyType(e.target.value)}
                                            style={{
                                                padding: "12px 14px",
                                                borderRadius: "10px",
                                                border: "1px solid var(--border)",
                                                background: "var(--surface)",
                                                color: "white",
                                                fontSize: "13px",
                                                outline: "none",
                                                cursor: "pointer",
                                                fontFamily: "'Inter', sans-serif",
                                            }}
                                        >
                                            <option value="info">ℹ️ Info</option>
                                            <option value="action_required">⚡ Action Required</option>
                                            <option value="approval">✅ Approval</option>
                                            <option value="rejection">❌ Rejection</option>
                                            <option value="status_update">📝 Status Update</option>
                                        </select>
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                                        <button
                                            onClick={() => setShowNotifyModal(false)}
                                            className="glow-btn glow-btn-outline"
                                            style={{ padding: "10px 20px", fontSize: "13px" }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSendNotification}
                                            disabled={!notifyTitle.trim() || !notifyMessage.trim() || notifySending}
                                            className="glow-btn glow-btn-primary"
                                            style={{
                                                padding: "10px 24px",
                                                fontSize: "13px",
                                                opacity: !notifyTitle.trim() || !notifyMessage.trim() || notifySending ? 0.5 : 1,
                                                cursor: !notifyTitle.trim() || !notifyMessage.trim() || notifySending ? "not-allowed" : "pointer",
                                            }}
                                        >
                                            {notifySending ? "Sending..." : "Send Notification 📨"}
                                        </button>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ============ SIDEBAR ============ */}
            <AnimatePresence>
                {mobileSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setMobileSidebarOpen(false)}
                        className="sidebar-overlay"
                        style={{ zIndex: 1000 }}
                    />
                )}
            </AnimatePresence>

            <motion.aside
                initial={false}
                animate={{
                    width: sidebarOpen ? "260px" : "70px",
                    x: typeof window !== 'undefined' && window.innerWidth <= 768
                        ? (mobileSidebarOpen ? 0 : -280)
                        : 0
                }}
                transition={{ duration: 0.3 }}
                style={{
                    background: "rgba(12, 12, 30, 0.95)",
                    backdropFilter: "blur(20px)",
                    borderRight: "1px solid var(--border)",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    height: "100vh",
                    zIndex: 1001,
                }}
            >
                {/* Logo area */}
                <div
                    style={{
                        padding: "20px",
                        borderBottom: "1px solid var(--border)",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                    }}
                >
                    <div
                        style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "10px",
                            background: "var(--gradient-1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 800,
                            fontSize: "16px",
                            flexShrink: 0,
                        }}
                    >
                        T
                    </div>
                    {sidebarOpen && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{
                                fontFamily: "'Space Grotesk', sans-serif",
                                fontWeight: 700,
                                fontSize: "18px",
                                whiteSpace: "nowrap",
                            }}
                        >
                            Tech<span style={{ color: "var(--primary)" }}>pG</span> Admin
                        </motion.span>
                    )}
                </div>

                {/* Nav Items */}
                <div style={{ padding: "16px 12px", flex: 1 }}>
                    {[
                        { key: "dashboard", icon: "🏠", label: "Dashboard", badge: null },
                        { key: "registrations", icon: "📋", label: "Registrations", badge: stats.pending > 0 ? stats.pending : null },
                        { key: "updates", icon: "📂", label: "Projects", badge: null },
                        { key: "communications", icon: "💬", label: "Communications", badge: null },
                        { key: "stats", icon: "📊", label: "Reports", badge: null },
                        { key: "_sep", icon: "", label: "", badge: null },
                        { key: "settings", icon: "⚙️", label: "Settings", badge: null },
                        { key: "audit", icon: "🛡️", label: "Audit Log", badge: null },
                    ].map((item) => {
                        if (item.key === "_sep") return <div key="_sep" style={{ height: "1px", background: "var(--border)", margin: "10px 0" }} />;
                        return (
                            <button
                                key={item.key}
                                onClick={() => setActiveTab(item.key as typeof activeTab)}
                                style={{
                                    width: "100%",
                                    padding: "12px 14px",
                                    borderRadius: "10px",
                                    border: "none",
                                    background:
                                        activeTab === item.key
                                            ? "rgba(108, 99, 255, 0.15)"
                                            : "transparent",
                                    color:
                                        activeTab === item.key
                                            ? "var(--primary-light)"
                                            : "var(--text-secondary)",
                                    fontSize: "14px",
                                    fontWeight: 500,
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                    marginBottom: "4px",
                                    transition: "all 0.2s ease",
                                    fontFamily: "'Inter', sans-serif",
                                    textAlign: "left",
                                    position: "relative",
                                }}
                            >
                                <span style={{ fontSize: "18px", flexShrink: 0 }}>{item.icon}</span>
                                {sidebarOpen && <span style={{ whiteSpace: "nowrap", flex: 1 }}>{item.label}</span>}
                                {item.badge && sidebarOpen && (
                                    <span
                                        style={{
                                            background: "#FF6B6B",
                                            color: "white",
                                            fontSize: "11px",
                                            fontWeight: 700,
                                            borderRadius: "50%",
                                            width: "22px",
                                            height: "22px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        {item.badge}
                                    </span>
                                )}
                                {item.badge && !sidebarOpen && (
                                    <span
                                        style={{
                                            position: "absolute",
                                            top: "6px",
                                            right: "6px",
                                            width: "8px",
                                            height: "8px",
                                            borderRadius: "50%",
                                            background: "#FF6B6B",
                                        }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Bottom section */}
                <div style={{ padding: "16px 12px", borderTop: "1px solid var(--border)" }}>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        style={{
                            width: "100%",
                            padding: "10px 14px",
                            borderRadius: "10px",
                            border: "none",
                            background: "transparent",
                            color: "var(--text-muted)",
                            fontSize: "13px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            marginBottom: "8px",
                            fontFamily: "'Inter', sans-serif",
                        }}
                    >
                        <span style={{ fontSize: "16px" }}>{sidebarOpen ? "◀" : "▶"}</span>
                        {sidebarOpen && "Collapse"}
                    </button>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: "100%",
                            padding: "10px 14px",
                            borderRadius: "10px",
                            border: "none",
                            background: "rgba(255, 107, 107, 0.1)",
                            color: "#FF6B6B",
                            fontSize: "13px",
                            fontWeight: 500,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            fontFamily: "'Inter', sans-serif",
                        }}
                    >
                        <span style={{ fontSize: "16px" }}>🚪</span>
                        {sidebarOpen && "Logout"}
                    </button>
                </div>
            </motion.aside>

            {/* ============ MAIN CONTENT ============ */}
            <main
                style={{
                    flex: 1,
                    marginLeft: isMobile ? 0 : (sidebarOpen ? "260px" : "70px"),
                    transition: "margin 0.3s ease",
                    minHeight: "100vh",
                    padding: isMobile ? "12px" : "24px",
                    width: "100%",
                }}
                className="admin-main-content"
            >
                {/* Mobile Header */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        marginBottom: "16px",
                        background: "rgba(18, 18, 42, 0.5)",
                        padding: "12px 16px",
                        borderRadius: "12px",
                        border: "1px solid var(--border)"
                    }}
                    className="md:hidden"
                >
                    <button
                        onClick={() => setMobileSidebarOpen(true)}
                        style={{ border: "none", background: "rgba(108, 99, 255, 0.1)", color: "var(--primary-light)", padding: "10px", borderRadius: "10px", cursor: "pointer" }}
                    >
                        ☰
                    </button>
                    <h1 style={{ fontSize: "18px", margin: 0, textTransform: "capitalize", fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>{activeTab}</h1>
                </div>

                {/* Top bar */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "28px",
                        flexWrap: "wrap",
                        gap: "16px",
                    }}
                >
                    <div>
                        <h1
                            style={{
                                fontSize: "1.6rem",
                                fontWeight: 700,
                                fontFamily: "'Space Grotesk', sans-serif",
                            }}
                        >
                            {activeTab === "dashboard" && "🏠 Overview"}
                            {activeTab === "registrations" && "📋 Registration Management"}
                            {activeTab === "updates" && "📂 Project Workflow"}
                            {activeTab === "communications" && "💬 Communications"}
                            {activeTab === "stats" && "📊 Reports & Analytics"}
                            {activeTab === "settings" && "⚙️ System Settings"}
                            {activeTab === "audit" && "🛡️ Audit Log"}
                        </h1>
                        <p
                            style={{
                                fontSize: "13px",
                                color: "var(--text-muted)",
                                marginTop: "4px",
                            }}
                        >
                            Welcome back, {admin.email}
                        </p>
                    </div>
                    <button
                        onClick={fetchData}
                        className="glow-btn glow-btn-outline"
                        style={{ fontSize: "13px", padding: "10px 18px" }}
                    >
                        🔄 Refresh
                    </button>
                </div>

                {loading ? (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "300px",
                            color: "var(--text-muted)",
                            fontSize: "14px",
                        }}
                    >
                        <div className="typing-indicator">
                            <span />
                            <span />
                            <span />
                        </div>
                        <span style={{ marginLeft: "12px" }}>Loading data...</span>
                    </div>
                ) : (
                    <>
                        {/* ============ DASHBOARD OVERVIEW TAB ============ */}
                        {activeTab === "dashboard" && (
                            <div>
                                {/* Quick Stats Row */}
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "14px", marginBottom: "24px" }}>
                                    {[
                                        { label: "Total", value: stats.total, color: "#6C63FF", icon: "📊" },
                                        { label: "Pending", value: stats.pending, color: "#FFC107", icon: "⏳" },
                                        { label: "Approved", value: stats.approved, color: "#00FF88", icon: "✅" },
                                        { label: "In Progress", value: stats.inProgress, color: "#00D9FF", icon: "🔄" },
                                        { label: "Completed", value: stats.completed, color: "#8B83FF", icon: "🏆" },
                                        { label: "Rejected", value: stats.rejected, color: "#FF6B6B", icon: "❌" },
                                    ].map((s, i) => (
                                        <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="glass-card" style={{ padding: "18px", textAlign: "center" }}>
                                            <div style={{ fontSize: "20px", marginBottom: "6px" }}>{s.icon}</div>
                                            <div style={{ fontSize: "1.6rem", fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif", color: s.color }}>{s.value}</div>
                                            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>{s.label}</div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Visitor Analytics Row */}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
                                    <div className="glass-card" style={{ padding: "20px", display: "flex", alignItems: "center", gap: "20px", border: "1px solid rgba(0, 255, 136, 0.2)" }}>
                                        <div style={{ width: "50px", height: "50px", borderRadius: "12px", background: "rgba(0, 255, 136, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>👁️</div>
                                        <div>
                                            <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>Today&apos;s Visitors</div>
                                            <div style={{ fontSize: "1.8rem", fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif", color: "#00FF88" }}>{dailyVisitors}</div>
                                        </div>
                                    </div>
                                    <div className="glass-card" style={{ padding: "20px", display: "flex", alignItems: "center", gap: "20px", border: "1px solid rgba(0, 217, 255, 0.2)" }}>
                                        <div style={{ width: "50px", height: "50px", borderRadius: "12px", background: "rgba(0, 217, 255, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>👥</div>
                                        <div>
                                            <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>Total Unique Visits</div>
                                            <div style={{ fontSize: "1.8rem", fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif", color: "#00D9FF" }}>{totalVisitors}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Two-column layout */}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
                                    {/* Project Queue */}
                                    <div className="glass-card" style={{ padding: "24px" }}>
                                        <h3 style={{ fontSize: "1rem", fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", color: "var(--text-secondary)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>📋 Project Queue</h3>
                                        {registrations.filter(r => r.status === "pending").length === 0 ? (
                                            <div style={{ textAlign: "center", padding: "24px", color: "var(--text-muted)", fontSize: "13px" }}>No pending projects</div>
                                        ) : registrations.filter(r => r.status === "pending").slice(0, 5).map((reg, i) => (
                                            <div key={reg.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 0", borderBottom: i < 4 ? "1px solid var(--border)" : "none" }}>
                                                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: reg.project_type === "major" ? "rgba(108,99,255,0.15)" : "rgba(0,217,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>{reg.project_type === "major" ? "🚀" : "🔬"}</div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontSize: "13px", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{reg.users?.full_name}</div>
                                                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{reg.users?.college_name}</div>
                                                </div>
                                                <span className="badge badge-pending" style={{ fontSize: "10px", padding: "2px 8px" }}>pending</span>
                                            </div>
                                        ))}
                                        {registrations.filter(r => r.status === "pending").length > 5 && (
                                            <button onClick={() => setActiveTab("registrations")} style={{ marginTop: "12px", width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid var(--border)", background: "transparent", color: "var(--text-secondary)", fontSize: "12px", cursor: "pointer", fontFamily: "'Inter', sans-serif" }}>View all {registrations.filter(r => r.status === "pending").length} pending →</button>
                                        )}
                                    </div>

                                    {/* Recent Activities */}
                                    <div className="glass-card" style={{ padding: "24px" }}>
                                        <h3 style={{ fontSize: "1rem", fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", color: "var(--text-secondary)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>⚡ Recent Activities</h3>
                                        {updates.length === 0 ? (
                                            <div style={{ textAlign: "center", padding: "24px", color: "var(--text-muted)", fontSize: "13px" }}>No activity yet</div>
                                        ) : updates.slice(0, 5).map((u, i) => (
                                            <div key={u.id} style={{ display: "flex", gap: "10px", alignItems: "flex-start", padding: "10px 0", borderBottom: i < 4 ? "1px solid var(--border)" : "none" }}>
                                                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--primary)", marginTop: "6px", flexShrink: 0 }} />
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontSize: "13px", lineHeight: 1.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{u.update_text}</div>
                                                    <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "2px" }}>{u.created_at && new Date(u.created_at).toLocaleString()}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Charts row */}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                                    {/* Registration Trends (visual bar chart) */}
                                    <div className="glass-card" style={{ padding: "24px" }}>
                                        <h3 style={{ fontSize: "1rem", fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", color: "var(--text-secondary)", marginBottom: "20px" }}>📈 Project Distribution</h3>
                                        <div style={{ display: "flex", gap: "20px", alignItems: "flex-end", height: "120px" }}>
                                            {[
                                                { label: "Mini", value: stats.mini, color: "#00D9FF" },
                                                { label: "Major", value: stats.major, color: "#6C63FF" },
                                            ].map(bar => (
                                                <div key={bar.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                                                    <motion.div initial={{ height: 0 }} animate={{ height: `${stats.total ? (bar.value / stats.total) * 100 : 10}%` }} transition={{ duration: 0.8, delay: 0.2 }} style={{ width: "100%", minHeight: "8px", borderRadius: "8px 8px 0 0", background: `linear-gradient(180deg, ${bar.color}, ${bar.color}60)` }} />
                                                    <div style={{ fontSize: "18px", fontWeight: 700, color: bar.color, fontFamily: "'Space Grotesk', sans-serif" }}>{bar.value}</div>
                                                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{bar.label}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Approval Stats */}
                                    <div className="glass-card" style={{ padding: "24px" }}>
                                        <h3 style={{ fontSize: "1rem", fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", color: "var(--text-secondary)", marginBottom: "20px" }}>🎯 Approval Statistics</h3>
                                        {[
                                            { label: "Approval Rate", value: stats.total > 0 ? Math.round(((stats.approved + stats.completed) / stats.total) * 100) : 0, suffix: "%", color: "#00FF88" },
                                            { label: "Active Projects", value: stats.inProgress, suffix: "", color: "#00D9FF" },
                                            { label: "Completion Rate", value: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0, suffix: "%", color: "#8B83FF" },
                                        ].map((m, i) => (
                                            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 2 ? "1px solid var(--border)" : "none" }}>
                                                <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{m.label}</span>
                                                <span style={{ fontSize: "1.2rem", fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: m.color }}>{m.value}{m.suffix}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ============ REGISTRATIONS TAB ============ */}
                        {activeTab === "registrations" && (
                            <div>
                                {/* Stats cards */}
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                                        gap: "16px",
                                        marginBottom: "24px",
                                    }}
                                >
                                    {[
                                        { label: "Total", value: stats.total, color: "#6C63FF" },
                                        { label: "Pending", value: stats.pending, color: "#FFC107" },
                                        { label: "Approved", value: stats.approved, color: "#00FF88" },
                                        { label: "In Progress", value: stats.inProgress, color: "#00D9FF" },
                                        { label: "Completed", value: stats.completed, color: "#8B83FF" },
                                        { label: "Rejected", value: stats.rejected, color: "#FF6B6B" },
                                    ].map((s, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="glass-card"
                                            style={{
                                                padding: "20px",
                                                textAlign: "center",
                                                cursor: "pointer",
                                                borderColor:
                                                    filterStatus === s.label.toLowerCase()
                                                        ? `${s.color}60`
                                                        : undefined,
                                            }}
                                            onClick={() =>
                                                setFilterStatus(
                                                    filterStatus === s.label.toLowerCase().replace(" ", "_")
                                                        ? "all"
                                                        : s.label.toLowerCase().replace(" ", "_")
                                                )
                                            }
                                        >
                                            <div
                                                style={{
                                                    fontSize: "2rem",
                                                    fontWeight: 800,
                                                    fontFamily: "'Space Grotesk', sans-serif",
                                                    color: s.color,
                                                }}
                                            >
                                                {s.value}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: "12px",
                                                    color: "var(--text-muted)",
                                                    marginTop: "4px",
                                                }}
                                            >
                                                {s.label}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Filters */}
                                <div
                                    style={{
                                        display: "flex",
                                        gap: "12px",
                                        marginBottom: "20px",
                                        flexWrap: "wrap",
                                        alignItems: "center",
                                    }}
                                >
                                    <input
                                        type="text"
                                        placeholder="🔍 Search by name, email, college..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        style={{
                                            flex: 1,
                                            minWidth: "200px",
                                            padding: "12px 16px",
                                            borderRadius: "10px",
                                            border: "1px solid var(--border)",
                                            background: "var(--surface)",
                                            color: "white",
                                            fontSize: "13px",
                                            outline: "none",
                                            fontFamily: "'Inter', sans-serif",
                                        }}
                                    />
                                    <select
                                        value={filterType}
                                        onChange={(e) => setFilterType(e.target.value)}
                                        style={{
                                            padding: "12px 16px",
                                            borderRadius: "10px",
                                            border: "1px solid var(--border)",
                                            background: "var(--surface)",
                                            color: "white",
                                            fontSize: "13px",
                                            outline: "none",
                                            cursor: "pointer",
                                            fontFamily: "'Inter', sans-serif",
                                        }}
                                    >
                                        <option value="all">All Types</option>
                                        <option value="mini">Mini Project</option>
                                        <option value="major">Major Project</option>
                                    </select>
                                </div>

                                {/* Registration list */}
                                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                    {filtered.length === 0 ? (
                                        <div
                                            className="glass-card"
                                            style={{
                                                padding: "48px",
                                                textAlign: "center",
                                                color: "var(--text-muted)",
                                            }}
                                        >
                                            <span style={{ fontSize: "48px", display: "block", marginBottom: "16px" }}>📭</span>
                                            <p>No registrations found</p>
                                        </div>
                                    ) : (
                                        filtered.map((reg, i) => (
                                            <motion.div
                                                key={reg.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.03 }}
                                                className="glass-card"
                                                style={{
                                                    padding: "20px 24px",
                                                    cursor: "pointer",
                                                    borderColor:
                                                        selectedProject?.id === reg.id
                                                            ? "rgba(108, 99, 255, 0.5)"
                                                            : undefined,
                                                }}
                                                onClick={() =>
                                                    setSelectedProject(
                                                        selectedProject?.id === reg.id ? null : reg
                                                    )
                                                }
                                            >
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "space-between",
                                                        flexWrap: "wrap",
                                                        gap: "12px",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: "14px",
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                width: "42px",
                                                                height: "42px",
                                                                borderRadius: "12px",
                                                                background:
                                                                    reg.project_type === "major"
                                                                        ? "rgba(108, 99, 255, 0.15)"
                                                                        : "rgba(0, 217, 255, 0.15)",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                fontSize: "20px",
                                                            }}
                                                        >
                                                            {reg.project_type === "major" ? "🚀" : "🔬"}
                                                        </div>
                                                        <div>
                                                            <div
                                                                style={{
                                                                    fontWeight: 600,
                                                                    fontSize: "15px",
                                                                    fontFamily: "'Space Grotesk', sans-serif",
                                                                }}
                                                            >
                                                                {reg.users?.full_name || "Unknown"}
                                                            </div>
                                                            <div
                                                                style={{
                                                                    fontSize: "12px",
                                                                    color: "var(--text-muted)",
                                                                    marginTop: "2px",
                                                                }}
                                                            >
                                                                {reg.users?.email} • {reg.users?.college_name}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: "10px",
                                                        }}
                                                    >
                                                        <span className={`badge badge-${reg.status}`}>
                                                            {reg.status?.replace("_", " ")}
                                                        </span>
                                                        <span
                                                            style={{
                                                                fontSize: "11px",
                                                                color: "var(--text-muted)",
                                                            }}
                                                        >
                                                            {reg.registration_date &&
                                                                new Date(reg.registration_date).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Expanded details */}
                                                <AnimatePresence>
                                                    {selectedProject?.id === reg.id && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: "auto" }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            style={{ overflow: "hidden" }}
                                                        >
                                                            <div
                                                                style={{
                                                                    marginTop: "20px",
                                                                    paddingTop: "20px",
                                                                    borderTop: "1px solid var(--border)",
                                                                    display: "grid",
                                                                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                                                                    gap: "16px",
                                                                }}
                                                            >
                                                                <div>
                                                                    <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Phone</div>
                                                                    <div style={{ fontSize: "14px" }}>{reg.users?.phone_number}</div>
                                                                </div>
                                                                <div>
                                                                    <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Course/Branch</div>
                                                                    <div style={{ fontSize: "14px" }}>{reg.users?.course_branch}</div>
                                                                </div>
                                                                <div>
                                                                    <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Project Type</div>
                                                                    <div style={{ fontSize: "14px", textTransform: "capitalize" }}>{reg.project_type} Project</div>
                                                                </div>
                                                            </div>

                                                            <div style={{ marginTop: "16px" }}>
                                                                <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>Problem Statement</div>
                                                                <div style={{ fontSize: "14px", lineHeight: 1.6, padding: "14px", borderRadius: "10px", background: "rgba(108, 99, 255, 0.05)", border: "1px solid rgba(108, 99, 255, 0.1)" }}>
                                                                    {reg.problem_statement}
                                                                </div>
                                                            </div>

                                                            {/* Status update + Notify */}
                                                            <div
                                                                style={{
                                                                    marginTop: "16px",
                                                                    display: "flex",
                                                                    gap: "10px",
                                                                    flexWrap: "wrap",
                                                                    alignItems: "flex-end",
                                                                }}
                                                            >
                                                                <div style={{ flex: 1, minWidth: "200px" }}>
                                                                    <label style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "6px" }}>Update Note</label>
                                                                    <input
                                                                        type="text"
                                                                        value={updateText}
                                                                        onChange={(e) => setUpdateText(e.target.value)}
                                                                        placeholder="Add a note (optional)..."
                                                                        onClick={(e) => e.stopPropagation()}
                                                                        style={{
                                                                            width: "100%",
                                                                            padding: "10px 14px",
                                                                            borderRadius: "8px",
                                                                            border: "1px solid var(--border)",
                                                                            background: "var(--surface)",
                                                                            color: "white",
                                                                            fontSize: "13px",
                                                                            outline: "none",
                                                                            fontFamily: "'Inter', sans-serif",
                                                                            boxSizing: "border-box",
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "6px" }}>Status</label>
                                                                    <select
                                                                        value={newStatus}
                                                                        onChange={(e) => setNewStatus(e.target.value)}
                                                                        onClick={(e) => e.stopPropagation()}
                                                                        style={{
                                                                            padding: "10px 14px",
                                                                            borderRadius: "8px",
                                                                            border: "1px solid var(--border)",
                                                                            background: "var(--surface)",
                                                                            color: "white",
                                                                            fontSize: "13px",
                                                                            outline: "none",
                                                                            cursor: "pointer",
                                                                            fontFamily: "'Inter', sans-serif",
                                                                        }}
                                                                    >
                                                                        <option value="">Select status...</option>
                                                                        {STATUS_OPTIONS.map((s) => (
                                                                            <option key={s} value={s}>
                                                                                {s.replace("_", " ")}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        if (newStatus && reg.id) {
                                                                            handleStatusUpdate(reg.id, newStatus, reg);
                                                                        }
                                                                    }}
                                                                    disabled={!newStatus}
                                                                    className="glow-btn glow-btn-primary"
                                                                    style={{
                                                                        padding: "10px 20px",
                                                                        fontSize: "13px",
                                                                        opacity: newStatus ? 1 : 0.5,
                                                                        cursor: newStatus ? "pointer" : "not-allowed",
                                                                    }}
                                                                >
                                                                    Update ✓
                                                                </button>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        openNotifyModal(reg);
                                                                    }}
                                                                    className="glow-btn glow-btn-outline"
                                                                    style={{
                                                                        padding: "10px 20px",
                                                                        fontSize: "13px",
                                                                    }}
                                                                >
                                                                    📨 Notify
                                                                </button>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleDeleteProject(reg.id!);
                                                                    }}
                                                                    style={{
                                                                        padding: "10px 16px",
                                                                        borderRadius: "10px",
                                                                        background: "rgba(255, 71, 87, 0.1)",
                                                                        color: "#FF4757",
                                                                        fontSize: "12px",
                                                                        fontWeight: 600,
                                                                        border: "1px solid rgba(255, 71, 87, 0.2)",
                                                                        cursor: "pointer",
                                                                        marginLeft: "auto"
                                                                    }}
                                                                >
                                                                    🗑️ Delete
                                                                </button>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ============ ACTIVITY LOG TAB ============ */}
                        {activeTab === "updates" && (
                            <div>
                                <h2
                                    style={{
                                        fontSize: "1.2rem",
                                        fontWeight: 600,
                                        marginBottom: "20px",
                                        fontFamily: "'Space Grotesk', sans-serif",
                                        color: "var(--text-secondary)",
                                    }}
                                >
                                    Recent Activity
                                </h2>
                                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                    {updates.length === 0 ? (
                                        <div
                                            className="glass-card"
                                            style={{
                                                padding: "48px",
                                                textAlign: "center",
                                                color: "var(--text-muted)",
                                            }}
                                        >
                                            <span style={{ fontSize: "48px", display: "block", marginBottom: "16px" }}>📭</span>
                                            <p>No activity yet</p>
                                        </div>
                                    ) : (
                                        updates.map((update, i) => (
                                            <motion.div
                                                key={update.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                                className="glass-card"
                                                style={{
                                                    padding: "18px 24px",
                                                    display: "flex",
                                                    alignItems: "flex-start",
                                                    gap: "14px",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: "8px",
                                                        height: "8px",
                                                        borderRadius: "50%",
                                                        background: "var(--primary)",
                                                        marginTop: "6px",
                                                        flexShrink: 0,
                                                    }}
                                                />
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontSize: "14px", lineHeight: 1.6 }}>
                                                        {update.update_text}
                                                    </div>
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            gap: "12px",
                                                            marginTop: "8px",
                                                            flexWrap: "wrap",
                                                        }}
                                                    >
                                                        {update.status_changed_to && (
                                                            <span
                                                                className={`badge badge-${update.status_changed_to}`}
                                                            >
                                                                {update.status_changed_to.replace("_", " ")}
                                                            </span>
                                                        )}
                                                        <span
                                                            style={{
                                                                fontSize: "11px",
                                                                color: "var(--text-muted)",
                                                            }}
                                                        >
                                                            {update.created_at &&
                                                                new Date(update.created_at).toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ============ COMMUNICATIONS TAB (REAL-TIME CHAT) ============ */}
                        {activeTab === "communications" && (
                            <div style={{ display: "grid", gridTemplateColumns: "350px 1fr", gap: "20px", height: "calc(100vh - 180px)" }}>
                                {/* Chat List Sidebar */}
                                <div className="glass-card" style={{ display: "flex", flexDirection: "column", padding: 0, overflow: "hidden" }}>
                                    <div style={{ padding: "20px", borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.02)" }}>
                                        <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: 0 }}>Project Inboxes</h3>
                                        <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>Select a student to start chatting</p>
                                    </div>
                                    <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
                                        {registrations.length === 0 ? (
                                            <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)", fontSize: "13px" }}>No projects found</div>
                                        ) : registrations.map(reg => (
                                            <div
                                                key={reg.id}
                                                onClick={() => setActiveChatId(reg.id || null)}
                                                style={{
                                                    padding: "14px",
                                                    borderRadius: "12px",
                                                    cursor: "pointer",
                                                    marginBottom: "6px",
                                                    background: activeChatId === reg.id ? "rgba(108, 99, 255, 0.15)" : "transparent",
                                                    border: activeChatId === reg.id ? "1px solid rgba(108, 99, 255, 0.3)" : "1px solid transparent",
                                                    transition: "all 0.2s",
                                                    position: "relative"
                                                }}
                                            >
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: onlineUsers.includes(reg.user_id) ? "#00FF88" : "rgba(255,255,255,0.1)" }}></div>
                                                        <div style={{ fontWeight: 600, fontSize: "14px", color: activeChatId === reg.id ? "white" : "var(--text-secondary)" }}>{reg.users?.full_name}</div>
                                                    </div>
                                                    <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>{reg.project_type?.toUpperCase()}</span>
                                                </div>
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                    <div style={{ fontSize: "11px", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "160px" }}>
                                                        {reg.id && typingUsers[reg.id] ? <span style={{ color: "#00FF88" }}>typing...</span> : reg.users?.college_name}
                                                    </div>
                                                    {reg.id && unreadCounts[reg.id] > 0 && (
                                                        <span style={{ background: "#FF4757", color: "white", fontSize: "10px", padding: "2px 6px", borderRadius: "10px", fontWeight: 700 }}>
                                                            {unreadCounts[reg.id]}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Main Chat Area */}
                                <div className="glass-card" style={{ display: "flex", flexDirection: "column", padding: 0, overflow: "hidden" }}>
                                    {activeChatId ? (
                                        <>
                                            {/* Chat Header */}
                                            <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.02)" }}>
                                                {(() => {
                                                    const chatReg = registrations.find(r => r.id === activeChatId);
                                                    return (
                                                        <>
                                                            <div>
                                                                <h4 style={{ margin: 0, fontSize: "15px" }}>{chatReg?.users?.full_name}</h4>
                                                                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{chatReg?.users?.email}</span>
                                                            </div>
                                                            <div style={{ textAlign: "right" }}>
                                                                <span className={`badge badge-${chatReg?.status}`} style={{ fontSize: "10px" }}>{chatReg?.status}</span>
                                                            </div>
                                                        </>
                                                    );
                                                })()}
                                            </div>

                                            {/* Messages Area */}
                                            <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                                                {chatMessages.length === 0 ? (
                                                    <div style={{ textAlign: "center", margin: "auto", color: "var(--text-muted)", fontSize: "13px" }}>No messages yet. Say hi! 👋</div>
                                                ) : chatMessages.map((msg, i) => (
                                                    <div key={i} style={{ alignSelf: msg.sender_type === "admin" ? "flex-end" : "flex-start", maxWidth: "80%" }}>
                                                        <div style={{
                                                            padding: "12px 16px",
                                                            borderRadius: "16px",
                                                            fontSize: "14px",
                                                            lineHeight: 1.5,
                                                            background: msg.sender_type === "admin" ? "var(--gradient-1)" : "rgba(255,255,255,0.05)",
                                                            border: msg.sender_type === "admin" ? "none" : "1px solid var(--border)",
                                                            color: "white"
                                                        }}>
                                                            {msg.content && <div style={{ marginBottom: msg.file_url ? "12px" : 0 }}>{msg.content}</div>}
                                                            {msg.file_url && (
                                                                <div style={{ marginTop: "10px" }}>
                                                                    {msg.file_type?.startsWith('image/') ? (
                                                                        <div style={{ position: "relative" }}>
                                                                            <Image
                                                                                src={msg.file_url!}
                                                                                alt={msg.file_name || "Attachment"}
                                                                                width={400}
                                                                                height={300}
                                                                                style={{
                                                                                    maxWidth: "100%",
                                                                                    height: "auto",
                                                                                    maxHeight: "300px",
                                                                                    borderRadius: "8px",
                                                                                    display: "block",
                                                                                    border: "1px solid rgba(255,255,255,0.1)"
                                                                                }}
                                                                                unoptimized
                                                                            />
                                                                            <a
                                                                                href={msg.file_url}
                                                                                download={msg.file_name}
                                                                                target="_blank"
                                                                                className="glow-btn"
                                                                                style={{
                                                                                    position: "absolute",
                                                                                    top: "10px",
                                                                                    right: "10px",
                                                                                    padding: "8px 12px",
                                                                                    fontSize: "10px",
                                                                                    background: "rgba(0,0,0,0.6)"
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
                                                                            padding: "16px",
                                                                            borderRadius: "12px",
                                                                            background: "rgba(0,0,0,0.25)",
                                                                            border: "1px solid rgba(255,255,255,0.1)",
                                                                            minWidth: "240px"
                                                                        }}>
                                                                            <div style={{ fontSize: "32px" }}>
                                                                                {msg.file_type?.includes('pdf') ? "📄" : "📁"}
                                                                            </div>
                                                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                                                <div style={{
                                                                                    fontWeight: 600,
                                                                                    fontSize: "13px",
                                                                                    whiteSpace: "nowrap",
                                                                                    overflow: "hidden",
                                                                                    textOverflow: "ellipsis"
                                                                                }}>
                                                                                    {msg.file_name}
                                                                                </div>
                                                                                <div style={{ fontSize: "10px", opacity: 0.6, textTransform: "uppercase" }}>
                                                                                    {(msg.file_type || '').split('/')[1] || 'FILE'}
                                                                                </div>
                                                                            </div>
                                                                            <a
                                                                                href={msg.file_url}
                                                                                download={msg.file_name}
                                                                                target="_blank"
                                                                                style={{
                                                                                    background: "var(--primary)",
                                                                                    color: "white",
                                                                                    padding: "8px 12px",
                                                                                    borderRadius: "8px",
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
                                                        <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "4px", textAlign: msg.sender_type === "admin" ? "right" : "left" }}>
                                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    </div>
                                                ))}
                                                <div ref={chatEndRef} />
                                            </div>

                                            {/* Input Area */}
                                            <div style={{ padding: "20px", borderTop: "1px solid var(--border)", background: "rgba(255,255,255,0.01)" }}>
                                                <form onSubmit={sendAdminMessage} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                                                    <label style={{ cursor: "pointer", fontSize: "22px", padding: "5px" }}>
                                                        📎
                                                        <input type="file" onChange={handleAdminFileUpload} style={{ display: "none" }} />
                                                    </label>
                                                    <input
                                                        ref={chatInputRef}
                                                        type="text"
                                                        value={adminMsg}
                                                        onChange={e => {
                                                            setAdminMsg(e.target.value);
                                                            handleTyping(e.target.value.length > 0);
                                                        }}
                                                        onBlur={() => handleTyping(false)}
                                                        placeholder="Write a reply..."
                                                        style={{ flex: 1, padding: "12px 18px", borderRadius: "10px", background: "var(--surface)", border: "1px solid var(--border)", color: "white", outline: "none", fontSize: "14px" }}
                                                    />
                                                    <button type="submit" className="glow-btn glow-btn-primary" style={{ padding: "12px 24px", fontSize: "14px" }}>Send</button>
                                                </form>
                                                {uploadingFile && <div style={{ fontSize: "10px", color: "var(--primary)", marginTop: "8px" }}>Sending file...</div>}
                                            </div>
                                        </>
                                    ) : (
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--text-muted)", padding: "40px", textAlign: "center" }}>
                                            <span style={{ fontSize: "64px", marginBottom: "20px" }}>💬</span>
                                            <h3 style={{ margin: 0 }}>Select a Conversation</h3>
                                            <p style={{ fontSize: "14px", maxWidth: "300px", marginTop: "10px" }}>Click on any project from the left sidebar to see messages and share files.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ============ STATS TAB ============ */}
                        {activeTab === "stats" && (
                            <div>
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                                        gap: "20px",
                                        marginBottom: "30px",
                                    }}
                                >
                                    {/* Project Type Distribution */}
                                    <div className="glass-card" style={{ padding: "28px" }}>
                                        <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "20px", fontFamily: "'Space Grotesk', sans-serif", color: "var(--text-secondary)" }}>
                                            Project Distribution
                                        </h3>
                                        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                                    <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Mini Projects</span>
                                                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#00D9FF" }}>{stats.mini}</span>
                                                </div>
                                                <div style={{ height: "8px", borderRadius: "4px", background: "var(--surface)", overflow: "hidden", marginBottom: "16px" }}>
                                                    <div style={{ width: `${stats.total ? (stats.mini / stats.total) * 100 : 0}%`, height: "100%", borderRadius: "4px", background: "linear-gradient(90deg, #00D9FF, #00FF88)", transition: "width 0.5s ease" }} />
                                                </div>
                                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                                    <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Major Projects</span>
                                                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#6C63FF" }}>{stats.major}</span>
                                                </div>
                                                <div style={{ height: "8px", borderRadius: "4px", background: "var(--surface)", overflow: "hidden" }}>
                                                    <div style={{ width: `${stats.total ? (stats.major / stats.total) * 100 : 0}%`, height: "100%", borderRadius: "4px", background: "var(--gradient-1)", transition: "width 0.5s ease" }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status Overview */}
                                    <div className="glass-card" style={{ padding: "28px" }}>
                                        <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "20px", fontFamily: "'Space Grotesk', sans-serif", color: "var(--text-secondary)" }}>
                                            Status Overview
                                        </h3>
                                        {[
                                            { label: "Pending", value: stats.pending, color: "#FFC107" },
                                            { label: "Approved", value: stats.approved, color: "#00FF88" },
                                            { label: "In Progress", value: stats.inProgress, color: "#00D9FF" },
                                            { label: "Completed", value: stats.completed, color: "#8B83FF" },
                                            { label: "Rejected", value: stats.rejected, color: "#FF6B6B" },
                                        ].map((s, i) => (
                                            <div
                                                key={i}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                    padding: "8px 0",
                                                    borderBottom: i < 4 ? "1px solid var(--border)" : "none",
                                                }}
                                            >
                                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: s.color }} />
                                                    <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{s.label}</span>
                                                </div>
                                                <span style={{ fontSize: "15px", fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: s.color }}>{s.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                <div className="glass-card" style={{ padding: "28px" }}>
                                    <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "16px", fontFamily: "'Space Grotesk', sans-serif", color: "var(--text-secondary)" }}>
                                        Quick Stats
                                    </h3>
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
                                        <div style={{ textAlign: "center", padding: "16px" }}>
                                            <div style={{ fontSize: "2.5rem", fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif", background: "var(--gradient-1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                                {stats.total}
                                            </div>
                                            <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>Total Registrations</div>
                                        </div>
                                        <div style={{ textAlign: "center", padding: "16px" }}>
                                            <div style={{ fontSize: "2.5rem", fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif", color: "#00FF88" }}>
                                                {stats.total > 0 ? Math.round(((stats.approved + stats.completed) / stats.total) * 100) : 0}%
                                            </div>
                                            <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>Approval Rate</div>
                                        </div>
                                        <div style={{ textAlign: "center", padding: "16px" }}>
                                            <div style={{ fontSize: "2.5rem", fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif", color: "#00D9FF" }}>
                                                {stats.inProgress}
                                            </div>
                                            <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>Active Projects</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ============ SETTINGS TAB ============ */}
                        {activeTab === "settings" && (
                            <div>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
                                    <div className="glass-card" style={{ padding: "28px" }}>
                                        <h3 style={{ fontSize: "1rem", fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", color: "var(--text-secondary)", marginBottom: "20px" }}>🔐 Authentication & Security</h3>
                                        {["Two-factor authentication (2FA)", "Session management", "Password policies", "Role-based access control", "IP whitelisting/blacklisting"].map((item, i) => (
                                            <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 0", borderBottom: i < 4 ? "1px solid var(--border)" : "none" }}>
                                                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent-green)" }} />
                                                <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{item}</span>
                                                <span style={{ marginLeft: "auto", fontSize: "11px", color: "var(--text-muted)", padding: "2px 10px", borderRadius: "6px", background: "rgba(0, 255, 136, 0.08)", border: "1px solid rgba(0, 255, 136, 0.15)" }}>Enabled</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="glass-card" style={{ padding: "28px" }}>
                                        <h3 style={{ fontSize: "1rem", fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", color: "var(--text-secondary)", marginBottom: "20px" }}>🛡️ Data Protection</h3>
                                        {["End-to-end encryption", "Regular security audits", "Data backup & recovery", "Privacy policy compliance", "Secure file storage"].map((item, i) => (
                                            <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 0", borderBottom: i < 4 ? "1px solid var(--border)" : "none" }}>
                                                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--primary)" }} />
                                                <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{item}</span>
                                                <span style={{ marginLeft: "auto", fontSize: "11px", color: "var(--text-muted)", padding: "2px 10px", borderRadius: "6px", background: "rgba(108, 99, 255, 0.08)", border: "1px solid rgba(108, 99, 255, 0.15)" }}>Active</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="glass-card" style={{ padding: "28px" }}>
                                        <h3 style={{ fontSize: "1rem", fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", color: "var(--text-secondary)", marginBottom: "20px" }}>⚡ Performance</h3>
                                        {["Optimized database queries", "Caching mechanisms", "CDN integration", "Mobile-responsive design", "API rate limiting"].map((item, i) => (
                                            <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 0", borderBottom: i < 4 ? "1px solid var(--border)" : "none" }}>
                                                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent)" }} />
                                                <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{item}</span>
                                                <span style={{ marginLeft: "auto", fontSize: "11px", color: "var(--text-muted)", padding: "2px 10px", borderRadius: "6px", background: "rgba(0, 217, 255, 0.08)", border: "1px solid rgba(0, 217, 255, 0.15)" }}>Online</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ============ AUDIT LOG TAB ============ */}
                        {activeTab === "audit" && (
                            <div>
                                <div className="glass-card" style={{ padding: "28px" }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                                        <h3 style={{ fontSize: "1rem", fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", color: "var(--text-secondary)" }}>📜 System Audit Trail</h3>
                                        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{updates.length} events</span>
                                    </div>
                                    {updates.length === 0 ? (
                                        <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                                            <span style={{ fontSize: "36px", display: "block", marginBottom: "12px" }}>📋</span>
                                            <p>No audit events recorded yet</p>
                                        </div>
                                    ) : updates.slice(0, 20).map((u, i) => (
                                        <div key={u.id} style={{ display: "flex", gap: "14px", alignItems: "flex-start", padding: "14px 0", borderBottom: i < 19 ? "1px solid var(--border)" : "none" }}>
                                            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(108, 99, 255, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>
                                                {u.update_text?.includes("approved") ? "✅" : u.update_text?.includes("rejected") ? "❌" : u.update_text?.includes("progress") ? "🔄" : "📝"}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: "13px", fontWeight: 500, marginBottom: "2px" }}>{u.update_text}</div>
                                                <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{u.created_at && new Date(u.created_at).toLocaleString()} • Project: {u.project_id?.slice(0, 8)}...</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Detail Modal Overlay */}
            <style jsx global>{`
                select option {
                    background: #1a1a3a;
                    color: white;
                }
            `}</style>
        </div>
    );
}
