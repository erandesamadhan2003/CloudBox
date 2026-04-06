import { useCallback, useEffect, useMemo, useState } from "react";
import {
    type SharedFile,
    getSharedFilesForCurrentUser,
} from "@/api/services/share.service";

export function useSharedFiles() {
    const [files, setFiles] = useState<SharedFile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSharedFiles = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        const result = await getSharedFilesForCurrentUser();
        if (!result.success) {
            setError(result.error ?? "Failed to load shared files.");
        } else {
            setFiles(result.data ?? []);
        }

        setIsLoading(false);
    }, []);

    useEffect(() => {
        void fetchSharedFiles();
    }, [fetchSharedFiles]);

    return useMemo(
        () => ({
            files,
            isLoading,
            error,
            fetchSharedFiles,
        }),
        [error, fetchSharedFiles, files, isLoading],
    );
}
