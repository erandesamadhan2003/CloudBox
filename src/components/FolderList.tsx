import type { Folder } from "@/api/services/folder.service";
import FolderCard from "@/components/FolderCard";

type FolderListProps = {
    folders: Folder[];
    isLoading?: boolean;
    emptyMessage?: string;
    onDelete?: (id: string) => void;
    onRename?: (id: string, currentName: string) => void;
};

export default function FolderList({
    folders,
    isLoading = false,
    emptyMessage = "No folders found.",
    onDelete,
    onRename,
}: FolderListProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {[...Array(4)].map((_, index) => (
                    <div
                        key={index}
                        className="h-32 animate-pulse rounded-2xl"
                        style={{ background: "rgba(255,255,255,0.04)" }}
                    />
                ))}
            </div>
        );
    }

    if (!folders.length) {
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
            {folders.map((folder) => (
                <FolderCard
                    key={folder.id}
                    folder={folder}
                    onDelete={onDelete ?? (() => {})}
                    onRename={onRename ?? (() => {})}
                />
            ))}
        </div>
    );
}
