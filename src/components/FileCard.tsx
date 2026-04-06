import {
    BsFilePdfFill,
    BsFileImageFill,
    BsFilePlayFill,
    BsFileMusicFill,
    BsFileZipFill,
    BsFileTextFill,
    BsFileEarmarkFill,
    BsGlobe2,
    BsLockFill,
    BsTrash3,
    BsPencil,
    BsDownload,
    BsEye,
    BsShare,
} from "react-icons/bs";
import type { CloudFile } from "@/api/services/file.service";
import { getFileUrl } from "@/api/services/file.service";

type FileCardProps = {
    file: CloudFile;
    onDelete?: (id: string, filePath: string) => void;
    onRename?: (id: string, currentName: string) => void;
    onToggleVisibility?: (id: string, makePublic: boolean) => void;
    onShare?: (file: CloudFile) => void;
};

function formatBytes(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function FileIcon({ mimeType }: { mimeType?: string }) {
    const t = mimeType ?? "";
    if (t.startsWith("image/"))
        return <BsFileImageFill size={26} className="text-emerald-400" />;
    if (t === "application/pdf")
        return <BsFilePdfFill size={26} className="text-red-400" />;
    if (t.startsWith("video/"))
        return <BsFilePlayFill size={26} className="text-blue-400" />;
    if (t.startsWith("audio/"))
        return <BsFileMusicFill size={26} className="text-pink-400" />;
    if (t.includes("zip") || t.includes("rar"))
        return <BsFileZipFill size={26} className="text-yellow-400" />;
    if (t.startsWith("text/"))
        return <BsFileTextFill size={26} className="text-cyan-400" />;
    return <BsFileEarmarkFill size={26} className="text-white/40" />;
}

export default function FileCard({
    file,
    onDelete,
    onRename,
    onToggleVisibility,
    onShare,
}: FileCardProps) {
    const isPublic = file.visibility === "public";

    const handleOpen = async () => {
        const { url } = await getFileUrl(file.file_path, isPublic);
        if (url) window.open(url, "_blank");
    };

    return (
        <div
            className="group relative flex flex-col gap-3 rounded-2xl p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.6)]"
            style={{
                background: "rgba(15,23,42,0.70)",
                border: "1px solid rgba(99,102,241,0.12)",
                backdropFilter: "blur(12px)",
            }}
        >
            {/* Top row */}
            <div className="flex items-start justify-between">
                <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                >
                    <FileIcon mimeType={file.mime_type} />
                </div>

                <span
                    className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium"
                    style={{
                        background: isPublic
                            ? "rgba(6,182,212,0.12)"
                            : "rgba(255,255,255,0.05)",
                        color: isPublic ? "#06B6D4" : "rgba(255,255,255,0.35)",
                        border: isPublic
                            ? "1px solid rgba(6,182,212,0.25)"
                            : "1px solid rgba(255,255,255,0.07)",
                    }}
                >
                    {isPublic ? (
                        <BsGlobe2 size={10} />
                    ) : (
                        <BsLockFill size={10} />
                    )}
                    {isPublic ? "Public" : "Private"}
                </span>
            </div>

            {/* Name + size */}
            <div>
                <p
                    className="truncate text-sm font-semibold text-white/90"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                    title={file.file_name}
                >
                    {file.file_name}
                </p>
                <p
                    className="mt-0.5 text-xs text-white/35"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                    {formatBytes(file.file_size)} ·{" "}
                    {formatDate(file.created_at)}
                </p>
            </div>

            {/* Actions on hover */}
            <div className="flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <button
                    type="button"
                    title="Download"
                    onClick={() => void handleOpen()}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-white/40 transition hover:bg-white/8 hover:text-white/80"
                >
                    <BsDownload size={13} />
                </button>
                <button
                    type="button"
                    title="Preview"
                    onClick={() => void handleOpen()}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-white/40 transition hover:bg-white/8 hover:text-white/80"
                >
                    <BsEye size={13} />
                </button>
                {onShare && (
                    <button
                        type="button"
                        title="Share"
                        onClick={() => onShare(file)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-white/40 transition hover:bg-white/8 hover:text-white/80"
                    >
                        <BsShare size={12} />
                    </button>
                )}
                {onRename && (
                    <button
                        type="button"
                        title="Rename"
                        onClick={() => onRename(file.id, file.file_name)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-white/40 transition hover:bg-white/8 hover:text-white/80"
                    >
                        <BsPencil size={12} />
                    </button>
                )}
                {onToggleVisibility && (
                    <button
                        type="button"
                        title="Toggle visibility"
                        onClick={() => onToggleVisibility(file.id, !isPublic)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-white/40 transition hover:bg-white/8 hover:text-white/80"
                    >
                        {isPublic ? (
                            <BsLockFill size={12} />
                        ) : (
                            <BsGlobe2 size={12} />
                        )}
                    </button>
                )}
                {onDelete && (
                    <button
                        type="button"
                        title="Delete"
                        onClick={() => onDelete(file.id, file.file_path)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-white/40 transition hover:bg-red-500/15 hover:text-red-400"
                    >
                        <BsTrash3 size={12} />
                    </button>
                )}
            </div>
        </div>
    );
}
