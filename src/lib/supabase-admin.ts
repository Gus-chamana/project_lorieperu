import { createClient } from '@supabase/supabase-js';

// Servidor-solo: Cliente de Supabase con poderes Service Role para omitir RLS
// Se debe usar SOLO EN EL BACKEND (Rutas de API o Server Actions)
export const createAdminClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseServiceKey) {
        // No usar fallback silencioso: el anon key NO puede hacer UPDATE/INSERT si RLS está activo
        throw new Error('SUPABASE_SERVICE_ROLE_KEY no está configurado en las variables de entorno de Vercel. Ve a Vercel → Settings → Environment Variables y agrégalo.');
    }

    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: { persistSession: false },
        // CRÍTICO: Next.js 14 cachea las llamadas fetch internas del SDK de Supabase.
        // Sin este override, las consultas SELECT devuelven datos obsoletos después de un UPDATE.
        global: {
            fetch: (url: RequestInfo | URL, options?: RequestInit) =>
                fetch(url, { ...options, cache: 'no-store' })
        }
    });
};
