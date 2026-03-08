"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Hero Background Video */}
      <div className="absolute inset-0 bg-transparent pointer-events-none">
        <iframe
          src="https://player.vimeo.com/video/1171546404?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1&autopause=0&playsinline=1"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
          loading="eager"
          className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2 object-cover"
          title="Video Prueba Lorie"
        ></iframe>
        {/* Dark Overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/50 z-10"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20 mt-10 lg:pt-0 lg:mt-0">
          <div className="max-w-2xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full mb-6"
            >
              <i className="ri-sparkling-line text-white"></i>
              <span className="text-white text-sm font-sans font-medium">Diseños Únicos y Personalizados</span>
            </motion.div>

            {/* Main Title - LORIE PERÚ con Aston Script */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white mb-6"
            >
              <div className="font-aston-script text-7xl md:text-8xl lg:text-9xl leading-tight mb-4" style={{ textShadow: '0 4px 20px rgba(139, 90, 90, 0.6)' }}>
                Lorie Perú
              </div>
              <div className="font-hero-subtitle text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed mb-2" style={{ textShadow: '0 4px 20px rgba(139, 90, 90, 0.6)' }}>
                Confeccionamos lo que imaginas
              </div>
              <div className="font-hero-subtitle text-lg md:text-xl lg:text-2xl font-light leading-relaxed" style={{ textShadow: '0 4px 20px rgba(139, 90, 90, 0.6)' }}>
                Bolsos artesanales con identidad propia
              </div>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-white/95 text-base md:text-lg font-sans font-light leading-relaxed mb-8 max-w-lg"
              style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.4)' }}
            >
              Cada pieza es única, funcional y duradera. Diseñadas con pasión y cuidado en cada detalle.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/productos"
                className="inline-flex items-center justify-center px-8 py-4 text-white rounded-full font-sans font-semibold text-base transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer whitespace-nowrap hover:opacity-90"
                style={{ backgroundColor: 'rgb(185, 150, 128)' }}
              >
                Ver Colección
                <i className="ri-arrow-right-line ml-2"></i>
              </Link>
              <a
                href="https://wa.me/51957026753?text=Hola%20Lorie%20Perú,%20me%20interesa%20conocer%20más%20sobre%20sus%20productos"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-sans font-semibold text-base hover:bg-white/10 transition-all duration-300 cursor-pointer whitespace-nowrap"
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  <i className="ri-whatsapp-line text-white text-xl"></i>
                </div>
                <span className="ml-2">Contáctanos</span>
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 text-center"
      >
        <p className="text-white/80 text-sm font-sans mb-2">Desliza para descubrir</p>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <i className="ri-arrow-down-line text-white text-2xl"></i>
        </motion.div>
      </motion.div>
    </section>
  );
}
