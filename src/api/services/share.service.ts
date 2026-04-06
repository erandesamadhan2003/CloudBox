import { supabase } from "../api";
import type { CloudFile } from "./file.service";
import { inferMimeTypeFromName } from "./file.service";

export type SharePermission = "view" | "edit";

type SharedFileRow = {
    id: string;
    file_id: string;
    shared_with_user_id: string;
    permission: SharePermission;
};

export type SharedFile = CloudFile & {
    shared_permission: SharePermission;
};

type ShareServiceResult = {
    success: boolean;
    error?: string;
};

export async function shareFileWithEmail(
    fileId: string,
    recipientEmail: string,
    permission: SharePermission,
): Promise<ShareServiceResult> {
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated." };

    const email = recipientEmail.trim().toLowerCase();
    if (!email)
        return { success: false, error: "Recipient email is required." };

    const { data: ownerFile, error: fileErr } = await supabase
        .from("files")
        .select("id, user_id")
        .eq("id", fileId)
        .single();

    if (fileErr) return { success: false, error: fileErr.message };
    if (!ownerFile || ownerFile.user_id !== user.id) {
        return { success: false, error: "You can only share your own files." };
    }

    const { data: searchResult, error: userErr } = await supabase.rpc(
        "search_user_by_email",
        { search_email: email },
    );

    console.log("RPC search result:", { searchResult, userErr });

    if (userErr) {
        console.error("RPC error:", userErr);
        return { success: false, error: userErr.message };
    }
    if (!searchResult || searchResult.length === 0) {
        return { success: false, error: "No user found with this email." };
    }

    const targetUser = searchResult[0];
    if (targetUser.id === user.id) {
        return { success: false, error: "You already own this file." };
    }

    const { data: existing, error: existingErr } = await supabase
        .from("shared_files")
        .select("id")
        .eq("file_id", fileId)
        .eq("shared_with_user_id", targetUser.id)
        .maybeSingle();

    if (existingErr) return { success: false, error: existingErr.message };

    if (existing?.id) {
        const { error } = await supabase
            .from("shared_files")
            .update({ permission })
            .eq("id", existing.id);
        if (error) return { success: false, error: error.message };
        return { success: true };
    }

    const { error } = await supabase.from("shared_files").insert({
        file_id: fileId,
        shared_with_user_id: targetUser.id,
        permission,
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
}

export async function getSharedFilesForCurrentUser(): Promise<{
    success: boolean;
    data?: SharedFile[];
    error?: string;
}> {
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated." };

    const { data: sharedRows, error: sharedErr } = await supabase
        .from("shared_files")
        .select("id, file_id, shared_with_user_id, permission")
        .eq("shared_with_user_id", user.id);

    if (sharedErr) return { success: false, error: sharedErr.message };

    const rows = (sharedRows ?? []) as SharedFileRow[];
    if (!rows.length) return { success: true, data: [] };

    const fileIds = [...new Set(rows.map((row) => row.file_id))];
    const { data: filesData, error: filesErr } = await supabase
        .from("files")
        .select("*")
        .in("id", fileIds)
        .or("is_deleted.is.null,is_deleted.eq.false");

    if (filesErr) return { success: false, error: filesErr.message };

    const filesById = new Map(
        ((filesData ?? []) as CloudFile[]).map((file) => [
            file.id,
            {
                ...file,
                mime_type: inferMimeTypeFromName(file.file_name),
            },
        ]),
    );

    const mapped = rows.reduce<SharedFile[]>((acc, row) => {
        const file = filesById.get(row.file_id);
        if (!file) return acc;

        acc.push({
            ...file,
            shared_permission: row.permission,
        });

        return acc;
    }, []);

    return { success: true, data: mapped };
}
