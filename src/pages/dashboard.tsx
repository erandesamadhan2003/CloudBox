import { useState } from "react";
import {
    BsCloudArrowUpFill,
    BsFileEarmarkFill,
    BsArrowUpRight,
} from "react-icons/bs";
import { useFiles } from "@/hooks/useFiles";
import ShareModal from "@/components/ShareModal";
import type { CloudFile } from "@/api/services/file.service";
import {
    shareFileWithEmail,
    type SharePermission,
} from "@/api/services/share.service";
import FileCard from "@/components/FileCard";
import UploadModal from "@/components/UploadModal";

function StatCard({
    icon,
    label,
    value,
    accent,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    accent: string;
}) {
    return (
        <div
            className="flex items-center gap-4 rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5"
            style={{
                background: "rgba(15,23,42,0.70)",
                border: "1px solid rgba(99,102,241,0.12)",
                backdropFilter: "blur(12px)",
            }}
        >
            <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                style={{
                    background: `${accent}18`,
                    border: `1px solid ${accent}30`,
                }}
            >
                <span style={{ color: accent }}>{icon}</span>
            </div>
            <div>
                <p
                    className="text-2xl font-bold text-white"
                    style={{ fontFamily: "'Sora', sans-serif" }}
                >
                    {value}
                </p>
                <p
                    className="text-sm text-white/45"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                    {label}
                </p>
            </div>
        </div>
    );
}

export default function Dashboard() {
    const {
        files,
        isLoading: filesLoading,
        isUploading,
        uploadFile,
        deleteFile,
        renameFile,
        toggleVisibility,
    } = useFiles(null, { includeAllFolders: true });

    const [uploadOpen, setUploadOpen] = useState(false);
    const [sharingFile, setSharingFile] = useState<CloudFile | null>(null);
    const [renamingFile, setRenamingFile] = useState<{
        id: string;
        name: string;
    } | null>(null);
    const [newName, setNewName] = useState("");

    const totalSizeMB =
        files.reduce((acc, f) => acc + f.file_size, 0) / 1024 / 1024;

    const handleRenameFile = async () => {
        if (!renamingFile || !newName.trim()) return;
        await renameFile(renamingFile.id, newName.trim());
        setRenamingFile(null);
        setNewName("");
    };

    const handleShare = async (
        fileId: string,
        recipientEmail: string,
        permission: SharePermission,
    ) => {
        return shareFileWithEmail(fileId, recipientEmail, permission);
    };

    const RenameDialog = ({
        title,
        onConfirm,
        onCancel,
    }: {
        title: string;
        onConfirm: () => void;
        onCancel: () => void;
    }) => (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(6px)",
            }}
        >
            <div
                className="w-full max-w-sm rounded-3xl p-6 shadow-2xl"
                style={{
                    background: "rgba(11,16,34,0.95)",
                    border: "1px solid rgba(99,102,241,0.20)",
                }}
            >
                <h3
                    className="mb-4 text-lg font-bold text-white"
                    style={{ fontFamily: "'Sora', sans-serif" }}
                >
                    {title}
                </h3>
                <input
                    type="text"
                    autoFocus
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && onConfirm()}
                    className="w-full rounded-xl px-4 py-3 text-sm text-white/90 outline-none"
                    style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(99,102,241,0.20)",
                        fontFamily: "'DM Sans', sans-serif",
                    }}
                />
                <div className="mt-4 flex gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 rounded-xl py-2.5 text-sm text-white/50"
                        style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white"
                        style={{
                            background:
                                "linear-gradient(135deg, #6366F1, #8B5CF6)",
                        }}
                    >
                        Rename
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col gap-8">
            {/* Header */}
            <div>
                <h1
                    className="text-3xl font-bold text-white"
                    style={{ fontFamily: "'Sora', sans-serif" }}
                >
                    Dashboard
                </h1>
                <p
                    className="mt-1 text-sm text-white/45"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                    Welcome back! Here's your storage overview.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard
                    icon={<BsCloudArrowUpFill size={22} />}
                    label="Storage Used"
                    value={`${totalSizeMB.toFixed(2)} MB`}
                    accent="#06B6D4"
                />
                <StatCard
                    icon={<BsFileEarmarkFill size={22} />}
                    label="Total Files"
                    value={String(files.length)}
                    accent="#8B5CF6"
                />
            </div>

            {/* Files section */}
            <section>
                <div className="mb-4 flex items-center justify-between">
                    <h2
                        className="text-base font-bold text-white/80"
                        style={{ fontFamily: "'Sora', sans-serif" }}
                    >
                        Recent Files
                    </h2>
                    <button
                        type="button"
                        onClick={() => setUploadOpen(true)}
                        className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium text-[#06B6D4] transition hover:bg-[#06B6D4]/10"
                        style={{ border: "1px solid rgba(6,182,212,0.20)" }}
                    >
                        Upload <BsArrowUpRight size={10} />
                    </button>
                </div>
                {filesLoading ? (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="h-40 animate-pulse rounded-2xl"
                                style={{ background: "rgba(255,255,255,0.04)" }}
                            />
                        ))}
                    </div>
                ) : files.length === 0 ? (
                    <div
                        className="flex flex-col items-center justify-center gap-3 rounded-2xl py-16"
                        style={{
                            border: "1px dashed rgba(99,102,241,0.18)",
                            background: "rgba(255,255,255,0.015)",
                        }}
                    >
                        <div
                            className="flex h-14 w-14 items-center justify-center rounded-2xl"
                            style={{
                                background:
                                    "linear-gradient(135deg, rgba(99,102,241,0.20), rgba(6,182,212,0.10))",
                                border: "1px solid rgba(99,102,241,0.18)",
                            }}
                        >
                            <BsCloudArrowUpFill
                                size={22}
                                className="text-[#818CF8]"
                            />
                        </div>
                        <p
                            className="text-sm text-white/35"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                            No files yet — upload something!
                        </p>
                        <button
                            type="button"
                            onClick={() => setUploadOpen(true)}
                            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
                            style={{
                                background:
                                    "linear-gradient(135deg, #6366F1, #8B5CF6)",
                                boxShadow: "0 4px 16px rgba(99,102,241,0.35)",
                                fontFamily: "'DM Sans', sans-serif",
                            }}
                        >
                            Upload your first file
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {files.slice(0, 10).map((f) => (
                            <FileCard
                                key={f.id}
                                file={f}
                                onDelete={deleteFile}
                                onRename={(id, name) => {
                                    setRenamingFile({ id, name });
                                    setNewName(name);
                                }}
                                onToggleVisibility={toggleVisibility}
                                onShare={(file) => setSharingFile(file)}
                            />
                        ))}
                    </div>
                )}
            </section>

            <UploadModal
                isOpen={uploadOpen}
                isUploading={isUploading}
                onClose={() => setUploadOpen(false)}
                onUpload={uploadFile}
            />
            <ShareModal
                isOpen={Boolean(sharingFile)}
                file={sharingFile}
                onClose={() => setSharingFile(null)}
                onShare={handleShare}
            />

            {renamingFile && (
                <RenameDialog
                    title="Rename File"
                    onConfirm={() => void handleRenameFile()}
                    onCancel={() => setRenamingFile(null)}
                />
            )}
        </div>
    );
}
