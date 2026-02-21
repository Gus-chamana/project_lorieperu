import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
}

export default function InfoModal({ isOpen, onClose, onContinue }: InfoModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const faqData = [
    {
      question: '¿Hacen envíos a todo el Perú?',
      answer: 'Sí, realizamos envíos a todo el Perú a través de Shalom. Para Lima Metropolitana, contamos con envío motorizado con tarifa plana de S/ 10 para zonas no alejadas.',
      icon: 'ri-truck-line'
    },
    {
      question: '¿Cuál es la política de cambios o devoluciones?',
      answer: 'Aceptamos cambios siempre que el producto se encuentre en las mismas condiciones en las que fue entregado, sin señales de uso, manchas, daños o alteraciones. Debe conservar etiquetas y empaque original. No se aceptan cambios por productos usados o deteriorados.',
      icon: 'ri-arrow-left-right-line'
    },
    {
      question: '¿Con qué empresas de envío trabajan?',
      answer: 'Lima: Guerreros (motorizado). Provincia: Shalom.',
      icon: 'ri-building-line'
    },
    {
      question: '¿Qué lugares envían solamente?',
      answer: 'Ate Vitarte, Magdalena del Mar, Barranco, Miraflores, Bellavista, Pueblo Libre, Breña, Puente Piedra, Callao, Rímac, Carabayllo, San Borja, Carmen de la Legua, San Isidro, Cercado de Lima, San Juan de Lurigancho, Chorrillos, San Juan de Miraflores, Comas, San Luis, El Agustino, Independencia, San Martín de Porres, Jesús María, San Miguel, La Molina, Santa Anita, La Victoria, Surco (Santiago de Surco), Lince, Surquillo, Los Olivos, Villa El Salvador, Villa María del Triunfo.',
      icon: 'ri-map-pin-line'
    },
    {
      question: '¿A qué países envían?',
      answer: 'Por el momento, no contamos con envíos internacionales. Solo se despacha dentro del Perú.',
      icon: 'ri-global-line'
    }
  ];

  const datosEnvio = [
    'Nombre completo',
    'Número de celular',
    'Distrito',
    'Dirección completa con referencia',
    'DNI',
    'Si es envío por Shalom: Nombre exacto de la agencia (no dirección)'
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70]"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[71] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl my-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-lorie-cream hover:bg-lorie-beige text-lorie-brown transition-colors duration-300 cursor-pointer z-10"
                aria-label="Cerrar"
              >
                <i className="ri-close-line text-xl"></i>
              </button>

              {/* Header */}
              <div className="bg-gradient-to-r from-lorie-rose/10 via-lorie-cream to-lorie-beige/30 px-8 py-8 rounded-t-3xl border-b border-lorie-beige">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white shadow-md">
                    <i className="ri-information-line text-3xl" style={{ color: 'rgb(185, 150, 128)' }}></i>
                  </div>
                </div>
                <h2 className="font-serif text-3xl font-bold text-lorie-dark text-center mb-2">
                  Información Importante
                </h2>
                <p className="text-lorie-brown text-center text-sm">
                  Por favor, lee esta información antes de continuar con tu compra
                </p>
              </div>

              {/* Content */}
              <div className="px-8 py-6 max-h-[60vh] overflow-y-auto">
                {/* FAQ Section */}
                <div className="space-y-5 mb-8">
                  {faqData.map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-gradient-to-br from-lorie-cream/30 to-white border border-lorie-beige rounded-2xl p-5 hover:shadow-md transition-shadow duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-white shadow-sm">
                          <i className={`${faq.icon} text-lg`} style={{ color: 'rgb(185, 150, 128)' }}></i>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-serif text-lg font-semibold text-lorie-dark mb-2">
                            {faq.question}
                          </h3>
                          <p className="text-lorie-brown text-sm leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Datos Obligatorios Section */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-lorie-rose/5 to-lorie-beige/20 border-2 border-lorie-rose/30 rounded-2xl p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-sm">
                      <i className="ri-file-list-3-line text-xl" style={{ color: 'rgb(185, 150, 128)' }}></i>
                    </div>
                    <h3 className="font-serif text-xl font-bold text-lorie-dark">
                      Datos Obligatorios para Envío
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {datosEnvio.map((dato, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <i className="ri-checkbox-circle-fill text-lorie-rose mt-0.5 flex-shrink-0"></i>
                        <span className="text-lorie-brown text-sm">{dato}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              {/* Footer */}
              <div className="px-8 py-6 bg-gradient-to-r from-lorie-cream/30 to-white rounded-b-3xl border-t border-lorie-beige">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 py-4 border-2 border-lorie-beige text-lorie-brown rounded-full font-sans font-semibold text-base hover:bg-lorie-cream transition-all duration-300 cursor-pointer whitespace-nowrap"
                  >
                    Volver
                  </button>
                  <button
                    onClick={onContinue}
                    className="flex-1 py-4 text-white rounded-full font-sans font-semibold text-base transition-all duration-300 cursor-pointer whitespace-nowrap hover:opacity-90 shadow-md"
                    style={{ backgroundColor: 'rgb(185, 150, 128)' }}
                  >
                    Continuar al Carrito
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
