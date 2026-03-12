"use client";

import { useEffect, useState, useRef } from 'react';
import Navbar from '@/components/feature/Navbar';
import FooterMinimal from '@/components/feature/FooterMinimal';
import CheckoutSteps from '@/components/feature/CheckoutSteps';

export default function IzipayPaymentPage({ params }: { params: { orden_id: string } }) {
    const ordenId = params.orden_id;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formToken, setFormToken] = useState<string>('');
    const scriptLoaded = useRef(false);

    // PASO 1: Obtener el FormToken desde nuestro backend seguro
    useEffect(() => {
        const fetchToken = async () => {
            try {
                const res = await fetch('/api/pagos/izipay/generar-sesion', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ orden_id: ordenId })
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Error al iniciar el pago.');
                setFormToken(data.formToken);
            } catch (err: any) {
                setError(err.message);
                setLoading(false);
            }
        };
        if (ordenId) fetchToken();
    }, [ordenId]);

    // PASO 2: Inyectar el script de Krypton (Izipay) desde el CDN estático correcto
    useEffect(() => {
        if (!formToken || scriptLoaded.current) return;

        const publicKey = process.env.NEXT_PUBLIC_IZIPAY_PUBLIC_KEY;
        // URL del CDN estático oficial de Izipay (NO el endpoint de API)
        const STATIC_CDN = 'https://static.micuentaweb.pe';

        if (!publicKey) {
            setError('No se ha configurado la Llave Pública de Izipay. Contacta al administrador.');
            setLoading(false);
            return;
        }

        // URL de éxito: URL absoluta pública para que Izipay redirija correctamente
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.lorieperu.com';
        const successUrl = `${baseUrl}/confirmacion?orden=${ordenId}`;

        const loadScript = () => {
            return new Promise<void>((resolve, reject) => {
                // CSS oficial de Izipay - tema Classic (único confirmado que muestra campos visibles)
                const cssLink = document.createElement('link');
                cssLink.rel = 'stylesheet';
                cssLink.href = `${STATIC_CDN}/static/js/krypton-client/V4.0/ext/classic.css`;
                document.head.appendChild(cssLink);

                // CSS mínimo: solo estiliza el botón, NO toca campos ni contenedor
                const cssCustom = document.createElement('link');
                cssCustom.rel = 'stylesheet';
                cssCustom.href = '/izipay-lorie.css';
                document.head.appendChild(cssCustom);

                // Script principal de Krypton
                const script = document.createElement('script');
                script.src = `${STATIC_CDN}/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js`;
                script.setAttribute('kr-public-key', publicKey);
                script.setAttribute('kr-get-url-success', successUrl);    // GET redirect: compatible con Next.js pages
                script.setAttribute('kr-language', 'es-ES');
                document.body.appendChild(script);

                script.onload = () => { resolve(); };
                script.onerror = () => reject(new Error('No se pudo cargar el formulario de Izipay.'));
                scriptLoaded.current = true;
            });
        };

        const initForm = async () => {
            try {
                await loadScript();
                setLoading(false);
            } catch (e: any) {
                console.error(e);
                setError('Ocurrió un error conectando con el banco. Por favor recarga la página.');
                setLoading(false);
            }
        };

        initForm();
    }, [formToken, ordenId]);

    return (
        <div className="min-h-screen bg-lorie-cream flex flex-col pt-24 mt-16 lg:mt-0 lg:pt-36">
            <Navbar hideCart />

            <main className="flex-1 flex flex-col items-center p-4 pb-16">
                {/* Stepper */}
                <div className="max-w-6xl w-full mx-auto mb-10 flex justify-center">
                    <CheckoutSteps paso={3} />
                </div>

                {/* Card de pago */}
                <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-lg border border-lorie-beige">

                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-lorie-cream flex items-center justify-center">
                            <i className="ri-secure-payment-line text-2xl text-lorie-brown"></i>
                        </div>
                        <h1 className="font-serif text-2xl font-bold text-lorie-dark">Pago Seguro</h1>
                        <p className="font-sans text-lorie-brown/60 text-sm mt-1">
                            Pedido <strong className="text-lorie-dark font-mono">#{ordenId.split('-')[0].toUpperCase()}</strong>
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 mb-6 font-sans text-sm text-center">
                            <i className="ri-error-warning-line text-lg block mb-1"></i>
                            {error}
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-3 text-xs underline block mx-auto text-red-500"
                            >
                                Reintentar
                            </button>
                        </div>
                    )}

                    {/* Loading */}
                    {loading && !error && (
                        <div className="py-14 text-center">
                            <i className="ri-loader-4-line text-4xl text-lorie-brown animate-spin block mb-4"></i>
                            <p className="font-sans text-sm text-lorie-brown/60">Conectando de forma segura con el banco...</p>
                        </div>
                    )}

                    {/* Formulario clásico embebido de Izipay */}
                    <div
                        className={`kr-embedded mx-auto transition-opacity duration-500 ${loading || error ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}
                        kr-form-token={formToken}
                    ></div>

                    {/* Pie de seguridad */}
                    {!loading && !error && (
                        <p className="font-sans text-xs text-lorie-brown/40 mt-6 flex items-center justify-center gap-2">
                            <i className="ri-lock-2-line"></i>
                            Pago cifrado y asegurado por Izipay · PCI-DSS Nivel 1
                        </p>
                    )}
                </div>
            </main>

            <FooterMinimal />
        </div>
    );
}
