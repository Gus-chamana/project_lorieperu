"use client";
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '../../components/feature/Navbar';
import FooterMinimal from '../../components/feature/FooterMinimal';
import CheckoutSteps from '../../components/feature/CheckoutSteps';
import { useCart } from '../../hooks/useCart';
import Image from 'next/image';

interface PedidoData {
  numeroPedido: string;
  productos: Array<{
    id: number;
    nombre: string;
    imagen: string;
    precio: number;
    precioOferta?: number;
    cantidad: number;
  }>;
  datosEnvio: {
    nombreCompleto: string;
    celular: string;
    dni: string;
    distrito: string;
    direccion: string;
    referencia: string;
    tipoEnvio: string;
    agenciaShalom?: string;
  };
  subtotal: number;
  costoEnvio: number;
  total: number;
  fecha: string;
}

export default function ConfirmacionPage() {
  const { clearCart } = useCart();
  const [pedidoData, setPedidoData] = useState<PedidoData | null>(null);

  useEffect(() => {
    // Obtener datos del pedido
    const pedidoGuardado = localStorage.getItem('ultimoPedido');
    if (pedidoGuardado) {
      setPedidoData(JSON.parse(pedidoGuardado));
    }

    // Limpiar el carrito
    clearCart();
  }, [clearCart]);

  if (!pedidoData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-lorie-cream via-white to-lorie-beige">
        <Navbar />
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lorie-brown">Cargando información del pedido...</p>
          </div>
        </section>
        <FooterMinimal />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-lorie-cream via-white to-lorie-beige">
      <Navbar />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Stepper de pasos */}
          <CheckoutSteps paso={3} />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-2xl p-8 md:p-12"
          >
            {/* Icono de Éxito */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-24 h-24 mx-auto mb-6 flex items-center justify-center bg-gradient-to-br from-green-400 to-green-500 rounded-full shadow-lg"
            >
              <i className="ri-check-line text-5xl text-white"></i>
            </motion.div>

            {/* Título */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-serif font-bold text-lorie-dark mb-4 text-center uppercase"
            >
              ¡Gracias por tu Compra!
            </motion.h1>

            {/* Mensaje Principal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center mb-8"
            >
              <p className="text-lg text-lorie-brown mb-2">
                Tu pedido ha sido confirmado exitosamente.
              </p>
              <p className="text-sm text-lorie-brown/70">
                Hemos enviado todos los detalles a tu correo electrónico.
              </p>
            </motion.div>

            {/* Número de Pedido */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-lorie-cream/50 to-lorie-beige/30 rounded-2xl p-6 mb-8 text-center"
            >
              <p className="text-sm text-lorie-brown mb-2">Número de Pedido</p>
              <p className="text-2xl font-bold text-lorie-dark font-mono">
                {pedidoData.numeroPedido}
              </p>
            </motion.div>

            {/* Información de Contacto */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-lorie-rose/5 border border-lorie-rose/20 rounded-2xl p-6 mb-8"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-white rounded-full shadow-sm">
                  <i className="ri-mail-line text-xl" style={{ color: 'rgb(185, 150, 128)' }}></i>
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-lg font-semibold text-lorie-dark mb-1">
                    Confirmación por Correo
                  </h3>
                  <p className="text-sm text-lorie-brown leading-relaxed">
                    Hemos enviado los detalles de tu pedido a tu correo electrónico.
                    Por favor, revisa tu bandeja de entrada y la carpeta de spam.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-white rounded-full shadow-sm">
                  <i className="ri-whatsapp-line text-xl text-green-500"></i>
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-lg font-semibold text-lorie-dark mb-1">
                    Nos Comunicaremos Contigo
                  </h3>
                  <p className="text-sm text-lorie-brown leading-relaxed">
                    Nuestro equipo se pondrá en contacto contigo por WhatsApp o correo
                    electrónico para confirmar los detalles del envío y coordinar la entrega.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Resumen del Pedido */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="border-t border-lorie-beige pt-6 mb-8"
            >
              <h3 className="font-serif text-xl font-semibold text-lorie-dark mb-4 uppercase">
                Resumen del Pedido
              </h3>

              <div className="space-y-3 mb-6">
                {pedidoData.productos.map((producto) => (
                  <div key={producto.id} className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border bg-white flex-shrink-0">
                      <Image
                        src={producto.imagen}
                        alt={producto.nombre}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-lorie-dark">{producto.nombre}</p>
                      <p className="text-xs text-lorie-brown">Cantidad: {producto.cantidad}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-lorie-dark">
                        S/ {((producto.precioOferta || producto.precio) * producto.cantidad).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-lorie-brown">Subtotal:</span>
                  <span className="font-medium text-lorie-dark">S/ {pedidoData.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-lorie-brown">Envío:</span>
                  <span className="font-medium text-lorie-dark">
                    {pedidoData.costoEnvio > 0 ? `S/ ${pedidoData.costoEnvio.toFixed(2)}` : 'A coordinar'}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-lorie-beige pt-2">
                  <span className="text-lorie-dark">Total:</span>
                  <span style={{ color: 'rgb(185, 150, 128)' }}>
                    S/ {pedidoData.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Dirección Registrada */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-lorie-cream/30 rounded-2xl p-6 mb-8"
            >
              <h3 className="font-serif text-xl font-semibold text-lorie-dark mb-4 uppercase">
                Dirección de Envío
              </h3>
              <div className="space-y-2 text-sm">
                <p className="text-lorie-dark">
                  <strong>Nombre:</strong> {pedidoData.datosEnvio.nombreCompleto}
                </p>
                <p className="text-lorie-dark">
                  <strong>Celular:</strong> {pedidoData.datosEnvio.celular}
                </p>
                <p className="text-lorie-dark">
                  <strong>DNI:</strong> {pedidoData.datosEnvio.dni}
                </p>
                <p className="text-lorie-dark">
                  <strong>Distrito:</strong> {pedidoData.datosEnvio.distrito}
                </p>
                <p className="text-lorie-dark">
                  <strong>Dirección:</strong> {pedidoData.datosEnvio.direccion}
                </p>
                {pedidoData.datosEnvio.referencia && (
                  <p className="text-lorie-dark">
                    <strong>Referencia:</strong> {pedidoData.datosEnvio.referencia}
                  </p>
                )}
                <p className="text-lorie-dark">
                  <strong>Método de Envío:</strong>{' '}
                  {pedidoData.datosEnvio.tipoEnvio === 'motorizado'
                    ? 'Envío Motorizado Lima'
                    : 'Envío a Provincia - Shalom'}
                </p>
                {pedidoData.datosEnvio.agenciaShalom && (
                  <p className="text-lorie-dark">
                    <strong>Agencia Shalom:</strong> {pedidoData.datosEnvio.agenciaShalom}
                  </p>
                )}
              </div>
            </motion.div>

            {/* Tiempo de Entrega */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-gradient-to-r from-lorie-rose/10 to-lorie-beige/20 rounded-2xl p-6 mb-8"
            >
              <div className="flex items-center justify-center gap-2 mb-3">
                <i className="ri-time-line text-lorie-rose text-xl"></i>
                <h3 className="font-serif text-lg font-semibold text-lorie-dark">
                  Tiempo de Entrega Estimado
                </h3>
              </div>
              <div className="text-center text-sm text-lorie-brown">
                <p><strong>Lima Metropolitana:</strong> 2-3 días hábiles</p>
                <p><strong>Provincia:</strong> 3-5 días hábiles (según ubicación)</p>
              </div>
            </motion.div>

            {/* Botones de Acción */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
            >
              <Link
                href="/productos"
                className="px-8 py-4 text-white rounded-full font-sans font-semibold text-base transition-all duration-300 cursor-pointer whitespace-nowrap hover:opacity-90 shadow-md text-center"
                style={{ backgroundColor: 'rgb(185, 150, 128)' }}
              >
                <i className="ri-shopping-bag-line mr-2"></i>
                Seguir Comprando
              </Link>

              <Link
                href="/"
                className="px-8 py-4 border-2 border-lorie-beige text-lorie-brown rounded-full font-sans font-semibold text-base hover:bg-lorie-cream transition-all duration-300 cursor-pointer whitespace-nowrap text-center"
              >
                <i className="ri-home-line mr-2"></i>
                Volver al Inicio
              </Link>
            </motion.div>

            {/* Contacto de Soporte */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="pt-8 border-t border-lorie-beige text-center"
            >
              <p className="text-sm text-lorie-brown mb-3">
                ¿Tienes alguna pregunta sobre tu pedido?
              </p>
              <a
                href="https://wa.me/51957026753?text=Hola%20Lorie%20Perú,%20tengo%20una%20consulta%20sobre%20mi%20pedido"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium transition-colors cursor-pointer"
              >
                <i className="ri-whatsapp-line text-xl"></i>
                <span>Contáctanos por WhatsApp</span>
              </a>
            </motion.div>
          </motion.div>

          {/* Decoración */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center space-x-2 text-lorie-brown/50">
              <i className="ri-heart-fill text-lorie-rose"></i>
              <span className="text-sm font-sans">Gracias por confiar en Lorie Perú</span>
              <i className="ri-heart-fill text-lorie-rose"></i>
            </div>
          </motion.div>
        </div>
      </section>

      <FooterMinimal />
    </div>
  );
}
