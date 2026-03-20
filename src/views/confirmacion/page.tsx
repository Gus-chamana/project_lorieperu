"use client";
import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '../../components/feature/Navbar';
import FooterMinimal from '../../components/feature/FooterMinimal';
import CheckoutSteps from '../../components/feature/CheckoutSteps';
import { useCart } from '../../hooks/useCart';

/* ------------------------------------------------------------------ */
/* Tipos                                                                 */
/* ------------------------------------------------------------------ */
interface OrdenData {
  orden_id: string;
  estado_pago: string;
  subtotal: number;
  monto_descuento: number;
  costo_envio: number;
  total: number;
  cliente: {
    nombre_completo: string;
    email: string;
    celular: string;
  };
  direccion: {
    direccion: string;
    referencia: string | null;
    tipo_envio: string;
    nombre_agencia: string | null;
    distrito: string;
  };
  items: Array<{
    nombre: string;
    cantidad: number;
    precio_unitario: number;
    subtotal_linea: number;
  }>;
}

/* ------------------------------------------------------------------ */
/* Constantes                                                            */
/* ------------------------------------------------------------------ */
// Reintentos para el polling cuando no hay kr-answer en la URL
const MAX_REINTENTOS = 6;
const DELAY_MS = 2000;

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function numeroPedido(orden_id: string) {
  return orden_id.split('-')[0].toUpperCase();
}

