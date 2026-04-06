import { supabase } from "../api";
import type { CloudFile } from "./file.service";
import { inferMimeTypeFromName } from "./file.service";

type TrashServiceResult = {
    success: boolean;
    error?: string;
};

export async function getTrashFiles(): Promise<{
    success: boolean;
    data?: CloudFile[];
    error?: string;
}> {
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated." };

    const { data, error } = await supabase
        .from("files")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_deleted", true)
        .order("created_at", { ascending: false });

    if (error) return { success: false, error: error.message };

    const files = ((data ?? []) as CloudFile[]).map((file) => ({
        ...file,
        mime_type: inferMimeTypeFromName(file.file_name),
    }));

    return { success: true, data: files };
}

export async function restoreTrashFile(
    fileId: string,
): Promise<TrashServiceResult> {
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated." };

    const { error } = await supabase
        .from("files")
        .update({ is_deleted: false })
        .eq("id", fileId)
        .eq("user_id", user.id);

    if (error) return { success: false, error: error.message };
    return { success: true };
}

export async function permanentlyDeleteTrashFile(
    fileId: string,
    filePath: string,
): Promise<TrashServiceResult> {
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated." };

    const { error: storageError } = await supabase.storage
        .from("files")
        .remove([filePath]);
    if (storageError) return { success: false, error: storageError.message };

    const { error: deleteError } = await supabase
        .from("files")
        .delete()
        .eq("id", fileId)
        .eq("user_id", user.id);
    if (deleteError) return { success: false, error: deleteError.message };

    return { success: true };
}
