"use client";
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function ContactoSection() {
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
          <h2 className="font-lista-masta text-4xl md:text-5xl text-lorie-dark mb-6">
            ¿Tienes Alguna Pregunta?
          </h2>
          <p className="font-sans text-lg text-lorie-brown max-w-3xl mx-auto">
            Estamos aquí para ayudarte. Contáctanos y te responderemos lo antes posible.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Contact Info Cards */}
            <div className="space-y-4">
              <a
                href="https://wa.me/51957026753"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-lorie-beige group"
              >
                <div className="w-14 h-14 flex items-center justify-center bg-green-500 rounded-full flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <i className="ri-whatsapp-line text-white text-2xl"></i>
                </div>
                <div>
                  <h3 className="font-sans font-semibold text-lg text-lorie-dark">
                    WhatsApp
                  </h3>
                  <p className="font-sans text-sm text-lorie-brown">
                    +51 957 026 753
                  </p>
                </div>
              </a>

              <a
                href="mailto:lorieventas@gmail.com"
                className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-lorie-beige group"
              >
                <div className="w-14 h-14 flex items-center justify-center bg-lorie-brown rounded-full flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <i className="ri-mail-line text-white text-2xl"></i>
                </div>
                <div>
                  <h3 className="font-sans font-semibold text-lg text-lorie-dark">
                    Email
                  </h3>
                  <p className="font-sans text-sm text-lorie-brown">
                    lorieventas@gmail.com
                  </p>
                </div>
              </a>

              <a
                href="https://www.instagram.com/lorie.peru"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-lorie-beige group"
              >
                <div className="w-14 h-14 flex items-center justify-center bg-lorie-rose rounded-full flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <i className="ri-instagram-line text-white text-2xl"></i>
                </div>
                <div>
                  <h3 className="font-sans font-semibold text-lg text-lorie-dark">
                    Instagram
                  </h3>
                  <p className="font-sans text-sm text-lorie-brown">
                    @lorie.peru
                  </p>
                </div>
              </a>

              <a
                href="https://www.tiktok.com/@lorie.peru"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-lorie-beige group"
              >
                <div className="w-14 h-14 flex items-center justify-center rounded-full flex-shrink-0 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: 'rgb(185, 150, 128)' }}>
                  <i className="ri-tiktok-line text-white text-2xl"></i>
                </div>
                <div>
                  <h3 className="font-sans font-semibold text-lg text-lorie-dark">
                    TikTok
                  </h3>
                  <p className="font-sans text-sm text-lorie-brown">
                    @lorie.peru
                  </p>
                </div>
              </a>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="w-full h-96 rounded-3xl overflow-hidden shadow-2xl relative">
              <Image
                src="https://sfpjbtvoulmxldwfstnr.supabase.co/storage/v1/object/public/home/home_1.jpg"
                alt="Contacto Lorie Perú"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            {/* Decorative Element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-lorie-beige rounded-3xl -z-10"></div>
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-lorie-rose/30 rounded-3xl -z-10"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
