import type { PropsWithChildren } from "react";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
    BsCloudArrowUpFill,
    BsShieldLockFill,
    BsGlobe2,
    BsPeopleFill,
} from "react-icons/bs";
import { HiOutlineArrowRight } from "react-icons/hi";
import { MdFolderShared } from "react-icons/md";

export type AuthView = "login" | "signup";

type AuthLayoutProps = PropsWithChildren<{
    view: AuthView;
    onViewChange: (view: AuthView) => void;
}>;

const FEATURES = [
    {
        icon: <BsShieldLockFill className="text-[#06B6D4]" size={16} />,
        label: "End-to-end encrypted storage",
    },
    {
        icon: <MdFolderShared className="text-[#8B5CF6]" size={16} />,
        label: "Instant file sharing",
    },
    {
        icon: <BsGlobe2 className="text-[#06B6D4]" size={16} />,
        label: "Public & private workspaces",
    },
    {
        icon: <BsPeopleFill className="text-[#8B5CF6]" size={16} />,
        label: "Team collaboration tools",
    },
];

/* Floating particle canvas */
function ParticleCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animId: number;

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        const particles = Array.from({ length: 55 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.6 + 0.4,
            dx: (Math.random() - 0.5) * 0.35,
            dy: (Math.random() - 0.5) * 0.35,
            alpha: Math.random() * 0.5 + 0.15,
            color: Math.random() > 0.5 ? "#06B6D4" : "#8B5CF6",
        }));

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (const p of particles) {
                p.x += p.dx;
                p.y += p.dy;
                if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.alpha;
                ctx.fill();
                ctx.globalAlpha = 1;
            }

            // Draw faint connection lines
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dist = Math.hypot(
                        particles[i].x - particles[j].x,
                        particles[i].y - particles[j].y,
                    );
                    if (dist < 90) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = "#06B6D4";
                        ctx.globalAlpha = (1 - dist / 90) * 0.12;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                        ctx.globalAlpha = 1;
                    }
                }
            }

            animId = requestAnimationFrame(draw);
        };
        draw();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full"
            style={{ zIndex: 0 }}
        />
    );
}

