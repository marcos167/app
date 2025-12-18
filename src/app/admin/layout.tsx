import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopbar from '@/components/admin/AdminTopbar';
import AdminGuard from '@/components/admin/AdminGuard';

export const metadata = {
    title: 'Chefex Admin - Painel de Controle',
    description: 'Painel administrativo Chefex - Axis Software',
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
                    <footer className="p-4 text-center text-xs text-stone-600 border-t border-[#2A2A2A]">
                        © {new Date().getFullYear()} Axis Software. Todos os direitos reservados.
                    </footer>
                </div>
            </div>
        </AdminGuard>
    );
}
