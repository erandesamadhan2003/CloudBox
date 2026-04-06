import { useCallback, useEffect, useMemo, useState } from "react";
import {
    type Folder,
    createFolder as createFolderSvc,
    deleteFolder as deleteFolderSvc,
    getFolders,
    renameFolder as renameFolderSvc,
} from "@/api/services/folder.service";

export function useFolders(parentId: string | null = null) {
    const [folders, setFolders] = useState<Folder[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchFolders = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        const result = await getFolders(parentId);
        if (!result.success) {
            setError(result.error ?? "Failed to load folders.");
        } else {
            setFolders(result.data ?? []);
        }
        setIsLoading(false);
    }, [parentId]);

    useEffect(() => {
        void fetchFolders();
    }, [fetchFolders]);

    const createFolder = useCallback(
        async (name: string) => {
            const result = await createFolderSvc(name, parentId);
            if (!result.success) {
                setError(result.error ?? "Create failed.");
                return false;
            }
            if (result.data) setFolders((prev) => [result.data!, ...prev]);
            return true;
        },
        [parentId],
    );

    const deleteFolder = useCallback(async (folderId: string) => {
        const result = await deleteFolderSvc(folderId);
        if (!result.success) {
            setError(result.error ?? "Delete failed.");
            return false;
        }
        setFolders((prev) => prev.filter((f) => f.id !== folderId));
        return true;
    }, []);

    const renameFolder = useCallback(
        async (folderId: string, newName: string) => {
            const result = await renameFolderSvc(folderId, newName);
            if (!result.success) {
                setError(result.error ?? "Rename failed.");
                return false;
            }
            setFolders((prev) =>
                prev.map((f) =>
                    f.id === folderId ? { ...f, folder_name: newName } : f,
                ),
            );
            return true;
        },
        [],
    );

    return useMemo(
        () => ({
            folders,
            isLoading,
            error,
            fetchFolders,
            createFolder,
            deleteFolder,
            renameFolder,
        }),
        [
            createFolder,
            deleteFolder,
            error,
            fetchFolders,
            folders,
            isLoading,
            renameFolder,
        ],
    );
}
