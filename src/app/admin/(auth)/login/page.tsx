"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/admin/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Ocurrió un error inesperado');
            }

            // Login exitoso, recargar la ruta para que middleware asuma el control 
            // y nos deje entrar al dashboard (como redirigir a /admin)
            router.push('/admin');
            router.refresh();

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg- lorire-cream bg-gradient-to-br from-lorie-cream via-white to-lorie-beige px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-lorie-beige"
            >
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 flex items-center justify-center rounded-full overflow-hidden bg-lorie-rose shadow-sm">
                        <Image src="/logo.ico" alt="Lorie Perú" width={64} height={64} className="object-contain" />
                    </div>
                </div>

                <h1 className="text-2xl font-serif font-bold text-center text-lorie-dark mb-2">
                    Panel de Administración
                </h1>
                <p className="text-sm font-sans text-center text-lorie-brown/70 mb-8">
                    Ingresa tus credenciales para continuar
                </p>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mb-4 p-3 bg-red-50 text-red-600 text-sm font-sans font-medium rounded-lg text-center border border-red-100"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-sans font-medium text-lorie-dark mb-1">Usuario</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-lorie-beige bg-lorie-cream/30 text-lorie-dark font-sans text-sm focus:outline-none focus:ring-2 focus:ring-lorie-brown/50 transition-all"
                            placeholder="admin..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-sans font-medium text-lorie-dark mb-1">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-lorie-beige bg-lorie-cream/30 text-lorie-dark font-sans text-sm focus:outline-none focus:ring-2 focus:ring-lorie-brown/50 transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3.5 mt-2 rounded-full font-sans font-semibold text-white transition-all shadow-md flex justify-center items-center ${loading ? 'bg-lorie-brown/70 cursor-not-allowed' : 'bg-[#BB9B8A] hover:opacity-90 hover:shadow-lg'
                            }`}
                    >
                        {loading ? (
                            <i className="ri-loader-4-line animate-spin text-xl"></i>
                        ) : (
                            'Iniciar Sesión'
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center text-xs text-lorie-brown/50 font-sans">
                    &copy; {new Date().getFullYear()} Lorie Perú. Acceso Exclusivo.
                </div>
            </motion.div>
        </div>
    );
}