/* ------------------------------------------------------------------ */
/* Componente principal                                                  */
/* ------------------------------------------------------------------ */
export default function ConfirmacionPage() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();

  // Parámetros que Izipay adjunta a la URL de éxito
  const ordenId    = searchParams.get('orden');
  const krAnswer   = searchParams.get('kr-answer');
  const krHash     = searchParams.get('kr-hash');
  const tipoPago   = searchParams.get('tipo'); // 'qr' para pagos por QR

  const [ordenData, setOrdenData] = useState<OrdenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [esQR, setEsQR] = useState(false);

  // Guards para evitar doble ejecución en React StrictMode
  const emailEnviado = useRef(false);
  const ejecutando   = useRef(false);

  useEffect(() => {
    if (!ordenId) {
      setError('No se encontró el identificador del pedido en la URL.');
      setLoading(false);
      return;
    }

    if (ejecutando.current) return;
    ejecutando.current = true;

    /* ─────────────────────────────────────────────────────────────
     * FLUJO QR: El comprobante ya fue subido y la orden está en
     *           estado REVISION_QR. No necesitamos verificar con
     *           Izipay, solo limpiar el estado y mostrar mensaje.
     * ───────────────────────────────────────────────────────────── */
    if (tipoPago === 'qr') {
      setEsQR(true);
      clearCart();
      localStorage.removeItem('pago_pendiente_orden_id');
      setLoading(false);
      return;
    }

    const confirmarPago = async () => {
      try {
        /* ─────────────────────────────────────────────────────────────
         * PASO A: Si Izipay adjuntó kr-answer + kr-hash en la URL,
         *         los verificamos en el servidor y marcamos la orden
         *         como PAGADA de inmediato (sin esperar el IPN).
         * ───────────────────────────────────────────────────────────── */
        if (krAnswer && krHash) {
          const verRes = await fetch('/api/pagos/izipay/verificar-retorno', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ krAnswer, krHash }),
          });
          const verData = await verRes.json();

          if (!verRes.ok || !verData.success) {
            // El pago fue rechazado/cancelado por Izipay
            setError('El pago no fue aprobado. Por favor intenta nuevamente o contacta soporte.');
            setLoading(false);
            return;
          }
          // Firma verificada y orden marcada como PAGADA → continuamos a obtener los datos
        }

        /* ─────────────────────────────────────────────────────────────
         * PASO B: Obtener los datos completos de la orden.
         *         Si el paso A ya actualizó Supabase, el primer intento
         *         debería devolver la orden como PAGADA.
         *         Si llegamos sin kr-answer (e.g. IPN ya lo actualizó),
         *         hacemos polling para esperar al webhook.
         * ───────────────────────────────────────────────────────────── */
        let intentos = 0;
        while (intentos < MAX_REINTENTOS) {
          intentos++;

          const res = await fetch(`/api/ordenes/${ordenId}`);
          const data = await res.json();

          if (res.ok && data.orden_id) {
            // ✅ Pago confirmado
            setOrdenData(data);
            clearCart();
            // Limpiar el pago pendiente del localStorage
            localStorage.removeItem('pago_pendiente_orden_id');
            enviarEmail(data);
            setLoading(false);
            return;
          }

          // 402 = Supabase aún no actualizado, reintentamos
          if (res.status === 402 && intentos < MAX_REINTENTOS) {
            await sleep(DELAY_MS);
            continue;
          }

          // Error no recuperable
          setError(data.error || 'No se pudo verificar el estado del pago.');
          setLoading(false);
          return;
        }

        // Reintentos agotados
        setError('Tu pago fue recibido pero la confirmación está tardando. Por favor recarga la página en unos segundos.');

      } catch (err) {
        console.error('Error en confirmarPago:', err);
        setError('Error de conexión. Por favor recarga la página.');
      } finally {
        setLoading(false);
      }
    };

    confirmarPago();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ordenId]);

  /* ── Envío de email (fire-and-forget, solo una vez) ── */
  function enviarEmail(data: OrdenData) {
    if (emailEnviado.current) return;

    // Prevenir reenvío asegurando el registro permanentemente en el navegador
    const storageKey = `email_enviado_${data.orden_id}`;
    if (typeof window !== 'undefined' && localStorage.getItem(storageKey) === 'true') {
      emailEnviado.current = true;
      return;
    }

    emailEnviado.current = true;
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, 'true');
    }

    fetch('/api/email/confirmacion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email:            data.cliente.email,
        nombre_completo:  data.cliente.nombre_completo,
        numero_pedido:    numeroPedido(data.orden_id),
        productos:        data.items.map(item => ({
          nombre:           item.nombre,
          cantidad:         item.cantidad,
          precio_unitario:  item.precio_unitario,
          subtotal_linea:   item.subtotal_linea,
        })),
        subtotal:         data.subtotal,
        monto_descuento:  data.monto_descuento > 0 ? data.monto_descuento : undefined,
        costo_envio:      data.costo_envio,
        total:            data.total,
        direccion:        data.direccion.direccion,
        distrito:         data.direccion.distrito,
        tipo_envio:       data.direccion.tipo_envio,
        celular:          data.cliente.celular,
        nombre_agencia:   data.direccion.nombre_agencia  ?? undefined,
        referencia:       data.direccion.referencia ?? undefined,
      }),
    }).catch(err => console.error('⚠️ Error al disparar correo:', err));
  }

  /* ─────── Loading ─────── */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-lorie-cream via-white to-lorie-beige">
        <Navbar />
        <section className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <i className="ri-loader-4-line text-5xl text-lorie-brown animate-spin block mb-5"></i>
            <h2 className="font-serif text-xl font-semibold text-lorie-dark mb-2">Confirmando tu pago</h2>
            <p className="text-sm text-lorie-brown/60">Verificando la confirmación de tu transacción...</p>
          </div>
        </section>
        <FooterMinimal />
      </div>
    );
  }

  /* ─────── Confirmación QR (comprobante recibido) ─────── */
  if (esQR) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-lorie-cream via-white to-lorie-beige">
        <Navbar />
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <CheckoutSteps paso={3} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl shadow-2xl p-8 md:p-12"
            >
              {/* Ícono */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-24 h-24 mx-auto mb-6 flex items-center justify-center bg-gradient-to-br from-amber-400 to-amber-500 rounded-full shadow-lg"
              >
                <i className="ri-time-line text-5xl text-white"></i>
              </motion.div>

              {/* Título */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl md:text-4xl font-serif font-bold text-lorie-dark mb-4 text-center uppercase"
              >
                ¡Comprobante Recibido!
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center mb-8"
              >
                <p className="text-lg text-lorie-brown mb-2">Tu comprobante de pago ha sido recibido exitosamente.</p>
                <p className="text-sm text-lorie-brown/70 leading-relaxed px-4">
                  Nuestro equipo revisará tu pago y te confirmaremos por <strong>correo electrónico</strong> y/o <strong>WhatsApp</strong> en las próximas horas. Una vez confirmado, procederemos con el envío de tu pedido.
                </p>
              </motion.div>

              {/* Número de pedido */}
              {ordenId && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-r from-lorie-cream/50 to-lorie-beige/30 rounded-2xl p-6 mb-8 text-center"
                >
                  <p className="text-sm text-lorie-brown mb-2">Número de Pedido</p>
                  <p className="text-2xl font-bold text-lorie-dark font-mono">{ordenId.split('-')[0].toUpperCase()}</p>
                </motion.div>
              )}

              {/* Info de proceso */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8"
              >
                <h3 className="font-serif text-lg font-semibold text-amber-800 mb-3 flex items-center gap-2">
                  <i className="ri-information-line text-amber-600"></i>
                  ¿Qué sigue?
                </h3>
                <div className="space-y-3">
                  {[
                    { icon: 'ri-search-eye-line', text: 'Verificaremos tu comprobante de pago' },
                    { icon: 'ri-mail-check-line', text: 'Te notificaremos la confirmación por correo y/o WhatsApp' },
                    { icon: 'ri-truck-line', text: 'Procederemos con el envío de tu pedido' },
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-white rounded-full shadow-sm">
                        <i className={`${step.icon} text-amber-600`}></i>
                      </div>
                      <p className="text-sm text-amber-700 font-sans">{step.text}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Botones */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
              >
                <Link
                  href="/productos"
                  className="px-8 py-4 text-white rounded-full font-sans font-semibold text-base transition-all duration-300 hover:opacity-90 shadow-md text-center"
                  style={{ backgroundColor: 'rgb(185, 150, 128)' }}
                >
                  <i className="ri-shopping-bag-line mr-2"></i>Seguir Comprando
                </Link>
                <Link
                  href="/"
                  className="px-8 py-4 border-2 border-lorie-beige text-lorie-brown rounded-full font-sans font-semibold text-base hover:bg-lorie-cream transition-all duration-300 text-center"
                >
                  <i className="ri-home-line mr-2"></i>Volver al Inicio
                </Link>
              </motion.div>

              {/* Soporte */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="pt-8 border-t border-lorie-beige text-center"
              >
                <p className="text-sm text-lorie-brown mb-3">¿Tienes alguna pregunta sobre tu pedido?</p>
                <a
                  href={`https://wa.me/51957026753?text=Hola%20Lorie%20Per%C3%BA,%20consulta%20sobre%20pedido%20${ordenId?.split('-')[0].toUpperCase()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium transition-colors"
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
              transition={{ delay: 0.9 }}
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

  /* ─────── Error ─────── */
  if (error || !ordenData) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-lorie-cream via-white to-lorie-beige">
        <Navbar />
        <section className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-white rounded-3xl shadow-lg p-8 border border-lorie-beige">
              <i className="ri-error-warning-line text-5xl text-amber-400 block mb-4"></i>
              <h2 className="font-serif text-xl font-bold text-lorie-dark mb-2">Tu pago está siendo procesado</h2>
              <p className="text-sm text-lorie-brown/70 mb-6 max-w-md mx-auto leading-relaxed">
                {error || 'La confirmación tardó más de lo esperado. Si el pago fue exitoso, recarga la página.'}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-3 rounded-full font-sans font-semibold text-sm text-white transition-all hover:opacity-90 shadow-md"
                style={{ backgroundColor: 'rgb(185, 150, 128)' }}
              >
                <i className="ri-refresh-line mr-2"></i>Recargar página
              </button>
              <p className="mt-4 text-xs text-lorie-brown/40">
                ¿Tienes dudas?{' '}
                <a href="https://wa.me/51957026753" target="_blank" rel="noopener noreferrer" className="text-green-500 underline">
                  Contáctanos por WhatsApp
                </a>
              </p>
            </div>
          </div>
        </section>
        <FooterMinimal />
      </div>
    );
  }

  /* ─────── Éxito ─────── */
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-lorie-cream via-white to-lorie-beige">
      <Navbar />
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <CheckoutSteps paso={3} />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-2xl p-8 md:p-12"
          >
            {/* Ícono éxito */}
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

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center mb-8"
            >
              <p className="text-lg text-lorie-brown mb-2">Tu pedido y pago han sido confirmados exitosamente.</p>
              <p className="text-sm text-lorie-brown/70 leading-relaxed px-4">
                Hemos enviado todos los detalles a tu correo electrónico. Cualquier comunicación sobre tu envío se realizará a través de ese medio o del número de WhatsApp que nos proporcionaste.
              </p>
            </motion.div>

            {/* Número de pedido */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-lorie-cream/50 to-lorie-beige/30 rounded-2xl p-6 mb-8 text-center"
            >
              <p className="text-sm text-lorie-brown mb-2">Número de Pedido</p>
              <p className="text-2xl font-bold text-lorie-dark font-mono">{numeroPedido(ordenData.orden_id)}</p>
            </motion.div>

            {/* Correo y WhatsApp */}
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
                  <h3 className="font-serif text-lg font-semibold text-lorie-dark mb-1">Detalles por Correo</h3>
                  <p className="text-sm text-lorie-brown leading-relaxed">
                    Hemos enviado los detalles completos a <strong>{ordenData.cliente.email}</strong>. Revisa tu bandeja de entrada o la carpeta de spam.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-white rounded-full shadow-sm">
                  <i className="ri-whatsapp-line text-xl text-green-500"></i>
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-lg font-semibold text-lorie-dark mb-1">Canales de Comunicación</h3>
                  <p className="text-sm text-lorie-brown leading-relaxed">
                    Cualquier novedad sobre tu pedido será notificada a través de tu correo o el número de WhatsApp registrado.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Resumen del pedido */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="border-t border-lorie-beige pt-6 mb-8"
            >
              <h3 className="font-serif text-xl font-semibold text-lorie-dark mb-4 uppercase">Resumen del Pedido</h3>
              <div className="space-y-3 mb-6">
                {ordenData.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-lorie-cream flex items-center justify-center">
                      <i className="ri-shopping-bag-line text-lorie-brown text-lg"></i>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-lorie-dark">{item.nombre}</p>
                      <p className="text-xs text-lorie-brown">Cantidad: {item.cantidad}</p>
                    </div>
                    <p className="text-sm font-bold text-lorie-dark">S/ {item.subtotal_linea.toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-lorie-brown">Subtotal:</span>
                  <span className="font-medium text-lorie-dark">S/ {ordenData.subtotal.toFixed(2)}</span>
                </div>
                {ordenData.monto_descuento > 0 && (
                  <div className="flex justify-between">
                    <span className="text-green-600">Descuento:</span>
                    <span className="font-medium text-green-600">- S/ {ordenData.monto_descuento.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-lorie-brown">Envío:</span>
                  <span className="font-medium text-lorie-dark">
                    {ordenData.costo_envio > 0 ? `S/ ${ordenData.costo_envio.toFixed(2)}` : 'A coordinar'}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-lorie-beige pt-2">
                  <span className="text-lorie-dark">Total:</span>
                  <span style={{ color: 'rgb(185, 150, 128)' }}>S/ {ordenData.total.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>

            {/* Dirección */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-lorie-cream/30 rounded-2xl p-6 mb-8"
            >
              <h3 className="font-serif text-xl font-semibold text-lorie-dark mb-4 uppercase">Dirección de Envío</h3>
              <div className="space-y-2 text-sm">
                <p className="text-lorie-dark"><strong>Nombre:</strong> {ordenData.cliente.nombre_completo}</p>
                <p className="text-lorie-dark"><strong>Celular:</strong> {ordenData.cliente.celular}</p>
                <p className="text-lorie-dark"><strong>Distrito:</strong> {ordenData.direccion.distrito}</p>
                <p className="text-lorie-dark"><strong>Dirección:</strong> {ordenData.direccion.direccion}</p>
                {ordenData.direccion.referencia && (
                  <p className="text-lorie-dark"><strong>Referencia:</strong> {ordenData.direccion.referencia}</p>
                )}
                <p className="text-lorie-dark">
                  <strong>Método de Envío:</strong>{' '}
                  {ordenData.direccion.tipo_envio === 'LIMA_MOTORIZADO' ? 'Envío Motorizado Lima' : 'Envío a Provincia - Shalom'}
                </p>
                {ordenData.direccion.nombre_agencia && (
                  <p className="text-lorie-dark"><strong>Agencia Shalom:</strong> {ordenData.direccion.nombre_agencia}</p>
                )}
              </div>
            </motion.div>

            {/* Tiempo de entrega */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-gradient-to-r from-lorie-rose/10 to-lorie-beige/20 rounded-2xl p-6 mb-8"
            >
              <div className="flex items-center justify-center gap-2 mb-3">
                <i className="ri-time-line text-lorie-rose text-xl"></i>
                <h3 className="font-serif text-lg font-semibold text-lorie-dark">Tiempo de Entrega Estimado</h3>
              </div>
              <div className="text-center text-sm text-lorie-brown">
                <p><strong>Lima Metropolitana:</strong> 2-3 días hábiles</p>
                <p><strong>Provincia:</strong> 3-5 días hábiles (según ubicación)</p>
              </div>
            </motion.div>

            {/* Botones */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
            >
              <Link
                href="/productos"
                className="px-8 py-4 text-white rounded-full font-sans font-semibold text-base transition-all duration-300 hover:opacity-90 shadow-md text-center"
                style={{ backgroundColor: 'rgb(185, 150, 128)' }}
              >
                <i className="ri-shopping-bag-line mr-2"></i>Seguir Comprando
              </Link>
              <Link
                href="/"
                className="px-8 py-4 border-2 border-lorie-beige text-lorie-brown rounded-full font-sans font-semibold text-base hover:bg-lorie-cream transition-all duration-300 text-center"
              >
                <i className="ri-home-line mr-2"></i>Volver al Inicio
              </Link>
            </motion.div>

            {/* Soporte */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="pt-8 border-t border-lorie-beige text-center"
            >
              <p className="text-sm text-lorie-brown mb-3">¿Tienes alguna pregunta sobre tu pedido?</p>
              <a
                href={`https://wa.me/51957026753?text=Hola%20Lorie%20Per%C3%BA,%20consulta%20sobre%20pedido%20${numeroPedido(ordenData.orden_id)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium transition-colors"
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
