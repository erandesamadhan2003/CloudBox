import "./App.css";
import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
    useNavigate,
} from "react-router-dom";

import AuthLayout, { type AuthView } from "@/layout/authLayout";
import MainLayout from "@/layout/MainLayout";
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import Dashboard from "@/pages/dashboard";
import MyFiles from "@/pages/MyFiles";
import Home from "@/pages/Home";
import Shared from "@/pages/Shared";
import Public from "@/pages/Public";
import Trash from "@/pages/Trash";
import Folder from "@/pages/Folder";
import { useAuth } from "@/hooks/useAuth";

/* ── Auth screen wrapper ── */
function AuthScreen({
    view,
    authError,
    clearError,
    login,
    signup,
}: {
    view: AuthView;
    authError: string | null;
    clearError: () => void;
    login: (
        email: string,
        password: string,
    ) => Promise<{ success: boolean; error?: string }>;
    signup: (
        name: string,
        email: string,
        password: string,
    ) => Promise<{ success: boolean; error?: string }>;
}) {
    const navigate = useNavigate();

    return (
        <AuthLayout
            view={view}
            onViewChange={(nextView) => {
                clearError();
                navigate(nextView === "login" ? "/login" : "/signup");
            }}
        >
            {view === "login" ? (
                <Login onLogin={login} globalError={authError} />
            ) : (
                <Signup onSignup={signup} globalError={authError} />
            )}
        </AuthLayout>
    );
}

/* ── Loading screen ── */
function LoadingScreen() {
    return (
        <div
            className="flex min-h-screen items-center justify-center"
            style={{ background: "#080d1a" }}
        >
            <div
                className="flex flex-col items-center gap-4 rounded-3xl px-8 py-6"
                style={{
                    background: "rgba(15,23,42,0.80)",
                    border: "1px solid rgba(99,102,241,0.15)",
                }}
            >
                <div
                    className="h-8 w-8 animate-spin rounded-full border-2 border-transparent"
                    style={{
                        borderTopColor: "#6366F1",
                        borderRightColor: "#06B6D4",
                    }}
                />
                <p
                    className="text-sm text-white/50"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                    Loading CloudBox...
                </p>
            </div>
        </div>
    );
}

/* ── Route guard ── */
function AppRoutes() {
    const { user, isLoading, login, signup, authError, clearError } = useAuth();

    if (isLoading) return <LoadingScreen />;

    return (
        <Routes>
            <Route path="/" element={<Home isAuthenticated={Boolean(user)} />} />

            {/* ── Auth routes ── */}
            <Route
                path="/login"
                element={
                    user ? (
                        <Navigate to="/dashboard" replace />
                    ) : (
                        <AuthScreen
                            view="login"
                            authError={authError}
                            clearError={clearError}
                            login={login}
                            signup={signup}
                        />
                    )
                }
            />
            <Route
                path="/signup"
                element={
                    user ? (
                        <Navigate to="/dashboard" replace />
                    ) : (
                        <AuthScreen
                            view="signup"
                            authError={authError}
                            clearError={clearError}
                            login={login}
                            signup={signup}
                        />
                    )
                }
            />

            {/* ── Protected dashboard routes (nested under MainLayout) ── */}
            <Route
                path="/dashboard"
                element={
                    user ? <MainLayout /> : <Navigate to="/login" replace />
                }
            >
                {/* /dashboard → Dashboard overview */}
                <Route index element={<Dashboard />} />

                {/* /dashboard/files → All files page */}
                <Route path="files" element={<MyFiles />} />

                {/* Placeholder routes — swap with real pages as you build them */}
                <Route path="shared" element={<Shared />} />
                <Route path="public" element={<Public />} />
                <Route path="trash" element={<Trash />} />
                <Route path="folder/:folderId" element={<Folder />} />
            </Route>

            {/* Fallback */}
            <Route
                path="*"
                element={<Navigate to="/" replace />}
            />
        </Routes>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    );
}

export default App;
