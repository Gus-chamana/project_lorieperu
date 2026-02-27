import { createClient } from '@supabase/supabase-js';

// Servidor-solo: Cliente de Supabase con poderes Service Role para omitir RLS
// Se debe usar SOLO EN EL BACKEND (Rutas de API o Server Actions)
export const createAdminClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseServiceKey) {
        console.warn("⚠️ ADVERTENCIA DE SEGURIDAD: Falla al encontrar SUPABASE_SERVICE_ROLE_KEY en las variables de entorno. Usando clave anónima como respaldo. Si el RLS está activado en Supabase, las peticiones backend fallarán.");
        return createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    }

    return createClient(supabaseUrl, supabaseServiceKey);
};
