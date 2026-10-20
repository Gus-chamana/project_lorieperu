"use client";
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

export default function ModelosGallery() {
  // Imágenes locales desde /public/img/carrusel/ (WebP optimizadas)
  const images = [
    { url: '/img/carrusel/h1.webp', alt: 'Bolso Lorie Perú - Diseño 1' },
    { url: '/img/carrusel/h2.webp', alt: 'Bolso Lorie Perú - Diseño 2' },
    { url: '/img/carrusel/h3.webp', alt: 'Bolso Lorie Perú - Diseño 3' },
    { url: '/img/carrusel/h4.webp', alt: 'Bolso Lorie Perú - Diseño 4' },
    { url: '/img/carrusel/h5.webp', alt: 'Bolso Lorie Perú - Diseño 5' },
    { url: '/img/carrusel/h6.webp', alt: 'Bolso Lorie Perú - Diseño 6' },
    { url: '/img/carrusel/h7.webp', alt: 'Bolso Lorie Perú - Diseño 7' },
    { url: '/img/carrusel/h8.webp', alt: 'Bolso Lorie Perú - Diseño 8' },
    { url: '/img/carrusel/h9.webp', alt: 'Bolso Lorie Perú - Diseño 9' },
    { url: '/img/carrusel/h10.webp', alt: 'Bolso Lorie Perú - Diseño 10' },
    { url: '/img/carrusel/h11.webp', alt: 'Bolso Lorie Perú - Diseño 11' },
    { url: '/img/carrusel/h12.webp', alt: 'Bolso Lorie Perú - Diseño 12' },
    { url: '/img/carrusel/h13.webp', alt: 'Bolso Lorie Perú - Diseño 13' },
    { url: '/img/carrusel/h14.webp', alt: 'Bolso Lorie Perú - Diseño 14' },
    { url: '/img/carrusel/h15.webp', alt: 'Bolso Lorie Perú - Diseño 15' },
  ];

  // Duplicar para efecto marquee infinito
  const doubledImages = [...images, ...images];

  // Primeras 8 imágenes cargan eager (visibles de inmediato), el resto lazy
  const EAGER_COUNT = 8;

  return (
    <section className="py-20 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-lista-masta text-4xl md:text-5xl text-lorie-dark mb-3"
          >
            Estilo y Personalidad
          </motion.h2>

          {/* Subrayado floreado SVG animado */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex justify-center mb-5"
          >
            <svg
              viewBox="0 0 480 28"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full max-w-sm md:max-w-md overflow-visible"
              aria-hidden="true"
            >
              <style>{`
                @keyframes floral-draw {
                  from { stroke-dashoffset: 900; }
                  to   { stroke-dashoffset: 0; }
                }
                .floral-line {
                  stroke-dasharray: 900;
                  stroke-dashoffset: 900;
                  animation: floral-draw 1.4s cubic-bezier(0.4, 0, 0.2, 1) 0.5s forwards;
                }
              `}</style>

              {/* Línea ondulada principal */}
              <path
                className="floral-line"
                d="M 4 18 C 20 10, 36 26, 52 18 C 68 10, 84 26, 100 18 C 116 10, 132 26, 148 18 C 164 10, 180 26, 196 18 C 212 10, 228 26, 244 18 C 260 10, 276 26, 292 18 C 308 10, 324 26, 340 18 C 356 10, 372 26, 388 18 C 404 10, 420 26, 436 18 C 452 10, 468 24, 476 18"
                fill="none"
                stroke="#A67C7C"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Pétalos de flor pequeños a lo largo de la curva */}
              {/* Flor 1 */}
              <g className="floral-line" style={{ animationDelay: '0.7s' }}>
                <circle cx="52" cy="18" r="3.5" fill="none" stroke="#A67C7C" strokeWidth="1.5" />
                <circle cx="52" cy="12" r="2" fill="#C9A0A0" opacity="0.7" />
                <circle cx="52" cy="24" r="2" fill="#C9A0A0" opacity="0.7" />
                <circle cx="46" cy="18" r="2" fill="#C9A0A0" opacity="0.7" />
                <circle cx="58" cy="18" r="2" fill="#C9A0A0" opacity="0.7" />
                <circle cx="52" cy="18" r="1.5" fill="#8B5A5A" />
              </g>

              {/* Flor 2 */}
              <g className="floral-line" style={{ animationDelay: '0.9s' }}>
                <circle cx="148" cy="18" r="3.5" fill="none" stroke="#A67C7C" strokeWidth="1.5" />
                <circle cx="148" cy="12" r="2" fill="#C9A0A0" opacity="0.7" />
                <circle cx="148" cy="24" r="2" fill="#C9A0A0" opacity="0.7" />
                <circle cx="142" cy="18" r="2" fill="#C9A0A0" opacity="0.7" />
                <circle cx="154" cy="18" r="2" fill="#C9A0A0" opacity="0.7" />
                <circle cx="148" cy="18" r="1.5" fill="#8B5A5A" />
              </g>

              {/* Flor central (corazón del diseño) */}
              <g className="floral-line" style={{ animationDelay: '1s' }}>
                <circle cx="244" cy="18" r="4.5" fill="none" stroke="#8B5A5A" strokeWidth="2" />
                <circle cx="244" cy="10" r="2.5" fill="#F5E6D3" stroke="#A67C7C" strokeWidth="1" />
                <circle cx="244" cy="26" r="2.5" fill="#F5E6D3" stroke="#A67C7C" strokeWidth="1" />
                <circle cx="236" cy="18" r="2.5" fill="#F5E6D3" stroke="#A67C7C" strokeWidth="1" />
                <circle cx="252" cy="18" r="2.5" fill="#F5E6D3" stroke="#A67C7C" strokeWidth="1" />
                <circle cx="238.5" cy="12.5" r="2" fill="#F5E6D3" stroke="#A67C7C" strokeWidth="0.8" />
                <circle cx="249.5" cy="12.5" r="2" fill="#F5E6D3" stroke="#A67C7C" strokeWidth="0.8" />
                <circle cx="238.5" cy="23.5" r="2" fill="#F5E6D3" stroke="#A67C7C" strokeWidth="0.8" />
                <circle cx="249.5" cy="23.5" r="2" fill="#F5E6D3" stroke="#A67C7C" strokeWidth="0.8" />
                <circle cx="244" cy="18" r="2" fill="#8B5A5A" />
              </g>

              {/* Flor 4 */}
              <g className="floral-line" style={{ animationDelay: '1.1s' }}>
                <circle cx="340" cy="18" r="3.5" fill="none" stroke="#A67C7C" strokeWidth="1.5" />
                <circle cx="340" cy="12" r="2" fill="#C9A0A0" opacity="0.7" />
                <circle cx="340" cy="24" r="2" fill="#C9A0A0" opacity="0.7" />
                <circle cx="334" cy="18" r="2" fill="#C9A0A0" opacity="0.7" />
                <circle cx="346" cy="18" r="2" fill="#C9A0A0" opacity="0.7" />
                <circle cx="340" cy="18" r="1.5" fill="#8B5A5A" />
              </g>

              {/* Flor 5 */}
              <g className="floral-line" style={{ animationDelay: '1.2s' }}>
                <circle cx="436" cy="18" r="3.5" fill="none" stroke="#A67C7C" strokeWidth="1.5" />
                <circle cx="436" cy="12" r="2" fill="#C9A0A0" opacity="0.7" />
                <circle cx="436" cy="24" r="2" fill="#C9A0A0" opacity="0.7" />
                <circle cx="430" cy="18" r="2" fill="#C9A0A0" opacity="0.7" />
                <circle cx="442" cy="18" r="2" fill="#C9A0A0" opacity="0.7" />
                <circle cx="436" cy="18" r="1.5" fill="#8B5A5A" />
              </g>

              {/* Hojitas decorativas pequeñas */}
              <g className="floral-line" style={{ animationDelay: '0.85s' }}>
                <ellipse cx="100" cy="14" rx="4" ry="2" fill="#C9A0A0" opacity="0.5" transform="rotate(-30 100 14)" />
              </g>
              <g className="floral-line" style={{ animationDelay: '0.95s' }}>
                <ellipse cx="196" cy="22" rx="4" ry="2" fill="#C9A0A0" opacity="0.5" transform="rotate(20 196 22)" />
              </g>
              <g className="floral-line" style={{ animationDelay: '1.05s' }}>
                <ellipse cx="292" cy="14" rx="4" ry="2" fill="#C9A0A0" opacity="0.5" transform="rotate(-20 292 14)" />
              </g>
              <g className="floral-line" style={{ animationDelay: '1.15s' }}>
                <ellipse cx="388" cy="22" rx="4" ry="2" fill="#C9A0A0" opacity="0.5" transform="rotate(30 388 22)" />
              </g>
            </svg>
          </motion.div>

          <p className="font-sans text-lg text-lorie-brown max-w-2xl mx-auto">
            Descubre cómo nuestros bolsos complementan tu estilo único
          </p>
        </motion.div>

        {/* Hero Container for Carousel */}
        <div className="relative group w-full overflow-hidden px-2 py-4">
          <style>{`
            @keyframes scrollLeft {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-50%); }
            }
            .marquee-left {
              animation: scrollLeft 60s linear infinite;
              display: flex;
              gap: 1rem;
            }
            @media (min-width: 768px) {
              .marquee-left { gap: 1.5rem; }
            }
            .marquee-left:hover {
              animation-play-state: paused;
            }
          `}</style>

          <div className="marquee-left w-max">
            {doubledImages.map((image, index) => (
              <motion.div
                key={index}
                className="relative rounded-3xl overflow-hidden shadow-xl shrink-0"
                style={{
                  width: 'clamp(260px, 30vw, 360px)',
                  aspectRatio: '4/5'
                }}
                initial={{ opacity: 1, scale: 1 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="object-cover pointer-events-none transition-transform duration-700 hover:scale-110"
                  sizes="(max-width: 768px) 260px, (max-width: 1200px) 30vw, 360px"
                  loading={index < EAGER_COUNT ? "eager" : "lazy"}
                />
                {/* Sutil gradiente inferior para darle estética premium (sin texto) */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-lorie-dark/40 to-transparent pointer-events-none mix-blend-multiply opacity-60"></div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <a
            href="https://www.instagram.com/lorie.peru"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-10 py-4 bg-lorie-brown text-white rounded-full font-sans font-semibold text-sm tracking-widest uppercase hover:bg-lorie-dark transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
          >
            <i className="ri-instagram-line mr-2 text-xl"></i>
            Síguenos en Instagram
          </a>
        </motion.div>
      </div>
    </section>
  );
}

