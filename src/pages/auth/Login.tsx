import { type FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import type { AuthActionResult } from "@/hooks/useAuth";

type LoginProps = {
    onLogin: (email: string, password: string) => Promise<AuthActionResult>;
    globalError?: string | null;
};

export default function Login({ onLogin, globalError }: LoginProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        if (!email || !password) {
            setError("Please enter email and password.");
            return;
        }

        setIsSubmitting(true);
        const result = await onLogin(email.trim(), password);
        setIsSubmitting(false);

        if (!result.success) {
            setError(result.error ?? "Invalid credentials.");
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-semibold tracking-tight text-[#E5E7EB]">
                Welcome back
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#E5E7EB]/70">
                Continue to your workspace and manage your files securely.
            </p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                <div>
                    <label className="mb-1.5 block text-sm text-[#E5E7EB]/80">
                        Email
                    </label>
                    <input
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="w-full rounded-xl border border-[#1F2937] bg-[#0B1020]/80 px-4 py-3 text-sm text-[#E5E7EB] outline-none transition duration-200 placeholder:text-[#E5E7EB]/35 focus:border-[#6366F1] focus:shadow-[0_0_0_4px_rgba(99,102,241,0.2)]"
                        placeholder="you@example.com"
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-sm text-[#E5E7EB]/80">
                        Password
                    </label>
                    <input
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="w-full rounded-xl border border-[#1F2937] bg-[#0B1020]/80 px-4 py-3 text-sm text-[#E5E7EB] outline-none transition duration-200 placeholder:text-[#E5E7EB]/35 focus:border-[#6366F1] focus:shadow-[0_0_0_4px_rgba(99,102,241,0.2)]"
                        placeholder="••••••••"
                    />
                </div>

                {(error || globalError) && (
                    <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                        {error ?? globalError}
                    </p>
                )}

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-11 w-full rounded-xl bg-linear-to-r from-[#6366F1] to-[#8B5CF6] text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-12px_rgba(99,102,241,0.8)]"
                >
                    {isSubmitting ? "Signing in..." : "Sign in"}
                </Button>
            </form>
        </div>
    );
}
