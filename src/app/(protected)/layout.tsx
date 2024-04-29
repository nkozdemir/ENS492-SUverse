import Sidebar from '@/components/layout/sidebar';

export default function ProtectedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex h-screen">
            <div className="w-1/5">
                <Sidebar />
            </div>
            <div className="flex-grow p-4 z-10">
                {children}
            </div>
        </div>
    );
}
