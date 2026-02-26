"use client";
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#6B4444] animate-pulse-glow overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white overflow-hidden flex-shrink-0 shadow">
                <Image
                  src="/logo.ico"
                  alt="Lorie Perú Logo"
                  width={44}
                  height={44}
                  className="w-11 h-11 object-contain"
                />
              </div>
              <div>
                <span className="font-serif text-xl font-semibold text-white block leading-tight">Lorie Perú</span>
                <span className="font-sans text-xs text-white/80">Confeccionamos lo que imaginas</span>
              </div>
            </div>
            <p className="font-sans text-sm text-white/80 leading-relaxed mb-6">
              Bolsos y accesorios artesanales con identidad propia. Cada pieza es única, funcional y duradera, creada con pasión por el arte textil.
            </p>
            {/* Social Media */}
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/lorie.peru"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white hover:text-[rgb(139,90,90)] text-white rounded-full transition-all duration-300 cursor-pointer"
                aria-label="Instagram"
              >
                <i className="ri-instagram-line text-xl"></i>
              </a>
              <a
                href="https://www.tiktok.com/@lorie.peru"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white hover:text-[rgb(139,90,90)] text-white rounded-full transition-all duration-300 cursor-pointer"
                aria-label="TikTok"
              >
                <i className="ri-tiktok-line text-xl"></i>
              </a>
              <a
                href="https://wa.me/51957026753"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white hover:text-[rgb(139,90,90)] text-white rounded-full transition-all duration-300 cursor-pointer"
                aria-label="WhatsApp"
              >
                <i className="ri-whatsapp-line text-xl"></i>
              </a>
              <a
                href="mailto:lorieventas@gmail.com"
                className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white hover:text-[rgb(139,90,90)] text-white rounded-full transition-all duration-300 cursor-pointer"
                aria-label="Email"
              >
                <i className="ri-mail-line text-xl"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-sans font-semibold text-lg text-white mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="font-sans text-sm text-white/80 hover:text-white transition-colors duration-300 cursor-pointer"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/productos"
                  className="font-sans text-sm text-white/80 hover:text-white transition-colors duration-300 cursor-pointer"
                >
                  Productos
                </Link>
              </li>
              <li>
                <Link
                  href="/carrito"
                  className="font-sans text-sm text-white/80 hover:text-white transition-colors duration-300 cursor-pointer"
                >
                  Carrito
                </Link>
              </li>
              <li>
                <Link
                  href="/nosotros"
                  className="font-sans text-sm text-white/80 hover:text-white transition-colors duration-300 cursor-pointer"
                >
                  Nosotros
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-sans font-semibold text-lg text-white mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <i className="ri-phone-line text-white/90 mt-1"></i>
                <a
                  href="tel:+51957026753"
                  className="font-sans text-sm text-white/80 hover:text-white transition-colors duration-300 cursor-pointer"
                >
                  +51 957 026 753
                </a>
              </li>
              <li className="flex items-start gap-3">
                <i className="ri-mail-line text-white/90 mt-1"></i>
                <a
                  href="mailto:lorieventas@gmail.com"
                  className="font-sans text-sm text-white/80 hover:text-white transition-colors duration-300 cursor-pointer"
                >
                  lorieventas@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <i className="ri-instagram-line text-white/90 mt-1"></i>
                <a
                  href="https://www.instagram.com/lorie.peru"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-sm text-white/80 hover:text-white transition-colors duration-300 cursor-pointer"
                >
                  @lorie.peru
                </a>
              </li>
              <li className="flex items-start gap-3">
                <i className="ri-tiktok-line text-white/90 mt-1"></i>
                <a
                  href="https://www.tiktok.com/@lorie.peru"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-sm text-white/80 hover:text-white transition-colors duration-300 cursor-pointer"
                >
                  @lorie.peru
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-8 pt-4 flex flex-col md:flex-row justify-between items-center gap-4">
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
              <i className="ri-book-2-line text-sm"></i>
              Libro de Reclamaciones
            </a>

          </div>
        </div>
      </div>
    </footer>
  );
}
