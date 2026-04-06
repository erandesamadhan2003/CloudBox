import type { CloudFile } from "@/api/services/file.service";
import FileCard from "@/components/FileCard";

type FileListProps = {
    files: CloudFile[];
    isLoading?: boolean;
    emptyMessage?: string;
    onDelete?: (id: string, filePath: string) => void;
    onRename?: (id: string, currentName: string) => void;
    onToggleVisibility?: (id: string, makePublic: boolean) => void;
    onShare?: (file: CloudFile) => void;
};

export default function FileList({
    files,
    isLoading = false,
    emptyMessage = "No files found.",
    onDelete,
    onRename,
    onToggleVisibility,
    onShare,
}: FileListProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {[...Array(6)].map((_, index) => (
                    <div
                        key={index}
                        className="h-40 animate-pulse rounded-2xl"
                        style={{ background: "rgba(255,255,255,0.04)" }}
                    />
                ))}
            </div>
        );
    }

    if (!files.length) {
        return (
            <div
                className="flex items-center justify-center rounded-2xl py-10"
                style={{
                    border: "1px dashed rgba(99,102,241,0.18)",
                    background: "rgba(255,255,255,0.015)",
                }}
            >
                <p
                    className="text-sm text-white/30"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                    {emptyMessage}
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {files.map((file) => (
                <FileCard
                    key={file.id}
                    file={file}
                    onDelete={onDelete}
                    onRename={onRename}
                    onToggleVisibility={onToggleVisibility}
                    onShare={onShare}
                />
            ))}
        </div>
    );
}
