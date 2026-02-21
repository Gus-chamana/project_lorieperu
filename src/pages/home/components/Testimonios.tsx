import { motion } from 'framer-motion';
import { useState } from 'react';

interface Testimonio {
  nombre: string;
  comentario: string;
  rating: number;
  fecha: string;
  avatar: string;
}

export default function Testimonios() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonios: Testimonio[] = [
    {
      nombre: 'María González',
      comentario: 'Me encanta mi bolso de Lorie Perú. La calidad es excepcional y el diseño es único. Recibo muchos cumplidos cada vez que lo uso. ¡Totalmente recomendado!',
      rating: 5,
      fecha: 'Hace 2 semanas',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20portrait%20young%20peruvian%20woman%20smiling%2C%20natural%20lighting%2C%20friendly%20expression%2C%20modern%20style%2C%20headshot%20photography&width=200&height=200&seq=avatar1&orientation=squarish'
    },
    {
      nombre: 'Lucía Ramírez',
      comentario: 'La atención al cliente es excelente y el producto superó mis expectativas. El bolso es hermoso, funcional y muy bien hecho. Definitivamente volveré a comprar.',
      rating: 5,
      fecha: 'Hace 1 mes',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20portrait%20young%20latina%20woman%20smiling%2C%20natural%20lighting%2C%20friendly%20expression%2C%20contemporary%20style%2C%20headshot%20photography&width=200&height=200&seq=avatar2&orientation=squarish'
    },
    {
      nombre: 'Sofía Torres',
      comentario: 'Compré un bolso personalizado y quedó perfecto. El equipo de Lorie Perú entendió exactamente lo que quería. La calidad artesanal se nota en cada detalle.',
      rating: 5,
      fecha: 'Hace 3 semanas',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20portrait%20young%20hispanic%20woman%20smiling%2C%20natural%20lighting%2C%20friendly%20expression%2C%20modern%20style%2C%20headshot%20photography&width=200&height=200&seq=avatar3&orientation=squarish'
    },
    {
      nombre: 'Valentina Castro',
      comentario: 'Estoy fascinada con mi compra. El diseño es precioso y los acabados impecables. Es justo lo que buscaba: un accesorio único que refleja mi personalidad.',
      rating: 5,
      fecha: 'Hace 1 semana',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20portrait%20young%20peruvian%20woman%20smiling%2C%20natural%20lighting%2C%20friendly%20expression%2C%20contemporary%20style%2C%20headshot%20photography&width=200&height=200&seq=avatar4&orientation=squarish'
    },
    {
      nombre: 'Camila Flores',
      comentario: 'La mejor inversión en accesorios que he hecho. El bolso es resistente, hermoso y muy práctico. El envío fue rápido y el empaque muy cuidado. ¡100% satisfecha!',
      rating: 5,
      fecha: 'Hace 2 días',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20portrait%20young%20latina%20woman%20smiling%2C%20natural%20lighting%2C%20friendly%20expression%2C%20modern%20style%2C%20headshot%20photography&width=200&height=200&seq=avatar5&orientation=squarish'
    }
  ];

  const nextTestimonio = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonios.length);
  };

  const prevTestimonio = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonios.length) % testimonios.length);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, index) => (
          <i
            key={index}
            className={`ri-star-fill text-lg ${
              index < rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          ></i>
        ))}
      </div>
    );
  };

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
          <h2 className="font-lista-masta text-4xl md:text-5xl text-lorie-dark mb-4">
            Lo Que Dicen Nuestras Clientas
          </h2>
          <p className="font-sans text-lg text-lorie-brown">
            Historias reales de quienes confían en Lorie Perú
          </p>
        </motion.div>

        {/* Testimonios Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-lorie-beige"
          >
            {/* Rating Stars */}
            <div className="flex justify-center mb-6">
              {renderStars(testimonios[currentIndex].rating)}
            </div>

            {/* Comentario */}
            <p className="font-sans text-lg md:text-xl text-lorie-dark text-center leading-relaxed mb-8 italic">
              "{testimonios[currentIndex].comentario}"
            </p>

            {/* Cliente Info */}
            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-lorie-beige">
                <img
                  src={testimonios[currentIndex].avatar}
                  alt={testimonios[currentIndex].nombre}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <h4 className="font-sans font-semibold text-lg text-lorie-dark">
                  {testimonios[currentIndex].nombre}
                </h4>
                <p className="font-sans text-sm text-lorie-brown">
                  {testimonios[currentIndex].fecha}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonio}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-lg hover:bg-lorie-beige transition-all duration-300 cursor-pointer border border-lorie-beige"
            aria-label="Testimonio anterior"
          >
            <i className="ri-arrow-left-s-line text-2xl text-lorie-dark"></i>
          </button>
          <button
            onClick={nextTestimonio}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-lg hover:bg-lorie-beige transition-all duration-300 cursor-pointer border border-lorie-beige"
            aria-label="Siguiente testimonio"
          >
            <i className="ri-arrow-right-s-line text-2xl text-lorie-dark"></i>
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonios.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  index === currentIndex
                    ? 'bg-lorie-brown w-8'
                    : 'bg-lorie-beige hover:bg-lorie-rose'
                }`}
                aria-label={`Ir al testimonio ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="font-sans text-base text-lorie-brown mb-6">
            ¿Quieres ser parte de nuestra comunidad?
          </p>
          <a
            href="https://www.instagram.com/lorie.peru"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 bg-lorie-brown text-white rounded-full font-sans font-semibold text-base hover:bg-lorie-dark transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer whitespace-nowrap"
          >
            <i className="ri-instagram-line mr-2 text-xl"></i>
            Comparte tu experiencia
          </a>
        </motion.div>
      </div>
    </section>
  );
}
