"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Added Image import
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartCount } from '../../hooks/useCart';
import { usePromoBannerState, PROMO_HEIGHT } from './PromoBanner';

interface NavbarProps {
  hideCart?: boolean;
}

export default function Navbar({ hideCart = false }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const cartCount = useCartCount();
  const promoBannerVisible = usePromoBannerState();

  // Si hay un pago pendiente, el carrito redirige al checkout (donde está el banner)
  const [cartLink, setCartLink] = useState('/carrito');

  useEffect(() => {
    const pendiente = localStorage.getItem('pago_pendiente_orden_id');
    setCartLink(pendiente ? '/checkout' : '/carrito');
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Productos', path: '/productos' },
    { name: 'Nosotros', path: '/nosotros' },
    { name: 'Curso', path: '/curso' },
  ];

  // Colores que combinan con el logo rosado/marrón
  const logoTextColor = '#8B5A5A'; // Rosado tierra oscuro - combina con el logo
  const logoSubtextColor = '#A67C7C'; // Rosado tierra medio
  const navLinkColor = '#8B5A5A'; // Mismo tono para consistencia
  const navLinkHover = '#6B4444'; // Más oscuro para hover

  const topOffset = promoBannerVisible ? `${PROMO_HEIGHT}px` : '0px';

  return (
    <nav
      className={`fixed left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-white/95 backdrop-blur-md shadow-lg'
        : 'bg-white/80 backdrop-blur-sm'
        }`}
      style={{ top: topOffset }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 cursor-pointer">
            <div className="w-14 h-14 flex items-center justify-center rounded-full overflow-hidden bg-lorie-rose shadow-sm">
              <Image
                src="/logo.ico"
                alt="Lorie Perú Logo"
                width={56}
                height={56}
                className="w-14 h-14 object-contain"
                priority
              />
            </div>
            <div>
              <h1
                className="font-serif text-2xl font-bold transition-colors duration-300"
                style={{ color: logoTextColor }}
              >
                Lorie Perú
              </h1>
              <p
                className="font-sans text-xs -mt-1 transition-colors duration-300"
                style={{ color: logoSubtextColor }}
              >
                Confeccionamos lo que imaginas
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className="font-sans font-medium text-base transition-colors duration-300 cursor-pointer whitespace-nowrap hover:opacity-80"
                style={{
                  color: pathname === link.path ? navLinkHover : navLinkColor,
                  fontWeight: pathname === link.path ? 600 : 500
                }}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA & Icons */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Cart Icon */}
            {!hideCart && (
              <Link
                href={cartLink}
                className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-lorie-cream transition-all duration-300 cursor-pointer"
                aria-label="Carrito"
                style={{ color: navLinkColor }}
              >
                <i className="ri-shopping-cart-2-line text-xl"></i>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-lorie-rose text-white text-xs font-bold rounded-full">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* WhatsApp Button */}
            <a
              href="https://wa.me/51957026753?text=Hola%20Lorie%20Perú,%20me%20interesa%20conocer%20más"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 text-white rounded-full font-sans font-semibold text-sm transition-all duration-300 cursor-pointer whitespace-nowrap hover:opacity-90"
              style={{ backgroundColor: 'rgb(185, 150, 128)' }}
            >
              <i className="ri-whatsapp-line mr-2"></i>
              Contactar
            </a>
          </div>

          {/* Mobile Icons & Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Cart Icon Mobile */}
            {!hideCart && (
              <Link
                href={cartLink}
                className="relative w-10 h-10 flex items-center justify-center rounded-full cursor-pointer"
                aria-label="Carrito"
                style={{ color: logoTextColor }}
              >
                <i className="ri-shopping-cart-2-line text-xl"></i>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-lorie-rose text-white text-xs font-bold rounded-full">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer"
              aria-label="Toggle menu"
            >
              <i
                className={`text-2xl transition-colors duration-300 ${isMobileMenuOpen ? 'ri-close-line' : 'ri-menu-line'}`}
                style={{ color: logoTextColor }}
              ></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-t border-beige-pastel"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block font-sans font-medium text-base py-2 transition-colors duration-300 cursor-pointer"
                  style={{
                    color: pathname === link.path ? navLinkHover : navLinkColor,
                    fontWeight: pathname === link.path ? 600 : 500
                  }}
                >
                  {link.name}
                </Link>
              ))}

              {/* Social Links Mobile */}
              <div className="flex items-center gap-4 py-2">
                <a
                  href="https://www.instagram.com/lorie.peru"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-lorie-cream cursor-pointer"
                  style={{ color: navLinkColor }}
                >
                  <i className="ri-instagram-line text-xl"></i>
                </a>
              </div>

              <a
                href="https://wa.me/51957026753?text=Hola%20Lorie%20Perú,%20me%20interesa%20conocer%20más"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center px-6 py-3 text-white rounded-full font-sans font-semibold text-sm transition-all duration-300 cursor-pointer whitespace-nowrap"
                style={{ backgroundColor: 'rgb(185, 150, 128)' }}
              >
                <i className="ri-whatsapp-line mr-2"></i>
                Contactar
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
