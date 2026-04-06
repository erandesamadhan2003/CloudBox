import { supabase } from "../api";

// Your actual DB columns:
// folders: id, folder_name, user_id, parent_folder_id, created_at
export type Folder = {
    id: string;
    folder_name: string;
    user_id: string;
    parent_folder_id: string | null;
    created_at: string;
};

export type FolderServiceResult = {
    success: boolean;
    error?: string;
};

export async function createFolder(
    name: string,
    parentId: string | null = null,
): Promise<{ success: boolean; data?: Folder; error?: string }> {
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated." };

    const { data, error } = await supabase
        .from("folders")
        .insert({
            folder_name: name,
            parent_folder_id: parentId,
            user_id: user.id,
        })
        .select()
        .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data: data as Folder };
}

export async function getFolders(
    parentId: string | null = null,
): Promise<{ success: boolean; data?: Folder[]; error?: string }> {
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated." };

    let query = supabase
        .from("folders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    if (parentId === null) {
        query = query.is("parent_folder_id", null);
    } else {
        query = query.eq("parent_folder_id", parentId);
    }

    const { data, error } = await query;
    if (error) return { success: false, error: error.message };
    return { success: true, data: data as Folder[] };
}

export async function deleteFolder(
    folderId: string,
): Promise<FolderServiceResult> {
    const { error } = await supabase
        .from("folders")
        .delete()
        .eq("id", folderId);
    if (error) return { success: false, error: error.message };
    return { success: true };
}

export async function renameFolder(
    folderId: string,
    newName: string,
): Promise<FolderServiceResult> {
    const { error } = await supabase
        .from("folders")
        .update({ folder_name: newName })
        .eq("id", folderId);
    if (error) return { success: false, error: error.message };
    return { success: true };
}
