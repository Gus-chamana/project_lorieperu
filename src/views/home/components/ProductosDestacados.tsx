"use client";
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '../../../hooks/useCart';
import { useProductos } from '../../../hooks/useProductos';
import type { ProductoFrontend } from '../../../types/producto';

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md animate-pulse">
      <div className="h-72 bg-lorie-beige/60" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-lorie-beige/60 rounded w-3/4" />
        <div className="h-3 bg-lorie-beige/40 rounded w-full" />
        <div className="h-10 bg-lorie-beige/50 rounded-full mt-4" />
      </div>
    </div>
  );
}

export default function ProductosDestacados() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [productoSeleccionado, setProductoSeleccionado] = useState<ProductoFrontend | null>(null);
  const [imagenActiva, setImagenActiva] = useState(0);

  const router = useRouter();
  const { cartItems, addToCart } = useCart();
  const { productos, cargando } = useProductos({ destacados: true });

  const productosOrdenados = useMemo(() => {
    const filtrados = [...productos];
    filtrados.sort((a, b) => {
      const getPriority = (p: ProductoFrontend) => {
        const isNuevo = p.nuevo;
        const isOferta = p.precioOferta !== null;
        if (isNuevo && isOferta) return 4;
        if (isNuevo) return 3;
        if (isOferta) return 2;
        return 1;
      };
      return getPriority(b) - getPriority(a);
    });
    return filtrados;
  }, [productos]);

  const abrirDetalle = (producto: ProductoFrontend) => {
    setProductoSeleccionado(producto);
    setImagenActiva(0);
  };

  const cerrarDetalle = () => {
    setProductoSeleccionado(null);
    setImagenActiva(0);
  };

  const handleAddToCart = (producto: ProductoFrontend) => {
    addToCart({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      precioOferta: producto.precioOferta,
      imagen: producto.imagenes?.[0] || '',
    });
  };

  const isInCart = (id: string) => {
    return cartItems.some(item => item.id === id);
  };

  return (
    <section ref={ref} className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white border border-lorie-rose/30 rounded-full mb-4"
          >
            <i className="ri-star-line text-lorie-brown" />
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

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12" data-product-shop>

          {/* Skeleton mientras carga */}
          {cargando && Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}

          {/* Productos de Supabase */}
          {!cargando && productosOrdenados.map((producto, index) => (
            <motion.div
              key={producto.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Imagen */}
              <div
                className="relative overflow-hidden h-72 cursor-pointer"
                onClick={() => abrirDetalle(producto)}
              >
                {producto.imagenes[0] ? (
                  <Image
                    src={producto.imagenes[0]}
                    alt={producto.nombre}
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-lorie-beige/40 flex items-center justify-center">
                    <i className="ri-image-line text-4xl text-lorie-beige" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-lorie-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {producto.nuevo && <span className="px-3 py-1 bg-lorie-brown text-white text-xs font-sans font-semibold rounded-full">Nuevo</span>}
                  {producto.precioOferta && <span className="px-3 py-1 bg-lorie-rose text-white text-xs font-sans font-semibold rounded-full">Oferta</span>}
                  {producto.agotado && <span className="px-3 py-1 bg-gray-500 text-white text-xs font-sans font-semibold rounded-full">Agotado</span>}
                </div>

                {!producto.agotado && producto.stock <= 5 && (
                  <span className="absolute bottom-4 left-4 px-3 py-1 bg-white/90 text-lorie-dark text-xs font-sans font-medium rounded-full">
                    ¡Solo {producto.stock} disponibles!
                  </span>
                )}

                <button
                  onClick={(e) => { e.stopPropagation(); abrirDetalle(producto); }}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-300 cursor-pointer"
                >
                  <i className="ri-eye-line text-lorie-brown" />
                </button>
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="font-serif text-lg font-semibold text-lorie-dark mb-1">{producto.nombre}</h3>
                <p className="text-lorie-brown/70 text-xs font-sans mb-3 line-clamp-2">{producto.descripcion}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-baseline gap-2">
                    {producto.precioOferta ? (
                      <>
                        <span className="text-2xl font-bold text-lorie-rose font-sans">S/ {producto.precioOferta.toFixed(2)}</span>
                        <span className="text-sm text-lorie-brown/50 line-through font-sans">S/ {producto.precio.toFixed(2)}</span>
                      </>
                    ) : (
                      <span className="text-2xl font-bold text-lorie-dark font-sans">S/ {producto.precio.toFixed(2)}</span>
                    )}
                  </div>
                  {producto.precioOferta && (
                    <span className="text-xs font-semibold text-white bg-lorie-rose px-2 py-1 rounded-full">
                      -{Math.round(((producto.precio - producto.precioOferta) / producto.precio) * 100)}%
                    </span>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (producto.agotado) return;
                    if (isInCart(producto.id)) {
                      router.push('/carrito');
                    } else {
                      handleAddToCart(producto);
                    }
                  }}
                  disabled={producto.agotado}
                  className={`w-full py-3 rounded-full font-sans font-semibold text-sm transition-all duration-300 flex items-center justify-center space-x-2 whitespace-nowrap ${producto.agotado
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : isInCart(producto.id)
                      ? 'bg-green-500 text-white'
                      : 'text-white hover:opacity-90 hover:shadow-lg cursor-pointer'
                    }`}
                  style={!producto.agotado && !isInCart(producto.id) ? { backgroundColor: 'rgb(185, 150, 128)' } : undefined}
                >
                  <i className={producto.agotado ? 'ri-close-circle-line' : isInCart(producto.id) ? 'ri-check-line' : 'ri-shopping-cart-2-line'} />
                  <span>{producto.agotado ? 'Agotado' : isInCart(producto.id) ? '¡Añadido a tu carrito!' : 'Añadir al carrito'}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Ver catálogo completo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <Link
            href="/productos"
            className="inline-flex items-center space-x-2 px-8 py-4 border-2 text-white rounded-full font-sans font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap hover:opacity-90"
            style={{ backgroundColor: 'rgb(185, 150, 128)', borderColor: 'rgb(185, 150, 128)' }}
          >
            <span>Ver Catálogo Completo</span>
            <i className="ri-arrow-right-line" />
          </Link>
        </motion.div>
      </div>

      {/* Modal de Detalle */}
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
                {/* Galería */}
                <div className="p-6">
                  <div className="relative h-80 md:h-96 rounded-xl overflow-hidden mb-4 bg-lorie-cream">
                    {productoSeleccionado.imagenes[imagenActiva] ? (
                      <Image
                        src={productoSeleccionado.imagenes[imagenActiva]}
                        alt={productoSeleccionado.nombre}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <i className="ri-image-line text-5xl text-lorie-beige" />
                      </div>
                    )}
                  </div>
                  {productoSeleccionado.imagenes.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {productoSeleccionado.imagenes.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setImagenActiva(idx)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${imagenActiva === idx ? 'border-lorie-brown' : 'border-transparent'}`}
                        >
                          <div className="relative w-full h-full">
                            <Image src={img} alt="" fill className="object-cover" />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-6 flex flex-col">
                  <button onClick={cerrarDetalle} className="self-end w-10 h-10 flex items-center justify-center rounded-full hover:bg-lorie-beige transition-colors cursor-pointer">
                    <i className="ri-close-line text-xl text-lorie-brown" />
                  </button>

                  <div className="flex gap-2 mb-3">
                    {productoSeleccionado.nuevo && <span className="px-3 py-1 bg-lorie-brown text-white text-xs font-semibold rounded-full">Nuevo</span>}
                    {productoSeleccionado.precioOferta && <span className="px-3 py-1 bg-lorie-rose text-white text-xs font-semibold rounded-full">Oferta</span>}
                  </div>

                  <h2 className="font-serif text-2xl font-semibold text-lorie-dark mb-2">{productoSeleccionado.nombre}</h2>
                  <p className="text-lorie-brown text-sm mb-4">{productoSeleccionado.descripcion}</p>

                  <div className="flex items-baseline gap-3 mb-4">
                    {productoSeleccionado.precioOferta ? (
                      <>
                        <span className="text-3xl font-bold text-lorie-rose">S/ {productoSeleccionado.precioOferta.toFixed(2)}</span>
                        <span className="text-lg text-lorie-brown/50 line-through">S/ {productoSeleccionado.precio.toFixed(2)}</span>
                        <span className="text-sm font-semibold text-white bg-lorie-rose px-2 py-1 rounded-full">
                          -{Math.round(((productoSeleccionado.precio - productoSeleccionado.precioOferta) / productoSeleccionado.precio) * 100)}%
                        </span>
                      </>
                    ) : (
                      <span className="text-3xl font-bold text-lorie-dark">S/ {productoSeleccionado.precio.toFixed(2)}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-6">
                    <i className={`ri-checkbox-circle-line ${productoSeleccionado.agotado ? 'text-gray-400' : 'text-green-500'}`} />
                    <span className={`text-sm ${productoSeleccionado.agotado ? 'text-gray-400' : 'text-lorie-brown'}`}>
                      {productoSeleccionado.agotado ? 'Producto agotado' : `${productoSeleccionado.stock} unidades disponibles`}
                    </span>
                  </div>

                  <div className="mt-auto flex flex-col gap-3">
                    <button
                      onClick={() => {
                        if (productoSeleccionado.agotado) return;
                        if (isInCart(productoSeleccionado.id)) {
                          router.push('/carrito');
                        } else {
                          handleAddToCart(productoSeleccionado);
                        }
                      }}
                      disabled={productoSeleccionado.agotado}
                      className={`w-full py-3.5 rounded-full font-sans font-semibold text-base transition-all duration-300 flex items-center justify-center space-x-2 whitespace-nowrap shadow-md ${productoSeleccionado.agotado ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : isInCart(productoSeleccionado.id) ? 'bg-green-600 text-white' : 'text-white hover:opacity-90 hover:shadow-lg cursor-pointer'}`}
                      style={!productoSeleccionado.agotado && !isInCart(productoSeleccionado.id) ? { backgroundColor: 'rgb(187,155,138)' } : undefined}
                    >
                      <i className={productoSeleccionado.agotado ? 'ri-close-circle-line text-lg' : isInCart(productoSeleccionado.id) ? 'ri-check-line text-lg' : 'ri-shopping-bag-3-line text-lg'} />
                      <span>{productoSeleccionado.agotado ? 'Agotado' : isInCart(productoSeleccionado.id) ? '¡Añadido a tu carrito!' : 'Añadir a mi carrito'}</span>
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                      <Link
                        href="/carrito"
                        className="w-full py-3 rounded-full font-sans font-medium text-sm bg-lorie-dark text-white hover:bg-black transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-sm border border-lorie-dark"
                      >
                        <i className="ri-shopping-cart-2-fill"></i>
                        Ver mi carrito
                      </Link>
                      <button
                        onClick={cerrarDetalle}
                        className="w-full py-3 rounded-full font-sans font-medium text-sm bg-white text-lorie-brown border border-lorie-beige hover:bg-lorie-cream transition-all cursor-pointer whitespace-nowrap text-center"
                      >
                        Seguir explorando
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
