import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import WhatsAppButton from '../../components/feature/WhatsAppButton';
import ScrollToTop from '../../components/feature/ScrollToTop';
import InfoModal from '../../components/feature/InfoModal';
import { useCart } from '../../hooks/useCart';

export default function CarritoPage() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [hasSeenModal, setHasSeenModal] = useState(false);

  useEffect(() => {
    document.title = 'Carrito de Compras | Lorie Perú';
    
    // Mostrar modal automáticamente si hay productos y no se ha visto antes
    if (cartItems.length > 0 && !hasSeenModal) {
      setShowInfoModal(true);
    }
  }, [cartItems.length, hasSeenModal]);

  const handleContinue = () => {
    setShowInfoModal(false);
    setHasSeenModal(true);
  };

  const handleCloseModal = () => {
    setShowInfoModal(false);
    setHasSeenModal(true);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const generarMensajeWhatsApp = () => {
    if (cartItems.length === 0) return '';
    
    let mensaje = 'Hola Lorie Perú! 🛍️ Me gustaría realizar el siguiente pedido:\n\n';
    
    cartItems.forEach((item, index) => {
      const precio = item.precioOferta || item.precio;
      mensaje += `${index + 1}. ${item.nombre}\n`;
      mensaje += `   Cantidad: ${item.cantidad}\n`;
      mensaje += `   Precio: S/ ${(precio * item.cantidad).toFixed(2)}\n\n`;
    });
    
    mensaje += `📦 Total: S/ ${getCartTotal().toFixed(2)}\n\n`;
    mensaje += '¿Podrían confirmar disponibilidad y coordinar el envío? ¡Gracias!';
    
    return encodeURIComponent(mensaje);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-lorie-cream via-white to-lorie-beige">
      <Navbar />
      
      {/* Info Modal */}
      <InfoModal 
        isOpen={showInfoModal} 
        onClose={handleCloseModal}
        onContinue={handleContinue}
      />
      
      {/* Header */}
      <section className="pt-36 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white border border-lorie-rose/30 rounded-full mb-6"
          >
            <i className="ri-shopping-cart-2-line text-lorie-brown"></i>
            <span className="text-lorie-brown text-sm font-sans font-medium">Tu Carrito</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif font-semibold text-lorie-dark mb-4"
          >
            Carrito de Compras
          </motion.h1>

          {/* Info Button */}
          {cartItems.length > 0 && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onClick={() => setShowInfoModal(true)}
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-white border-2 border-lorie-rose/40 rounded-full text-lorie-brown hover:bg-lorie-cream transition-all duration-300 cursor-pointer whitespace-nowrap shadow-sm"
            >
              <i className="ri-information-line text-lg"></i>
              <span className="text-sm font-medium">Ver información de envío</span>
            </motion.button>
          )}
        </div>
      </section>

      {/* Cart Content */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {cartItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 bg-white rounded-2xl shadow-md"
            >
              <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center bg-lorie-cream rounded-full">
                <i className="ri-shopping-cart-line text-5xl text-lorie-rose"></i>
              </div>
              <h2 className="font-serif text-2xl text-lorie-dark mb-3">Tu carrito está vacío</h2>
              <p className="text-lorie-brown mb-8">¡Explora nuestras carteras artesanales!</p>
              <Link
                to="/productos"
                className="inline-flex items-center space-x-2 px-8 py-4 text-white rounded-full font-sans font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap hover:opacity-90"
                style={{ backgroundColor: 'rgb(185, 150, 128)' }}
              >
                <i className="ri-shopping-bag-line"></i>
                <span>Ver Productos</span>
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {/* Cart Items */}
              <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center gap-4 p-4 sm:p-6 ${
                      index !== cartItems.length - 1 ? 'border-b border-lorie-beige' : ''
                    }`}
                  >
                    {/* Image */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden">
                      <img
                        src={item.imagen}
                        alt={item.nombre}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-lg font-semibold text-lorie-dark truncate">
                        {item.nombre}
                      </h3>
                      <div className="flex items-baseline gap-2 mt-1">
                        {item.precioOferta ? (
                          <>
                            <span className="text-lg font-bold text-lorie-rose">
                              S/ {item.precioOferta.toFixed(2)}
                            </span>
                            <span className="text-sm text-lorie-brown/50 line-through">
                              S/ {item.precio.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-lorie-dark">
                            S/ {item.precio.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-lorie-cream text-lorie-brown hover:bg-lorie-beige transition-colors cursor-pointer"
                      >
                        <i className="ri-subtract-line"></i>
                      </button>
                      <span className="w-8 text-center font-semibold text-lorie-dark">
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-lorie-cream text-lorie-brown hover:bg-lorie-beige transition-colors cursor-pointer"
                      >
                        <i className="ri-add-line"></i>
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="hidden sm:block text-right min-w-[80px]">
                      <span className="font-bold text-lorie-dark">
                        S/ {((item.precioOferta || item.precio) * item.cantidad).toFixed(2)}
                      </span>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-red-50 text-lorie-brown hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* Cart Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-md p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lorie-brown font-sans">Subtotal ({cartItems.reduce((c, i) => c + i.cantidad, 0)} productos)</span>
                  <span className="text-xl font-bold text-lorie-dark">S/ {getCartTotal().toFixed(2)}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-lorie-brown/70 mb-6">
                  <i className="ri-truck-line"></i>
                  <span>El costo de envío se coordina por WhatsApp</span>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleCheckout}
                    className="w-full py-4 text-white rounded-full font-sans font-semibold text-base transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer whitespace-nowrap hover:opacity-90 shadow-md"
                    style={{ backgroundColor: 'rgb(185, 150, 128)' }}
                  >
                    <i className="ri-secure-payment-line text-xl"></i>
                    <span>Proceder al Pago</span>
                  </button>

                  <a
                    href={`https://wa.me/51957026753?text=${generarMensajeWhatsApp()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 bg-green-500 text-white rounded-full font-sans font-semibold text-base hover:bg-green-600 transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-whatsapp-line text-xl"></i>
                    <span>Consultar por WhatsApp</span>
                  </a>
                  
                  <div className="flex gap-3">
                    <Link
                      to="/productos"
                      className="flex-1 py-3 border border-lorie-beige text-lorie-brown rounded-full font-sans font-medium text-sm hover:bg-lorie-cream transition-all cursor-pointer text-center whitespace-nowrap"
                    >
                      Seguir Comprando
                    </Link>
                    <button
                      onClick={clearCart}
                      className="px-6 py-3 border border-red-200 text-red-500 rounded-full font-sans font-medium text-sm hover:bg-red-50 transition-all cursor-pointer whitespace-nowrap"
                    >
                      Vaciar Carrito
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
    </div>
  );
}
