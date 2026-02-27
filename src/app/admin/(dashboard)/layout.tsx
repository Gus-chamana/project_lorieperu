"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { usePromoBannerState, PROMO_HEIGHT } from "@/components/feature/PromoBanner";

export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const promoBannerVisible = usePromoBannerState();

    const menuItems = [
        { title: "Dashboard", path: "/admin", icon: "ri-dashboard-line" },
        { title: "Productos", path: "/admin/productos", icon: "ri-shopping-bag-3-line" },
        { title: "Órdenes", path: "/admin/ordenes", icon: "ri-file-list-3-line" },
        { title: "Descuentos", path: "/admin/descuentos", icon: "ri-price-tag-3-line" },
    ];

    // Cerrar sidebar al cambiar de ruta en mobile
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

    const handleLogout = async () => {
        if (!confirm('¿Deseas cerrar sesión?')) return;
        setIsLoggingOut(true);
        await fetch('/api/admin/logout', { method: 'POST' });
        router.push('/admin/login');
        router.refresh();
    };

    const topOffset = promoBannerVisible ? `${PROMO_HEIGHT}px` : '0px';
    const heightOffset = promoBannerVisible ? `calc(100vh - ${PROMO_HEIGHT}px)` : '100vh';

    return (
        <div className="bg-gray-50 flex w-full" style={{ minHeight: heightOffset, marginTop: topOffset }}>
            {/* Botón flotante Mobile */}
            <button
                className="md:hidden fixed left-4 z-50 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-lorie-dark"
                style={{ top: `calc(1rem + ${topOffset})` }}
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                <i className={`text-xl ${isSidebarOpen ? 'ri-close-line' : 'ri-menu-line'}`}></i>
            </button>

            {/* Overlay mobile */}
            {isSidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
                    style={{ top: topOffset }}
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed md:sticky left-0 w-64 bg-white border-r border-lorie-beige/50 flex flex-col z-50 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
                style={{ top: topOffset, height: heightOffset }}
            >
                <div className="p-6 flex items-center justify-center border-b border-lorie-beige/30">
                    <Link href="/" className="flex flex-col items-center">
                        <div className="w-12 h-12 flex items-center justify-center rounded-full overflow-hidden bg-lorie-rose shadow-sm mb-2">
                            <Image src="/logo.ico" alt="Lorie Perú" width={48} height={48} className="object-contain" />
                        </div>
                        <span className="font-serif font-bold text-lorie-dark text-lg">Admin Panel</span>
                    </Link>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path));
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-sans transition-all duration-200 ${isActive
                                    ? "bg-[#BB9B8A] text-white shadow-md font-medium"
                                    : "text-lorie-brown/70 hover:bg-lorie-cream/50 hover:text-lorie-dark"
                                    }`}
                            >
                                <i className={`${item.icon} text-lg`}></i>
                                {item.title}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-lorie-beige/30">
                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex items-center justify-center gap-2 w-full py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-sans font-medium disabled:opacity-50"
                    >
                        <i className="ri-logout-box-r-line"></i>
                        {isLoggingOut ? 'Saliendo...' : 'Cerrar Sesión'}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 bg-[#FDFBF9]" style={{ height: heightOffset, overflowY: 'auto' }}>
                {children}
            </main>
        </div>
    );
}
