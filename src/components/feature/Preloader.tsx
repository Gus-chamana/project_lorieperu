'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Al cambiar la ruta (o al cargar por primera vez), mostramos el preloader
    setIsLoading(true);
    setIsFading(false);
    
    const finishLoading = () => {
      setIsFading(true);
      // Esperamos el tiempo de la transición CSS antes de quitar el elemento del DOM
      setTimeout(() => {
        setIsLoading(false);
      }, 500); 
    };

    if (pathname === '/' || pathname === '/curso') {
      // === RUTAS CON VIDEO PRINCIPAL ===
      // Esperamos específicamente a que el video empiece a reproducirse
      const handleVideoReady = () => {
        finishLoading();
      };
      
      window.addEventListener('page-video-ready', handleVideoReady);
      
      // Fallback: por si el video falla, se bloquea el autoplay por el navegador (Ahorro de batería), etc.
      // 5 segundos máximo de espera.
      const fallback = setTimeout(finishLoading, 5000);
      
      return () => {
        window.removeEventListener('page-video-ready', handleVideoReady);
        clearTimeout(fallback);
      };
    } else {
      // === OTRAS RUTAS ===
      // Verificamos si es la carga inicial "dura" del navegador
      if (document.readyState !== 'complete') {
        window.addEventListener('load', finishLoading);
        const fallback = setTimeout(finishLoading, 5000);
        
        return () => {
          window.removeEventListener('load', finishLoading);
          clearTimeout(fallback);
        };
      } else {
        // Navegación en el cliente (Next.js Link o Push)
        // Agregamos un delay elegante para mostrar la animación antes de revelar la página
        const timer = setTimeout(finishLoading, 600);
        return () => clearTimeout(timer);
      }
    }
  }, [pathname]); // Se vuelve a ejecutar cada vez que cambia el pathname

  if (!isLoading) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-lorie-cream transition-opacity duration-500 ease-in-out ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="relative flex flex-col items-center animate-pulse-slow">
        <Image 
          src="/LOGO_LORIE_OFICIAL-SinFondo.png" 
          alt="Lorie Perú Cargando..." 
          width={220} 
          height={220} 
          priority
          className="object-contain"
        />
        {/* Barra de progreso sutil y elegante */}
        <div className="mt-8 w-16 h-[2px] bg-lorie-beige overflow-hidden rounded-full">
          <div className="w-full h-full bg-lorie-brown animate-loading-bar"></div>
        </div>
      </div>
    </div>
  );
}
