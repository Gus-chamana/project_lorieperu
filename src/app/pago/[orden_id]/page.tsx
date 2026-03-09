"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/feature/Navbar';
import FooterMinimal from '@/components/feature/FooterMinimal';

export default function IzipayPaymentPage({ params }: { params: { orden_id: string } }) {
    const ordenId = params.orden_id;
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formToken, setFormToken] = useState<string>('');

    // Bandera para evitar doble inicialización del script KR
    const scriptLoaded = useRef(false);

    // 1. Obtener Sesión de Pago (Token) del Backend
    useEffect(() => {
        const fetchToken = async () => {
            try {
                const res = await fetch('/api/pagos/izipay/generar-sesion', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ orden_id: ordenId })
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || 'Error al iniciar el pago.');
                }

                setFormToken(data.formToken);
            } catch (err: any) {
                setError(err.message);
                setLoading(false);
            }
        };

        if (ordenId) fetchToken();
    }, [ordenId]);

    // 2. Inyectar Scripts de Izipay cuando tenemos el Token
    useEffect(() => {
        if (!formToken || scriptLoaded.current) return;

        // Validar si public key existe (reemplazar temporalmente o leer del entorno client public)
        const publicKey = process.env.NEXT_PUBLIC_IZIPAY_PUBLIC_KEY;
        const izipayEndpoint = process.env.NEXT_PUBLIC_IZIPAY_ENDPOINT || "https://api.micuentaweb.pe";

        if (!publicKey) {
            setError("No se ha configurado la Llave Pública de Izipay (JavaScript Client). Contacta al administrador.");
            setLoading(false);
            return;
        }

        const loadScript = () => {
            return new Promise((resolve, reject) => {
                // Cargar el script de cliente basekr-payment-form (Theme Classic)
                const script = document.createElement("script");
                script.src = `${izipayEndpoint}/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js`;
                script.setAttribute("kr-public-key", publicKey);
                script.setAttribute("kr-post-url-success", "/confirmacion"); // Se enviará aquí en caso de éxito
                script.setAttribute("kr-language", "es-ES");

                // Integrar CSS del formulario (Estilo Neon o Classic)
                const cssLink = document.createElement("link");
                cssLink.rel = "stylesheet";
                cssLink.href = `${izipayEndpoint}/static/js/krypton-client/V4.0/ext/classic.css`;

                document.head.appendChild(cssLink);
                document.body.appendChild(script);

                script.onload = resolve;
                script.onerror = () => reject(new Error('Fallo al cargar la pasarela bancaria.'));

                scriptLoaded.current = true;
            });
        };

        const initForm = async () => {
            try {
                await loadScript();
                // Ocultar nuestro estado de carga cuando Krypton (Izipay) se levanta
                setLoading(false);
            } catch (e) {
                console.error(e);
                setError("Ocurrió un error conectando con el banco.");
                setLoading(false);
            }
        };

        initForm();

        // Cleanup function en caso el componente se desmonte preventivamente
        return () => {
            // Removisión del nodo no es estrictamente obligatoria, Krypton sobreescribe sobre su div.
        }

    }, [formToken]);

    return (
        <div className="min-h-screen bg-lorie-cream flex flex-col pt-24 lg:pt-36">
            <Navbar hideCart />

            <main className="flex-1 flex flex-col items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-lg text-center border border-lorie-beige">
                    <h1 className="font-lista-masta text-3xl text-lorie-dark mb-2">Completar Pago Seguro</h1>
                    <p className="font-sans text-lorie-brown/70 mb-8 text-sm">
                        Estás a un paso de confirmar el pedido <strong>#{ordenId.split('-')[0].toUpperCase()}</strong>.
                    </p>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 mb-6 font-sans text-sm">
                            <i className="ri-error-warning-line text-lg block mb-1"></i>
                            {error}
                        </div>
                    )}

                    {loading && !error && (
                        <div className="py-12">
                            <i className="ri-loader-4-line text-4xl text-lorie-brown animate-spin block mb-4"></i>
                            <p className="font-sans text-sm text-lorie-brown/60">Conectando de forma segura con el banco...</p>
                        </div>
                    )}

                    {/* El contenedor donde Izipay (Krypton) inyectará dinámicamente el Formulario Tarjetas */}
                    <div
                        className={`kr-embedded transition-opacity duration-500 mx-auto ${loading || error ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}
                        kr-form-token={formToken}
                    >
                    </div>

                    {!loading && !error && (
                        <p className="font-sans text-xs text-lorie-brown/50 mt-8 flex items-center justify-center gap-2">
                            <i className="ri-lock-2-line"></i> Pago cifrado y asegurado por Izipay PCI-DSS
                        </p>
                    )}
                </div>
            </main>

            <FooterMinimal />
        </div>
    );
}
