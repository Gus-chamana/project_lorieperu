"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import Navbar from '../../components/feature/Navbar';
import FooterMinimal from '../../components/feature/FooterMinimal';
import WhatsAppButton from '../../components/feature/WhatsAppButton';
import ScrollToTop from '../../components/feature/ScrollToTop';
import CheckoutSteps from '../../components/feature/CheckoutSteps';

import { useCart } from '../../hooks/useCart';
import { useProductos } from '../../hooks/useProductos';
import type { ValidacionDescuento } from '@/types/checkout';

export default function CarritoPage() {
  const router = useRouter();
  const {
    cartItems,
    isHydrated,
    removeFromCart,
    updateQuantity,
    clearCart,
    descuentoData,
    setDescuento
  } = useCart();

  const { productos: catalogoBD, cargando: cargandoBD } = useProductos();

  const [inputCodigo, setInputCodigo] = useState('');
  const [aplicandoDescuento, setAplicandoDescuento] = useState(false);
  const [errorDescuento, setErrorDescuento] = useState('');

  const handleCheckout = () => {
    router.push('/checkout');
  };

  const getProductoReal = (id: string) => {
    return catalogoBD.find(p => p.id === id) || null;
  };

  const handleUpdateQuantity = (cartItemId: string, productoId: string, currentQty: number, change: number) => {
    const newQty = currentQty + change;
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    // Validar stock usando BD fresca (si ya cargó)
    const dataReal = getProductoReal(productoId);
    const maxStock = dataReal ? dataReal.stock : Infinity;

    if (newQty > maxStock) {
      return;
    }

    updateQuantity(cartItemId, newQty);
  };

  const subtotalProductos = cartItems.reduce((acc, item) => {
    const pReal = getProductoReal(item.id);
    const precioUnit = pReal ? (pReal.precioOferta || pReal.precio) : (item.precioOferta || item.precio);
    return acc + (precioUnit * item.cantidad);
  }, 0);

  // Recalcular el descuento
  let montoDescuento = 0;
  if (descuentoData?.valido) {
    if (descuentoData.tipo === 'PORCENTAJE' && descuentoData.valor) {
      montoDescuento = subtotalProductos * (descuentoData.valor / 100);
    } else if (descuentoData.tipo === 'MONTO_FIJO' && descuentoData.valor) {
      montoDescuento = descuentoData.valor;
    }
    montoDescuento = Math.min(montoDescuento, subtotalProductos);
  }

  const totalCalculado = Math.max(0, subtotalProductos - montoDescuento);

  const aplicarDescuento = async () => {
    if (!inputCodigo.trim()) return;
    setAplicandoDescuento(true);
    setErrorDescuento('');
    setDescuento(null);

    try {
      const res = await fetch('/api/descuento/validar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: inputCodigo.trim(), subtotal: subtotalProductos }),
      });

      const data: ValidacionDescuento = await res.json();

      if (res.ok && data.valido) {
        setDescuento(data);
        setErrorDescuento('');
      } else {
        setDescuento(null);
        setErrorDescuento(data.error ?? 'Código inválido o expirado');
      }
    } catch {
      setErrorDescuento('Error de red al validar el código');
    } finally {
      setAplicandoDescuento(false);
    }
  };

  const removerDescuento = () => {
    setDescuento(null);
    setInputCodigo('');
    setErrorDescuento('');
  };

  const generarMensajeWhatsApp = () => {
    if (cartItems.length === 0) return '';

    let mensaje = 'Hola Lorie Perú! 🛍️ Me gustaría realizar el siguiente pedido:\n\n';

    cartItems.forEach((item, index) => {
      const pReal = getProductoReal(item.id);
      const precioUnit = pReal ? (pReal.precioOferta || pReal.precio) : (item.precioOferta || item.precio);
      mensaje += `${index + 1}. ${item.nombre}${item.medida ? ` (Medida: ${item.medida})` : ''}\n`;
      mensaje += `   Cantidad: ${item.cantidad}\n`;
      mensaje += `   Subtotal: S/ ${(precioUnit * item.cantidad).toFixed(2)}\n\n`;
    });

    if (montoDescuento > 0) {
      mensaje += `📉 Descuento Aplicado: -S/ ${montoDescuento.toFixed(2)}\n`;
    }
    mensaje += `📦 Total a Pagar: S/ ${totalCalculado.toFixed(2)}\n\n`;
    mensaje += '¿Podrían confirmar disponibilidad y coordinar el envío? ¡Gracias!';

    return encodeURIComponent(mensaje);
  };

  if (!isHydrated) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-lorie-cream via-white to-lorie-beige">
      <Navbar />

      <section className="pt-36 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <CheckoutSteps paso={1} />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white border border-lorie-rose/30 rounded-full mb-6"
          >
            <i className="ri-shopping-cart-2-line text-lorie-brown"></i>
            <span className="text-lorie-brown text-sm font-sans font-medium">Tu Bolsa de Compras</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif font-semibold text-lorie-dark mb-4"
          >
            REVISA TU CARRITO
          </motion.h1>
        </div>
      </section>

      <section className="flex-1 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {cartItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 bg-white rounded-3xl shadow-sm border border-lorie-beige/50"
            >
              <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center bg-lorie-cream rounded-full">
                <i className="ri-shopping-cart-line text-5xl text-lorie-rose"></i>
              </div>
              <h2 className="font-serif text-3xl text-lorie-dark mb-3">Tu bolsa está vacía</h2>
              <p className="text-lorie-brown mb-8 font-sans">¡Explora nuestras carteras artesanales exclusivas y encuentra la tuya!</p>
              <Link
                href="/productos"
                className="inline-flex items-center space-x-2 px-10 py-4 text-white rounded-full font-sans font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap hover:opacity-90 shadow-md hover:shadow-lg"
                style={{ backgroundColor: 'rgb(185, 150, 128)' }}
              >
                <i className="ri-shopping-bag-line"></i>
                <span>Descubrir Colecciones</span>
              </Link>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-12 gap-10">

              <div className="lg:col-span-8 space-y-6">
                <div className="bg-white rounded-3xl shadow-sm border border-lorie-beige/50 overflow-hidden">
                  <div className="hidden sm:grid grid-cols-12 gap-4 p-6 border-b border-lorie-beige/50 bg-lorie-cream/20 text-lorie-brown font-semibold text-sm uppercase tracking-wider">
                    <div className="col-span-6">Producto</div>
                    <div className="col-span-3 text-center">Cantidad</div>
                    <div className="col-span-3 flex justify-end items-center gap-4">
                      <span>Subtotal</span>
                      {/* Espaciador invisible para alinear el header con el margen que ocupa el botón eliminar abajo */}
                      <div className="w-10"></div>
                    </div>
                  </div>

                  <div className="p-2 sm:p-0">
                    <AnimatePresence>
                      {cartItems.map((item, index) => {
                        const pReal = getProductoReal(item.id);
                        const isOutOfStock = pReal ? pReal.stock <= 0 : false;
                        const maxStock = pReal ? pReal.stock : Infinity;
                        const isMaxReached = item.cantidad >= maxStock;

                        const precioActual = pReal ? (pReal.precioOferta || pReal.precio) : (item.precioOferta || item.precio);

                        return (
                          <motion.div
                            key={item.cartItemId}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className={`group relative grid grid-cols-1 sm:grid-cols-12 gap-y-6 sm:gap-x-4 items-center p-4 sm:p-6 transition-colors hover:bg-lorie-cream/10 ${index !== cartItems.length - 1 ? 'border-b border-lorie-beige/30' : ''}`}
                          >
                            <button
                              onClick={() => removeFromCart(item.cartItemId)}
                              className="absolute sm:hidden top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-400 hover:text-red-500 transition-colors"
                            >
                              <i className="ri-close-line text-lg"></i>
                            </button>

                            <div className="col-span-1 sm:col-span-6 flex flex-col sm:flex-row gap-5">
                              <div className="relative w-full sm:w-32 aspect-square rounded-2xl overflow-hidden bg-lorie-cream border border-lorie-beige/40 flex-shrink-0">
                                <Image
                                  src={item.imagen}
                                  alt={item.nombre}
                                  fill
                                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                              </div>

                              <div className="flex flex-col justify-center min-w-0 pr-6 sm:pr-0">
                                <Link href={`/productos`} className="font-serif text-xl sm:text-2xl font-semibold text-lorie-dark hover:text-lorie-brown transition-colors truncate mb-1">
                                  {item.nombre}
                                </Link>
                                {item.medida && (
                                  <p className="text-sm text-lorie-brown font-medium mb-1">
                                    Tamaño: {item.medida}
                                  </p>
                                )}

                                {cargandoBD ? (
                                  <div className="animate-pulse flex flex-col gap-2 mt-2">
                                    <div className="h-3 bg-lorie-beige/50 rounded w-2/3"></div>
                                    <div className="h-3 bg-lorie-beige/50 rounded w-1/2"></div>
                                  </div>
                                ) : (
                                  <>
                                    {pReal?.descripcion && (
                                      <p className="text-sm text-lorie-brown/80 mb-2 line-clamp-2 leading-relaxed">
                                        {pReal.descripcion}
                                      </p>
                                    )}
                                    {pReal?.caracteristicas && (
                                      <div className="relative group/scroll flex items-start gap-2 text-xs text-lorie-dark/80 mb-3 bg-white/60 p-3 rounded-xl border border-lorie-beige/50 w-full max-w-[14rem] sm:max-w-[18rem] max-h-24 overflow-y-auto shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-lorie-brown/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-lorie-brown/40 transition-colors">
                                        <i className="ri-file-list-3-line text-lorie-rose mt-0.5 flex-shrink-0 text-sm"></i>
                                        <span className="leading-relaxed whitespace-pre-wrap">{pReal.caracteristicas}</span>
                                      </div>
                                    )}

                                    <div className="flex items-center gap-2 mt-auto">
                                      {isOutOfStock ? (
                                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-500 bg-red-50 px-2 py-1 rounded-md">
                                          <i className="ri-error-warning-line"></i> Agotado
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-md">
                                          <i className="ri-checkbox-circle-line"></i>
                                          {pReal ? `En Stock (${pReal.stock} disponibles)` : 'Verificando stock...'}
                                        </span>
                                      )}
                                    </div>
                                  </>
                                )}

                                <div className="mt-4 sm:hidden font-bold text-lorie-dark text-lg">
                                  S/ {precioActual.toFixed(2)}
                                </div>
                              </div>
                            </div>

                            <div className="col-span-1 sm:col-span-3 flex flex-col items-center justify-center">
                              <div className="flex items-center bg-lorie-cream/30 border border-lorie-beige rounded-xl p-1 shadow-inner sm:w-28 justify-between gap-2">
                                <button
                                  onClick={() => handleUpdateQuantity(item.cartItemId, item.id, item.cantidad, -1)}
                                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-lorie-brown transition-all shadow-sm cursor-pointer"
                                >
                                  <i className="ri-subtract-line"></i>
                                </button>
                                <span className="w-6 text-center font-semibold text-lorie-dark text-base">
                                  {item.cantidad}
                                </span>
                                <button
                                  onClick={() => handleUpdateQuantity(item.cartItemId, item.id, item.cantidad, 1)}
                                  disabled={isMaxReached || isOutOfStock}
                                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all shadow-sm ${isMaxReached || isOutOfStock ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-60' : 'hover:bg-white text-lorie-brown cursor-pointer'}`}
                                >
                                  <i className="ri-add-line"></i>
                                </button>
                              </div>
                              {isMaxReached && pReal && !isOutOfStock && (
                                <span className="text-[10px] text-lorie-rose font-medium mt-2 bg-lorie-rose/10 px-2 py-0.5 rounded-full">Límite de stock</span>
                              )}
                            </div>

                            <div className="hidden sm:flex col-span-3 items-center justify-end">
                              <div className="flex items-center justify-between w-full">
                                <div className="text-right whitespace-nowrap min-w-max flex-1">

                                  <span className="font-bold text-lorie-dark text-xl flex items-center justify-end gap-1">
                                    <span>S/</span>
                                    <span>{(precioActual * item.cantidad).toFixed(2)}</span>
                                  </span>
                                </div>
                                <div className="w-10 flex justify-end ml-4">
                                  <button
                                    onClick={() => removeFromCart(item.cartItemId)}
                                    title="Eliminar del carrito"
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors flex-shrink-0"
                                  >
                                    <i className="ri-delete-bin-line text-lg"></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-3xl shadow-lg border border-lorie-beige/60 p-6 sm:p-8 sticky top-28"
                >
                  <h3 className="font-serif text-2xl font-semibold text-lorie-dark mb-6">Resumen del Carrito</h3>

                  <div className="mb-6 pb-6 border-b border-lorie-beige/50">
                    <label className="block text-sm font-semibold text-lorie-dark mb-3">
                      Código de descuento
                    </label>

                    {!descuentoData?.valido ? (
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <i className="ri-discount-percent-line absolute left-4 top-1/2 -translate-y-1/2 text-lorie-brown/50"></i>
                          <input
                            type="text"
                            placeholder="Ej. MUJER50"
                            className="w-full pl-11 pr-4 py-3 bg-lorie-cream/20 border border-lorie-beige rounded-xl text-sm font-medium text-lorie-dark focus:ring-2 focus:ring-lorie-rose/30 focus:border-lorie-rose outline-none transition-all placeholder:font-normal"
                            value={inputCodigo}
                            onChange={(e) => { setInputCodigo(e.target.value.toUpperCase()); setErrorDescuento(''); }}
                            onKeyDown={(e) => { if (e.key === 'Enter') aplicarDescuento() }}
                          />
                        </div>
                        <button
                          onClick={aplicarDescuento}
                          disabled={aplicandoDescuento || !inputCodigo.trim()}
                          className="px-5 py-3 bg-lorie-dark text-white rounded-xl text-sm font-semibold hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shadow-sm cursor-pointer"
                        >
                          {aplicandoDescuento ? <i className="ri-loader-4-line animate-spin"></i> : 'Aplicar'}
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-green-50 border border-green-200 p-4 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            <i className="ri-coupon-3-line text-xl"></i>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-green-800">CÓDIGO APLICADO</p>
                            <p className="text-xs text-green-600 font-medium">-{descuentoData.tipo === 'PORCENTAJE' ? `${descuentoData.valor}%` : `S/ ${descuentoData.valor}`} de descuento</p>
                          </div>
                        </div>
                        <button onClick={removerDescuento} className="text-green-800 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors cursor-pointer" title="Quitar cupón">
                          <i className="ri-close-line text-lg"></i>
                        </button>
                      </div>
                    )}

                    {errorDescuento && (
                      <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-3 text-sm text-red-500 font-medium flex items-center gap-1.5">
                        <i className="ri-error-warning-line"></i> {errorDescuento}
                      </motion.p>
                    )}
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center text-lorie-brown">
                      <span className="font-medium">Subtotal ({cartItems.reduce((c, i) => c + i.cantidad, 0)} items)</span>
                      <span className="font-semibold text-lorie-dark">S/ {subtotalProductos.toFixed(2)}</span>
                    </div>

                    {descuentoData?.valido && (
                      <div className="flex justify-between items-center text-lorie-rose">
                        <span className="font-medium flex items-center gap-1.5">
                          <i className="ri-price-tag-3-line"></i> Descuento
                        </span>
                        <span className="font-bold">- S/ {montoDescuento.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-lorie-brown/60 text-sm">
                      <span className="flex items-center gap-1.5"><i className="ri-truck-line"></i> Envío</span>
                      <span>Por coordinar</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-lorie-beige border-dashed mb-8">
                    <div className="flex justify-between items-end">
                      <span className="text-lg font-bold text-lorie-dark">Total</span>
                      <div className="text-right">
                        <span className="text-3xl font-bold text-lorie-dark">S/ {totalCalculado.toFixed(2)}</span>
                        <p className="text-xs text-lorie-brown/60 mt-1">Impuestos incluidos</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={handleCheckout}
                      className="w-full py-4 text-white rounded-2xl font-sans font-bold text-base transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-0.5 group"
                      style={{ backgroundColor: 'rgb(185, 150, 128)' }}
                    >
                      <i className="ri-secure-payment-line text-xl group-hover:scale-110 transition-transform"></i>
                      <span>Proceder Pedido</span>
                    </button>

                    <a
                      href={`https://wa.me/51957026753?text=${generarMensajeWhatsApp()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-4 bg-[#25D366] text-white rounded-2xl font-sans font-bold text-base transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer shadow-sm hover:shadow-md hover:bg-[#20BE5A]"
                    >
                      <i className="ri-whatsapp-line text-xl"></i>
                      <span>Pedido vía WhatsApp</span>
                    </a>

                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <Link
                        href="/productos"
                        className="py-3 border-2 border-lorie-beige text-lorie-brown rounded-2xl font-sans font-bold text-xs sm:text-sm hover:bg-lorie-cream hover:border-lorie-dark/10 transition-all cursor-pointer text-center"
                      >
                        Más productos
                      </Link>
                      <button
                        onClick={clearCart}
                        className="py-3 bg-red-50 text-red-500 rounded-2xl font-sans font-bold text-xs sm:text-sm hover:bg-red-100 transition-all cursor-pointer"
                      >
                        Vaciar
                      </button>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-lorie-beige/50 flex items-center justify-center gap-6 opacity-60">
                    <i className="ri-visa-line text-3xl text-lorie-dark" title="Visa"></i>
                    <i className="ri-mastercard-line text-3xl text-lorie-dark" title="Mastercard"></i>
                    <i className="ri-shield-check-line text-3xl text-lorie-dark" title="Pago Seguro"></i>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </section>

      <FooterMinimal />
      <WhatsAppButton />
      <ScrollToTop />
    </div>
  );
}
