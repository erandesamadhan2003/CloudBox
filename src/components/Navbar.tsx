import { useState } from "react";
import { useLocation } from "react-router-dom";
import { BsSearch, BsBellFill, BsPlus } from "react-icons/bs";

type NavbarProps = {
    displayName: string;
    onUploadClick: () => void;
    onCreateFolderClick: () => void;
};

const PAGE_TITLES: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/dashboard/files": "My Files",
    "/dashboard/shared": "Shared with Me",
    "/dashboard/public": "Public Files",
    "/dashboard/trash": "Trash",
};

export default function Navbar({
    displayName,
    onUploadClick,
    onCreateFolderClick,
}: NavbarProps) {
    const location = useLocation();
    const [search, setSearch] = useState("");

    const title = PAGE_TITLES[location.pathname] ?? "CloudBox";

    return (
        <header
            className="flex h-16 shrink-0 items-center gap-4 px-6"
            style={{
                background: "rgba(8,13,26,0.70)",
                borderBottom: "1px solid rgba(99,102,241,0.10)",
                backdropFilter: "blur(20px)",
            }}
        >
            {/* Page title */}
            <h1
                className="mr-4 text-lg font-bold text-white/90"
                style={{ fontFamily: "'Sora', sans-serif" }}
            >
                {title}
            </h1>

            {/* Search */}
            <div
                className="flex flex-1 items-center gap-2 rounded-xl px-4 py-2"
                style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    maxWidth: "400px",
                }}
            >
                <BsSearch size={13} className="shrink-0 text-white/30" />
                <input
                    type="text"
                    placeholder="Search files & folders..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 bg-transparent text-sm text-white/80 outline-none placeholder:text-white/25"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                />
            </div>

            <div className="flex flex-1 items-center justify-end gap-3">
                {/* Create folder button */}
                <button
                    type="button"
                    onClick={onCreateFolderClick}
                    className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white/60 transition-all duration-200 hover:bg-white/5 hover:text-white/90"
                    style={{
                        border: "1px solid rgba(255,255,255,0.08)",
                        fontFamily: "'DM Sans', sans-serif",
                    }}
                >
                    <BsPlus size={17} />
                    New Folder
                </button>

                {/* Upload button */}
                <button
                    type="button"
                    onClick={onUploadClick}
                    className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
                    style={{
                        background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                        boxShadow: "0 4px 16px rgba(99,102,241,0.35)",
                        fontFamily: "'DM Sans', sans-serif",
                    }}
                >
                    <BsPlus size={17} />
                    Upload
                </button>

                {/* Notification bell */}
                <button
                    type="button"
                    className="relative flex h-9 w-9 items-center justify-center rounded-xl text-white/40 transition-all duration-200 hover:bg-white/5 hover:text-white/70"
                    style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                >
                    <BsBellFill size={14} />
                </button>

                {/* Avatar */}
                <div
                    className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl text-sm font-bold text-white"
                    style={{
                        background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                        boxShadow: "0 0 12px rgba(99,102,241,0.35)",
                    }}
                >
                    {displayName.charAt(0).toUpperCase()}
                </div>
            </div>
        </header>
    );
}
