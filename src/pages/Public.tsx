import FileList from "@/components/FileList";
import { usePublicFiles } from "@/hooks/usePublicFiles";

export default function Public() {
    const { files, isLoading, error } = usePublicFiles();

    return (
        <div className="space-y-5">
            <div>
                <h1
                    className="text-2xl font-bold text-white"
                    style={{ fontFamily: "'Sora', sans-serif" }}
                >
                    Public Files
                </h1>
                <p
                    className="mt-1 text-sm text-white/45"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                    Discover files visible publicly in CloudBox.
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
                emptyMessage="No public files found."
            />
        </div>
    );
}
