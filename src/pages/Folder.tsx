import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BsArrowLeft, BsArrowUpRight, BsFolderFill } from "react-icons/bs";
import type { CloudFile } from "@/api/services/file.service";
import {
    shareFileWithEmail,
    type SharePermission,
} from "@/api/services/share.service";
import CreateFolderModal from "@/components/CreateFolderModal";
import FileList from "@/components/FileList";
import FolderCard from "@/components/FolderCard";
import ShareModal from "@/components/ShareModal";
import UploadModal from "@/components/UploadModal";
import { useFiles } from "@/hooks/useFiles";
import { useFolders } from "@/hooks/useFolders";

export default function FolderPage() {
    const { folderId } = useParams<{ folderId: string }>();
    const currentFolderId = folderId ?? null;

    const {
        files,
        isLoading: filesLoading,
        isUploading,
        uploadFile,
        deleteFile,
        renameFile,
        toggleVisibility,
    } = useFiles(currentFolderId);

    const {
        folders,
        isLoading: foldersLoading,
        createFolder,
        deleteFolder,
        renameFolder,
    } = useFolders(currentFolderId);

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

    if (!folderId) {
        return (
            <div
                className="rounded-2xl p-6 text-sm text-white/60"
                style={{
                    background: "rgba(15,23,42,0.70)",
                    border: "1px solid rgba(99,102,241,0.12)",
                }}
            >
                Invalid folder route.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center gap-2 text-xs text-[#818CF8] hover:text-[#A5B4FC] transition"
                    >
                        <BsArrowLeft size={12} />
                        Back to Dashboard
                    </Link>
                    <div className="flex items-center gap-2">
                        <BsFolderFill size={20} className="text-[#818CF8]" />
                        <h1
                            className="text-2xl font-bold text-white"
                            style={{ fontFamily: "'Sora', sans-serif" }}
                        >
                            Folder Contents
                        </h1>
                    </div>
                    <p
                        className="text-xs text-white/40"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                        Manage files and subfolders in this directory
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setFolderOpen(true)}
                        className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium text-[#818CF8] transition hover:bg-[#818CF8]/10"
                        style={{ border: "1px solid rgba(129,140,248,0.20)" }}
                    >
                        New Folder <BsArrowUpRight size={10} />
                    </button>
                    <button
                        type="button"
                        onClick={() => setUploadOpen(true)}
                        className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium text-[#06B6D4] transition hover:bg-[#06B6D4]/10"
                        style={{ border: "1px solid rgba(6,182,212,0.20)" }}
                    >
                        Upload <BsArrowUpRight size={10} />
                    </button>
                </div>
            </div>

            {/* Subfolders section - HIGHLIGHTED */}
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
                        Subfolders ({folders.length})
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

            {/* Files section - FULL LIST */}
            <section>
                <h2
                    className="mb-4 text-base font-bold text-white/80"
                    style={{ fontFamily: "'Sora', sans-serif" }}
                >
                    Files in Folder ({files.length})
                </h2>
                <FileList
                    files={files}
                    isLoading={filesLoading}
                    emptyMessage="This folder is empty. Upload files or create subfolders."
                    onDelete={deleteFile}
                    onRename={(id, name) => {
                        setRenamingFile({ id, name });
                        setNewName(name);
                    }}
                    onToggleVisibility={toggleVisibility}
                    onShare={(file) => setSharingFile(file)}
                />
            </section>

            <UploadModal
                isOpen={uploadOpen}
                isUploading={isUploading}
                onClose={() => setUploadOpen(false)}
                onUpload={uploadFile}
            />
            <CreateFolderModal
                isOpen={folderOpen}
                onClose={() => setFolderOpen(false)}
                onCreate={createFolder}
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
            {renamingFolder && (
                <RenameDialog
                    title="Rename Folder"
                    onConfirm={() => void handleRenameFolder()}
                    onCancel={() => setRenamingFolder(null)}
                />
            )}
        </div>
    );
}
