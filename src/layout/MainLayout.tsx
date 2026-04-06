import { useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import UploadModal from "@/components/UploadModal";
import CreateFolderModal from "@/components/CreateFolderModal";
import { useFiles } from "@/hooks/useFiles";
import { useFolders } from "@/hooks/useFolders";

export default function MainLayout() {
    const { user, logout } = useAuth();
    const [uploadOpen, setUploadOpen] = useState(false);
    const [folderOpen, setFolderOpen] = useState(false);

    const { uploadFile, isUploading } = useFiles(null);
    const { createFolder } = useFolders(null);

    const displayName = useMemo(() => {
        if (!user) return "User";
        const metaName = user.user_metadata?.name;
        if (typeof metaName === "string" && metaName.trim()) return metaName;
        return user.email?.split("@")[0] ?? "User";
    }, [user]);

    const email = user?.email ?? "";

    return (
        <div
            className="flex h-screen w-full overflow-hidden"
            style={{
                background:
                    "radial-gradient(ellipse 70% 50% at 10% 30%, rgba(99,102,241,0.07) 0%, transparent 55%), radial-gradient(ellipse 50% 60% at 90% 80%, rgba(6,182,212,0.06) 0%, transparent 55%), #080d1a",
            }}
        >
            {/* Sidebar */}
            <Sidebar logout={logout} displayName={displayName} email={email} />

            {/* Main content area */}
            <div className="flex min-w-0 flex-1 flex-col">
                <Navbar
                    displayName={displayName}
                    onUploadClick={() => setUploadOpen(true)}
                    onCreateFolderClick={() => setFolderOpen(true)}
                />

                {/* Page content via Outlet */}
                <main className="min-h-0 flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>

            {/* Global modals */}
            <UploadModal
                isOpen={uploadOpen}
                isUploading={isUploading}
                onClose={() => setUploadOpen(false)}
                onUpload={uploadFile}
            />
            <CreateFolderModal
                isOpen={folderOpen}
                onClose={() => setFolderOpen(false)}
                onCreate={createFolder}
            />
        </div>
    );
}
