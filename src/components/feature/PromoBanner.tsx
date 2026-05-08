import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// Global visibility state shared across all PromoBanner instances
let globalIsVisible = false;
type VisibilityListener = (v: boolean) => void;
const listeners: VisibilityListener[] = [];

/**
 * Updates the global visibility flag and notifies all registered listeners.
 * Includes a safety guard to avoid notifying listeners that might have been
 * removed during notification (e.g., if a component unmounts while this runs).
 */
function setGlobalVisible(v: boolean) {
  globalIsVisible = v;
  // Copy the array to prevent mutation issues during iteration
  const currentListeners = [...listeners];
  currentListeners.forEach((fn) => {
    try {
      fn(v);
    } catch (err) {
      console.error('PromoBanner listener error:', err);
    }
  });
}

/**
 * Hook that returns the current global visibility of the promo banner.
 * It stays in sync with any changes made via `setGlobalVisible`.
 */
export function usePromoBannerState() {
  const [visible, setVisible] = useState(globalIsVisible);

  useEffect(() => {
    // Register listener
    listeners.push(setVisible);

    // Cleanup on unmount
    return () => {
      const idx = listeners.indexOf(setVisible);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, []);

  return visible;
}

export const PROMO_HEIGHT = 36;

/**
 * PromoBanner component.
 * Displays a dismissible banner. Its visibility is also reflected in the
 * global state so that other parts of the app can react to the banner being
 * closed.
 */
export default function PromoBanner() {
  // Local state mirrors the global state on initial render
  const [isVisible, setIsVisible] = useState(globalIsVisible);
  const [config, setConfig] = useState({
    texto_principal: "Cargando promociones...",
    descuento_porcentaje: "",
    codigo_cupon: "",
    activo: false,
    color_fondo: "#1f2937",
    color_texto_cupon: "#fde047"
  });
  const [loaded, setLoaded] = useState(false);

  // Keep local state in sync with global changes (e.g., if another component
  // closes the banner)
  useEffect(() => {
    const sync = (v: boolean) => setIsVisible(v);
    listeners.push(sync);

    const fetchConfig = async () => {
      try {
        const { data, error } = await supabase
          .from("configuracion_tienda")
          .select("valor")
          .eq("llave", "promo_banner")
          .single();

        if (data && data.valor && data.valor.activo) {
          const value = data.valor;
          const now = new Date();
          let esValidoPorFecha = true;
          
          if (value.fecha_inicio && new Date(value.fecha_inicio) > now) {
              esValidoPorFecha = false;
          }
          if (value.fecha_fin && new Date(value.fecha_fin) < now) {
              esValidoPorFecha = false;
          }

          if (esValidoPorFecha) {
            setConfig(value);
            setLoaded(true);
            setGlobalVisible(true);
            setIsVisible(true);
          } else {
            setGlobalVisible(false);
            setIsVisible(false);
          }
        } else {
          // If not active in DB, hide it
          setGlobalVisible(false);
          setIsVisible(false);
        }
      } catch (e) {
        // Fallback or hide
        setGlobalVisible(false);
        setIsVisible(false);
      }
    };

    fetchConfig();

    return () => {
      const idx = listeners.indexOf(sync);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setGlobalVisible(false);
  };

  // Do not render anything when the banner is hidden or not loaded
  if (!isVisible || !loaded) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] text-white px-4 shadow-md flex items-center justify-center transition-colors duration-500"
      style={{ height: `${PROMO_HEIGHT}px`, backgroundColor: config.color_fondo || '#1f2937' }}
      role="region"
      aria-label="Promotional banner"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center relative w-full">
        <div className="flex items-center justify-center gap-2 text-center">
          <i className="ri-gift-line text-sm hidden sm:block" aria-hidden="true"></i>
          <p className="text-xs font-medium tracking-wide">
            <span className="font-semibold">{config.texto_principal}</span>
            {config.descuento_porcentaje && ` con ${config.descuento_porcentaje}% de descuento usando el código `}
            {config.codigo_cupon && (
              <span className="inline-block px-2 py-0.5 bg-white/20 rounded font-bold mx-1 text-xs uppercase transition-colors duration-500" style={{ color: config.color_texto_cupon || '#fde047' }}>
                {config.codigo_cupon}
              </span>
            )}
          </p>
          <i className="ri-gift-line text-sm hidden sm:block" aria-hidden="true"></i>
        </div>

        <button
          onClick={handleClose}
          className="absolute right-0 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors duration-300 cursor-pointer"
          aria-label="Cerrar banner"
        >
          <i className="ri-close-line text-sm" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  );
}
