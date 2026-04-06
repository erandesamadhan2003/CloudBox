import { type FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import type { AuthActionResult } from "@/hooks/useAuth";

type SignupProps = {
    onSignup: (
        name: string,
        email: string,
        password: string,
    ) => Promise<AuthActionResult>;
    globalError?: string | null;
};

export default function Signup({ onSignup, globalError }: SignupProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        if (!name || !email || !password || !confirmPassword) {
            setError("Please complete all fields.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setIsSubmitting(true);
        const result = await onSignup(name.trim(), email.trim(), password);
        setIsSubmitting(false);

        if (!result.success) {
            setError(result.error ?? "Could not create your account.");
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-semibold tracking-tight text-[#E5E7EB]">
                Create account
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#E5E7EB]/70">
                Start in seconds and collaborate with your files anywhere.
            </p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                <div>
                    <label className="mb-1.5 block text-sm text-[#E5E7EB]/80">
                        Name
                    </label>
                    <input
                        type="text"
                        autoComplete="name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        className="w-full rounded-xl border border-[#1F2937] bg-[#0B1020]/80 px-4 py-3 text-sm text-[#E5E7EB] outline-none transition duration-200 placeholder:text-[#E5E7EB]/35 focus:border-[#6366F1] focus:shadow-[0_0_0_4px_rgba(99,102,241,0.2)]"
                        placeholder="Samadhan"
                    />
                </div>

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
                        autoComplete="new-password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="w-full rounded-xl border border-[#1F2937] bg-[#0B1020]/80 px-4 py-3 text-sm text-[#E5E7EB] outline-none transition duration-200 placeholder:text-[#E5E7EB]/35 focus:border-[#6366F1] focus:shadow-[0_0_0_4px_rgba(99,102,241,0.2)]"
                        placeholder="At least 6 characters"
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-sm text-[#E5E7EB]/80">
                        Confirm password
                    </label>
                    <input
                        type="password"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(event) =>
                            setConfirmPassword(event.target.value)
                        }
                        className="w-full rounded-xl border border-[#1F2937] bg-[#0B1020]/80 px-4 py-3 text-sm text-[#E5E7EB] outline-none transition duration-200 placeholder:text-[#E5E7EB]/35 focus:border-[#6366F1] focus:shadow-[0_0_0_4px_rgba(99,102,241,0.2)]"
                        placeholder="Re-enter password"
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
                    {isSubmitting ? "Creating account..." : "Create account"}
                </Button>
            </form>
        </div>
    );
}
