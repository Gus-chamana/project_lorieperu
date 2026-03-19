"use client";
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

export default function ModelosGallery() {
  // URLs de imágenes desde el bucket "home" en Supabase.
  const rawImages = [
    {
      url: 'https://sfpjbtvoulmxldwfstnr.supabase.co/storage/v1/object/public/home/h1.jpeg',
      alt: 'Bolso Lorie Perú - Diseño 1'
    },
    {
      url: 'https://sfpjbtvoulmxldwfstnr.supabase.co/storage/v1/object/public/home/h2.jpeg',
      alt: 'Bolso Lorie Perú - Diseño 2'
    },
    {
      url: 'https://sfpjbtvoulmxldwfstnr.supabase.co/storage/v1/object/public/home/h3.jpeg',
      alt: 'Bolso Lorie Perú - Diseño 3'
    },
    {
      url: 'https://sfpjbtvoulmxldwfstnr.supabase.co/storage/v1/object/public/home/h4.jpeg',
      alt: 'Bolso Lorie Perú - Diseño 4'
    },
    {
      url: 'https://sfpjbtvoulmxldwfstnr.supabase.co/storage/v1/object/public/home/h5.jpeg',
      alt: 'Bolso Lorie Perú - Diseño 5'
    },
    {
      url: 'https://sfpjbtvoulmxldwfstnr.supabase.co/storage/v1/object/public/home/h6.jpeg',
      alt: 'Bolso Lorie Perú - Diseño 6'
    },
    {
      url: 'https://sfpjbtvoulmxldwfstnr.supabase.co/storage/v1/object/public/home/h7.jpeg',
      alt: 'Bolso Lorie Perú - Diseño 7'
    },
    {
      url: 'https://sfpjbtvoulmxldwfstnr.supabase.co/storage/v1/object/public/home/h8.jpeg',
      alt: 'Bolso Lorie Perú - Diseño 8'
    },
    {
      url: 'https://sfpjbtvoulmxldwfstnr.supabase.co/storage/v1/object/public/home/h9.jpeg',
      alt: 'Bolso Lorie Perú - Diseño 9'
    },
    {
      url: 'https://sfpjbtvoulmxldwfstnr.supabase.co/storage/v1/object/public/home/h10.jpeg',
      alt: 'Bolso Lorie Perú - Diseño 10'
    },
    {
      url: 'https://sfpjbtvoulmxldwfstnr.supabase.co/storage/v1/object/public/home/h11.jpeg',
      alt: 'Bolso Lorie Perú - Diseño 11'
    },
    {
      url: 'https://sfpjbtvoulmxldwfstnr.supabase.co/storage/v1/object/public/home/h12.jpeg',
      alt: 'Bolso Lorie Perú - Diseño 12'
    },
    {
      url: 'https://sfpjbtvoulmxldwfstnr.supabase.co/storage/v1/object/public/home/h13.jpeg',
      alt: 'Bolso Lorie Perú - Diseño 13'
    },
    {
      url: 'https://sfpjbtvoulmxldwfstnr.supabase.co/storage/v1/object/public/home/h14.jpeg',
      alt: 'Bolso Lorie Perú - Diseño 14'
    },
    {
      url: 'https://sfpjbtvoulmxldwfstnr.supabase.co/storage/v1/object/public/home/h15.jpeg',
      alt: 'Bolso Lorie Perú - Diseño 15'
    },
    {
      url: 'https://sfpjbtvoulmxldwfstnr.supabase.co/storage/v1/object/public/home/h16.jpeg',
      alt: 'Bolso Lorie Perú - Diseño 16'
    },
    {
      url: 'https://sfpjbtvoulmxldwfstnr.supabase.co/storage/v1/object/public/home/h17.jpeg',
      alt: 'Bolso Lorie Perú - Diseño 17'
    },
    {
      url: 'https://sfpjbtvoulmxldwfstnr.supabase.co/storage/v1/object/public/home/h18.jpeg',
      alt: 'Bolso Lorie Perú - Diseño 18'
    },
    {
      url: 'https://sfpjbtvoulmxldwfstnr.supabase.co/storage/v1/object/public/home/h19.jpeg',
      alt: 'Bolso Lorie Perú - Diseño 19'
    },
    {
      url: 'https://sfpjbtvoulmxldwfstnr.supabase.co/storage/v1/object/public/home/h20.jpeg',
      alt: 'Bolso Lorie Perú - Diseño 20'
    },
    {
      url: 'https://sfpjbtvoulmxldwfstnr.supabase.co/storage/v1/object/public/home/h21.jpeg',
      alt: 'Bolso Lorie Perú - Diseño 21'
    },
    {
      url: 'https://sfpjbtvoulmxldwfstnr.supabase.co/storage/v1/object/public/home/h22.jpeg',
      alt: 'Bolso Lorie Perú - Diseño 22'
    },
    {
      url: 'https://sfpjbtvoulmxldwfstnr.supabase.co/storage/v1/object/public/home/h23.jpeg',
      alt: 'Bolso Lorie Perú - Diseño 23'
    },
    {
      url: 'https://sfpjbtvoulmxldwfstnr.supabase.co/storage/v1/object/public/home/h24.jpeg',
      alt: 'Bolso Lorie Perú - Diseño 24'
    },
    {
      url: 'https://sfpjbtvoulmxldwfstnr.supabase.co/storage/v1/object/public/home/h25.jpeg',
      alt: 'Bolso Lorie Perú - Diseño 25'
    },
    {
      url: 'https://sfpjbtvoulmxldwfstnr.supabase.co/storage/v1/object/public/home/h26.jpeg',
      alt: 'Bolso Lorie Perú - Diseño 26'
    },
    {
      url: 'https://sfpjbtvoulmxldwfstnr.supabase.co/storage/v1/object/public/home/h27.jpeg',
      alt: 'Bolso Lorie Perú - Diseño 27'
    },
    {
      url: 'https://sfpjbtvoulmxldwfstnr.supabase.co/storage/v1/object/public/home/h28.jpeg',
      alt: 'Bolso Lorie Perú - Diseño 28'
    },
    {
      url: 'https://sfpjbtvoulmxldwfstnr.supabase.co/storage/v1/object/public/home/h29.jpeg',
      alt: 'Bolso Lorie Perú - Diseño 29'
    },
    {
      url: 'https://sfpjbtvoulmxldwfstnr.supabase.co/storage/v1/object/public/home/h30.jpeg',
      alt: 'Bolso Lorie Perú - Diseño 30'
    },
  ];

  /* 
   Optimización de Supabase:
   Agregamos parámetros a la URL pública para indicarle al servidor de Supabase que 
   re-escale y entregue un webp optimizado de 600x800 antes de enviarlo al cliente.
   Esto ahorra Mbs masivos en la carga inicial independientemente del peso original.
  */
  const images = rawImages.map(img => ({
    ...img,
    url: `${img.url}?width=600&height=800&resize=cover`
  }));

  const doubledImages = [...images, ...images];

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
            @keyframes scrollRight {
              0% { transform: translateX(-50%); }
              100% { transform: translateX(0%); }
            }
            .marquee-right {
              animation: scrollRight 30s linear infinite;
              display: flex;
              gap: 1rem;
            }
            @media (min-width: 768px) {
              .marquee-right { gap: 1.5rem; }
            }
            .marquee-right:hover {
              animation-play-state: paused;
            }
          `}</style>

          <div className="marquee-right w-max">
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
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  loading={index < 4 ? 'eager' : 'lazy'}
                  priority={index < 4}
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

