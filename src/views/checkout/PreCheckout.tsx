"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart, CartItem } from '@/hooks/useCart';
import Navbar from '@/components/feature/Navbar';
import FooterMinimal from '@/components/feature/FooterMinimal';
import CheckoutSteps from '@/components/feature/CheckoutSteps';
import type { Distrito, MetodoEnvio } from '@/types/checkout';

interface PreCheckoutProps {
    onOrdenCreada?: (ordenId: string) => void;
}

export default function PreCheckout({ onOrdenCreada }: PreCheckoutProps) {
    // ── Estado: catálogos ──
    const [distritos, setDistritos] = useState<Distrito[]>([]);
    const [metodosEnvio, setMetodosEnvio] = useState<MetodoEnvio[]>([]);
    const [cargando, setCargando] = useState(true);

    // ── Estado: formulario ──
    const [form, setForm] = useState({
        nombre_completo: '',
        dni: '',
        celular: '',
        email: '',
        distrito_id: '',
        direccion: '',
        referencia: '',
        nombre_agencia: '',
    });

    // ── Estado: lógica de envío ──
    const [distritoSeleccionado, setDistritoSeleccionado] = useState<Distrito | null>(null);
    const [metodoEnvioId, setMetodoEnvioId] = useState<string>('');
    const [costoEnvio, setCostoEnvio] = useState<number>(0);

    // ── Estado: descuento (ahora viene del global del carrito) ──

    // ── Estado: política y envío ──
    const [aceptaPolitica, setAceptaPolitica] = useState(false);
    const [enviando, setEnviando] = useState(false);
    const [errores, setErrores] = useState<Record<string, string>>({});
    const router = useRouter();

    const { cartItems, clearCart, descuentoData } = useCart();
    // ── Cargar catálogos ──
    useEffect(() => {
        async function cargarCatalogos() {
            try {
                const [distRes, envRes] = await Promise.all([
                    fetch('/api/distritos'),
                    fetch('/api/metodos-envio'),
                ]);
                const distData = await distRes.json();
                const envData = await envRes.json();
                setDistritos(Array.isArray(distData) ? distData : []);
                setMetodosEnvio(Array.isArray(envData) ? envData : []);
            } catch {
                console.error('Error al cargar catálogos');
            } finally {
                setCargando(false);
            }
        }
        cargarCatalogos();
    }, []);

    // ── Lógica dinámica de envío por distrito ──
    useEffect(() => {
        if (!form.distrito_id || metodosEnvio.length === 0) return;

        const distrito = distritos.find(d => d.id === form.distrito_id) ?? null;
        setDistritoSeleccionado(distrito);

        if (distrito) {
            if (distrito.es_lima_metropolitana) {
                const motorizado = metodosEnvio.find(m => m.tipo_envio === 'LIMA');
                if (motorizado) {
                    setMetodoEnvioId(motorizado.id);
                    setCostoEnvio(motorizado.precio);
                }
            } else {
                const shalom = metodosEnvio.find(m => m.tipo_envio === 'PROVINCIA');
                if (shalom) {
                    setMetodoEnvioId(shalom.id);
                    setCostoEnvio(0); // Shalom: coordina con agencia
                }
            }
        }
    }, [form.distrito_id, distritos, metodosEnvio]);

    // ── Totales ──
    const subtotal = cartItems.reduce((sum: number, item: CartItem) => {
        const precio = item.precioOferta ?? item.precio;
        return sum + precio * item.cantidad;
    }, 0);

    let montoDescuento = 0;
    if (descuentoData?.valido) {
        if (descuentoData.tipo === 'PORCENTAJE' && descuentoData.valor) {
            montoDescuento = subtotal * (descuentoData.valor / 100);
        } else if (descuentoData.tipo === 'MONTO_FIJO' && descuentoData.valor) {
            montoDescuento = descuentoData.valor;
        }
        montoDescuento = Math.min(montoDescuento, subtotal);
    }

    const total = Math.max(0, subtotal - montoDescuento + costoEnvio);

    // ── Validaciones ──
    function validarFormulario(): boolean {
        const nuevoErrores: Record<string, string> = {};

        if (form.nombre_completo.trim().length < 3) nuevoErrores.nombre_completo = 'Ingresa tu nombre completo';
        if (!/^\d{8}$/.test(form.dni)) nuevoErrores.dni = 'El DNI debe tener exactamente 8 dígitos';
        if (!/^9\d{8}$/.test(form.celular)) nuevoErrores.celular = 'El celular debe tener 9 dígitos y comenzar con 9';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nuevoErrores.email = 'Ingresa un email válido';
        if (!form.distrito_id) nuevoErrores.distrito_id = 'Selecciona un distrito';
        if (form.direccion.trim().length < 10) nuevoErrores.direccion = 'Ingresa una dirección más detallada';
        if (distritoSeleccionado && !distritoSeleccionado.es_lima_metropolitana && !form.nombre_agencia.trim()) {
            nuevoErrores.nombre_agencia = 'Indica el nombre exacto de tu agencia Shalom';
        }

        setErrores(nuevoErrores);
        return Object.keys(nuevoErrores).length === 0;
    }

    // ── Enviar orden ──
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!validarFormulario() || !aceptaPolitica || cartItems.length === 0) return;

        // Verificar que el método de envío esté asignado
        if (!metodoEnvioId) {
            alert('Selecciona un distrito para continuar. El método de envío no está asignado.');
            return;
        }

        setEnviando(true);
        try {
            const payload = {
                cliente: {
                    nombre_completo: form.nombre_completo,
                    dni: form.dni,
                    celular: form.celular,
                    email: form.email,
                },
                direccion: {
                    distrito_id: form.distrito_id,
                    direccion: form.direccion,
                    referencia: form.referencia || undefined,
                    tipo_envio: distritoSeleccionado?.es_lima_metropolitana ? 'LIMA_MOTORIZADO' : 'PROVINCIA_SHALOM',
                    nombre_agencia: form.nombre_agencia || undefined,
                },
                metodo_envio_id: metodoEnvioId,
                codigo_descuento_id: descuentoData?.codigo_id ?? null,
                items: cartItems.map((item: CartItem) => ({
                    producto_id: String(item.id),
                    nombre_producto_snapshot: item.nombre,
                    precio_unitario_snapshot: item.precioOferta ?? item.precio,
                    cantidad: item.cantidad,
                    subtotal_linea: (item.precioOferta ?? item.precio) * item.cantidad,
                })),
                subtotal,
                monto_descuento: montoDescuento,
                costo_envio: costoEnvio,
                total,
            };

            const res = await fetch('/api/ordenes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (data.success) {
                // Guardar datos para la página de confirmación
                const nombreDistrito = distritos.find(d => d.id === form.distrito_id)?.nombre ?? form.distrito_id;
                const pedidoParaConfirmacion = {
                    numeroPedido: data.orden_id.toUpperCase().slice(0, 8),
                    productos: cartItems.map((item: CartItem) => ({
                        id: item.id,
                        nombre: item.nombre,
                        imagen: item.imagen,
                        precio: item.precio,
                        precioOferta: item.precioOferta,
                        cantidad: item.cantidad,
                    })),
                    datosEnvio: {
                        nombreCompleto: form.nombre_completo,
                        celular: form.celular,
                        dni: form.dni,
                        distrito: nombreDistrito,
                        direccion: form.direccion,
                        referencia: form.referencia,
                        tipoEnvio: esLima ? 'motorizado' : 'shalom',
                        agenciaShalom: form.nombre_agencia || undefined,
                    },
                    subtotal,
                    costoEnvio,
                    total,
                    fecha: new Date().toISOString(),
                };
                localStorage.setItem('ultimoPedido', JSON.stringify(pedidoParaConfirmacion));
                clearCart();
                onOrdenCreada?.(data.orden_id);
                // PASARELA IZIPAY: Ahora redirigimos al pasillo de pago embebido en lugar de la confirmación directa
                router.push(`/pago/${data.orden_id}`);
            } else {
                // Mostrar el error real del backend para diagnóstico
                const errorMsg = data?.error || data?.detalles || 'Error desconocido del servidor';
                const errorDetalle = typeof data?.detalles === 'object'
                    ? JSON.stringify(data.detalles, null, 2)
                    : errorMsg;
                console.error('Error del backend al crear orden:', data);
                alert(`Hubo un problema al procesar tu pedido:\n\n${errorDetalle}\n\nPor favor revisa los datos e inténtalo nuevamente.`);
            }
        } catch {
            alert('Error de conexión. Por favor inténtalo nuevamente.');
        } finally {
            setEnviando(false);
        }
    }

    const esLima = distritoSeleccionado?.es_lima_metropolitana ?? true;
    const formularioCompleto =
        form.nombre_completo.trim().length >= 3 &&
        /^\d{8}$/.test(form.dni) &&
        /^9\d{8}$/.test(form.celular) &&
        form.email.includes('@') &&
        form.distrito_id &&
        form.direccion.trim().length >= 10 &&
        (esLima || form.nombre_agencia.trim().length > 0) &&
        aceptaPolitica &&
        cartItems.length > 0;

    return (
        <>
            <Navbar hideCart />
            <div className="flex-1 min-h-screen bg-lorie-cream px-4 pt-24 mt-16 lg:mt-0 lg:pt-36 pb-16">
                <div className="max-w-6xl mx-auto">
                    {/* Stepper de pasos */}
                    <CheckoutSteps paso={2} />

                    {/* Título */}
                    <div className="text-center mb-10">
                        <h1
                            className="text-3xl md:text-4xl font-bold text-lorie-dark mb-2"
                            style={{ fontFamily: "'Lista Masta Regular', serif" }}
                        >
                            RESUMEN DE TU PEDIDO
                        </h1>
                        <p className="text-lorie-brown/60 text-sm font-sans">
                            Verifica tu pedido y completa tus datos de envío
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                            {/* ══════════ COLUMNA IZQUIERDA: Resumen ══════════ */}
                            <div className="space-y-5">

                                {/* SECCIÓN 1 – Resumen del pedido */}
                                <div className="bg-white rounded-3xl shadow-md p-6">
                                    <h2 className="font-serif text-lg font-bold text-lorie-dark mb-5 flex items-center gap-2">
                                        <i className="ri-shopping-bag-2-line text-lorie-brown"></i>
                                        Tu pedido
                                    </h2>

                                    {cartItems.length === 0 ? (
                                        <div className="text-center py-8">
                                            <i className="ri-shopping-cart-line text-4xl text-lorie-brown/30 mb-3 block"></i>
                                            <p className="text-lorie-brown/50 text-sm font-sans">Tu carrito está vacío</p>
                                            <a href="/productos" className="text-lorie-brown text-sm underline mt-2 inline-block">Ver productos</a>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {cartItems.map((item: CartItem) => (
                                                <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-lorie-cream last:border-0 last:pb-0">
                                                    {/* Imagen */}
                                                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-lorie-cream flex-shrink-0">
                                                        {item.imagen ? (
                                                            <Image
                                                                src={item.imagen}
                                                                alt={item.nombre}
                                                                fill
                                                                className="object-cover"
                                                                sizes="64px"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <i className="ri-image-line text-lorie-brown/30 text-xl"></i>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-serif text-sm font-semibold text-lorie-dark truncate">{item.nombre}</p>
                                                        <p className="text-lorie-brown/60 text-xs font-sans mt-0.5">Cantidad: {item.cantidad}</p>
                                                    </div>

                                                    {/* Precio */}
                                                    <div className="text-right">
                                                        <p className="font-sans font-bold text-lorie-dark text-sm">
                                                            S/ {((item.precioOferta ?? item.precio) * item.cantidad).toFixed(2)}
                                                        </p>
                                                        {item.precioOferta && (
                                                            <p className="text-lorie-brown/40 text-xs line-through">
                                                                S/ {(item.precio * item.cantidad).toFixed(2)}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}



                                    {/* Totales */}
                                    <div className="mt-4 space-y-2.5 pt-4 border-t border-lorie-cream">
                                        <div className="flex justify-between text-sm font-sans text-lorie-brown/70">
                                            <span>Subtotal</span>
                                            <span>S/ {subtotal.toFixed(2)}</span>
                                        </div>
                                        {montoDescuento > 0 && (
                                            <div className="flex justify-between text-sm font-sans text-green-600">
                                                <span>Descuento</span>
                                                <span>- S/ {montoDescuento.toFixed(2)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-sm font-sans text-lorie-brown/70">
                                            <span>Envío</span>
                                            <span>{costoEnvio > 0 ? `S/ ${costoEnvio.toFixed(2)}` : form.distrito_id ? (esLima ? 'S/ 10.00' : 'Por coordinar con Shalom') : '—'}</span>
                                        </div>
                                        <div className="flex justify-between text-base font-bold font-sans text-lorie-dark pt-2 border-t border-lorie-cream/80">
                                            <span>TOTAL</span>
                                            <span className="text-lorie-rose">S/ {total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* SECCIÓN 4 – Política de cambios (Desktop) */}
                                <div className="hidden lg:block bg-white rounded-3xl shadow-md p-6">
                                    <h2 className="font-serif text-lg font-bold text-lorie-dark mb-4 flex items-center gap-2">
                                        <i className="ri-shield-check-line text-lorie-brown"></i>
                                        Política de Cambios y Devoluciones
                                    </h2>
                                    <ul className="space-y-2 mb-5">
                                        {[
                                            'Producto sin uso',
                                            'Con etiquetas originales',
                                            'En empaque original intacto',
                                            'No se aceptan productos usados o con daños',
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-xs text-lorie-brown/70 font-sans">
                                                <i className="ri-checkbox-circle-fill text-lorie-brown mt-0.5 flex-shrink-0"></i>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={aceptaPolitica}
                                            onChange={e => setAceptaPolitica(e.target.checked)}
                                            className="mt-0.5 w-4 h-4 rounded border-lorie-rose/40 text-lorie-brown cursor-pointer"
                                        />
                                        <span className="text-xs text-lorie-dark font-sans leading-relaxed group-hover:text-lorie-brown transition-colors">
                                            He leído y acepto la <strong>política de cambios y devoluciones</strong> de Lorie Perú.
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* ══════════ COLUMNA DERECHA: Formulario ══════════ */}
                            <div className="space-y-5">

                                {/* SECCIÓN 2 – Datos del cliente */}
                                <div className="bg-white rounded-3xl shadow-md p-6">
                                    <h2 className="font-serif text-lg font-bold text-lorie-dark mb-5 flex items-center gap-2">
                                        <i className="ri-user-line text-lorie-brown"></i>
                                        Tus datos
                                    </h2>

                                    <div className="space-y-4">
                                        {/* Nombre completo */}
                                        <div>
                                            <label className="text-xs font-semibold text-lorie-dark font-sans uppercase tracking-wide mb-1.5 block">
                                                Nombre completo <span className="text-lorie-rose">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={form.nombre_completo}
                                                onChange={e => setForm(f => ({ ...f, nombre_completo: e.target.value }))}
                                                placeholder="Ej: María García López"
                                                className={`w-full px-4 py-2.5 border rounded-xl text-sm font-sans focus:outline-none focus:ring-2 bg-lorie-cream/30 ${errores.nombre_completo ? 'border-red-400 focus:ring-red-200' : 'border-lorie-rose/30 focus:ring-lorie-rose/30'}`}
                                            />
                                            {errores.nombre_completo && <p className="text-red-500 text-xs mt-1">{errores.nombre_completo}</p>}
                                        </div>

                                        {/* DNI y Celular */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-xs font-semibold text-lorie-dark font-sans uppercase tracking-wide mb-1.5 block">
                                                    DNI <span className="text-lorie-rose">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={form.dni}
                                                    onChange={e => setForm(f => ({ ...f, dni: e.target.value.replace(/\D/g, '').slice(0, 8) }))}
                                                    placeholder="12345678"
                                                    maxLength={8}
                                                    className={`w-full px-4 py-2.5 border rounded-xl text-sm font-sans focus:outline-none focus:ring-2 bg-lorie-cream/30 ${errores.dni ? 'border-red-400 focus:ring-red-200' : 'border-lorie-rose/30 focus:ring-lorie-rose/30'}`}
                                                />
                                                {errores.dni && <p className="text-red-500 text-xs mt-1">{errores.dni}</p>}
                                            </div>
                                            <div>
                                                <label className="text-xs font-semibold text-lorie-dark font-sans uppercase tracking-wide mb-1.5 block">
                                                    Celular <span className="text-lorie-rose">*</span>
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={form.celular}
                                                    onChange={e => setForm(f => ({ ...f, celular: e.target.value.replace(/\D/g, '').slice(0, 9) }))}
                                                    placeholder="987654321"
                                                    maxLength={9}
                                                    className={`w-full px-4 py-2.5 border rounded-xl text-sm font-sans focus:outline-none focus:ring-2 bg-lorie-cream/30 ${errores.celular ? 'border-red-400 focus:ring-red-200' : 'border-lorie-rose/30 focus:ring-lorie-rose/30'}`}
                                                />
                                                {errores.celular && <p className="text-red-500 text-xs mt-1">{errores.celular}</p>}
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label className="text-xs font-semibold text-lorie-dark font-sans uppercase tracking-wide mb-1.5 block">
                                                Email <span className="text-lorie-rose">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                value={form.email}
                                                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                                placeholder="tucorreo@gmail.com"
                                                className={`w-full px-4 py-2.5 border rounded-xl text-sm font-sans focus:outline-none focus:ring-2 bg-lorie-cream/30 ${errores.email ? 'border-red-400 focus:ring-red-200' : 'border-lorie-rose/30 focus:ring-lorie-rose/30'}`}
                                            />
                                            {errores.email && <p className="text-red-500 text-xs mt-1">{errores.email}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* SECCIÓN 3 – Dirección y envío */}
                                <div className="bg-white rounded-3xl shadow-md p-6">
                                    <h2 className="font-serif text-lg font-bold text-lorie-dark mb-5 flex items-center gap-2">
                                        <i className="ri-map-pin-line text-lorie-brown"></i>
                                        Dirección de envío
                                    </h2>

                                    <div className="space-y-4">
                                        {/* Distrito */}
                                        <div>
                                            <label className="text-xs font-semibold text-lorie-dark font-sans uppercase tracking-wide mb-1.5 block">
                                                Distrito <span className="text-lorie-rose">*</span>
                                            </label>
                                            <select
                                                value={form.distrito_id}
                                                onChange={e => setForm(f => ({ ...f, distrito_id: e.target.value }))}
                                                className={`w-full px-4 py-2.5 border rounded-xl text-sm font-sans focus:outline-none focus:ring-2 bg-lorie-cream/30 ${errores.distrito_id ? 'border-red-400 focus:ring-red-200' : 'border-lorie-rose/30 focus:ring-lorie-rose/30'}`}
                                                disabled={cargando}
                                            >
                                                <option value="">{cargando ? 'Cargando distritos...' : 'Selecciona tu distrito'}</option>
                                                {distritos.filter(d => d.es_lima_metropolitana).length > 0 && (
                                                    <optgroup label="── Lima Metropolitana ──">
                                                        {distritos.filter(d => d.es_lima_metropolitana).map(d => (
                                                            <option key={d.id} value={d.id}>{d.nombre}</option>
                                                        ))}
                                                    </optgroup>
                                                )}
                                                {distritos.filter(d => !d.es_lima_metropolitana).length > 0 && (
                                                    <optgroup label="── Provincia ──">
                                                        {distritos.filter(d => !d.es_lima_metropolitana).map(d => (
                                                            <option key={d.id} value={d.id}>{d.nombre}</option>
                                                        ))}
                                                    </optgroup>
                                                )}
                                            </select>
                                            {errores.distrito_id && <p className="text-red-500 text-xs mt-1">{errores.distrito_id}</p>}
                                        </div>

                                        {/* Info de envío dinámica */}
                                        {distritoSeleccionado && (
                                            <div className={`flex items-start gap-3 px-4 py-3 rounded-xl text-xs font-sans ${esLima ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
                                                <i className={`${esLima ? 'ri-e-bike-line text-green-600' : 'ri-truck-line text-amber-600'} text-base flex-shrink-0 mt-0.5`}></i>
                                                <div>
                                                    <p className={`font-bold ${esLima ? 'text-green-700' : 'text-amber-700'}`}>
                                                        {esLima ? 'Envío Motorizado Guerreros – S/ 10.00' : 'Envío Shalom Provincia'}
                                                    </p>
                                                    <p className={`mt-0.5 ${esLima ? 'text-green-600' : 'text-amber-600'}`}>
                                                        {esLima
                                                            ? 'Entrega a domicilio en Lima Metropolitana'
                                                            : 'El costo de envío se coordina directamente con tu agencia Shalom'}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Campo agencia Shalom (solo si es provincia) */}
                                        {distritoSeleccionado && !esLima && (
                                            <div>
                                                <label className="text-xs font-semibold text-lorie-dark font-sans uppercase tracking-wide mb-1.5 block">
                                                    Nombre de tu agencia Shalom <span className="text-lorie-rose">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={form.nombre_agencia}
                                                    onChange={e => setForm(f => ({ ...f, nombre_agencia: e.target.value }))}
                                                    placeholder="Ej: Shalom Arequipa Centro"
                                                    className={`w-full px-4 py-2.5 border rounded-xl text-sm font-sans focus:outline-none focus:ring-2 bg-lorie-cream/30 ${errores.nombre_agencia ? 'border-red-400 focus:ring-red-200' : 'border-lorie-rose/30 focus:ring-lorie-rose/30'}`}
                                                />
                                                {errores.nombre_agencia && <p className="text-red-500 text-xs mt-1">{errores.nombre_agencia}</p>}
                                            </div>
                                        )}

                                        {/* Dirección */}
                                        <div>
                                            <label className="text-xs font-semibold text-lorie-dark font-sans uppercase tracking-wide mb-1.5 block">
                                                Dirección completa <span className="text-lorie-rose">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={form.direccion}
                                                onChange={e => setForm(f => ({ ...f, direccion: e.target.value }))}
                                                placeholder="Ej: Av. Los Olivos 234, Dpto 3B"
                                                className={`w-full px-4 py-2.5 border rounded-xl text-sm font-sans focus:outline-none focus:ring-2 bg-lorie-cream/30 ${errores.direccion ? 'border-red-400 focus:ring-red-200' : 'border-lorie-rose/30 focus:ring-lorie-rose/30'}`}
                                            />
                                            {errores.direccion && <p className="text-red-500 text-xs mt-1">{errores.direccion}</p>}
                                        </div>

                                        {/* Referencia */}
                                        <div>
                                            <label className="text-xs font-semibold text-lorie-dark font-sans uppercase tracking-wide mb-1.5 block">
                                                Referencia
                                            </label>
                                            <input
                                                type="text"
                                                value={form.referencia}
                                                onChange={e => setForm(f => ({ ...f, referencia: e.target.value }))}
                                                placeholder="Ej: Frente al supermercado, casa color azul"
                                                className="w-full px-4 py-2.5 border border-lorie-rose/30 rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-lorie-rose/30 bg-lorie-cream/30"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* SECCIÓN 4 – Política de cambios (Móvil) */}
                                <div className="block lg:hidden bg-white rounded-3xl shadow-md p-6">
                                    <h2 className="font-serif text-lg font-bold text-lorie-dark mb-4 flex items-center gap-2">
                                        <i className="ri-shield-check-line text-lorie-brown"></i>
                                        Política de Cambios y Devoluciones
                                    </h2>
                                    <ul className="space-y-2 mb-5">
                                        {[
                                            'Producto sin uso',
                                            'Con etiquetas originales',
                                            'En empaque original intacto',
                                            'No se aceptan productos usados o con daños',
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-xs text-lorie-brown/70 font-sans">
                                                <i className="ri-checkbox-circle-fill text-lorie-brown mt-0.5 flex-shrink-0"></i>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={aceptaPolitica}
                                            onChange={e => setAceptaPolitica(e.target.checked)}
                                            className="mt-0.5 w-4 h-4 rounded border-lorie-rose/40 text-lorie-brown cursor-pointer"
                                        />
                                        <span className="text-xs text-lorie-dark font-sans leading-relaxed group-hover:text-lorie-brown transition-colors">
                                            He leído y acepto la <strong>política de cambios y devoluciones</strong> de Lorie Perú.
                                        </span>
                                    </label>
                                </div>

                                {/* Botón de envío */}
                                <button
                                    type="submit"
                                    disabled={!formularioCompleto || enviando}
                                    className={`w-full py-4 rounded-2xl text-white font-bold font-sans text-base transition-all duration-300 flex items-center justify-center gap-3 ${formularioCompleto && !enviando
                                        ? 'hover:opacity-90 hover:shadow-xl cursor-pointer'
                                        : 'opacity-40 cursor-not-allowed'
                                        }`}
                                    style={{ backgroundColor: 'rgb(166, 124, 124)' }}
                                >
                                    {enviando ? (
                                        <>
                                            <i className="ri-loader-4-line animate-spin"></i>
                                            <span>Procesando pedido...</span>
                                        </>
                                    ) : (
                                        <>
                                            <i className="ri-secure-payment-line"></i>
                                            <span>Confirmar Pedido – S/ {total.toFixed(2)}</span>
                                        </>
                                    )}
                                </button>

                                {!formularioCompleto && cartItems.length > 0 && (
                                    <p className="text-center text-xs text-lorie-brown/50 font-sans">
                                        Completa todos los campos y acepta la política de cambios para continuar
                                    </p>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <FooterMinimal />
        </>
    );
}
