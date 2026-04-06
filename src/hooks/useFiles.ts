import { useCallback, useEffect, useMemo, useState } from "react";
import {
    type CloudFile,
    deleteFile as deleteFileSvc,
    getFiles,
    renameFile as renameFileSvc,
    toggleFileVisibility,
    uploadFile as uploadFileSvc,
} from "@/api/services/file.service";

export function useFiles(
    folderId: string | null = null,
    options?: { includeAllFolders?: boolean },
) {
    const includeAllFolders = options?.includeAllFolders ?? false;
    const [files, setFiles] = useState<CloudFile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchFiles = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        const result = await getFiles(folderId, { includeAllFolders });
        if (!result.success) {
            setError(result.error ?? "Failed to load files.");
        } else {
            setFiles(result.data ?? []);
        }
        setIsLoading(false);
    }, [folderId, includeAllFolders]);

    useEffect(() => {
        void fetchFiles();
    }, [fetchFiles]);

    const uploadFile = useCallback(
        async (file: File) => {
            setIsUploading(true);
            setError(null);
            const result = await uploadFileSvc(file, folderId);
            setIsUploading(false);
            if (!result.success) {
                setError(result.error ?? "Upload failed.");
                return false;
            }
            if (result.data) setFiles((prev) => [result.data!, ...prev]);
            return true;
        },
        [folderId],
    );

    const deleteFile = useCallback(async (fileId: string, filePath: string) => {
        const result = await deleteFileSvc(fileId, filePath);
        if (!result.success) {
            setError(result.error ?? "Delete failed.");
            return false;
        }
        setFiles((prev) => prev.filter((f) => f.id !== fileId));
        return true;
    }, []);

    const renameFile = useCallback(async (fileId: string, newName: string) => {
        const result = await renameFileSvc(fileId, newName);
        if (!result.success) {
            setError(result.error ?? "Rename failed.");
            return false;
        }
        setFiles((prev) =>
            prev.map((f) =>
                f.id === fileId ? { ...f, file_name: newName } : f,
            ),
        );
        return true;
    }, []);

    const toggleVisibility = useCallback(
        async (fileId: string, makePublic: boolean) => {
            const result = await toggleFileVisibility(fileId, makePublic);
            if (!result.success) {
                setError(result.error ?? "Update failed.");
                return false;
            }
            setFiles((prev) =>
                prev.map((f) =>
                    f.id === fileId
                        ? {
                              ...f,
                              visibility: makePublic ? "public" : "private",
                          }
                        : f,
                ),
            );
            return true;
        },
        [],
    );

    return useMemo(
        () => ({
            files,
            isLoading,
            isUploading,
            error,
            fetchFiles,
            uploadFile,
            deleteFile,
            renameFile,
            toggleVisibility,
        }),
        [
            deleteFile,
            error,
            fetchFiles,
            files,
            isLoading,
            isUploading,
            renameFile,
            toggleVisibility,
            uploadFile,
        ],
    );
}