export default function AuthLayout({
    children,
    view,
    onViewChange,
}: AuthLayoutProps) {
    return (
        <div
            className="relative flex h-screen w-full items-center justify-center overflow-hidden"
            style={{
                background:
                    "radial-gradient(ellipse 80% 60% at 20% 40%, rgba(99,102,241,0.13) 0%, transparent 60%), radial-gradient(ellipse 60% 70% at 80% 80%, rgba(6,182,212,0.10) 0%, transparent 60%), #080d1a",
            }}
        >
            {/* ── Global particle layer ── */}
            <div className="pointer-events-none absolute inset-0">
                <ParticleCanvas />
            </div>

            {/* ── Glowing blobs ── */}
            <div
                className="pointer-events-none absolute left-[-10%] top-[-10%] h-105 w- rounded-full opacity-20 blur-[100px]"
                style={{
                    background:
                        "radial-gradient(circle, #6366F1, transparent 70%)",
                }}
            />
            <div
                className="pointer-events-none absolute bottom-[-8%] right-[5%] h-80 w-80 rounded-full opacity-15 blur-[80px]"
                style={{
                    background:
                        "radial-gradient(circle, #06B6D4, transparent 70%)",
                }}
            />

            {/* ── Card container ── */}
            <div
                className="relative z-10 flex w-full max-w-275 overflow-hidden rounded-3xl shadow-[0_32px_96px_-24px_rgba(0,0,0,0.9)]"
                style={{
                    background: "rgba(11,16,34,0.75)",
                    border: "1px solid rgba(99,102,241,0.18)",
                    backdropFilter: "blur(24px)",
                    minHeight: "min(680px, 92vh)",
                }}
            >
                {/* ════ LEFT PANEL ════ */}
                <aside
                    className="relative hidden w-[45%] flex-col justify-between overflow-hidden p-10 lg:flex"
                    style={{
                        background:
                            "linear-gradient(135deg, rgba(99,102,241,0.18) 0%, rgba(6,182,212,0.10) 100%)",
                        borderRight: "1px solid rgba(99,102,241,0.15)",
                    }}
                >
                    {/* grid texture */}
                    <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                            backgroundImage:
                                "linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px)",
                            backgroundSize: "36px 36px",
                        }}
                    />

                    {/* top brand */}
                    <div className="relative z-10">
                        <div className="mb-10 flex items-center gap-3">
                            <div
                                className="flex h-10 w-10 items-center justify-center rounded-xl"
                                style={{
                                    background:
                                        "linear-gradient(135deg, #6366F1, #06B6D4)",
                                    boxShadow: "0 0 18px rgba(99,102,241,0.5)",
                                }}
                            >
                                <BsCloudArrowUpFill
                                    size={20}
                                    className="text-white"
                                />
                            </div>
                            <span
                                className="text-xl font-bold tracking-tight text-white"
                                style={{
                                    fontFamily: "'Sora', 'DM Sans', sans-serif",
                                }}
                            >
                                CloudBox
                            </span>
                        </div>

                        <h2
                            className="text-3xl font-bold leading-tight text-white"
                            style={{
                                fontFamily: "'Sora', 'DM Sans', sans-serif",
                            }}
                        >
                            Your files.
                            <br />
                            <span
                                style={{
                                    backgroundImage:
                                        "linear-gradient(90deg,#818CF8,#06B6D4)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                }}
                            >
                                Everywhere.
                            </span>
                        </h2>
                        <p
                            className="mt-3 text-sm leading-relaxed text-white/55"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                            The secure workspace to store, organize, and share
                            your files from anywhere in the world.
                        </p>
                    </div>

                    {/* feature cards */}
                    <div className="relative z-10 flex flex-col gap-3">
                        {FEATURES.map(({ icon, label }) => (
                            <div
                                key={label}
                                className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 hover:scale-[1.02]"
                                style={{
                                    background: "rgba(255,255,255,0.04)",
                                    border: "1px solid rgba(255,255,255,0.07)",
                                }}
                            >
                                <span
                                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                                    style={{
                                        background: "rgba(255,255,255,0.06)",
                                    }}
                                >
                                    {icon}
                                </span>
                                <span
                                    className="text-sm text-white/80"
                                    style={{
                                        fontFamily: "'DM Sans', sans-serif",
                                    }}
                                >
                                    {label}
                                </span>
                                <HiOutlineArrowRight
                                    size={14}
                                    className="ml-auto text-white/25"
                                />
                            </div>
                        ))}
                    </div>

                    {/* bottom decoration */}
                    <div
                        className="pointer-events-none absolute bottom-0 left-0 h-40 w-full"
                        style={{
                            background:
                                "linear-gradient(to top, rgba(6,182,212,0.08), transparent)",
                        }}
                    />
                </aside>

                {/* ════ RIGHT PANEL ════ */}
                <main className="relative flex flex-1 flex-col justify-center px-8 py-10 sm:px-12">
                    {/* Mobile logo */}
                    <div className="mb-8 flex items-center gap-3 lg:hidden">
                        <div
                            className="flex h-9 w-9 items-center justify-center rounded-xl"
                            style={{
                                background:
                                    "linear-gradient(135deg, #6366F1, #06B6D4)",
                                boxShadow: "0 0 14px rgba(99,102,241,0.4)",
                            }}
                        >
                            <BsCloudArrowUpFill
                                size={17}
                                className="text-white"
                            />
                        </div>
                        <span
                            className="text-lg font-bold text-white"
                            style={{ fontFamily: "'Sora', sans-serif" }}
                        >
                            CloudBox
                        </span>
                    </div>

                    {/* Tab switcher */}
                    <div
                        className="mb-8 flex rounded-2xl p-1"
                        style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                        }}
                    >
                        {(["login", "signup"] as AuthView[]).map((tab) => (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => onViewChange(tab)}
                                className="relative flex-1 rounded-xl py-2.5 text-sm font-semibold capitalize transition-all duration-300"
                                style={{
                                    fontFamily: "'DM Sans', sans-serif",
                                    color:
                                        view === tab
                                            ? "#fff"
                                            : "rgba(255,255,255,0.4)",
                                    background:
                                        view === tab
                                            ? "linear-gradient(135deg,#6366F1,#8B5CF6)"
                                            : "transparent",
                                    boxShadow:
                                        view === tab
                                            ? "0 4px 20px rgba(99,102,241,0.4)"
                                            : "none",
                                }}
                            >
                                {tab === "login" ? "Login" : "Sign up"}
                            </button>
                        ))}
                    </div>

                    {/* Injected children (Login / Signup form) */}
                    <div className="w-full">{children}</div>

                    <div className="mt-5 text-center">
                        <Link
                            to="/"
                            className="text-sm text-white/55 transition hover:text-white"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                            Back to Home
                        </Link>
                    </div>

                    {/* Footer */}
                    <p
                        className="mt-5 text-center text-xs text-white/25"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                        © {new Date().getFullYear()} CloudBox · All rights
                        reserved
                    </p>
                </main>
            </div>
        </div>
    );
}
