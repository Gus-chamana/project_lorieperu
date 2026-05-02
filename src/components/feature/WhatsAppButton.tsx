"use client";
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function WhatsAppButton() {
  return (
    <>
      <motion.a
        href="https://www.natura.com.pe/consultoria/aureliaquispemayhua"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 1 }}
        className="fixed bottom-24 right-6 z-40 w-14 h-14 flex items-center justify-center bg-white hover:bg-gray-50 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 cursor-pointer border border-gray-100"
        aria-label="Catálogo Natura"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 bg-orange-500 rounded-full opacity-20"
        ></motion.div>
        <div className="relative z-10 w-full h-full flex items-center justify-center p-[10px]">
          <Image src="/natura-logo.png" alt="Natura Logo" width={40} height={40} className="object-contain" />
        </div>
      </motion.a>

      <motion.a
        href="https://wa.me/51957026753?text=Hola%20Lorie%20Perú,%20me%20interesa%20conocer%20más%20sobre%20sus%20productos"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 1 }}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 cursor-pointer"
        aria-label="Contactar por WhatsApp"
      >
        <i className="ri-whatsapp-line text-3xl"></i>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 bg-green-500 rounded-full opacity-30"
        ></motion.div>
      </motion.a>
    </>
  );
}