import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';

export default function CursoPage() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    document.title = 'Clases de Costura - Lorie Perú | Aprende desde Cero';
  }, []);

  const handleReserva = () => {
    const mensaje = encodeURIComponent(
      'Hola Lorie Perú, me interesa reservar un cupo para las clases de costura. ¿Podrían darme más información?'
    );
    window.open(`https://wa.me/51957026753?text=${mensaje}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream via-beige-light to-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-36 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <img
            src="https://readdy.ai/api/search-image?query=delicate%20sewing%20pattern%20background%20with%20thread%20spools%20needles%20scissors%20fabric%20swatches%20in%20soft%20beige%20rose%20gold%20and%20cream%20tones%2C%20feminine%20crafting%20aesthetic%2C%20watercolor%20style%2C%20artisan%20workshop%20elements%2C%20gentle%20pastel%20colors%2C%20handmade%20textile%20design%20motifs&width=1920&height=1080&seq=curso-bg-pattern&orientation=landscape"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-8"
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
            className="text-center mb-6"
          >
            <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-lorie-dark mb-4 font-sans">
              🧵 CLASES DE COSTURA 🧵
            </div>
            <div className="text-2xl md:text-3xl font-light text-lorie-brown font-serif">
              Aprende desde Cero
            </div>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center text-lorie-brown text-lg md:text-xl font-sans max-w-3xl mx-auto leading-relaxed"
          >
            ¿Siempre quisiste aprender a coser y crear tus propios productos?
            <br />
            <strong className="text-lorie-dark">Nuestras clases están diseñadas para personas sin experiencia previa</strong>, con metodología práctica y acompañamiento personalizado.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section ref={ref} className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Left Column - Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl h-96 lg:h-full">
                <img
                  src="https://readdy.ai/api/search-image?query=woman%20hands%20sewing%20on%20modern%20sewing%20machine%20creating%20handmade%20fabric%20bag%2C%20close%20up%20crafting%20scene%2C%20warm%20natural%20lighting%2C%20artisan%20workshop%20atmosphere%2C%20beige%20and%20cream%20tones%2C%20feminine%20aesthetic%2C%20detailed%20needlework%2C%20creative%20process%2C%20cozy%20crafting%20space%20with%20fabric%20and%20thread&width=800&height=1000&seq=curso-sewing-class&orientation=portrait"
                  alt="Clases de costura"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-lorie-dark/30 to-transparent"></div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-6 bg-lorie-rose text-white px-8 py-6 rounded-2xl shadow-xl transform rotate-3">
                <div className="text-center">
                  <div className="text-3xl font-bold font-sans">S/ 250</div>
                  <div className="text-sm font-sans">4 Clases</div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Details */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Modalidad */}
              <div className="bg-white rounded-2xl p-6 shadow-md border border-lorie-rose/20">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-lorie-cream rounded-full flex-shrink-0">
                    <i className="ri-map-pin-line text-lorie-brown text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-lorie-dark mb-2 font-sans">Modalidad</h3>
                    <p className="text-lorie-brown font-sans">
                      <strong>Presencial</strong> – San Juan de Miraflores (Lima)
                    </p>
                    <p className="text-sm text-lorie-brown/70 mt-2 font-sans">
                      La dirección exacta se envía al recibir el pago completo
                    </p>
                  </div>
                </div>
              </div>

              {/* Duración */}
              <div className="bg-white rounded-2xl p-6 shadow-md border border-lorie-rose/20">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-lorie-cream rounded-full flex-shrink-0">
                    <i className="ri-time-line text-lorie-brown text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-lorie-dark mb-2 font-sans">Duración</h3>
                    <p className="text-lorie-brown font-sans">
                      <strong>1 hora y media</strong> por clase
                    </p>
                    <p className="text-lorie-brown font-sans">
                      Total: <strong>4 clases</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Inversión */}
              <div className="bg-white rounded-2xl p-6 shadow-md border border-lorie-rose/20">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-lorie-cream rounded-full flex-shrink-0">
                    <i className="ri-price-tag-3-line text-lorie-brown text-xl"></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-lorie-dark mb-3 font-sans">Inversión</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-lorie-brown font-sans">Presencial (4 clases)</span>
                        <span className="text-xl font-bold text-lorie-dark font-sans">S/ 250</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-lorie-brown font-sans">Material extra</span>
                        <span className="text-xl font-bold text-lorie-dark font-sans">S/ 50</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ¿Qué aprenderás? */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center text-lorie-dark mb-12 font-sans">
              ¿Qué Aprenderás?
            </h2>
            
            <div className="text-center mb-8">
              <p className="text-lg text-lorie-brown font-sans">
                Realizarás <strong className="text-lorie-dark">3 proyectos completos</strong>:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Proyecto 1 */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="h-64 relative">
                  <img
                    src="https://readdy.ai/api/search-image?query=handmade%20fabric%20card%20holder%20wallet%20in%20beige%20and%20cream%20tones%2C%20minimalist%20design%2C%20artisan%20crafted%20accessory%2C%20simple%20elegant%20cardholder%2C%20soft%20neutral%20colors%2C%20feminine%20aesthetic%2C%20clean%20background%2C%20product%20photography%20style&width=600&height=600&seq=proyecto-tarjetero&orientation=squarish"
                    alt="Tarjetero"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="p-6 text-center">
                  <div className="w-12 h-12 flex items-center justify-center bg-lorie-cream rounded-full mx-auto mb-4">
                    <i className="ri-bank-card-line text-lorie-brown text-xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-lorie-dark mb-2 font-sans">1 Tarjetero</h3>
                  <p className="text-sm text-lorie-brown/70 font-sans">
                    Aprende las bases de la costura creando un tarjetero funcional
                  </p>
                </div>
              </div>

              {/* Proyecto 2 */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="h-64 relative">
                  <img
                    src="https://readdy.ai/api/search-image?query=handmade%20fabric%20cosmetic%20pouch%20bag%20in%20beige%20and%20cream%20tones%2C%20zipper%20closure%2C%20artisan%20crafted%20toiletry%20bag%2C%20soft%20neutral%20colors%2C%20feminine%20aesthetic%2C%20elegant%20simple%20design%2C%20clean%20background%2C%20product%20photography%20style&width=600&height=600&seq=proyecto-neceser&orientation=squarish"
                    alt="Neceser"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="p-6 text-center">
                  <div className="w-12 h-12 flex items-center justify-center bg-lorie-cream rounded-full mx-auto mb-4">
                    <i className="ri-briefcase-line text-lorie-brown text-xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-lorie-dark mb-2 font-sans">1 Neceser</h3>
                  <p className="text-sm text-lorie-brown/70 font-sans">
                    Domina técnicas de cremallera y estructura
                  </p>
                </div>
              </div>

              {/* Proyecto 3 */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="h-64 relative">
                  <img
                    src="https://readdy.ai/api/search-image?query=handmade%20mini%20puffer%20bag%20quilted%20fabric%20in%20beige%20and%20cream%20tones%2C%20small%20puffy%20handbag%2C%20artisan%20crafted%20padded%20bag%2C%20soft%20neutral%20colors%2C%20feminine%20aesthetic%2C%20elegant%20simple%20design%2C%20clean%20background%2C%20product%20photography%20style&width=600&height=600&seq=proyecto-minipuffer&orientation=squarish"
                    alt="Mini Puffer"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="p-6 text-center">
                  <div className="w-12 h-12 flex items-center justify-center bg-lorie-cream rounded-full mx-auto mb-4">
                    <i className="ri-handbag-line text-lorie-brown text-xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-lorie-dark mb-2 font-sans">1 Mini Puffer</h3>
                  <p className="text-sm text-lorie-brown/70 font-sans">
                    Crea un bolso acolchado con técnicas avanzadas
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Mensaje Motivador Destacado */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="relative mb-12"
          >
            <div className="bg-gradient-to-br from-lorie-rose to-lorie-brown text-white rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
              
              <div className="relative z-10 text-center max-w-3xl mx-auto">
                <div className="w-16 h-16 flex items-center justify-center bg-white/20 rounded-full mx-auto mb-6">
                  <i className="ri-trophy-line text-white text-3xl"></i>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4 font-sans">
                  ¡Llévate Tus Creaciones a Casa!
                </h3>
                <p className="text-lg md:text-xl leading-relaxed font-sans font-light">
                  Al finalizar, habrás aprendido a usar la máquina y técnicas básicas, y te llevarás proyectos listos para <strong className="font-semibold">uso personal o venta</strong>.
                </p>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center"
          >
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border-2 border-lorie-rose/30 max-w-2xl mx-auto">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-lorie-rose/10 border border-lorie-rose/30 rounded-full mb-6">
                <i className="ri-alarm-warning-line text-lorie-rose"></i>
                <span className="text-lorie-rose text-sm font-sans font-bold uppercase">Cupos Limitados</span>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold text-lorie-dark mb-4 font-sans">
                ¿Lista para Aprender?
              </h3>
              <p className="text-lorie-brown text-lg mb-8 font-sans">
                Reserva tu cupo ahora y comienza tu viaje en el mundo de la costura artesanal
              </p>
              
              <button
                onClick={handleReserva}
                className="inline-flex items-center space-x-3 px-10 py-5 text-white rounded-full font-sans font-bold text-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer whitespace-nowrap"
                style={{ backgroundColor: 'rgb(185, 150, 128)' }}
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  <i className="ri-whatsapp-line text-white text-2xl"></i>
                </div>
                <span>Reservar Mi Cupo</span>
                <i className="ri-arrow-right-line text-xl"></i>
              </button>
              
              <p className="text-sm text-lorie-brown/70 mt-6 font-sans">
                Te responderemos en menos de 24 horas
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
