"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/feature/Navbar';
import FooterMinimal from '@/components/feature/FooterMinimal';
import CheckoutSteps from '@/components/feature/CheckoutSteps';

/* ------------------------------------------------------------------ */
/* Tipos                                                                 */
/* ------------------------------------------------------------------ */
interface ResumenItem {
    nombre: string;
    cantidad: number;
    precio_unitario: number;
    subtotal_linea: number;
}

interface ResumenOrden {
    orden_id: string;
    estado_pago: string;
    comprobante_url?: string | null;
    subtotal: number;
    monto_descuento: number;
    costo_envio: number;
    total: number;
    nombre_cliente: string;
    items: ResumenItem[];
}

/* Item del localStorage (tiene imagen) */
interface PedidoLocalItem {
    id: string;
    nombre: string;
    imagen?: string;
    precio: number;
    precioOferta?: number;
    cantidad: number;
}

type MetodoPago = 'tarjeta' | 'qr';

/* ------------------------------------------------------------------ */
/* Componente principal                                                  */
/* ------------------------------------------------------------------ */
export default function IzipayPaymentPage({ params }: { params: { orden_id: string } }) {
    const ordenId = params.orden_id;
    const router = useRouter();

    // ── Estado: Izipay (tarjeta) ──
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formToken, setFormToken] = useState<string>('');
    const scriptLoaded = useRef(false);

    // ── Estado: método de pago seleccionado ──
    const [metodoPago, setMetodoPago] = useState<MetodoPago>('tarjeta');

    // ── Estado: QR / Comprobante ──
    const [comprobanteFile, setComprobanteFile] = useState<File | null>(null);
    const [comprobantePreview, setComprobantePreview] = useState<string | null>(null);
    const [enviandoComprobante, setEnviandoComprobante] = useState(false);
    const [errorComprobante, setErrorComprobante] = useState<string | null>(null);

    // ── Estado: Resumen del pedido ──
    const [resumen, setResumen] = useState<ResumenOrden | null>(null);
    const [imagenesLocal, setImagenesLocal] = useState<Record<string, string>>({});

    // ── Persistir orden_id para retomar pago ──
    useEffect(() => {
        if (ordenId) {
            localStorage.setItem('pago_pendiente_orden_id', ordenId);
        }
    }, [ordenId]);

    // ── Cargar imágenes de productos desde localStorage ──
    useEffect(() => {
        try {
            const raw = localStorage.getItem('ultimoPedido');
            if (raw) {
                const pedido = JSON.parse(raw);
                if (pedido?.productos) {
                    const map: Record<string, string> = {};
                    pedido.productos.forEach((p: PedidoLocalItem) => {
                        if (p.imagen) map[p.nombre] = p.imagen;
                    });
                    setImagenesLocal(map);
                }
            }
        } catch {
            // Silenciar errores de parsing
        }
    }, []);

    // ── Cargar resumen del pedido desde API ──
    useEffect(() => {
        if (!ordenId) return;
        const cargarResumen = async () => {
            try {
                const res = await fetch(`/api/ordenes/${ordenId}/resumen`);
                if (res.ok) {
                    const data = await res.json();
                    setResumen(data);
                    
                    // Si ya existe un comprobante subido previamente, restaurar la vista
                    if (data.comprobante_url) {
                        setComprobantePreview(data.comprobante_url);
                        setMetodoPago('qr'); // Mostrar la pestaña QR por defecto
                    }
                }
            } catch {
                console.error('No se pudo cargar el resumen del pedido');
            }
        };
        cargarResumen();
    }, [ordenId]);

    // ── PASO 1: Obtener FormToken de Izipay ──
    useEffect(() => {
        const fetchToken = async () => {
            try {
                const res = await fetch('/api/pagos/izipay/generar-sesion', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ orden_id: ordenId })
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Error al iniciar el pago.');
                setFormToken(data.formToken);
            } catch (err: any) {
                setError(err.message);
                setLoading(false);
            }
        };
        if (ordenId) fetchToken();
    }, [ordenId]);

    // ── PASO 2: Inyectar script de Krypton (Izipay) ──
    useEffect(() => {
        if (!formToken || scriptLoaded.current) return;

        const publicKey = process.env.NEXT_PUBLIC_IZIPAY_PUBLIC_KEY;
        const STATIC_CDN = 'https://static.micuentaweb.pe';

        if (!publicKey) {
            setError('No se ha configurado la Llave Pública de Izipay. Contacta al administrador.');
            setLoading(false);
            return;
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.lorieperu.com';
        const successUrl = `${baseUrl}/confirmacion?orden=${ordenId}`;

        const loadScript = () => {
            return new Promise<void>((resolve, reject) => {
                const cssLink = document.createElement('link');
                cssLink.rel = 'stylesheet';
                cssLink.href = `${STATIC_CDN}/static/js/krypton-client/V4.0/ext/classic.css`;
                document.head.appendChild(cssLink);

                const cssCustom = document.createElement('link');
                cssCustom.rel = 'stylesheet';
                cssCustom.href = '/izipay-lorie.css';
                document.head.appendChild(cssCustom);

                const script = document.createElement('script');
                script.src = `${STATIC_CDN}/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js`;
                script.setAttribute('kr-public-key', publicKey);
                script.setAttribute('kr-get-url-success', successUrl);
                script.setAttribute('kr-language', 'es-ES');
                document.body.appendChild(script);

                script.onload = () => { resolve(); };
                script.onerror = () => reject(new Error('No se pudo cargar el formulario de Izipay.'));
                scriptLoaded.current = true;
            });
        };

        const initForm = async () => {
            try {
                await loadScript();
                setLoading(false);
            } catch (e: any) {
                console.error(e);
                setError('Ocurrió un error conectando con el banco. Por favor recarga la página.');
                setLoading(false);
            }
        };

        initForm();
    }, [formToken, ordenId]);

    // ── Manejar selección de archivo comprobante ──
    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setErrorComprobante(null);

        if (file) {
            // Validar tipo
            const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];
            if (!tiposPermitidos.includes(file.type)) {
                setErrorComprobante('Solo se permiten imágenes (JPG, PNG, WEBP)');
                return;
            }
            // Validar tamaño (5MB)
            if (file.size > 5 * 1024 * 1024) {
                setErrorComprobante('La imagen no puede superar los 5 MB');
                return;
            }
            setComprobanteFile(file);
            setComprobantePreview(URL.createObjectURL(file));
        } else {
            setComprobanteFile(null);
            setComprobantePreview(null);
        }
    }, []);

    // ── Enviar comprobante ──
    const enviarComprobante = async () => {
        if (!comprobanteFile || !ordenId) return;
        setEnviandoComprobante(true);
        setErrorComprobante(null);

        try {
            const formData = new FormData();
            formData.append('file', comprobanteFile);

            const res = await fetch(`/api/ordenes/${ordenId}/comprobante`, {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Error al enviar el comprobante');
            }

            // Éxito: redirigir a confirmación QR
            localStorage.removeItem('pago_pendiente_orden_id');
            router.push(`/confirmacion?orden=${ordenId}&tipo=qr`);

        } catch (err: any) {
            setErrorComprobante(err.message || 'Error al enviar el comprobante. Intenta nuevamente.');
        } finally {
            setEnviandoComprobante(false);
        }
    };

    // URL del QR de Izipay
    const QR_URL = 'https://sfpjbtvoulmxldwfstnr.supabase.co/storage/v1/object/public/pago/codigoQR_LoriePeru.jpeg';

    return (
        <div className="min-h-screen bg-lorie-cream flex flex-col pt-24 mt-16 lg:mt-0 lg:pt-36">
            <Navbar hideCart />

            <main className="flex-1 p-4 pb-16">
                {/* Stepper */}
                <div className="max-w-6xl w-full mx-auto mb-10 flex justify-center">
                    <CheckoutSteps paso={3} />
                </div>

                <div className="max-w-6xl w-full mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

                        {/* ══════════ COLUMNA IZQUIERDA: Métodos de pago (3/5) ══════════ */}
                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-3xl shadow-lg border border-lorie-beige overflow-hidden">

                                {/* Header */}
                                <div className="text-center p-6 pb-0">
                                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-lorie-cream flex items-center justify-center">
                                        <i className="ri-secure-payment-line text-2xl text-lorie-brown"></i>
                                    </div>
                                    <h1 className="font-serif text-2xl font-bold text-lorie-dark">Pago Seguro</h1>
                                    <p className="font-sans text-lorie-brown/60 text-sm mt-1">
                                        Pedido <strong className="text-lorie-dark font-mono">#{ordenId.split('-')[0].toUpperCase()}</strong>
                                    </p>
                                </div>

                                {/* Tabs de método de pago */}
                                <div className="flex border-b border-lorie-beige mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setMetodoPago('tarjeta')}
                                        className={`flex-1 py-3.5 px-4 text-sm font-sans font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                                            metodoPago === 'tarjeta'
                                                ? 'text-lorie-dark border-b-2 bg-lorie-cream/30'
                                                : 'text-lorie-brown/50 hover:text-lorie-brown/70 hover:bg-lorie-cream/10'
                                        }`}
                                        style={metodoPago === 'tarjeta' ? { borderBottomColor: 'rgb(166, 124, 124)' } : {}}
                                    >
                                        <i className="ri-bank-card-line text-base"></i>
                                        Tarjeta
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setMetodoPago('qr')}
                                        className={`flex-1 py-3.5 px-4 text-sm font-sans font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                                            metodoPago === 'qr'
                                                ? 'text-lorie-dark border-b-2 bg-lorie-cream/30'
                                                : 'text-lorie-brown/50 hover:text-lorie-brown/70 hover:bg-lorie-cream/10'
                                        }`}
                                        style={metodoPago === 'qr' ? { borderBottomColor: 'rgb(166, 124, 124)' } : {}}
                                    >
                                        <i className="ri-qr-code-line text-base"></i>
                                        QR Izipay
                                    </button>
                                </div>

                                {/* Contenido del tab seleccionado */}
                                <div className="p-6 md:p-8">

                                    {/* ──── TAB TARJETA (siempre montado para evitar conflicto con DOM inyectado por Izipay) ──── */}
                                    <div style={{ display: metodoPago === 'tarjeta' ? 'block' : 'none' }}>
                                            {/* Error */}
                                            {error && (
                                                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 mb-6 font-sans text-sm text-center">
                                                    <i className="ri-error-warning-line text-lg block mb-1"></i>
                                                    {error}
                                                    <button
                                                        onClick={() => window.location.reload()}
                                                        className="mt-3 text-xs underline block mx-auto text-red-500"
                                                    >
                                                        Reintentar
                                                    </button>
                                                </div>
                                            )}

                                            {/* Loading */}
                                            {loading && !error && (
                                                <div className="py-14 text-center">
                                                    <i className="ri-loader-4-line text-4xl text-lorie-brown animate-spin block mb-4"></i>
                                                    <p className="font-sans text-sm text-lorie-brown/60">Conectando de forma segura con el banco...</p>
                                                </div>
                                            )}

                                            {/* Formulario clásico embebido de Izipay */}
                                            <div
                                                className={`kr-embedded mx-auto transition-opacity duration-500 ${loading || error ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}
                                                kr-form-token={formToken}
                                            ></div>

                                            {/* Pie de seguridad */}
                                            {!loading && !error && (
                                                <p className="font-sans text-xs text-lorie-brown/40 mt-6 flex items-center justify-center gap-2">
                                                    <i className="ri-lock-2-line"></i>
                                                    Pago cifrado y asegurado por Izipay · PCI-DSS Nivel 1
                                                </p>
                                            )}
                                    </div>

                                    {/* ──── TAB QR IZIPAY (siempre montado) ──── */}
                                    <div style={{ display: metodoPago === 'qr' ? 'block' : 'none' }}>
                                        <div className="space-y-6">
                                            {/* Instrucciones */}
                                            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                                                <h3 className="font-serif text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
                                                    <i className="ri-information-line text-blue-600"></i>
                                                    ¿Cómo pagar con QR?
                                                </h3>
                                                <ol className="list-decimal list-inside space-y-1 text-xs text-blue-700 font-sans leading-relaxed">
                                                    <li>Escanea el código QR con la app de tu banco</li>
                                                    <li>Realiza la transferencia por el monto total</li>
                                                    <li>Toma una captura de pantalla del comprobante</li>
                                                    <li>Sube la imagen del comprobante aquí abajo</li>
                                                </ol>
                                            </div>

                                            {/* QR Image */}
                                            <div className="flex flex-col items-center">
                                                <div className="w-full max-w-[320px] rounded-2xl overflow-hidden border-2 border-lorie-beige shadow-md bg-white p-3">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={QR_URL}
                                                        alt="Código QR Izipay - Lorie Perú"
                                                        className="w-full h-auto rounded-xl"
                                                        loading="eager"
                                                    />
                                                </div>
                                                <p className="text-xs text-lorie-brown/50 font-sans mt-3 text-center">
                                                    Escanea con la app de tu banco
                                                </p>
                                                {resumen && (
                                                    <p className="text-base font-bold text-lorie-dark font-sans mt-2">
                                                        Monto a pagar: <span className="text-lorie-rose">S/ {resumen.total.toFixed(2)}</span>
                                                    </p>
                                                )}
                                            </div>

                                            {/* Separador */}
                                            <div className="relative">
                                                <div className="absolute inset-0 flex items-center">
                                                    <div className="w-full border-t border-lorie-beige"></div>
                                                </div>
                                                <div className="relative flex justify-center text-xs">
                                                    <span className="bg-white px-4 text-lorie-brown/50 font-sans uppercase tracking-wider">
                                                        Subir comprobante
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Upload de comprobante */}
                                            <div className="space-y-4">
                                                {/* Input area */}
                                                <label className="group cursor-pointer block">
                                                    <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 ${
                                                        comprobantePreview
                                                            ? 'border-green-300 bg-green-50/50'
                                                            : 'border-lorie-beige hover:border-lorie-brown/40 hover:bg-lorie-cream/20'
                                                    }`}>
                                                        {comprobantePreview ? (
                                                            <div className="space-y-3">
                                                                <div className="relative w-full max-w-xs mx-auto h-48 rounded-xl overflow-hidden">
                                                                    <Image
                                                                        src={comprobantePreview}
                                                                        alt="Vista previa del comprobante"
                                                                        fill
                                                                        className="object-contain"
                                                                        sizes="320px"
                                                                    />
                                                                </div>
                                                                <p className="text-xs text-green-600 font-sans font-semibold flex items-center justify-center gap-1">
                                                                    <i className="ri-check-line"></i>
                                                                    {comprobanteFile?.name || 'Comprobante subido'}
                                                                </p>
                                                                <p className="text-xs text-lorie-brown/40 font-sans">
                                                                    Haz clic para subir uno nuevo
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-2">
                                                                <i className="ri-upload-cloud-2-line text-4xl text-lorie-brown/30 group-hover:text-lorie-brown/50 transition-colors"></i>
                                                                <p className="text-sm text-lorie-brown/60 font-sans">
                                                                    <span className="font-semibold text-lorie-dark">Haz clic para subir</span> tu comprobante
                                                                </p>
                                                                <p className="text-xs text-lorie-brown/40 font-sans">
                                                                    JPG, PNG o WEBP · Máximo 5 MB
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <input
                                                        type="file"
                                                        accept="image/jpeg,image/png,image/webp"
                                                        onChange={handleFileChange}
                                                        className="hidden"
                                                    />
                                                </label>

                                                {/* Error comprobante */}
                                                {errorComprobante && (
                                                    <div className="bg-red-50 text-red-600 p-3 rounded-xl border border-red-200 font-sans text-sm text-center">
                                                        <i className="ri-error-warning-line mr-1"></i>
                                                        {errorComprobante}
                                                    </div>
                                                )}

                                                {/* Botón enviar */}
                                                <button
                                                    type="button"
                                                    onClick={enviarComprobante}
                                                    disabled={!comprobanteFile || enviandoComprobante}
                                                    className={`w-full py-4 rounded-2xl text-white font-bold font-sans text-base transition-all duration-300 flex items-center justify-center gap-3 ${
                                                        comprobanteFile && !enviandoComprobante
                                                            ? 'hover:opacity-90 hover:shadow-xl cursor-pointer'
                                                            : 'opacity-40 cursor-not-allowed'
                                                    }`}
                                                    style={{ backgroundColor: 'rgb(166, 124, 124)' }}
                                                >
                                                    {enviandoComprobante ? (
                                                        <>
                                                            <i className="ri-loader-4-line animate-spin"></i>
                                                            <span>Enviando comprobante...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="ri-send-plane-line"></i>
                                                            <span>Enviar Comprobante de Pago</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ══════════ COLUMNA DERECHA: Resumen del pedido (2/5) ══════════ */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-3xl shadow-lg border border-lorie-beige p-6 lg:sticky lg:top-36">
                                <h2 className="font-serif text-lg font-bold text-lorie-dark mb-5 flex items-center gap-2">
                                    <i className="ri-shopping-bag-2-line text-lorie-brown"></i>
                                    Resumen del pedido
                                </h2>

                                {resumen ? (
                                    <>
                                        {/* Lista de productos */}
                                        <div className="space-y-3 mb-5">
                                            {resumen.items.map((item, idx) => {
                                                const imagenUrl = imagenesLocal[item.nombre];
                                                return (
                                                    <div key={idx} className="flex items-center gap-3 pb-3 border-b border-lorie-cream last:border-0 last:pb-0">
                                                        {/* Imagen pequeña */}
                                                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-lorie-cream flex-shrink-0">
                                                            {imagenUrl ? (
                                                                <Image
                                                                    src={imagenUrl}
                                                                    alt={item.nombre}
                                                                    fill
                                                                    className="object-cover"
                                                                    sizes="48px"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <i className="ri-shopping-bag-line text-lorie-brown/30 text-sm"></i>
                                                                </div>
                                                            )}
                                                        </div>
                                                        {/* Info */}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-serif text-xs font-semibold text-lorie-dark truncate">{item.nombre}</p>
                                                            <p className="text-lorie-brown/50 text-xs font-sans">
                                                                {item.cantidad} × S/ {item.precio_unitario.toFixed(2)}
                                                            </p>
                                                        </div>
                                                        {/* Precio */}
                                                        <p className="font-sans font-bold text-lorie-dark text-xs whitespace-nowrap">
                                                            S/ {item.subtotal_linea.toFixed(2)}
                                                        </p>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Totales */}
                                        <div className="space-y-2 pt-4 border-t border-lorie-cream">
                                            <div className="flex justify-between text-sm font-sans text-lorie-brown/70">
                                                <span>Subtotal</span>
                                                <span>S/ {resumen.subtotal.toFixed(2)}</span>
                                            </div>
                                            {resumen.monto_descuento > 0 && (
                                                <div className="flex justify-between text-sm font-sans text-green-600">
                                                    <span>Descuento</span>
                                                    <span>- S/ {resumen.monto_descuento.toFixed(2)}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between text-sm font-sans text-lorie-brown/70">
                                                <span>Envío</span>
                                                <span>{resumen.costo_envio > 0 ? `S/ ${resumen.costo_envio.toFixed(2)}` : 'A coordinar'}</span>
                                            </div>
                                            <div className="flex justify-between text-base font-bold font-sans text-lorie-dark pt-2 border-t border-lorie-cream/80">
                                                <span>TOTAL</span>
                                                <span className="text-lorie-rose">S/ {resumen.total.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="py-8 text-center">
                                        <i className="ri-loader-4-line text-2xl text-lorie-brown/30 animate-spin block mb-2"></i>
                                        <p className="text-xs text-lorie-brown/40 font-sans">Cargando resumen...</p>
                                    </div>
                                )}

                                {/* Pie de seguridad */}
                                <div className="mt-5 pt-4 border-t border-lorie-cream">
                                    <div className="flex items-center gap-2 text-xs text-lorie-brown/40 font-sans">
                                        <i className="ri-shield-check-line text-green-500"></i>
                                        <span>Compra 100% segura y protegida</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <FooterMinimal />
        </div>
    );
}
