// Footer mínimo para el flujo de compra (carrito, checkout, confirmación).
// Mismo fondo y contenedor que el Footer completo para alinear el texto.
const currentYear = new Date().getFullYear();

export default function FooterMinimal() {
    return (
        <footer className="bg-[#6B4444)] animate-pulse-glow overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="border-t border-white/20 pt-4 pb-2 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="font-sans text-sm text-white/70 text-center md:text-left">
                        © {currentYear} Lorie Perú. Todos los derechos reservados.
                    </p>
                    <div className="flex items-center gap-6">
                        <a
                            href="https://docs.google.com/forms/d/e/1FAIpQLSfSC7GDRl7nK8aB54K0_WTfZTPR01zyKe8Zo_f2PcL5wYiTuA/viewform?pli=1"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-sans text-sm text-white/70 hover:text-white transition-colors duration-300 cursor-pointer inline-flex items-center gap-1.5"
                        >
                            <i className="ri-book-2-line text-sm" />
                            Libro de Reclamaciones
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
