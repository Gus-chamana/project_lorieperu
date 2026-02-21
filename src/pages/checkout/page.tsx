import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import { useCart } from '../../hooks/useCart';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, getCartTotal } = useCart();
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    celular: '',
    dni: '',
    distrito: '',
    direccion: '',
    referencia: '',
    tipoEnvio: 'motorizado',
    agenciaShalom: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);
  const [showPolicies, setShowPolicies] = useState(false);

  useEffect(() => {
    document.title = 'Finalizar Compra | Lorie Perú';
    
    if (cartItems.length === 0) {
      navigate('/carrito');
    }
  }, [cartItems, navigate]);

  const distritos = [
    'ATE VITARTE',
    'MAGDALENA DEL MAR',
    'BARRANCO',
    'MIRAFLORES',
    'BELLAVISTA',
    'PUEBLO LIBRE',
    'BREÑA',
    'PUENTE PIEDRA',
    'CALLAO',
    'RÍMAC',
    'CARABAYLLO',
    'SAN BORJA',
    'CARMEN DE LA LEGUA',
    'SAN ISIDRO',
    'CERCADO DE LIMA',
    'SAN JUAN DE LURIGANCHO',
    'CHORRILLOS',
    'SAN JUAN DE MIRAFLORES',
    'COMAS',
    'SAN LUIS',
    'EL AGUSTINO',
    'INDEPENDENCIA',
    'SAN MARTÍN DE PORRES',
    'JESÚS MARÍA',
    'SAN MIGUEL',
    'LA MOLINA',
    'SANTA ANITA',
    'LA VICTORIA',
    'SURCO (SANTIAGO DE SURCO)',
    'LINCE',
    'SURQUILLO',
    'LOS OLIVOS',
    'VILLA EL SALVADOR',
    'VILLA MARÍA DEL TRIUNFO'
  ];

  const subtotal = getCartTotal();
  const costoEnvio = formData.tipoEnvio === 'motorizado' ? 10 : 0;
  const total = subtotal + costoEnvio;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombreCompleto.trim()) newErrors.nombreCompleto = 'El nombre completo es obligatorio';
    if (!formData.celular.trim()) newErrors.celular = 'El número de celular es obligatorio';
    if (!formData.dni.trim()) newErrors.dni = 'El DNI es obligatorio';
    if (!formData.distrito) newErrors.distrito = 'Debes seleccionar un distrito';
    if (!formData.direccion.trim()) newErrors.direccion = 'La dirección completa es obligatoria';
    
    if (formData.tipoEnvio === 'shalom' && !formData.agenciaShalom.trim()) {
      newErrors.agenciaShalom = 'El nombre de la agencia Shalom es obligatorio';
    }

    if (!acceptedPolicies) {
      newErrors.policies = 'Debes aceptar las políticas de envío y cambios';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Generar número de pedido
      const numeroPedido = `LP${Date.now().toString().slice(-8)}`;
      
      // Guardar datos en localStorage para la página de confirmación
      localStorage.setItem('ultimoPedido', JSON.stringify({
        numeroPedido,
        productos: cartItems,
        datosEnvio: formData,
        subtotal,
        costoEnvio,
        total,
        fecha: new Date().toISOString()
      }));
      
      navigate('/confirmacion');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-lorie-cream via-white to-lorie-beige">
      <Navbar />
      
      <section className="pt-36 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white border border-lorie-rose/30 rounded-full mb-4">
              <i className="ri-secure-payment-line text-lorie-brown"></i>
              <span className="text-lorie-brown text-sm font-sans font-medium">Pago Seguro</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-semibold text-lorie-dark uppercase">
              Finalizar Compra
            </h1>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Formulario - Lado Izquierdo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Datos de Envío */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <h2 className="font-serif text-2xl font-semibold text-lorie-dark mb-6 uppercase">
                    Datos de Envío
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-lorie-brown mb-2">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        name="nombreCompleto"
                        value={formData.nombreCompleto}
                        onChange={handleInputChange}
                        placeholder="Ej: María Fernanda López García"
                        className={`w-full px-4 py-3 border ${errors.nombreCompleto ? 'border-red-500' : 'border-lorie-beige'} rounded-xl focus:outline-none focus:ring-2 focus:ring-lorie-rose/30 text-sm`}
                      />
                      {errors.nombreCompleto && <p className="text-red-500 text-xs mt-1">{errors.nombreCompleto}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-lorie-brown mb-2">
                          Número de Celular *
                        </label>
                        <input
                          type="tel"
                          name="celular"
                          value={formData.celular}
                          onChange={handleInputChange}
                          placeholder="987654321"
                          className={`w-full px-4 py-3 border ${errors.celular ? 'border-red-500' : 'border-lorie-beige'} rounded-xl focus:outline-none focus:ring-2 focus:ring-lorie-rose/30 text-sm`}
                        />
                        {errors.celular && <p className="text-red-500 text-xs mt-1">{errors.celular}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-lorie-brown mb-2">
                          DNI *
                        </label>
                        <input
                          type="text"
                          name="dni"
                          value={formData.dni}
                          onChange={handleInputChange}
                          placeholder="12345678"
                          maxLength={8}
                          className={`w-full px-4 py-3 border ${errors.dni ? 'border-red-500' : 'border-lorie-beige'} rounded-xl focus:outline-none focus:ring-2 focus:ring-lorie-rose/30 text-sm`}
                        />
                        {errors.dni && <p className="text-red-500 text-xs mt-1">{errors.dni}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-lorie-brown mb-2">
                        Distrito *
                      </label>
                      <select
                        name="distrito"
                        value={formData.distrito}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border ${errors.distrito ? 'border-red-500' : 'border-lorie-beige'} rounded-xl focus:outline-none focus:ring-2 focus:ring-lorie-rose/30 text-sm cursor-pointer`}
                      >
                        <option value="">Selecciona tu distrito</option>
                        {distritos.map((distrito) => (
                          <option key={distrito} value={distrito}>
                            {distrito}
                          </option>
                        ))}
                      </select>
                      {errors.distrito && <p className="text-red-500 text-xs mt-1">{errors.distrito}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-lorie-brown mb-2">
                        Dirección Completa *
                      </label>
                      <input
                        type="text"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleInputChange}
                        placeholder="Ej: Av. Principal 123, Depto 4B"
                        className={`w-full px-4 py-3 border ${errors.direccion ? 'border-red-500' : 'border-lorie-beige'} rounded-xl focus:outline-none focus:ring-2 focus:ring-lorie-rose/30 text-sm`}
                      />
                      {errors.direccion && <p className="text-red-500 text-xs mt-1">{errors.direccion}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-lorie-brown mb-2">
                        Referencia
                      </label>
                      <textarea
                        name="referencia"
                        value={formData.referencia}
                        onChange={handleInputChange}
                        placeholder="Ej: Frente al parque, edificio azul con portón blanco"
                        rows={3}
                        className="w-full px-4 py-3 border border-lorie-beige rounded-xl focus:outline-none focus:ring-2 focus:ring-lorie-rose/30 text-sm resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Método de Envío */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <h2 className="font-serif text-2xl font-semibold text-lorie-dark mb-6 uppercase">
                    Método de Envío
                  </h2>
                  
                  <div className="space-y-4">
                    <label className="flex items-start gap-3 p-4 border-2 border-lorie-beige rounded-xl cursor-pointer hover:bg-lorie-cream/30 transition-all">
                      <input
                        type="radio"
                        name="tipoEnvio"
                        value="motorizado"
                        checked={formData.tipoEnvio === 'motorizado'}
                        onChange={handleInputChange}
                        className="mt-1 w-5 h-5 text-lorie-rose border-lorie-beige focus:ring-lorie-rose/30 cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-lorie-dark">Envío Motorizado Lima</span>
                          <span className="font-bold text-lorie-rose">S/ 10.00</span>
                        </div>
                        <p className="text-sm text-lorie-brown/70 mt-1">Tarifa plana para Lima Metropolitana</p>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-4 border-2 border-lorie-beige rounded-xl cursor-pointer hover:bg-lorie-cream/30 transition-all">
                      <input
                        type="radio"
                        name="tipoEnvio"
                        value="shalom"
                        checked={formData.tipoEnvio === 'shalom'}
                        onChange={handleInputChange}
                        className="mt-1 w-5 h-5 text-lorie-rose border-lorie-beige focus:ring-lorie-rose/30 cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-lorie-dark">Envío a Provincia - Shalom</span>
                          <span className="text-sm text-lorie-brown/70">Costo a coordinar</span>
                        </div>
                        <p className="text-sm text-lorie-brown/70 mt-1">Para envíos fuera de Lima</p>
                      </div>
                    </label>

                    {formData.tipoEnvio === 'shalom' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4"
                      >
                        <label className="block text-sm font-medium text-lorie-brown mb-2">
                          Nombre Exacto de la Agencia Shalom *
                        </label>
                        <input
                          type="text"
                          name="agenciaShalom"
                          value={formData.agenciaShalom}
                          onChange={handleInputChange}
                          placeholder="Ej: Shalom Huancayo Centro"
                          className={`w-full px-4 py-3 border ${errors.agenciaShalom ? 'border-red-500' : 'border-lorie-beige'} rounded-xl focus:outline-none focus:ring-2 focus:ring-lorie-rose/30 text-sm`}
                        />
                        {errors.agenciaShalom && <p className="text-red-500 text-xs mt-1">{errors.agenciaShalom}</p>}
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Políticas */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="policies"
                        checked={acceptedPolicies}
                        onChange={(e) => setAcceptedPolicies(e.target.checked)}
                        className="mt-1 w-5 h-5 text-lorie-rose border-lorie-beige rounded focus:ring-lorie-rose/30 cursor-pointer"
                      />
                      <label htmlFor="policies" className="text-sm text-lorie-brown cursor-pointer flex-1">
                        He leído y acepto las{' '}
                        <button
                          type="button"
                          onClick={() => setShowPolicies(!showPolicies)}
                          className="text-lorie-rose font-medium hover:underline"
                        >
                          políticas de envío y cambios
                        </button>
                      </label>
                    </div>
                    {errors.policies && <p className="text-red-500 text-xs">{errors.policies}</p>}

                    {showPolicies && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-lorie-cream/30 rounded-xl p-4 text-sm text-lorie-brown space-y-3"
                      >
                        <div>
                          <h4 className="font-semibold text-lorie-dark mb-1">Envíos:</h4>
                          <ul className="list-disc list-inside space-y-1 text-xs">
                            <li>No realizamos envíos internacionales</li>
                            <li>Solo despachamos dentro del Perú</li>
                            <li>Lima: Envío motorizado con tarifa plana de S/ 10</li>
                            <li>Provincia: A través de Shalom (costo a coordinar)</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-lorie-dark mb-1">Cambios y Devoluciones:</h4>
                          <ul className="list-disc list-inside space-y-1 text-xs">
                            <li>Aceptamos cambios solo si el producto está sin uso</li>
                            <li>Debe conservar etiquetas y empaque original</li>
                            <li>No se aceptan cambios por productos usados o deteriorados</li>
                            <li>El producto no debe tener manchas, daños o alteraciones</li>
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Botón de Pago */}
                <button
                  type="submit"
                  className="w-full py-4 text-white rounded-full font-sans font-semibold text-base transition-all duration-300 cursor-pointer whitespace-nowrap hover:opacity-90 shadow-lg flex items-center justify-center space-x-2"
                  style={{ backgroundColor: 'rgb(185, 150, 128)' }}
                >
                  <i className="ri-secure-payment-line text-xl"></i>
                  <span>Pagar con Izipay</span>
                </button>
              </form>
            </motion.div>

            {/* Resumen de Compra - Lado Derecho */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:sticky lg:top-32 h-fit"
            >
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="font-serif text-2xl font-semibold text-lorie-dark mb-6 uppercase">
                  Resumen de Compra
                </h2>

                {/* Productos */}
                <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-lorie-beige last:border-0">
                      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                        <img
                          src={item.imagen}
                          alt={item.nombre}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center bg-lorie-rose text-white text-xs font-bold rounded-full">
                          {item.cantidad}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-lorie-dark line-clamp-2">
                          {item.nombre}
                        </h3>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-lorie-brown">
                            S/ {(item.precioOferta || item.precio).toFixed(2)} c/u
                          </span>
                          <span className="text-sm font-bold text-lorie-dark">
                            S/ {((item.precioOferta || item.precio) * item.cantidad).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totales */}
                <div className="space-y-3 border-t border-lorie-beige pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-lorie-brown">Subtotal</span>
                    <span className="font-medium text-lorie-dark">S/ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-lorie-brown">Costo de Envío</span>
                    <span className="font-medium text-lorie-dark">
                      {formData.tipoEnvio === 'motorizado' ? `S/ ${costoEnvio.toFixed(2)}` : 'A coordinar'}
                    </span>
                  </div>
                  <div className="flex justify-between text-xl font-bold border-t border-lorie-beige pt-3">
                    <span className="text-lorie-dark">Total</span>
                    <span style={{ color: 'rgb(185, 150, 128)' }}>
                      S/ {total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Izipay Badge */}
                <div className="mt-6 pt-6 border-t border-lorie-beige">
                  <div className="flex items-center justify-center gap-2 text-sm text-lorie-brown/70 mb-3">
                    <i className="ri-shield-check-line text-green-500"></i>
                    <span>Pago seguro con</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-md">
                      <span className="text-white font-bold text-xl tracking-wide">IZIPAY</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-center gap-3">
                    <i className="ri-bank-card-line text-2xl text-lorie-brown/50"></i>
                    <i className="ri-mastercard-line text-2xl text-lorie-brown/50"></i>
                    <i className="ri-visa-line text-2xl text-lorie-brown/50"></i>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
