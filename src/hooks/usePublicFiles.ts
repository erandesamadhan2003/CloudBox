import { useCallback, useEffect, useMemo, useState } from "react";
import type { CloudFile } from "@/api/services/file.service";
import { getPublicFiles } from "@/api/services/public.service";

export function usePublicFiles() {
    const [files, setFiles] = useState<CloudFile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPublicFiles = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        const result = await getPublicFiles();
        if (!result.success) {
            setError(result.error ?? "Failed to load public files.");
        } else {
            setFiles(result.data ?? []);
        }

        setIsLoading(false);
    }, []);

    useEffect(() => {
        void fetchPublicFiles();
    }, [fetchPublicFiles]);

    return useMemo(
        () => ({
            files,
            isLoading,
            error,
            fetchPublicFiles,
        }),
        [error, fetchPublicFiles, files, isLoading],
    );
}
