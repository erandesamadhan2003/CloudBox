import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { supabase } from "../api";

export type AuthStateCallback = (
    event: AuthChangeEvent,
    session: Session | null,
) => void;

export type AuthServiceResult = {
    success: boolean;
    error?: string;
};

export async function getCurrentSession(): Promise<{
    session: Session | null;
    error?: string;
}> {
    const { data, error } = await supabase.auth.getSession();
    if (error) return { session: null, error: error.message };
    return { session: data.session };
}

export function subscribeToAuthStateChanges(callback: AuthStateCallback) {
    const {
        data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) =>
        callback(event, session),
    );
    return () => subscription.unsubscribe();
}

// Matches your actual users table: id, name, email, storage_used, created_at
async function upsertUserProfile(user: User, name?: string | null) {
    const userName =
        name ??
        (typeof user.user_metadata?.name === "string"
            ? user.user_metadata.name
            : null);

    const { error } = await supabase.from("users").upsert(
        {
            id: user.id,
            email: user.email ?? null,
            name: userName,
            // storage_used is int, default 0 — don't send it here to avoid conflict
        },
        { onConflict: "id" },
    );

    // Log but don't throw — auth still works even if profile upsert fails
    if (error) {
        console.warn("Profile upsert warning:", error.message);
    }
}

export async function signInWithEmailPassword(
    email: string,
    password: string,
): Promise<AuthServiceResult> {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) return { success: false, error: error.message };
    if (data.user) await upsertUserProfile(data.user);
    return { success: true };
}

export async function signUpWithEmailPassword(
    name: string,
    email: string,
    password: string,
): Promise<AuthServiceResult> {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
    });
    if (error) return { success: false, error: error.message };
    if (data.user) await upsertUserProfile(data.user, name);
    return { success: true };
}

export async function signOutUser(): Promise<AuthServiceResult> {
    const { error } = await supabase.auth.signOut();
    if (error) return { success: false, error: error.message };
    return { success: true };
}

export async function syncUserProfile(user: User) {
    await upsertUserProfile(user);
}
