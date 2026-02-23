"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function CookieBanner() {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        // Retrasamos un par de segundos la aparición para que no rompa la fluidez de entrada
        const timer = setTimeout(() => {
            const consent = localStorage.getItem('lorie_cookie_consent');
            if (!consent) {
                setShowBanner(true);
            }
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const acceptCookies = () => {
        localStorage.setItem('lorie_cookie_consent', 'true');
        setShowBanner(false);
    };

    return (
        <AnimatePresence>
            {showBanner && (
                <motion.div
                    initial={{ y: 150, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 150, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="fixed bottom-0 sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-md z-[100] w-full bg-white sm:rounded-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] sm:shadow-2xl border border-lorie-beige p-5"
                >
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-lorie-cream rounded-full flex items-center justify-center flex-shrink-0 text-lorie-rose">
                            <i className="ri-cookie-line text-xl"></i>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-serif text-lorie-dark font-semibold text-base mb-1">
                                Valoramos tu privacidad
                            </h3>
                            <p className="text-xs text-lorie-brown/80 font-sans leading-relaxed mb-4">
                                Lorie Perú utiliza cookies (almacenamiento local) estrictamente necesarias para recordar los productos de tu carrito de compras y asegurar el correcto funcionamiento de la tienda.
                                <br />
                                <Link href="/nosotros" className="text-lorie-rose underline mt-1 inline-block">Saber más</Link>
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={acceptCookies}
                                    className="flex-1 py-2.5 bg-lorie-dark text-white rounded-xl text-xs font-bold font-sans hover:bg-black transition-colors cursor-pointer"
                                >
                                    ¡Entendido!
                                </button>
                                <button
                                    onClick={() => setShowBanner(false)}
                                    className="w-10 h-10 flex items-center justify-center border border-lorie-beige text-lorie-brown rounded-xl hover:bg-lorie-cream transition-colors cursor-pointer"
                                    title="Cerrar temporalmente"
                                >
                                    <i className="ri-close-line text-lg"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
