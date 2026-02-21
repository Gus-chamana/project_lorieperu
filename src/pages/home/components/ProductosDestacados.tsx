import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { productos } from '../../../mocks/productos';
import { useCart } from '../../../hooks/useCart';

export default function ProductosDestacados() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { addToCart } = useCart();
  const productosDestacados = productos.slice(0, 6);

  const handleAddToCart = (producto: typeof productos[0]) => {
    addToCart({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      precioOferta: producto.precioOferta,
      imagen: producto.imagenes[0],
    });
  };

  return (
    <section ref={ref} className="py-20 px-4 sm:px-6 lg:px-8 bg-lorie-cream">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white border border-lorie-rose/30 rounded-full mb-4"
          >
            <i className="ri-star-line text-lorie-brown"></i>
            <span className="text-lorie-brown text-sm font-sans font-medium">Nuestras Creaciones</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-center mb-8 uppercase tracking-wide"
            style={{ fontFamily: "'Lista Masta Regular', serif", color: '#8B5A5A' }}
          >
            Cada Cartera es una Obra de Arte
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center text-gray-600 max-w-2xl mx-auto mb-12 text-base leading-relaxed"
          >
            Descubre nuestra colección de carteras artesanales, donde cada pieza es única y refleja la pasión por el detalle y la calidad.
          </motion.p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12" data-product-shop>
          {productosDestacados.map((producto, index) => (
            <motion.div
              key={producto.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Image Container */}
              <div className="relative overflow-hidden h-72">
                <img
                  src={producto.imagenes[0]}
                  alt={producto.nombre}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-lorie-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {producto.nuevo && (
                    <span className="px-3 py-1 bg-lorie-brown text-white text-xs font-sans font-semibold rounded-full">
                      Nuevo
                    </span>
                  )}
                  {producto.precioOferta && (
                    <span className="px-3 py-1 bg-lorie-rose text-white text-xs font-sans font-semibold rounded-full">
                      Oferta
                    </span>
                  )}
                  {producto.agotado && (
                    <span className="px-3 py-1 bg-gray-500 text-white text-xs font-sans font-semibold rounded-full">
                      Agotado
                    </span>
                  )}
                </div>
                
                {/* Stock Badge */}
                {!producto.agotado && producto.stock <= 5 && (
                  <span className="absolute bottom-4 left-4 px-3 py-1 bg-white/90 text-lorie-dark text-xs font-sans font-medium rounded-full">
                    ¡Solo {producto.stock} disponibles!
                  </span>
                )}
                
                {/* Wishlist Icon */}
                <button className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-300 cursor-pointer group/heart">
                  <i className="ri-heart-line text-lorie-brown group-hover/heart:ri-heart-fill transition-all duration-300"></i>
                </button>
              </div>

              {/* Product Info */}
              <div className="p-5">
                <h3 className="font-serif text-lg font-semibold text-lorie-dark mb-1">
                  {producto.nombre}
                </h3>
                <p className="text-lorie-brown/70 text-xs font-sans mb-3 line-clamp-2">
                  {producto.descripcion}
                </p>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-baseline gap-2">
                    {producto.precioOferta ? (
                      <>
                        <span className="text-2xl font-bold text-lorie-rose font-sans">
                          S/ {producto.precioOferta.toFixed(2)}
                        </span>
                        <span className="text-sm text-lorie-brown/50 line-through font-sans">
                          S/ {producto.precio.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-2xl font-bold text-lorie-dark font-sans">
                        S/ {producto.precio.toFixed(2)}
                      </span>
                    )}
                  </div>
                  {producto.precioOferta && (
                    <span className="text-xs font-semibold text-white bg-lorie-rose px-2 py-1 rounded-full">
                      -{Math.round(((producto.precio - producto.precioOferta) / producto.precio) * 100)}%
                    </span>
                  )}
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => !producto.agotado && handleAddToCart(producto)}
                  disabled={producto.agotado}
                  className={`w-full py-3 rounded-full font-sans font-semibold text-sm transition-all duration-300 flex items-center justify-center space-x-2 whitespace-nowrap ${
                    producto.agotado
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'text-white hover:opacity-90 hover:shadow-lg cursor-pointer'
                  }`}
                  style={!producto.agotado ? { backgroundColor: 'rgb(185, 150, 128)' } : undefined}
                >
                  <i className={producto.agotado ? 'ri-close-circle-line' : 'ri-shopping-cart-2-line'}></i>
                  <span>{producto.agotado ? 'Agotado' : 'Agregar al Carrito'}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View More Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <Link
            to="/productos"
            className="inline-flex items-center space-x-2 px-8 py-4 border-2 text-white rounded-full font-sans font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap hover:opacity-90"
            style={{ backgroundColor: 'rgb(185, 150, 128)', borderColor: 'rgb(185, 150, 128)' }}
          >
            <span>Ver Catálogo Completo</span>
            <i className="ri-arrow-right-line"></i>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
