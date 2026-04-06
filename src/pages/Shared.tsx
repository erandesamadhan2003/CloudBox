import FileList from "@/components/FileList";
import { useSharedFiles } from "@/hooks/useSharedFiles";

export default function Shared() {
    const { files, isLoading, error } = useSharedFiles();

    return (
        <div className="space-y-5">
            <div>
                <h1
                    className="text-2xl font-bold text-white"
                    style={{ fontFamily: "'Sora', sans-serif" }}
                >
                    Shared with Me
                </h1>
                <p
                    className="mt-1 text-sm text-white/45"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                    Files that other users shared with your account.
                </p>
            </div>

            {error && (
                <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                    {error}
                </p>
            )}

            <FileList
                files={files}
                isLoading={isLoading}
                emptyMessage="No shared files available yet."
            />
        </div>
    );
}
