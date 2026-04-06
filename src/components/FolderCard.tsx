import { BsFolderFill, BsTrash3, BsPencil } from "react-icons/bs";
import type { Folder } from "@/api/services/folder.service";
import { useNavigate } from "react-router-dom";

type FolderCardProps = {
    folder: Folder;
    onDelete: (id: string) => void;
    onRename: (id: string, currentName: string) => void;
};

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export default function FolderCard({
    folder,
    onDelete,
    onRename,
}: FolderCardProps) {
    const navigate = useNavigate();

    return (
        <div
            className="group relative flex flex-col gap-3 rounded-2xl p-4 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.6)]"
            style={{
                background: "rgba(15,23,42,0.70)",
                border: "1px solid rgba(99,102,241,0.12)",
                backdropFilter: "blur(12px)",
            }}
            onDoubleClick={() => navigate(`/dashboard/folder/${folder.id}`)}
        >
            <div
                className="flex h-12 w-12 items-center justify-center rounded-xl"
                style={{
                    background:
                        "linear-gradient(135deg, rgba(99,102,241,0.20), rgba(6,182,212,0.12))",
                    border: "1px solid rgba(99,102,241,0.18)",
                }}
            >
                <BsFolderFill size={22} className="text-[#818CF8]" />
            </div>

            <div>
                <p
                    className="truncate text-sm font-semibold text-white/90"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                    title={folder.folder_name}
                >
                    {folder.folder_name}
                </p>
                <p
                    className="mt-0.5 text-xs text-white/35"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                    {formatDate(folder.created_at)}
                </p>
            </div>

            <div className="flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <button
                    type="button"
                    title="Rename"
                    onClick={(e) => {
                        e.stopPropagation();
                        onRename(folder.id, folder.folder_name);
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-white/40 transition hover:bg-white/8 hover:text-white/80"
                >
                    <BsPencil size={12} />
                </button>
                <button
                    type="button"
                    title="Delete"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(folder.id);
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-white/40 transition hover:bg-red-500/15 hover:text-red-400"
                >
                    <BsTrash3 size={12} />
                </button>
            </div>
        </div>
    );
}
