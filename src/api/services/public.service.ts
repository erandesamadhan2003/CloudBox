import { supabase } from "../api";
import type { CloudFile } from "./file.service";
import { inferMimeTypeFromName } from "./file.service";

export async function getPublicFiles(): Promise<{
    success: boolean;
    data?: CloudFile[];
    error?: string;
}> {
    const { data, error } = await supabase
        .from("files")
        .select("*")
        .eq("visibility", "public")
        .or("is_deleted.is.null,is_deleted.eq.false")
        .order("created_at", { ascending: false });

    if (error) return { success: false, error: error.message };

    const files = ((data ?? []) as CloudFile[]).map((file) => ({
        ...file,
        mime_type: inferMimeTypeFromName(file.file_name),
    }));

    return { success: true, data: files };
}
