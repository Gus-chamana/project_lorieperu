"use client";
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import WhatsAppButton from '../../components/feature/WhatsAppButton';
import ScrollToTop from '../../components/feature/ScrollToTop';
import Image from 'next/image';
import { useCart } from '../../hooks/useCart';
import { useProductos } from '../../hooks/useProductos';
import type { ProductoFrontend } from '../../types/producto';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// ── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md animate-pulse">
      <div className="h-80 bg-lorie-beige/60" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-lorie-beige/60 rounded w-3/4" />
        <div className="h-3 bg-lorie-beige/40 rounded w-full" />
        <div className="h-3 bg-lorie-beige/40 rounded w-2/3" />
        <div className="h-10 bg-lorie-beige/50 rounded-full mt-4" />
      </div>
    </div>
  );
}

// ── Tipos de filtro ──────────────────────────────────────────────────────────
type Filtro = 'Todas' | 'Nuevas' | 'Ofertas';

export default function ProductosPage() {
  const [filtroActivo, setFiltroActivo] = useState<Filtro>('Todas');
  const [productoSeleccionado, setProductoSeleccionado] = useState<ProductoFrontend | null>(null);
  const [imagenActiva, setImagenActiva] = useState(0);
  const [inputMedida, setInputMedida] = useState('');

  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const router = useRouter();
  const { cartItems, addToCart } = useCart();
  const { productos, cargando, error } = useProductos();

  const filtros: Filtro[] = ['Todas', 'Nuevas', 'Ofertas'];

  // Filtrado y ordenamiento en cliente
  const productosFiltrados = useMemo(() => {
    let filtrados = [...productos];

    // 1. Filtrar por pestaña
    if (filtroActivo === 'Nuevas') {
      filtrados = filtrados.filter((p) => p.nuevo);
    } else if (filtroActivo === 'Ofertas') {
      filtrados = filtrados.filter((p) => p.precioOferta !== null);
    }

    // 2. Ordenar según jerarquía requerida
    filtrados.sort((a, b) => {
      // Función auxiliar para asignar un "peso" o prioridad al producto
      const getPriority = (p: ProductoFrontend) => {
        const isNuevo = p.nuevo;
        const isOferta = p.precioOferta !== null;

        if (isNuevo && isOferta) return 4; // Mayor prioridad: Nuevo + Oferta
        if (isNuevo) return 3;             // Segunda prioridad: Solo Nuevo
        if (isOferta) return 2;            // Tercera prioridad: Solo Oferta
        return 1;                          // Última prioridad: Normal (Sin etiquetas)
      };

      const priorityA = getPriority(a);
      const priorityB = getPriority(b);

      // Ordenar de mayor prioridad (4) a menor prioridad (1)
      return priorityB - priorityA;
    });

    return filtrados;
  }, [filtroActivo, productos]);

  const abrirDetalle = (producto: ProductoFrontend) => {
    setProductoSeleccionado(producto);
    setImagenActiva(0);
    setInputMedida('');
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
      medida: producto.requiere_medida ? inputMedida.trim() : undefined,
    });
  };

  // Función auxiliar para saber si el producto actual ya está en el carrito
  const isInCart = (id: string, medidaReq?: string) => {
    if (medidaReq) {
      return cartItems.some(item => item.id === id && item.medida === medidaReq);
    }
    return cartItems.some(item => item.id === id);
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
            <i className="ri-shopping-bag-3-line text-lorie-brown" />
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

      {/* Filtros */}
      <section className="sticky top-24 z-40 bg-white/80 backdrop-blur-md shadow-sm py-6 px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {filtros.map((filtro) => (
              <button
                key={filtro}
                onClick={() => setFiltroActivo(filtro)}
                className={`px-6 py-2 rounded-full font-sans text-sm font-medium transition-all duration-300 cursor-pointer whitespace-nowrap ${filtroActivo === filtro
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

      {/* Grid de Productos */}
      <section ref={ref} className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          {/* Error state */}
          {error && !cargando && (
            <div className="text-center py-20">
              <i className="ri-wifi-off-line text-5xl text-lorie-beige mb-4 block" />
              <p className="text-lorie-brown font-sans text-lg">{error}</p>
              <p className="text-lorie-brown/60 text-sm mt-2">Comprueba tu conexión e intenta de nuevo</p>
            </div>
          )}

          {/* Skeleton loaders */}
          {cargando && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* Productos */}
          {!cargando && !error && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {productosFiltrados.map((producto, index) => (
                  <motion.div
                    key={producto.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.08 }}
                    className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                  >
                    {/* Imagen */}
                    <div
                      className="relative overflow-hidden h-80 cursor-pointer"
                      onClick={() => abrirDetalle(producto)}
                    >
                      <div className="relative h-full w-full overflow-hidden bg-lorie-cream">
                        {producto.imagenes[0] ? (
                          <Image
                            src={producto.imagenes[0]}
                            alt={producto.nombre}
                            fill
                            className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <i className="ri-image-line text-5xl text-lorie-beige" />
                          </div>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-lorie-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {producto.nuevo && (
                          <span className="px-3 py-1 bg-lorie-brown text-white text-xs font-sans font-semibold rounded-full">Nuevo</span>
                        )}
                        {producto.precioOferta && (
                          <span className="px-3 py-1 bg-lorie-rose text-white text-xs font-sans font-semibold rounded-full">Oferta</span>
                        )}
                        {producto.agotado && (
                          <span className="px-3 py-1 bg-gray-500 text-white text-xs font-sans font-semibold rounded-full">Agotado</span>
                        )}
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
                            return;
                          }

                          if (producto.requiere_medida) {
                            abrirDetalle(producto);
                            return;
                          }

                          handleAddToCart(producto);
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
                        <i className={producto.agotado ? 'ri-close-circle-line' : isInCart(producto.id) ? 'ri-check-line' : producto.requiere_medida ? 'ri-ruler-line' : 'ri-shopping-cart-2-line'} />
                        <span>{producto.agotado ? 'Agotado' : isInCart(producto.id) ? '¡Añadido a tu carrito!' : producto.requiere_medida ? 'Elegir Medida' : 'Añadir al carrito'}</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {productosFiltrados.length === 0 && (
                <div className="text-center py-20">
                  <i className="ri-shopping-bag-line text-6xl text-lorie-beige mb-4 block" />
                  <p className="text-lorie-brown font-sans text-lg">No hay productos con este filtro</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

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

                  {productoSeleccionado.requiere_medida && !productoSeleccionado.agotado && (
                    <div className="mb-6 bg-lorie-cream/30 p-4 rounded-xl border border-lorie-beige">
                      <label htmlFor="medidaPulgadas" className="block text-lorie-dark font-sans font-semibold text-sm mb-2">
                        Especifica el tamaño en pulgadas <span className="text-lorie-rose">*</span>
                      </label>
                      <input
                        type="text"
                        id="medidaPulgadas"
                        value={inputMedida}
                        onChange={(e) => setInputMedida(e.target.value)}
                        placeholder='Ej: 13", 14", 15.6"'
                        className="w-full px-4 py-3 rounded-xl border border-lorie-beige bg-white text-lorie-dark font-sans text-sm focus:outline-none focus:ring-2 focus:ring-lorie-brown/50 transition-all"
                      />
                      <p className="text-xs text-lorie-brown/70 mt-2">
                        Necesitamos conocer la medida exacta de tu dispositivo para confeccionar la funda a medida.
                      </p>
                    </div>
                  )}

                  <div className="mt-auto flex flex-col gap-3">
                    <button
                      onClick={() => {
                        if (productoSeleccionado.agotado) return;
                        if (productoSeleccionado.requiere_medida && !inputMedida.trim()) return;

                        const isSpecificItemInCart = productoSeleccionado.requiere_medida
                          ? isInCart(productoSeleccionado.id, inputMedida.trim())
                          : isInCart(productoSeleccionado.id);
                        if (isSpecificItemInCart) {
                          router.push('/carrito');
                        } else {
                          handleAddToCart(productoSeleccionado);
                        }
                      }}
                      disabled={productoSeleccionado.agotado || !!(productoSeleccionado.requiere_medida && !inputMedida.trim() && !isInCart(productoSeleccionado.id, inputMedida.trim()))}
                      className={`w-full py-3.5 rounded-full font-sans font-semibold text-base transition-all duration-300 flex items-center justify-center space-x-2 whitespace-nowrap shadow-md ${(productoSeleccionado.agotado || (productoSeleccionado.requiere_medida && !inputMedida.trim())) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : (productoSeleccionado.requiere_medida ? isInCart(productoSeleccionado.id, inputMedida.trim()) : isInCart(productoSeleccionado.id)) ? 'bg-green-600 text-white' : 'text-white hover:opacity-90 hover:shadow-lg cursor-pointer'}`}
                      style={!(productoSeleccionado.agotado || (productoSeleccionado.requiere_medida && !inputMedida.trim())) && !(productoSeleccionado.requiere_medida ? isInCart(productoSeleccionado.id, inputMedida.trim()) : isInCart(productoSeleccionado.id)) ? { backgroundColor: 'rgb(187,155,138)' } : undefined}
                    >
                      <i className={productoSeleccionado.agotado ? 'ri-close-circle-line text-lg' : (productoSeleccionado.requiere_medida ? isInCart(productoSeleccionado.id, inputMedida.trim()) : isInCart(productoSeleccionado.id)) ? 'ri-check-line text-lg' : 'ri-shopping-bag-3-line text-lg'} />
                      <span>{productoSeleccionado.agotado ? 'Agotado' : (productoSeleccionado.requiere_medida ? isInCart(productoSeleccionado.id, inputMedida.trim()) : isInCart(productoSeleccionado.id)) ? '¡Añadido a tu carrito!' : 'Añadir a mi carrito'}</span>
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

      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
    </div>
  );
}
