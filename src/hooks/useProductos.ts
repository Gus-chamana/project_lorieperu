import { useState, useEffect } from 'react';
import type { ProductoFrontend } from '@/types/producto';

interface UseProductosOptions {
    destacados?: boolean;
    filtro?: 'nuevas' | 'ofertas' | null;
}

interface UseProductosResult {
    productos: ProductoFrontend[];
    cargando: boolean;
    error: string | null;
}

export function useProductos(options: UseProductosOptions = {}): UseProductosResult {
    const [productos, setProductos] = useState<ProductoFrontend[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelado = false;

        async function fetchProductos() {
            setCargando(true);
            setError(null);

            const params = new URLSearchParams();
            if (options.destacados) params.set('destacados', 'true');
            if (options.filtro) params.set('filtro', options.filtro);

            try {
                const res = await fetch(`/api/productos?${params.toString()}`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data: ProductoFrontend[] = await res.json();
                if (!cancelado) setProductos(data);
            } catch (err) {
                console.error('[useProductos] Error fetching products:', err);
                if (!cancelado) setError('No se pudieron cargar los productos');
            } finally {
                if (!cancelado) setCargando(false);
            }
        }

        fetchProductos();

        return () => { cancelado = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [options.destacados, options.filtro]);

    return { productos, cargando, error };
}
