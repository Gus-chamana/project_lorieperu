import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import WhatsAppButton from '../../components/feature/WhatsAppButton';
import ScrollToTop from '../../components/feature/ScrollToTop';

export default function NosotrosPage() {
  useEffect(() => {
    document.title = 'Nosotros - Lorie Perú | Nuestra Historia y Valores';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-lorie-cream via-lorie-beige to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-36 pb-20 bg-gradient-to-b from-lorie-cream to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="font-lista-masta text-5xl md:text-6xl text-lorie-dark mb-6">
              Nuestra Historia
            </h1>
            <p className="font-sans text-xl text-lorie-brown max-w-3xl mx-auto">
              De una habitación con una máquina de segunda mano a una marca consolidada
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-serif text-4xl font-bold text-lorie-dark mb-6">
                El Comienzo
              </h2>
              <p className="font-sans text-base text-lorie-brown leading-relaxed mb-4">
                <strong className="text-lorie-dark">LORIE PERÚ</strong> nació hace cuatro años como un emprendimiento personal, iniciado en una habitación con una máquina doméstica de segunda mano y una visión clara: crear productos de calidad con identidad propia.
              </p>
              <p className="font-sans text-base text-lorie-brown leading-relaxed">
                Lo que comenzó con la elaboración de monederos artesanales, se transformó progresivamente en una marca gracias a la capacitación constante, la mejora continua de procesos y una fuerte vocación por el diseño y la confección.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full h-96 rounded-3xl overflow-hidden shadow-2xl"
            >
              <img
                src="https://readdy.ai/api/search-image?query=artisan%20woman%20sewing%20handmade%20fabric%20purse%20with%20domestic%20sewing%20machine%2C%20small%20workshop%20room%20setting%2C%20beige%20and%20earth%20tones%20materials%2C%20natural%20lighting%2C%20beginning%20of%20business%2C%20craftsmanship%2C%20humble%20start&width=800&height=600&seq=historia1&orientation=landscape"
                alt="Inicio de Lorie Perú"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full h-96 rounded-3xl overflow-hidden shadow-2xl order-2 md:order-1"
            >
              <img
                src="https://readdy.ai/api/search-image?query=team%20of%20artisans%20working%20together%20on%20handmade%20fabric%20bags%2C%20collaborative%20workspace%2C%20beige%20and%20earth%20tones%2C%20modern%20workshop%2C%20natural%20lighting%2C%20teamwork%2C%20craftsmanship%2C%20professional%20setting&width=800&height=600&seq=historia2&orientation=landscape"
                alt="Equipo Lorie Perú"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-1 md:order-2"
            >
              <h2 className="font-serif text-4xl font-bold text-lorie-dark mb-6">
                Hoy
              </h2>
              <p className="font-sans text-base text-lorie-brown leading-relaxed mb-4">
                Hoy, <strong className="text-lorie-dark">LORIE PERÚ</strong> es el resultado de un crecimiento sostenido, construido con esfuerzo, aprendizaje y un equipo de colaboradores que hicieron posible consolidar este proyecto empresarial.
              </p>
              <p className="font-sans text-base text-lorie-brown leading-relaxed">
                Nos diferencia nuestra combinación de experiencia, creatividad y compromiso con la calidad. Cada bolso es diseñado y confeccionado por nuestro propio equipo, cuidando cada etapa del proceso productivo y priorizando los detalles.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What Makes Us Special */}
      <section className="py-20 bg-gradient-to-b from-white to-lorie-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-lista-masta text-4xl md:text-5xl text-lorie-dark mb-6">
              ¿Qué Nos Hace Especiales?
            </h2>
            <p className="font-sans text-lg text-lorie-brown max-w-3xl mx-auto">
              En LORIE PERÚ no solo vendemos accesorios: entregamos piezas con identidad
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: 'ri-hand-heart-line',
                title: 'Diseño con Identidad',
                description: 'Cada bolso es diseñado y confeccionado por nuestro propio equipo, creando piezas únicas que reflejan nuestra pasión por el arte textil.'
              },
              {
                icon: 'ri-star-line',
                title: 'Calidad Garantizada',
                description: 'Cuidamos cada etapa del proceso productivo, priorizando los detalles y manteniendo un alto estándar de acabado en cada producto.'
              },
              {
                icon: 'ri-palette-line',
                title: 'Personalización',
                description: 'Enfoque en la personalización que garantiza productos únicos, funcionales y duraderos, creados especialmente para ti.'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-lorie-beige"
              >
                <div className="w-16 h-16 flex items-center justify-center bg-lorie-beige rounded-2xl mb-6">
                  <i className={`${item.icon} text-lorie-dark text-3xl`}></i>
                </div>
                <h3 className="font-sans font-bold text-xl text-lorie-dark mb-4">
                  {item.title}
                </h3>
                <p className="font-sans text-base text-lorie-brown leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-lorie-brown text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '4+', label: 'Años de Experiencia' },
              { number: '1000+', label: 'Clientas Satisfechas' },
              { number: '100%', label: 'Hecho a Mano' },
              { number: '50+', label: 'Diseños Únicos' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="font-serif text-5xl md:text-6xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="font-sans text-sm md:text-base text-white/80">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-lorie-beige to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-lista-masta text-4xl md:text-5xl text-lorie-dark mb-6">
              ¿Lista para tu Bolso Único?
            </h2>
            <p className="font-sans text-lg text-lorie-brown mb-8">
              Descubre nuestra colección y encuentra el accesorio perfecto para ti
            </p>
            <a
              href="https://wa.me/51957026753?text=Hola%20Lorie%20Perú,%20me%20interesa%20conocer%20más%20sobre%20sus%20productos"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 text-white rounded-full font-sans font-semibold text-base transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer whitespace-nowrap hover:opacity-90"
              style={{ backgroundColor: 'rgb(185, 150, 128)' }}
            >
              <i className="ri-whatsapp-line mr-2 text-xl"></i>
              Contáctanos Ahora
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
    </div>
  );
}
