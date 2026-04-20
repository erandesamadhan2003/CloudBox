import { Link } from "react-router-dom";

type HomeProps = {
    isAuthenticated: boolean;
};

export default function Home({ isAuthenticated }: HomeProps) {
    const featurePills = [
        "Zero-friction uploads",
        "Private + public sharing",
        "Folder hierarchy",
        "Trash recovery",
        "Access anywhere",
    ];

    const activity = [
        "Folder sync completed",
        "Public link generated",
        "Shared file opened",
        "Restore from trash",
    ];

    return (
        <div
            className="relative min-h-screen overflow-hidden"
            style={{
                background:
                    "radial-gradient(1000px 560px at -12% -16%, rgba(16,185,129,0.24), transparent 62%), radial-gradient(880px 520px at 104% -10%, rgba(34,211,238,0.22), transparent 58%), radial-gradient(900px 700px at 50% 112%, rgba(56,189,248,0.14), transparent 68%), linear-gradient(180deg, #030712 0%, #070f23 52%, #050c1b 100%)",
            }}
        >
            <style>
                {`
                    @keyframes home-float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-8px); }
                    }

                    @keyframes home-pulse {
                        0%, 100% { opacity: 0.35; }
                        50% { opacity: 0.8; }
                    }

                    @keyframes home-scroll {
                        from { transform: translateX(0); }
                        to { transform: translateX(-50%); }
                    }
                `}
            </style>

            <div className="pointer-events-none absolute -left-24 top-16 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />
            <div className="pointer-events-none absolute -right-20 top-8 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-30 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-sky-400/15 blur-3xl" />

            <div
                className="pointer-events-none absolute inset-0 opacity-40"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(125,211,252,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(125,211,252,0.08) 1px, transparent 1px)",
                    backgroundSize: "44px 44px",
                    maskImage:
                        "radial-gradient(circle at center, black 30%, transparent 84%)",
                }}
            />

            <header className="relative z-10 border-b border-white/10 bg-slate-950/40 backdrop-blur-xl">
                <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 md:px-10">
                    <div className="flex items-center gap-3">
                        <span
                            className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-sm font-black text-slate-900"
                            style={{
                                background:
                                    "linear-gradient(135deg, #22D3EE 0%, #34D399 100%)",
                            }}
                        >
                            C
                        </span>
                        <h1
                            className="text-xl font-extrabold tracking-tight text-white"
                            style={{ fontFamily: "'Sora', sans-serif" }}
                        >
                            CloudBox
                        </h1>
                        <span className="rounded-lg border border-cyan-300/20 bg-cyan-300/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-cyan-200">
                            Beta
                        </span>
                    </div>
                    <nav className="flex items-center gap-3">
                        <Link
                            to="/login"
                            className="rounded-xl px-4 py-2 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                            Log in
                        </Link>
                        <Link
                            to="/signup"
                            className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-900 transition hover:opacity-90"
                            style={{
                                background:
                                    "linear-gradient(135deg, #34D399 0%, #22D3EE 100%)",
                                fontFamily: "'DM Sans', sans-serif",
                            }}
                        >
                            Create account
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 pt-12 md:px-10 lg:pb-20 lg:pt-16">
                <section className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
                    <div className="lg:col-span-7">
                        <p
                            className="inline-flex items-center rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                            Secure File Platform
                        </p>

                        <h2
                            className="mt-5 text-4xl font-black leading-[1.05] text-white sm:text-5xl lg:text-6xl"
                            style={{ fontFamily: "'Sora', sans-serif" }}
                        >
                            File flow,
                            <br />
                            zero friction.
                        </h2>

                        <p
                            className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                            CloudBox combines structured folders, controlled
                            sharing, and instant access into a single workspace
                            built for speed.
                        </p>

                        <div className="mt-7 flex flex-wrap gap-3">
                            <Link
                                to={isAuthenticated ? "/dashboard" : "/signup"}
                                className="rounded-2xl px-6 py-3 text-sm font-bold text-slate-900 transition hover:-translate-y-0.5"
                                style={{
                                    background:
                                        "linear-gradient(135deg, #22D3EE 0%, #34D399 100%)",
                                    boxShadow:
                                        "0 14px 34px rgba(34,211,238,0.30)",
                                    fontFamily: "'DM Sans', sans-serif",
                                }}
                            >
                                {isAuthenticated
                                    ? "Go to Dashboard"
                                    : "Start for Free"}
                            </Link>
                            <Link
                                to="/public"
                                className="rounded-2xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                            >
                                Explore Public Files
                            </Link>
                        </div>

                        <div className="mt-7 flex flex-wrap gap-2">
                            {featurePills.map((item) => (
                                <span
                                    key={item}
                                    className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/85"
                                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                                >
                                    {item}
                                </span>
                            ))}
                        </div>

                        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                                <p className="text-xs text-white/55">Storage</p>
                                <p className="mt-1 text-sm font-semibold text-white">
                                    Smart organization
                                </p>
                            </div>
                            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                                <p className="text-xs text-white/55">Sharing</p>
                                <p className="mt-1 text-sm font-semibold text-white">
                                    Public or private
                                </p>
                            </div>
                            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                                <p className="text-xs text-white/55">Recovery</p>
                                <p className="mt-1 text-sm font-semibold text-white">
                                    Trash restore
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="relative lg:col-span-5">
                        <div
                            className="absolute -left-3 -right-3 -top-3 bottom-10 rounded-3xl blur-2xl"
                            style={{
                                background:
                                    "linear-gradient(150deg, rgba(16,185,129,0.25), rgba(14,165,233,0.24), rgba(99,102,241,0.2))",
                                animation: "home-pulse 3.8s ease-in-out infinite",
                            }}
                        />

                        <div
                            className="relative rounded-3xl border border-white/15 bg-slate-900/55 p-4 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl"
                            style={{ animation: "home-float 5.2s ease-in-out infinite" }}
                        >
                            <div className="mb-3 flex items-center justify-between">
                                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-200/90">
                                    Realtime activity
                                </p>
                                <span className="rounded-md border border-emerald-300/20 bg-emerald-300/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-emerald-200">
                                    Live
                                </span>
                            </div>

                            <div className="space-y-2">
                                {activity.map((item, idx) => (
                                    <div
                                        key={item}
                                        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                                    >
                                        <span
                                            className="h-2 w-2 rounded-full"
                                            style={{
                                                background:
                                                    idx % 2 === 0
                                                        ? "#34D399"
                                                        : "#22D3EE",
                                            }}
                                        />
                                        <p className="text-sm text-white/85">
                                            {item}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/40 p-3">
                                <div className="mb-3 flex items-center justify-between">
                                    <p className="text-xs text-white/60">
                                        Command mesh
                                    </p>
                                    <span className="text-[10px] font-semibold uppercase tracking-widest text-cyan-200/80">
                                        Active
                                    </span>
                                </div>

                                <div className="relative rounded-xl border border-white/10 bg-slate-900/50 p-4">
                                    <div className="pointer-events-none absolute inset-0 opacity-35"
                                        style={{
                                            backgroundImage:
                                                "linear-gradient(rgba(125,211,252,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(125,211,252,0.12) 1px, transparent 1px)",
                                            backgroundSize: "22px 22px",
                                        }}
                                    />

                                    <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-300/10">
                                        <div className="absolute h-16 w-16 rounded-full border border-emerald-300/25" />
                                        <div className="absolute h-10 w-10 rounded-full border border-cyan-300/35" />
                                        <span className="h-3 w-3 rounded-full bg-linear-to-r from-cyan-300 to-emerald-300" />
                                    </div>

                                    <div className="relative mt-4 grid grid-cols-2 gap-2">
                                        {[
                                            "Upload node",
                                            "Share node",
                                            "Public gate",
                                            "Recovery lane",
                                        ].map((item, idx) => (
                                            <div
                                                key={item}
                                                className="rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-[11px] text-white/85"
                                            >
                                                <span
                                                    className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full"
                                                    style={{
                                                        background:
                                                            idx % 2 === 0
                                                                ? "#22D3EE"
                                                                : "#34D399",
                                                    }}
                                                />
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-white/5 py-3">
                    <div
                        className="flex min-w-max items-center gap-8 px-4"
                        style={{ animation: "home-scroll 22s linear infinite" }}
                    >
                        {[
                            "Share in seconds",
                            "Nested folder control",
                            "Visibility switching",
                            "Public file hub",
                            "Trash recovery system",
                            "Secure auth with Supabase",
                            "Share in seconds",
                            "Nested folder control",
                            "Visibility switching",
                            "Public file hub",
                            "Trash recovery system",
                            "Secure auth with Supabase",
                        ].map((item, idx) => (
                            <span
                                key={`${item}-${idx}`}
                                className="text-xs font-semibold uppercase tracking-[0.12em] text-white/70"
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
