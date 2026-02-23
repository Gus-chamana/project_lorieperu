"use client";
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import WhatsAppButton from '../../components/feature/WhatsAppButton';
import ScrollToTop from '../../components/feature/ScrollToTop';
import Image from 'next/image';

export default function CursoPage() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleReserva = () => {
    const mensaje = encodeURIComponent(
      'Hola Lorie Perú, me interesa reservar un cupo para las clases de costura. ¿Podrían darme más información?'
    );
    window.open(`https://wa.me/51957026753?text=${mensaje}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-lorie-cream via-white to-white">
      <Navbar />

      {/* Hero Section - simple, texto centrado sin imagen de fondo */}
      <section className="pt-32 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-6"
          >
            <div className="inline-flex items-center space-x-2 px-5 py-2 bg-white border border-lorie-rose/30 rounded-full shadow-sm">
              <i className="ri-scissors-cut-line text-lorie-brown text-lg"></i>
              <span className="text-lorie-brown text-sm font-sans font-medium">Aprende con Nosotros</span>
            </div>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-lorie-dark mb-4 font-sans"
          >
            🧵 CLASES DE COSTURA 🧵
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-2xl md:text-3xl font-light text-lorie-brown font-serif mb-4"
          >
            Aprende desde Cero
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lorie-brown text-base md:text-lg font-sans max-w-2xl mx-auto leading-relaxed"
          >
            ¿Siempre quisiste aprender a coser y crear tus propios productos?<br />
            <strong className="text-lorie-dark">Nuestras clases están diseñadas para personas sin experiencia previa</strong>, con metodología práctica y acompañamiento personalizado.
          </motion.p>
        </div>
      </section>

      {/* Main Content: Imagen izquierda + Tarjetas derecha */}
      <section ref={ref} className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

            {/* Left Column - Imagen contenida */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl h-96">
                <Image
                  src="https://static.readdy.ai/image/3b494e0e56ddce0bb796382de2f71287/8ae8e4ba436fc71ce346fbb6b69a2503.png"
                  alt="Clases de costura"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center"
                  priority
                />
              </div>

              {/* Floating Price Badge */}
              <div className="absolute -bottom-4 left-6 bg-lorie-rose text-white px-8 py-4 rounded-2xl shadow-xl">
                <div className="text-center">
                  <div className="text-2xl font-bold font-sans">S/ 250</div>
                  <div className="text-xs font-sans">4 Clases</div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Tarjetas de info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4 pt-4"
            >
              {/* Modalidad */}
              <div className="bg-white rounded-2xl p-5 shadow-md border border-lorie-rose/20">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-lorie-cream rounded-full flex-shrink-0 mt-1">
                    <i className="ri-map-pin-line text-lorie-brown text-lg"></i>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-lorie-dark mb-1 font-sans">Modalidad</h3>
                    <p className="text-lorie-brown font-sans text-sm">
                      <strong>Presencial</strong> – San Juan de Miraflores (Lima)
                    </p>
                    <p className="text-xs text-lorie-brown/70 mt-1 font-sans">
                      La dirección exacta se envía al recibir el pago completo
                    </p>
                  </div>
                </div>
              </div>

              {/* Duración */}
              <div className="bg-white rounded-2xl p-5 shadow-md border border-lorie-rose/20">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-lorie-cream rounded-full flex-shrink-0 mt-1">
                    <i className="ri-time-line text-lorie-brown text-lg"></i>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-lorie-dark mb-1 font-sans">Duración</h3>
                    <p className="text-lorie-brown font-sans text-sm">
                      <strong>1 hora y media</strong> por clase
                    </p>
                    <p className="text-lorie-brown font-sans text-sm">
                      Total: <strong>4 clases</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Inversión */}
              <div className="bg-white rounded-2xl p-5 shadow-md border border-lorie-rose/20">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-lorie-cream rounded-full flex-shrink-0 mt-1">
                    <i className="ri-price-tag-3-line text-lorie-brown text-lg"></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-lorie-dark mb-2 font-sans">Inversión</h3>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-lorie-brown font-sans text-sm">Presencial (4 clases)</span>
                        <span className="text-lg font-bold text-lorie-dark font-sans">S/ 250</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-lorie-brown font-sans text-sm">Material extra</span>
                        <span className="text-lg font-bold text-lorie-dark font-sans">S/ 50</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ¿Qué aprenderás? */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center text-lorie-dark mb-3 font-sans">
              ¿Qué Aprenderás?
            </h2>
            <div className="text-center mb-10">
              <p className="text-base text-lorie-brown font-sans">
                Realizarás <strong className="text-lorie-dark">3 proyectos completos</strong>:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Proyecto 1 */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src="https://static.readdy.ai/image/3b494e0e56ddce0bb796382de2f71287/f0c3dfcceb6ab8a6b22108b4af235db3.png"
                    alt="Puntada a Mano"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-xs font-semibold text-lorie-brown">Clase 1</span>
                  </div>
                </div>
                <div className="p-5 text-center">
                  <div className="w-10 h-10 flex items-center justify-center bg-lorie-cream rounded-full mx-auto mb-3">
                    <i className="ri-bank-card-line text-lorie-brown text-lg"></i>
                  </div>
                  <h3 className="text-base font-semibold text-lorie-dark mb-1 font-sans">1 Tarjetero</h3>
                  <p className="text-xs text-lorie-brown/70 font-sans">
                    Aprende las bases de la costura creando un tarjetero funcional
                  </p>
                </div>
              </div>

              {/* Proyecto 2 */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src="https://static.readdy.ai/image/3b494e0e56ddce0bb796382de2f71287/4a621741bbcf16d470df04ddfc8b4491.png"
                    alt="Neceser"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
                <div className="p-5 text-center">
                  <div className="w-10 h-10 flex items-center justify-center bg-lorie-cream rounded-full mx-auto mb-3">
                    <i className="ri-briefcase-line text-lorie-brown text-lg"></i>
                  </div>
                  <h3 className="text-base font-semibold text-lorie-dark mb-1 font-sans">1 Neceser</h3>
                  <p className="text-xs text-lorie-brown/70 font-sans">
                    Domina técnicas de cremallera y estructura
                  </p>
                </div>
              </div>

              {/* Proyecto 3 */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src="https://static.readdy.ai/image/3b494e0e56ddce0bb796382de2f71287/b7877b7d44e885fe5f7febf0a272469f.png"
                    alt="Mini Puffer"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
                <div className="p-5 text-center">
                  <div className="w-10 h-10 flex items-center justify-center bg-lorie-cream rounded-full mx-auto mb-3">
                    <i className="ri-handbag-line text-lorie-brown text-lg"></i>
                  </div>
                  <h3 className="text-base font-semibold text-lorie-dark mb-1 font-sans">1 Mini Puffer</h3>
                  <p className="text-xs text-lorie-brown/70 font-sans">
                    Crea un bolso acolchado con técnicas avanzadas
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mensaje Motivador */}
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="bg-gradient-to-br from-lorie-rose to-lorie-brown text-white rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
              <div className="relative z-10 text-center max-w-3xl mx-auto">
                <div className="w-14 h-14 flex items-center justify-center bg-white/20 rounded-full mx-auto mb-5">
                  <i className="ri-trophy-line text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4 font-sans">
                  ¡Llévate Tus Creaciones a Casa!
                </h3>
                <p className="text-base md:text-lg leading-relaxed font-sans font-light">
                  Al finalizar, habrás aprendido a usar la máquina y técnicas básicas, y te llevarás proyectos listos para <strong className="font-semibold">uso personal o venta</strong>.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border-2 border-lorie-rose/30">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-lorie-rose/10 border border-lorie-rose/30 rounded-full mb-5">
                <i className="ri-alarm-warning-line text-lorie-rose text-sm"></i>
                <span className="text-lorie-rose text-xs font-sans font-bold uppercase">Cupos Limitados</span>
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-lorie-dark mb-3 font-sans">
                ¿Lista para Aprender?
              </h3>
              <p className="text-lorie-brown text-base mb-6 font-sans">
                Reserva tu cupo ahora y comienza tu viaje en el mundo de la costura artesanal
              </p>

              <button
                onClick={handleReserva}
                className="inline-flex items-center space-x-3 px-8 py-4 text-white rounded-full font-sans font-bold text-base transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer whitespace-nowrap"
                style={{ backgroundColor: 'rgb(185, 150, 128)' }}
              >
                <i className="ri-whatsapp-line text-white text-xl"></i>
                <span>Reservar Mi Cupo</span>
                <i className="ri-arrow-right-line text-lg"></i>
              </button>

              <p className="text-xs text-lorie-brown/70 mt-4 font-sans">
                Te responderemos en menos de 24 horas
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
    </div>
  );
}
