import Sidebar from '@/components/layout/sidebar';
import SidebarRight from '@/components/layout/sidebar-right';

export default function ProtectedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex h-screen">
            <div className="w-1/5 z-50">
                <Sidebar />
            </div>
            <div className="flex-grow p-4">
                {children}
            </div>
            <div className="w-1/5 z-50">
                <SidebarRight />
            </div>
        </div>
    );
}
