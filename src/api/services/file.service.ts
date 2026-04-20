import { supabase } from "../api";

// Your actual DB columns:
// files: id, file_name, file_path, file_size, user_id, folder_id, visibility, public_token, created_at
export type CloudFile = {
    id: string;
    file_name: string;
    file_path: string;
    file_size: number;
    user_id: string;
    folder_id: string | null;
    visibility: "private" | "public";
    public_token: string | null;
    is_deleted?: boolean;
    created_at: string;
    mime_type?: string; // inferred client-side from file extension
};

export type FileServiceResult = {
    success: boolean;
    error?: string;
};

export function inferMimeTypeFromName(fileName: string): string {
    const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
    const map: Record<string, string> = {
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        gif: "image/gif",
        webp: "image/webp",
        svg: "image/svg+xml",
        pdf: "application/pdf",
        mp4: "video/mp4",
        mov: "video/quicktime",
        avi: "video/avi",
        mp3: "audio/mpeg",
        wav: "audio/wav",
        zip: "application/zip",
        rar: "application/x-rar-compressed",
        txt: "text/plain",
        md: "text/markdown",
        doc: "application/msword",
        docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        xls: "application/vnd.ms-excel",
        xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    };
    return map[ext] ?? "application/octet-stream";
}

export async function uploadFile(
    file: File,
    folderId: string | null = null,
): Promise<{ success: boolean; data?: CloudFile; error?: string }> {
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated." };

    const ext = file.name.split(".").pop();
    const filePath = `${user.id}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage
        .from("files")
        .upload(filePath, file, { upsert: false });

    if (uploadError) return { success: false, error: uploadError.message };

    const { data, error: dbError } = await supabase
        .from("files")
        .insert({
            file_name: file.name,
            file_size: file.size,
            file_path: filePath,
            folder_id: folderId,
            user_id: user.id,
            visibility: "private",
            is_deleted: false,
        })
        .select()
        .single();

    if (dbError) {
        await supabase.storage.from("files").remove([filePath]);
        return { success: false, error: dbError.message };
    }

    return {
        success: true,
        data: { ...(data as CloudFile), mime_type: file.type },
    };
}

export async function getFiles(
    folderId: string | null = null,
    options?: { includeAllFolders?: boolean },
): Promise<{ success: boolean; data?: CloudFile[]; error?: string }> {
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated." };

    let query = supabase
        .from("files")
        .select("*")
        .eq("user_id", user.id)
        .or("is_deleted.is.null,is_deleted.eq.false")
        .order("created_at", { ascending: false });

    if (!options?.includeAllFolders) {
        if (folderId === null) {
            query = query.is("folder_id", null);
        } else {
            query = query.eq("folder_id", folderId);
        }
    }

    const { data, error } = await query;
    if (error) return { success: false, error: error.message };

    const files = (data as CloudFile[]).map((f) => ({
        ...f,
        mime_type: inferMimeTypeFromName(f.file_name),
    }));

    return { success: true, data: files };
}

export async function getFileUrl(
    filePath: string,
    isPublic: boolean,
): Promise<{ url: string | null; error?: string }> {
    if (isPublic) {
        const { data } = supabase.storage.from("files").getPublicUrl(filePath);

        // Public URL can fail at runtime if bucket public access is misconfigured.
        // In that case, gracefully fall back to a signed URL.
        try {
            const probe = await fetch(data.publicUrl, { method: "HEAD" });
            if (probe.ok) {
                return { url: data.publicUrl };
            }
        } catch {
            // Ignore probe/network errors and try signed URL below.
        }
    }

    const { data, error } = await supabase.storage
        .from("files")
        .createSignedUrl(filePath, 3600);
    if (error) return { url: null, error: error.message };
    return { url: data.signedUrl };
}

export async function deleteFile(
    fileId: string,
    _filePath: string,
): Promise<FileServiceResult> {
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated." };

    const { error: dbErr } = await supabase
        .from("files")
        .update({ is_deleted: true })
        .eq("id", fileId)
        .eq("user_id", user.id);
    if (dbErr) return { success: false, error: dbErr.message };
    return { success: true };
}

export async function toggleFileVisibility(
    fileId: string,
    makePublic: boolean,
): Promise<FileServiceResult> {
    const { error } = await supabase
        .from("files")
        .update({ visibility: makePublic ? "public" : "private" })
        .eq("id", fileId);
    if (error) return { success: false, error: error.message };
    return { success: true };
}

export async function renameFile(
    fileId: string,
    newName: string,
): Promise<FileServiceResult> {
    const { error } = await supabase
        .from("files")
        .update({ file_name: newName })
        .eq("id", fileId);
    if (error) return { success: false, error: error.message };
    return { success: true };
}
