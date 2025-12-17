import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopbar from '@/components/admin/AdminTopbar';
import AdminGuard from '@/components/admin/AdminGuard';

export const metadata = {
    title: 'Admin Dashboard - App Receitas',
    description: 'Painel administrativo para gerenciamento de receitas.',
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminGuard>
            <div className="min-h-screen bg-[#121212] text-stone-200 font-sans selection:bg-[var(--color-primary)] selection:text-white">
                <AdminSidebar />

                <div className="md:ml-64 flex flex-col min-h-screen transition-all duration-300">
                    <AdminTopbar />
                    <main className="flex-1 p-8 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </AdminGuard>
    );
}
