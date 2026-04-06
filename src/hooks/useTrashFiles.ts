import { useCallback, useEffect, useMemo, useState } from "react";
import type { CloudFile } from "@/api/services/file.service";
import {
    getTrashFiles,
    permanentlyDeleteTrashFile,
    restoreTrashFile,
} from "@/api/services/trash.service";

export function useTrashFiles() {
    const [files, setFiles] = useState<CloudFile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingIds, setProcessingIds] = useState<Record<string, true>>(
        {},
    );
    const [error, setError] = useState<string | null>(null);

    const fetchTrashFiles = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        const result = await getTrashFiles();
        if (!result.success) {
            setError(result.error ?? "Failed to load trash files.");
        } else {
            setFiles(result.data ?? []);
        }

        setIsLoading(false);
    }, []);

    useEffect(() => {
        void fetchTrashFiles();
    }, [fetchTrashFiles]);

    const markProcessing = (id: string) =>
        setProcessingIds((prev) => ({ ...prev, [id]: true }));
    const unmarkProcessing = (id: string) =>
        setProcessingIds((prev) => {
            const next = { ...prev };
            delete next[id];
            return next;
        });

    const restoreFile = useCallback(async (fileId: string) => {
        markProcessing(fileId);
        const result = await restoreTrashFile(fileId);
        unmarkProcessing(fileId);

        if (!result.success) {
            setError(result.error ?? "Failed to restore file.");
            return false;
        }

        setFiles((prev) => prev.filter((file) => file.id !== fileId));
        return true;
    }, []);

    const permanentlyDeleteFile = useCallback(
        async (fileId: string, filePath: string) => {
            markProcessing(fileId);
            const result = await permanentlyDeleteTrashFile(fileId, filePath);
            unmarkProcessing(fileId);

            if (!result.success) {
                setError(result.error ?? "Failed to permanently delete file.");
                return false;
            }

            setFiles((prev) => prev.filter((file) => file.id !== fileId));
            return true;
        },
        [],
    );

    return useMemo(
        () => ({
            files,
            isLoading,
            error,
            processingIds,
            fetchTrashFiles,
            restoreFile,
            permanentlyDeleteFile,
        }),
        [
            error,
            fetchTrashFiles,
            files,
            isLoading,
            permanentlyDeleteFile,
            processingIds,
            restoreFile,
        ],
    );
}
