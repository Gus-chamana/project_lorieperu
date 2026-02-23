"use client";
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen text-center px-4 bg-lorie-cream">
            <h1 className="absolute bottom-0 text-9xl md:text-[12rem] font-black text-lorie-beige select-none pointer-events-none z-0">
                404
            </h1>
            <div className="relative z-10 flex flex-col items-center">
                <h1 className="text-2xl md:text-3xl font-bold mt-6 text-lorie-dark font-serif">Esta página no ha sido encontrada</h1>
                <p className="mt-4 text-lg md:text-xl text-lorie-brown font-sans mb-8">Lo sentimos, no pudimos encontrar la ruta solicitada.</p>
                <Link href="/" className="px-8 py-3 bg-white border border-lorie-beige text-lorie-brown rounded-full font-sans font-semibold text-sm hover:bg-lorie-beige transition-all duration-300">
                    Volver al Inicio
                </Link>
            </div>
        </div>
    );
}
