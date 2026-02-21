import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import WhatsAppButton from '../../components/feature/WhatsAppButton';
import ScrollToTop from '../../components/feature/ScrollToTop';
import { productos } from '../../mocks/productos';
import { useCart } from '../../hooks/useCart';

export default function ProductosPage() {
  const [filtroActivo, setFiltroActivo] = useState('Todas');
  const [productosFiltrados, setProductosFiltrados] = useState(productos);
  const [productoSeleccionado, setProductoSeleccionado] = useState<typeof productos[0] | null>(null);
  const [imagenActiva, setImagenActiva] = useState(0);
  const [addedToCart, setAddedToCart] = useState<number | null>(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { addToCart } = useCart();

  useEffect(() => {
    document.title = 'Productos - Carteras Artesanales | Lorie Perú';
  }, []);

  useEffect(() => {
    if (filtroActivo === 'Todas') {
      setProductosFiltrados(productos);
    } else if (filtroActivo === 'Nuevas') {
      setProductosFiltrados(productos.filter((p) => p.nuevo));
    } else if (filtroActivo === 'Ofertas') {
      setProductosFiltrados(productos.filter((p) => p.precioOferta));
    }
  }, [filtroActivo]);

  const filtros = ['Todas', 'Nuevas', 'Ofertas'];

  const abrirDetalle = (producto: typeof productos[0]) => {
    setProductoSeleccionado(producto);
    setImagenActiva(0);
  };

  const cerrarDetalle = () => {
    setProductoSeleccionado(null);
    setImagenActiva(0);
  };

  const handleAddToCart = (producto: typeof productos[0]) => {
    addToCart({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      precioOferta: producto.precioOferta,
      imagen: producto.imagenes[0],
    });
    setAddedToCart(producto.id);
    setTimeout(() => setAddedToCart(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-lorie-cream via-white to-lorie-beige">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-36 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white border border-lorie-rose/30 rounded-full mb-6"
          >
            <i className="ri-shopping-bag-3-line text-lorie-brown"></i>
            <span className="text-lorie-brown text-sm font-sans font-medium">Nuestra Colección</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-lista-masta text-5xl md:text-6xl text-lorie-dark mb-6"
          >
            Carteras Artesanales
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lorie-brown text-lg font-sans max-w-2xl mx-auto"
          >
            Explora nuestra colección completa de carteras hechas a mano con amor y dedicación
          </motion.p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="sticky top-24 z-40 bg-white/80 backdrop-blur-md shadow-sm py-6 px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {filtros.map((filtro) => (
              <button
                key={filtro}
                onClick={() => setFiltroActivo(filtro)}
                className={`px-6 py-2 rounded-full font-sans text-sm font-medium transition-all duration-300 cursor-pointer whitespace-nowrap ${
                  filtroActivo === filtro
                    ? 'text-white shadow-md'
                    : 'bg-white border border-lorie-beige text-lorie-brown hover:border-lorie-brown hover:text-lorie-dark'
                }`}
                style={filtroActivo === filtro ? { backgroundColor: 'rgb(185, 150, 128)' } : undefined}
              >
                {filtro}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section ref={ref} className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-product-shop>
            {productosFiltrados.map((producto, index) => (
              <motion.div
                key={producto.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                {/* Image Container */}
                <div 
                  className="relative overflow-hidden h-80 cursor-pointer"
                  onClick={() => abrirDetalle(producto)}
                >
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
                  
                  {/* Quick View Icon */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      abrirDetalle(producto);
                    }}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-300 cursor-pointer"
                  >
                    <i className="ri-eye-line text-lorie-brown"></i>
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
                        : addedToCart === producto.id
                        ? 'bg-green-500 text-white'
                        : 'text-white hover:opacity-90 hover:shadow-lg cursor-pointer'
                    }`}
                    style={!producto.agotado && addedToCart !== producto.id ? { backgroundColor: 'rgb(185, 150, 128)' } : undefined}
                  >
                    <i className={producto.agotado ? 'ri-close-circle-line' : addedToCart === producto.id ? 'ri-check-line' : 'ri-shopping-cart-2-line'}></i>
                    <span>{producto.agotado ? 'Agotado' : addedToCart === producto.id ? '¡Agregado!' : 'Agregar al Carrito'}</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {productosFiltrados.length === 0 && (
            <div className="text-center py-20">
              <i className="ri-shopping-bag-line text-6xl text-lorie-beige mb-4"></i>
              <p className="text-lorie-brown font-sans text-lg">
                No se encontraron productos con este filtro
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Modal de Detalle del Producto */}
      <AnimatePresence>
        {productoSeleccionado && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={cerrarDetalle}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid md:grid-cols-2 gap-0">
                {/* Galería de Imágenes */}
                <div className="p-6">
                  <div className="relative h-80 md:h-96 rounded-xl overflow-hidden mb-4">
                    <img
                      src={productoSeleccionado.imagenes[imagenActiva]}
                      alt={productoSeleccionado.nombre}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {productoSeleccionado.imagenes.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setImagenActiva(idx)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                          imagenActiva === idx ? 'border-lorie-brown' : 'border-transparent'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Información del Producto */}
                <div className="p-6 flex flex-col">
                  <button
                    onClick={cerrarDetalle}
                    className="self-end w-10 h-10 flex items-center justify-center rounded-full hover:bg-lorie-beige transition-colors cursor-pointer"
                  >
                    <i className="ri-close-line text-xl text-lorie-brown"></i>
                  </button>

                  <div className="flex gap-2 mb-3">
                    {productoSeleccionado.nuevo && (
                      <span className="px-3 py-1 bg-lorie-brown text-white text-xs font-semibold rounded-full">
                        Nuevo
                      </span>
                    )}
                    {productoSeleccionado.precioOferta && (
                      <span className="px-3 py-1 bg-lorie-rose text-white text-xs font-semibold rounded-full">
                        Oferta
                      </span>
                    )}
                  </div>

                  <h2 className="font-serif text-2xl font-semibold text-lorie-dark mb-2">
                    {productoSeleccionado.nombre}
                  </h2>

                  <p className="text-lorie-brown text-sm mb-4">
                    {productoSeleccionado.descripcion}
                  </p>

                  {/* Precio */}
                  <div className="flex items-baseline gap-3 mb-4">
                    {productoSeleccionado.precioOferta ? (
                      <>
                        <span className="text-3xl font-bold text-lorie-rose">
                          S/ {productoSeleccionado.precioOferta.toFixed(2)}
                        </span>
                        <span className="text-lg text-lorie-brown/50 line-through">
                          S/ {productoSeleccionado.precio.toFixed(2)}
                        </span>
                        <span className="text-sm font-semibold text-white bg-lorie-rose px-2 py-1 rounded-full">
                          -{Math.round(((productoSeleccionado.precio - productoSeleccionado.precioOferta) / productoSeleccionado.precio) * 100)}%
                        </span>
                      </>
                    ) : (
                      <span className="text-3xl font-bold text-lorie-dark">
                        S/ {productoSeleccionado.precio.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Stock */}
                  <div className="flex items-center gap-2 mb-6">
                    <i className={`ri-checkbox-circle-line ${productoSeleccionado.agotado ? 'text-gray-400' : 'text-green-500'}`}></i>
                    <span className={`text-sm ${productoSeleccionado.agotado ? 'text-gray-400' : 'text-lorie-brown'}`}>
                      {productoSeleccionado.agotado 
                        ? 'Producto agotado' 
                        : `${productoSeleccionado.stock} unidades disponibles`}
                    </span>
                  </div>

                  <div className="mt-auto space-y-3">
                    <button
                      onClick={() => {
                        if (!productoSeleccionado.agotado) {
                          handleAddToCart(productoSeleccionado);
                        }
                      }}
                      disabled={productoSeleccionado.agotado}
                      className={`w-full py-3 rounded-full font-sans font-semibold text-sm transition-all duration-300 flex items-center justify-center space-x-2 whitespace-nowrap ${
                        productoSeleccionado.agotado
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : addedToCart === productoSeleccionado.id
                          ? 'bg-green-500 text-white'
                          : 'text-white hover:opacity-90 hover:shadow-lg cursor-pointer'
                      }`}
                      style={!productoSeleccionado.agotado && addedToCart !== productoSeleccionado.id ? { backgroundColor: 'rgb(185, 150, 128)' } : undefined}
                    >
                      <i className={productoSeleccionado.agotado ? 'ri-close-circle-line' : addedToCart === productoSeleccionado.id ? 'ri-check-line' : 'ri-shopping-cart-2-line'}></i>
                      <span>{productoSeleccionado.agotado ? 'Agotado' : addedToCart === productoSeleccionado.id ? '¡Agregado al Carrito!' : 'Agregar al Carrito'}</span>
                    </button>
                    <button
                      onClick={cerrarDetalle}
                      className="w-full py-3 rounded-full font-sans font-medium text-sm border border-lorie-beige text-lorie-brown hover:bg-lorie-cream transition-all cursor-pointer whitespace-nowrap"
                    >
                      Seguir viendo productos
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
    </div>
  );
}
