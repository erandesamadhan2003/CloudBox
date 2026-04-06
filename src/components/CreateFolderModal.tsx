import { useState } from "react";
import { BsFolderPlus, BsXLg } from "react-icons/bs";

type CreateFolderModalProps = {
    isOpen: boolean;
    onCreate: (name: string) => Promise<boolean>;
    onClose: () => void;
};

export default function CreateFolderModal({
    isOpen,
    onCreate,
    onClose,
}: CreateFolderModalProps) {
    const [name, setName] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleCreate = async () => {
        if (!name.trim()) {
            setError("Please enter a folder name.");
            return;
        }
        setIsCreating(true);
        setError(null);
        const ok = await onCreate(name.trim());
        setIsCreating(false);

        if (ok) {
            setName("");
            onClose();
        } else {
            setError("Could not create folder. Try again.");
        }
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
                className="w-full max-w-sm rounded-3xl p-6 shadow-2xl"
                style={{
                    background: "rgba(11,16,34,0.95)",
                    border: "1px solid rgba(99,102,241,0.20)",
                    backdropFilter: "blur(24px)",
                }}
            >
                {/* Header */}
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
                            <BsFolderPlus
                                size={17}
                                className="text-[#818CF8]"
                            />
                        </div>
                        <h2
                            className="text-lg font-bold text-white"
                            style={{ fontFamily: "'Sora', sans-serif" }}
                        >
                            New Folder
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-xl text-white/40 transition hover:bg-white/8 hover:text-white/80"
                    >
                        <BsXLg size={13} />
                    </button>
                </div>

                {/* Input */}
                <input
                    type="text"
                    placeholder="Folder name"
                    value={name}
                    autoFocus
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && void handleCreate()}
                    className="w-full rounded-xl border px-4 py-3 text-sm text-white/90 outline-none transition duration-200 placeholder:text-white/25"
                    style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(99,102,241,0.20)",
                        fontFamily: "'DM Sans', sans-serif",
                    }}
                />

                {error && (
                    <p className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                        {error}
                    </p>
                )}

                {/* Actions */}
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
                        onClick={() => void handleCreate()}
                        disabled={isCreating}
                        className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-40"
                        style={{
                            background:
                                "linear-gradient(135deg, #6366F1, #8B5CF6)",
                            boxShadow: "0 4px 16px rgba(99,102,241,0.35)",
                            fontFamily: "'DM Sans', sans-serif",
                        }}
                    >
                        {isCreating ? "Creating..." : "Create"}
                    </button>
                </div>
            </div>
        </div>
    );
}
