import { NavLink, useNavigate } from "react-router-dom";
import {
    BsCloudArrowUpFill,
    BsFillGridFill,
    BsFolderFill,
    BsGlobe2,
    BsPeopleFill,
    BsTrash3Fill,
} from "react-icons/bs";
import { HiOutlineLogout } from "react-icons/hi";
import type { useAuth } from "@/hooks/useAuth";

type SidebarProps = {
    logout: ReturnType<typeof useAuth>["logout"];
    displayName: string;
    email: string;
};

const NAV_ITEMS = [
    {
        to: "/dashboard",
        icon: <BsFillGridFill size={16} />,
        label: "Dashboard",
        end: true,
    },
    {
        to: "/dashboard/files",
        icon: <BsFolderFill size={16} />,
        label: "My Files",
        end: false,
    },
    {
        to: "/dashboard/shared",
        icon: <BsPeopleFill size={16} />,
        label: "Shared",
        end: false,
    },
    {
        to: "/dashboard/public",
        icon: <BsGlobe2 size={16} />,
        label: "Public",
        end: false,
    },
    {
        to: "/dashboard/trash",
        icon: <BsTrash3Fill size={16} />,
        label: "Trash",
        end: false,
    },
];

export default function Sidebar({ logout, displayName, email }: SidebarProps) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <aside
            className="flex h-full w-60 flex-col"
            style={{
                background: "rgba(8, 13, 26, 0.85)",
                borderRight: "1px solid rgba(99,102,241,0.12)",
                backdropFilter: "blur(20px)",
            }}
        >
            {/* Brand */}
            <div className="flex items-center gap-3 px-5 py-6">
                <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                    style={{
                        background: "linear-gradient(135deg, #6366F1, #06B6D4)",
                        boxShadow: "0 0 16px rgba(99,102,241,0.45)",
                    }}
                >
                    <BsCloudArrowUpFill size={17} className="text-white" />
                </div>
                <span
                    className="text-lg font-bold tracking-tight text-white"
                    style={{ fontFamily: "'Sora', sans-serif" }}
                >
                    CloudBox
                </span>
            </div>

            {/* Divider */}
            <div
                className="mx-4 mb-4 h-px"
                style={{ background: "rgba(99,102,241,0.12)" }}
            />

            {/* Nav links */}
            <nav className="flex flex-1 flex-col gap-1 px-3">
                {NAV_ITEMS.map(({ to, icon, label, end }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={end}
                        className={({ isActive }) =>
                            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                                isActive
                                    ? "text-white"
                                    : "text-white/50 hover:bg-white/5 hover:text-white/80"
                            }`
                        }
                        style={({ isActive }) =>
                            isActive
                                ? {
                                      background:
                                          "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(6,182,212,0.12))",
                                      border: "1px solid rgba(99,102,241,0.25)",
                                  }
                                : {}
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <span
                                    className={
                                        isActive
                                            ? "text-[#818CF8]"
                                            : "text-white/35"
                                    }
                                >
                                    {icon}
                                </span>
                                {label}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Storage usage bar */}
            <div
                className="mx-3 mb-4 rounded-2xl p-4"
                style={{
                    background: "rgba(99,102,241,0.08)",
                    border: "1px solid rgba(99,102,241,0.12)",
                }}
            >
                <div className="mb-2 flex items-center justify-between">
                    <span
                        className="text-xs text-white/50"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                        Storage
                    </span>
                    <span className="text-xs font-semibold text-[#818CF8]">
                        0 / 5 GB
                    </span>
                </div>
                <div
                    className="h-1.5 w-full overflow-hidden rounded-full"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                >
                    <div
                        className="h-full w-0 rounded-full"
                        style={{
                            background:
                                "linear-gradient(90deg, #6366F1, #06B6D4)",
                        }}
                    />
                </div>
            </div>

            {/* User + logout */}
            <div
                className="mx-3 mb-4 rounded-2xl p-3"
                style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                }}
            >
                <div className="mb-3 flex items-center gap-3">
                    <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
                        style={{
                            background:
                                "linear-gradient(135deg, #6366F1, #8B5CF6)",
                        }}
                    >
                        {displayName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <p
                            className="truncate text-sm font-semibold text-white/90"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                            {displayName}
                        </p>
                        <p
                            className="truncate text-xs text-white/40"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                            {email}
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => void handleLogout()}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/50 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                    <HiOutlineLogout size={15} />
                    Sign out
                </button>
            </div>
        </aside>
    );
}
