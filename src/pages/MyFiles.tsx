import { useState } from "react";
import { BsArrowUpRight, BsFolderFill } from "react-icons/bs";
import type { CloudFile } from "@/api/services/file.service";
import {
    shareFileWithEmail,
    type SharePermission,
} from "@/api/services/share.service";
import FileCard from "@/components/FileCard";
import FolderCard from "@/components/FolderCard";
import ShareModal from "@/components/ShareModal";
import UploadModal from "@/components/UploadModal";
import { useFiles } from "@/hooks/useFiles";
import { useFolders } from "@/hooks/useFolders";

export default function MyFiles() {
    const {
        files,
        isLoading: filesLoading,
        isUploading,
        uploadFile,
        deleteFile,
        renameFile,
        toggleVisibility,
    } = useFiles(null);

    const {
        folders,
        isLoading: foldersLoading,
        deleteFolder,
        renameFolder,
    } = useFolders(null);

    const [uploadOpen, setUploadOpen] = useState(false);
    const [folderOpen, setFolderOpen] = useState(false);
    const [sharingFile, setSharingFile] = useState<CloudFile | null>(null);
    const [renamingFile, setRenamingFile] = useState<{
        id: string;
        name: string;
    } | null>(null);
    const [renamingFolder, setRenamingFolder] = useState<{
        id: string;
        name: string;
    } | null>(null);
    const [newName, setNewName] = useState("");

    const handleShare = async (
        fileId: string,
        recipientEmail: string,
        permission: SharePermission,
    ) => {
        return shareFileWithEmail(fileId, recipientEmail, permission);
    };

    const handleRenameFile = async () => {
        if (!renamingFile || !newName.trim()) return;
        await renameFile(renamingFile.id, newName.trim());
        setRenamingFile(null);
        setNewName("");
    };

    const handleRenameFolder = async () => {
        if (!renamingFolder || !newName.trim()) return;
        await renameFolder(renamingFolder.id, newName.trim());
        setRenamingFolder(null);
        setNewName("");
    };

    const RenameDialog = ({
        onConfirm,
        onCancel,
    }: {
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
                    Rename File
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
        <div className="space-y-6">
            {/* Header with stats */}
            <div>
                <h1
                    className="text-3xl font-bold text-white"
                    style={{ fontFamily: "'Sora', sans-serif" }}
                >
                    My Files
                </h1>
                <p
                    className="mt-1 text-sm text-white/45"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                    All your files and folders in one place
                </p>
            </div>

            {/* Folders section */}
            {folders.length > 0 && (
                <section
                    className="rounded-2xl p-5"
                    style={{
                        background:
                            "linear-gradient(135deg, rgba(99,102,241,0.06), rgba(139,92,246,0.04))",
                        border: "1px solid rgba(99,102,241,0.15)",
                    }}
                >
                    <h2
                        className="mb-4 flex items-center gap-2 text-sm font-bold text-[#818CF8]"
                        style={{ fontFamily: "'Sora', sans-serif" }}
                    >
                        <BsFolderFill size={14} />
                        Folders ({folders.length})
                    </h2>
                    {foldersLoading ? (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            {[...Array(3)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-32 animate-pulse rounded-2xl"
                                    style={{
                                        background: "rgba(255,255,255,0.04)",
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            {folders.map((f) => (
                                <FolderCard
                                    key={f.id}
                                    folder={f}
                                    onDelete={deleteFolder}
                                    onRename={(id, name) => {
                                        setRenamingFolder({ id, name });
                                        setNewName(name);
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </section>
            )}

            {/* Files section */}
            <section>
                <div className="mb-4 flex items-center justify-between">
                    <h2
                        className="text-base font-bold text-white/80"
                        style={{ fontFamily: "'Sora', sans-serif" }}
                    >
                        All Files
                    </h2>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setFolderOpen(true)}
                            className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium text-[#818CF8] transition hover:bg-[#818CF8]/10"
                            style={{
                                border: "1px solid rgba(129,140,248,0.20)",
                            }}
                        >
                            New Folder <BsArrowUpRight size={10} />
                        </button>
                        <button
                            type="button"
                            onClick={() => setUploadOpen(true)}
                            className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium text-[#06B6D4] transition hover:bg-[#06B6D4]/10"
                            style={{ border: "1px solid rgba(6,182,212,0.20)" }}
                        >
                            Upload <BsArrowUpRight size={10} />
                        </button>
                    </div>
                </div>
                {filesLoading ? (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {[...Array(10)].map((_, i) => (
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
                        <p
                            className="text-sm text-white/35"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                            No files yet — upload your first file!
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
                            Upload File
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {files.map((f) => (
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
                    onConfirm={() => void handleRenameFile()}
                    onCancel={() => setRenamingFile(null)}
                />
            )}
        </div>
    );
}
