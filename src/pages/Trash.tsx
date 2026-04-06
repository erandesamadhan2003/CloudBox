import { BsArrowCounterclockwise, BsTrash3 } from "react-icons/bs";
import { useTrashFiles } from "@/hooks/useTrashFiles";

function formatBytes(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default function Trash() {
    const {
        files,
        isLoading,
        error,
        processingIds,
        restoreFile,
        permanentlyDeleteFile,
    } = useTrashFiles();

    return (
        <div className="space-y-5">
            <div>
                <h1
                    className="text-2xl font-bold text-white"
                    style={{ fontFamily: "'Sora', sans-serif" }}
                >
                    Trash
                </h1>
                <p
                    className="mt-1 text-sm text-white/45"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                    Restore deleted files or remove them permanently.
                </p>
            </div>

            {error && (
                <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                    {error}
                </p>
            )}

            {isLoading ? (
                <div className="space-y-3">
                    {[...Array(5)].map((_, index) => (
                        <div
                            key={index}
                            className="h-20 animate-pulse rounded-2xl"
                            style={{ background: "rgba(255,255,255,0.04)" }}
                        />
                    ))}
                </div>
            ) : files.length === 0 ? (
                <div
                    className="flex items-center justify-center rounded-2xl py-14"
                    style={{
                        border: "1px dashed rgba(99,102,241,0.18)",
                        background: "rgba(255,255,255,0.015)",
                    }}
                >
                    <p
                        className="text-sm text-white/30"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                        Trash is empty.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {files.map((file) => {
                        const isBusy = Boolean(processingIds[file.id]);
                        return (
                            <div
                                key={file.id}
                                className="flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between"
                                style={{
                                    background: "rgba(15,23,42,0.70)",
                                    border: "1px solid rgba(99,102,241,0.12)",
                                }}
                            >
                                <div className="min-w-0">
                                    <p
                                        className="truncate text-sm font-semibold text-white/90"
                                        style={{
                                            fontFamily: "'DM Sans', sans-serif",
                                        }}
                                        title={file.file_name}
                                    >
                                        {file.file_name}
                                    </p>
                                    <p
                                        className="text-xs text-white/35"
                                        style={{
                                            fontFamily: "'DM Sans', sans-serif",
                                        }}
                                    >
                                        {formatBytes(file.file_size)}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        disabled={isBusy}
                                        onClick={() =>
                                            void restoreFile(file.id)
                                        }
                                        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[#22C55E] transition hover:bg-[#22C55E]/10 disabled:cursor-not-allowed disabled:opacity-50"
                                        style={{
                                            border: "1px solid rgba(34,197,94,0.3)",
                                        }}
                                    >
                                        <BsArrowCounterclockwise size={13} />
                                        Restore
                                    </button>
                                    <button
                                        type="button"
                                        disabled={isBusy}
                                        onClick={() =>
                                            void permanentlyDeleteFile(
                                                file.id,
                                                file.file_path,
                                            )
                                        }
                                        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                                        style={{
                                            border: "1px solid rgba(239,68,68,0.35)",
                                        }}
                                    >
                                        <BsTrash3 size={13} />
                                        Delete Forever
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
