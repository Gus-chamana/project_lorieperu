import { motion } from 'framer-motion';

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
    <section className="py-20 bg-gradient-to-b from-white to-lorie-beige">
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
            className="font-lista-masta text-4xl md:text-5xl text-lorie-dark mb-4"
          >
            Estilo y Personalidad
          </motion.h2>
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
              <div className="w-full h-full">
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
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
