"use client";
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function ModelosGallery() {
  const images = [
    {
      url: 'https://readdy.ai/api/search-image?query=young%20modern%20woman%20model%20wearing%20casual%20outfit%20holding%20handmade%20beige%20pastel%20fabric%20handbag%2C%20full%20body%20lifestyle%20fashion%20photography%2C%20natural%20outdoor%20setting%2C%20soft%20daylight%2C%20earth%20tones%20aesthetic%2C%20contemporary%20style%2C%20minimalist%20background%2C%20artisan%20crafted%20bag%20accessories&width=800&height=1000&seq=modelo1&orientation=portrait',
      alt: 'Modelo con bolso Lorie Perú estilo casual'
    },
    {
      url: 'https://readdy.ai/api/search-image?query=stylish%20young%20woman%20in%20modern%20outfit%20carrying%20cute%20aesthetic%20handmade%20purse%20bag%2C%20beige%20and%20earth%20tones%2C%20lifestyle%20fashion%20photography%2C%20urban%20setting%2C%20natural%20lighting%2C%20feminine%20accessories%2C%20artisan%20crafted%20handbag%2C%20contemporary%20fashion%20style&width=800&height=1000&seq=modelo2&orientation=portrait',
      alt: 'Modelo con bolso Lorie Perú estilo urbano'
    },
    {
      url: 'https://readdy.ai/api/search-image?query=elegant%20young%20woman%20model%20with%20handmade%20fabric%20bag%20accessory%2C%20pastel%20beige%20and%20neutral%20tones%2C%20lifestyle%20fashion%20photography%2C%20soft%20natural%20light%2C%20minimalist%20aesthetic%2C%20artisan%20crafted%20purse%2C%20delicate%20details%2C%20contemporary%20feminine%20style&width=800&height=1000&seq=modelo3&orientation=portrait',
      alt: 'Modelo con bolso Lorie Perú estilo elegante'
    },
    {
      url: 'https://readdy.ai/api/search-image?query=modern%20woman%20holding%20cute%20handmade%20fabric%20handbag%20with%20aesthetic%20design%2C%20beige%20pastel%20and%20earth%20tones%2C%20lifestyle%20fashion%20photography%2C%20natural%20setting%2C%20soft%20lighting%2C%20artisan%20crafted%20bag%2C%20contemporary%20style%2C%20feminine%20accessories&width=800&height=1000&seq=modelo4&orientation=portrait',
      alt: 'Modelo con bolso Lorie Perú estilo moderno'
    }
  ];

  return (
    <section className="py-20 relative z-10">
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
                d="M 4 18
                   C 20 10, 36 26, 52 18
                   C 68 10, 84 26, 100 18
                   C 116 10, 132 26, 148 18
                   C 164 10, 180 26, 196 18
                   C 212 10, 228 26, 244 18
                   C 260 10, 276 26, 292 18
                   C 308 10, 324 26, 340 18
                   C 356 10, 372 26, 388 18
                   C 404 10, 420 26, 436 18
                   C 452 10, 468 24, 476 18"
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

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl aspect-[4/5] cursor-pointer"
            >
              {/* The Image component needs a parent with relative positioning and defined dimensions */}
              {/* The motion.div already provides 'relative' and 'aspect-[4/5]' */}
              <Image
                src={image.url}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-lorie-dark/80 via-lorie-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div className="text-white">
                  <p className="font-sans text-sm font-medium">Lorie Perú</p>
                  <p className="font-serif text-lg">Estilo {index + 1}</p>
                </div>
              </div>
            </motion.div>
          ))}
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
            className="inline-flex items-center justify-center px-8 py-4 bg-lorie-brown text-white rounded-full font-sans font-semibold text-base hover:bg-lorie-dark transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer whitespace-nowrap"
          >
            <i className="ri-instagram-line mr-2 text-xl"></i>
            Síguenos en Instagram
          </a>
        </motion.div>
      </div>
    </section>
  );
}
