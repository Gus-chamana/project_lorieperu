"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function NosotrosPreview() {
  return (
    <section className="py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-lista-masta text-4xl md:text-5xl text-lorie-dark mb-2">
            Nuestra Historia
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-sans text-base text-lorie-brown leading-relaxed mb-6">
              <strong className="text-lorie-dark">LORIE PERÚ</strong> nació hace cuatro años como un emprendimiento personal, iniciado en una habitación con una máquina doméstica de segunda mano y una visión clara: crear productos de calidad con identidad propia.
            </p>
            <p className="font-sans text-base text-lorie-brown leading-relaxed mb-6">
              Lo que comenzó con la elaboración de monederos artesanales, se transformó progresivamente en una marca gracias a la capacitación constante, la mejora continua de procesos y una fuerte vocación por el diseño y la confección.
            </p>
            <p className="font-sans text-base text-lorie-brown leading-relaxed mb-8">
              Hoy, <strong className="text-lorie-dark">LORIE PERÚ</strong> es el resultado de un crecimiento sostenido, construido con esfuerzo, aprendizaje y un equipo de colaboradores que hicieron posible consolidar este proyecto empresarial.
            </p>

            {/* Features */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-lorie-beige rounded-full flex-shrink-0">
                  <i className="ri-hand-heart-line text-lorie-dark text-xl"></i>
                </div>
                <div>
                  <h3 className="font-sans font-semibold text-lg text-lorie-dark mb-1">
                    Diseño con Identidad
                  </h3>
                  <p className="font-sans text-sm text-lorie-brown">
                    Cada bolso es diseñado y confeccionado por nuestro propio equipo
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-lorie-beige rounded-full flex-shrink-0">
                  <i className="ri-star-line text-lorie-dark text-xl"></i>
                </div>
                <div>
                  <h3 className="font-sans font-semibold text-lg text-lorie-dark mb-1">
                    Calidad Garantizada
                  </h3>
                  <p className="font-sans text-sm text-lorie-brown">
                    Alto estándar de acabado en cada etapa del proceso productivo
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-lorie-beige rounded-full flex-shrink-0">
                  <i className="ri-palette-line text-lorie-dark text-xl"></i>
                </div>
                <div>
                  <h3 className="font-sans font-semibold text-lg text-lorie-dark mb-1">
                    Personalización
                  </h3>
                  <p className="font-sans text-sm text-lorie-brown">
                    Piezas únicas, funcionales y duraderas creadas con pasión
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/nosotros"
              className="inline-flex items-center justify-center px-8 py-4 text-white rounded-full font-sans font-semibold text-base transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer whitespace-nowrap hover:opacity-90"
              style={{ backgroundColor: 'rgb(185, 150, 128)' }}
            >
              Conoce Más Sobre Nosotros
              <i className="ri-arrow-right-line ml-2"></i>
            </Link>
          </motion.div>

          {/* Right Images Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="space-y-4">
              <div className="w-full h-64 rounded-2xl overflow-hidden relative">
                <Image
                  src="https://readdy.ai/api/search-image?query=artisan%20hands%20sewing%20handmade%20fabric%20handbag%2C%20craftsmanship%20process%2C%20beige%20and%20earth%20tones%20materials%2C%20workshop%20setting%2C%20natural%20lighting%2C%20textile%20art%2C%20detailed%20close%20up%20of%20sewing%20machine%20work&width=400&height=500&seq=proceso1&orientation=portrait"
                  alt="Proceso artesanal Lorie Perú"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="w-full h-48 rounded-2xl overflow-hidden relative">
                <Image
                  src="https://readdy.ai/api/search-image?query=collection%20of%20handmade%20fabric%20bags%20and%20purses%2C%20beige%20pastel%20and%20earth%20tones%2C%20artisan%20crafted%20accessories%2C%20organized%20display%2C%20natural%20lighting%2C%20textile%20products%2C%20contemporary%20design&width=400&height=400&seq=proceso2&orientation=squarish"
                  alt="Colección Lorie Perú"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="w-full h-48 rounded-2xl overflow-hidden relative">
                <Image
                  src="https://readdy.ai/api/search-image?query=fabric%20materials%20and%20sewing%20supplies%20for%20handbag%20making%2C%20beige%20and%20earth%20tone%20textiles%2C%20artisan%20workspace%2C%20crafting%20tools%2C%20natural%20lighting%2C%20textile%20design%20materials&width=400&height=400&seq=proceso3&orientation=squarish"
                  alt="Materiales Lorie Perú"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="w-full h-64 rounded-2xl overflow-hidden relative">
                <Image
                  src="https://readdy.ai/api/search-image?query=finished%20handmade%20fabric%20handbags%20with%20cute%20aesthetic%20details%2C%20beige%20pastel%20and%20earth%20tones%2C%20artisan%20crafted%20bags%2C%20product%20photography%2C%20natural%20lighting%2C%20contemporary%20design%2C%20quality%20accessories&width=400&height=500&seq=proceso4&orientation=portrait"
                  alt="Productos terminados Lorie Perú"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
