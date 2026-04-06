import { useCallback, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";

import {
    getCurrentSession,
    signInWithEmailPassword,
    signOutUser,
    signUpWithEmailPassword,
    subscribeToAuthStateChanges,
    syncUserProfile,
} from "@/api/services/auth.service";

export type AuthActionResult = {
    success: boolean;
    error?: string;
};

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [authError, setAuthError] = useState<string | null>(null);

    useEffect(() => {
        const bootstrap = async () => {
            setIsLoading(true);
            const { session: currentSession, error } =
                await getCurrentSession();

            if (error) {
                setAuthError(error);
            }

            setSession(currentSession);
            setUser(currentSession?.user ?? null);
            setIsLoading(false);
        };

        void bootstrap();

        const unsubscribe = subscribeToAuthStateChanges((_, nextSession) => {
            setSession(nextSession);
            setUser(nextSession?.user ?? null);

            if (nextSession?.user) {
                void syncUserProfile(nextSession.user);
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const login = useCallback(
        async (email: string, password: string): Promise<AuthActionResult> => {
            setAuthError(null);
            const result = await signInWithEmailPassword(email, password);

            if (!result.success) {
                setAuthError(result.error ?? "Unable to login.");
            }

            return result;
        },
        [],
    );

    const signup = useCallback(
        async (
            name: string,
            email: string,
            password: string,
        ): Promise<AuthActionResult> => {
            setAuthError(null);
            const result = await signUpWithEmailPassword(name, email, password);

            if (!result.success) {
                setAuthError(result.error ?? "Unable to create account.");
            }

            return result;
        },
        [],
    );

    const logout = useCallback(async (): Promise<AuthActionResult> => {
        const result = await signOutUser();

        if (!result.success) {
            setAuthError(result.error ?? "Unable to logout.");
        }

        return result;
    }, []);

    const clearError = useCallback(() => {
        setAuthError(null);
    }, []);

    return useMemo(
        () => ({
            user,
            session,
            isLoading,
            authError,
            login,
            signup,
            logout,
            clearError,
        }),
        [
            authError,
            clearError,
            isLoading,
            login,
            logout,
            session,
            signup,
            user,
        ],
    );
}
