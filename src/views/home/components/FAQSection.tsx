"use client";
import { motion } from 'framer-motion';
import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: '¿Cuánto demora el envío?',
      answer: 'El tiempo de envío es de 3 a 6 días hábiles, dependiendo de la zona de destino. Una vez despachado el pedido, se te brindará la información necesaria para el seguimiento.'
    },
    {
      question: '¿Hacen envíos a todo el Perú?',
      answer: 'Sí, realizamos envíos a todo el Perú a través de Shalom. Para Lima Metropolitana, contamos con envío motorizado con tarifa plana de S/ 10 para zonas no alejadas.'
    },
    {
      question: '¿Cuál es la política de cambios o devoluciones?',
      answer: 'Aceptamos cambios siempre que el producto se encuentre en las mismas condiciones en las que fue entregado, sin señales de uso, manchas, daños o alteraciones. El producto debe conservar sus etiquetas y empaque original. No se aceptan cambios por productos usados o deteriorados.'
    }
  ];

  return (
    <section className="py-20 relative z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-lista-masta text-4xl md:text-5xl text-lorie-dark mb-4">
            Preguntas Frecuentes
          </h2>
          <p className="font-sans text-lg text-lorie-brown">
            Resolvemos tus dudas sobre envíos, cambios y más
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-md overflow-hidden border border-lorie-beige"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-lorie-cream transition-colors duration-300 cursor-pointer"
              >
                <h3 className="font-sans font-semibold text-lg text-lorie-dark pr-4">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                  <i
                    className={`ri-arrow-down-s-line text-2xl text-lorie-brown transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''
                      }`}
                  ></i>
                </div>
              </button>
              <motion.div
                initial={false}
                animate={{
                  height: openIndex === index ? 'auto' : 0,
                  opacity: openIndex === index ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-5 pt-2">
                  <p className="font-sans text-base text-lorie-brown leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="font-sans text-base text-lorie-brown mb-6">
            ¿Tienes más preguntas? Estamos aquí para ayudarte
          </p>
          <a
            href="https://wa.me/51957026753?text=Hola%20Lorie%20Perú,%20tengo%20una%20consulta"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 text-white rounded-full font-sans font-semibold text-base transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer whitespace-nowrap hover:opacity-90"
            style={{ backgroundColor: 'rgb(185, 150, 128)' }}
          >
            <i className="ri-whatsapp-line mr-2 text-xl"></i>
            Contáctanos por WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
}
