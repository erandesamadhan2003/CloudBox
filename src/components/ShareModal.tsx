import { useEffect, useState } from "react";
import { BsShareFill, BsXLg } from "react-icons/bs";
import type { CloudFile } from "@/api/services/file.service";
import type { SharePermission } from "@/api/services/share.service";

type ShareModalProps = {
    isOpen: boolean;
    file: CloudFile | null;
    onClose: () => void;
    onShare: (
        fileId: string,
        recipientEmail: string,
        permission: SharePermission,
    ) => Promise<{ success: boolean; error?: string }>;
};

export default function ShareModal({
    isOpen,
    file,
    onClose,
    onShare,
}: ShareModalProps) {
    const [email, setEmail] = useState("");
    const [permission, setPermission] = useState<SharePermission>("view");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) {
            setEmail("");
            setPermission("view");
            setError(null);
            setIsSubmitting(false);
        }
    }, [isOpen]);

    if (!isOpen || !file) return null;

    const handleShare = async () => {
        if (!email.trim()) {
            setError("Please enter a recipient email.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        const result = await onShare(file.id, email.trim(), permission);

        setIsSubmitting(false);
        if (!result.success) {
            setError(result.error ?? "Failed to share file.");
            return;
        }

        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
                background: "rgba(0,0,0,0.65)",
                backdropFilter: "blur(6px)",
            }}
        >
            <div
                className="w-full max-w-md rounded-3xl p-6 shadow-2xl"
                style={{
                    background: "rgba(11,16,34,0.95)",
                    border: "1px solid rgba(99,102,241,0.20)",
                    backdropFilter: "blur(24px)",
                }}
            >
                <div className="mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className="flex h-9 w-9 items-center justify-center rounded-xl"
                            style={{
                                background:
                                    "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(6,182,212,0.15))",
                                border: "1px solid rgba(99,102,241,0.25)",
                            }}
                        >
                            <BsShareFill size={16} className="text-[#818CF8]" />
                        </div>
                        <div>
                            <h2
                                className="text-lg font-bold text-white"
                                style={{ fontFamily: "'Sora', sans-serif" }}
                            >
                                Share File
                            </h2>
                            <p
                                className="truncate text-xs text-white/35"
                                style={{
                                    fontFamily: "'DM Sans', sans-serif",
                                    maxWidth: "230px",
                                }}
                                title={file.file_name}
                            >
                                {file.file_name}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-xl text-white/40 transition hover:bg-white/8 hover:text-white/80"
                    >
                        <BsXLg size={13} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label
                            className="mb-1.5 block text-xs text-white/45"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                            Recipient email
                        </label>
                        <input
                            type="email"
                            placeholder="friend@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === "Enter" && void handleShare()
                            }
                            className="w-full rounded-xl border px-4 py-3 text-sm text-white/90 outline-none transition placeholder:text-white/25"
                            style={{
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(99,102,241,0.20)",
                                fontFamily: "'DM Sans', sans-serif",
                            }}
                        />
                    </div>

                    <div>
                        <label
                            className="mb-1.5 block text-xs text-white/45"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                            Permission
                        </label>
                        <select
                            value={permission}
                            onChange={(e) =>
                                setPermission(e.target.value as SharePermission)
                            }
                            className="w-full rounded-xl border px-4 py-3 text-sm text-white/90 outline-none"
                            style={{
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(99,102,241,0.20)",
                                fontFamily: "'DM Sans', sans-serif",
                            }}
                        >
                            <option value="view">View</option>
                            <option value="edit">Edit</option>
                        </select>
                    </div>
                </div>

                {error && (
                    <p className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                        {error}
                    </p>
                )}

                <div className="mt-5 flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 rounded-xl py-2.5 text-sm font-medium text-white/50 transition hover:bg-white/5"
                        style={{
                            border: "1px solid rgba(255,255,255,0.08)",
                            fontFamily: "'DM Sans', sans-serif",
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={() => void handleShare()}
                        disabled={isSubmitting}
                        className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-40"
                        style={{
                            background:
                                "linear-gradient(135deg, #6366F1, #8B5CF6)",
                            boxShadow: "0 4px 16px rgba(99,102,241,0.35)",
                            fontFamily: "'DM Sans', sans-serif",
                        }}
                    >
                        {isSubmitting ? "Sharing..." : "Share"}
                    </button>
                </div>
            </div>
        </div>
    );
}
