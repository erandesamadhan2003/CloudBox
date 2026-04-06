import { useRef, useState } from "react";
import { BsCloudArrowUpFill, BsXLg } from "react-icons/bs";

type UploadModalProps = {
    isOpen: boolean;
    isUploading: boolean;
    onClose: () => void;
    onUpload: (file: File) => Promise<boolean>;
};

export default function UploadModal({
    isOpen,
    isUploading,
    onClose,
    onUpload,
}: UploadModalProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleFile = (file: File) => {
        setError(null);
        setSelectedFile(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    const handleSubmit = async () => {
        if (!selectedFile) return;
        const ok = await onUpload(selectedFile);
        if (ok) {
            setSelectedFile(null);
            onClose();
        } else {
            setError("Upload failed. Please try again.");
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
                className="w-full max-w-md rounded-3xl p-6 shadow-2xl"
                style={{
                    background: "rgba(11,16,34,0.95)",
                    border: "1px solid rgba(99,102,241,0.20)",
                    backdropFilter: "blur(24px)",
                }}
            >
                {/* Header */}
                <div className="mb-5 flex items-center justify-between">
                    <h2
                        className="text-lg font-bold text-white"
                        style={{ fontFamily: "'Sora', sans-serif" }}
                    >
                        Upload File
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-xl text-white/40 transition hover:bg-white/8 hover:text-white/80"
                    >
                        <BsXLg size={13} />
                    </button>
                </div>

                {/* Drop zone */}
                <div
                    onDragOver={(e) => {
                        e.preventDefault();
                        setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                    className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl py-10 transition-all duration-200"
                    style={{
                        border: `2px dashed ${dragging ? "rgba(99,102,241,0.6)" : "rgba(99,102,241,0.20)"}`,
                        background: dragging
                            ? "rgba(99,102,241,0.08)"
                            : "rgba(255,255,255,0.02)",
                    }}
                >
                    <div
                        className="flex h-14 w-14 items-center justify-center rounded-2xl"
                        style={{
                            background:
                                "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(6,182,212,0.15))",
                            border: "1px solid rgba(99,102,241,0.25)",
                        }}
                    >
                        <BsCloudArrowUpFill
                            size={24}
                            className="text-[#818CF8]"
                        />
                    </div>

                    {selectedFile ? (
                        <div className="text-center">
                            <p
                                className="text-sm font-semibold text-white/80"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                            >
                                {selectedFile.name}
                            </p>
                            <p
                                className="text-xs text-white/35"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                            >
                                {(selectedFile.size / 1024).toFixed(1)} KB
                            </p>
                        </div>
                    ) : (
                        <div className="text-center">
                            <p
                                className="text-sm font-semibold text-white/70"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                            >
                                Drag & drop or{" "}
                                <span className="text-[#818CF8]">browse</span>
                            </p>
                            <p
                                className="mt-1 text-xs text-white/30"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                            >
                                Any file up to 50MB
                            </p>
                        </div>
                    )}
                    <input
                        ref={inputRef}
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleFile(f);
                        }}
                    />
                </div>

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
                        onClick={() => void handleSubmit()}
                        disabled={!selectedFile || isUploading}
                        className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
                        style={{
                            background:
                                "linear-gradient(135deg, #6366F1, #8B5CF6)",
                            boxShadow: "0 4px 16px rgba(99,102,241,0.35)",
                            fontFamily: "'DM Sans', sans-serif",
                        }}
                    >
                        {isUploading ? "Uploading..." : "Upload"}
                    </button>
                </div>
            </div>
        </div>
    );
}
