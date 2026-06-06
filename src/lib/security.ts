import { createAdminClient } from '@/lib/supabase-admin';

/* ─────────────────────────────────────────────────────────────────────
 * 1. ESCAPE HTML — Previene XSS al insertar datos del usuario en HTML
 * ───────────────────────────────────────────────────────────────────── */
export function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/* ─────────────────────────────────────────────────────────────────────
 * 2. VERIFICAR SESIÓN ADMIN — Valida que la cookie corresponda a un
 *    admin real en la BD, no solo que la cookie exista.
 * ───────────────────────────────────────────────────────────────────── */
export async function verifyAdminSession(cookieValue: string | undefined): Promise<boolean> {
    if (!cookieValue) return false;

    try {
        const adminSupabase = createAdminClient();
        const { data, error } = await adminSupabase
            .from('admin_users')
            .select('id')
            .eq('id', cookieValue)
            .single();

        return !error && !!data;
    } catch {
        return false;
    }
}

/* ─────────────────────────────────────────────────────────────────────
 * 3. RATE LIMITER — Limita la cantidad de peticiones por IP en una
 *    ventana de tiempo. Usa un Map en memoria con limpieza automática.
 *
 *    Nota: En Vercel serverless, cada instancia tiene su propio Map,
 *    lo que reduce la efectividad entre instancias. Para producción
 *    a gran escala, se recomienda @upstash/ratelimit con Redis.
 *    Sin embargo, esto ya previene ataques simples y scripts.
 * ───────────────────────────────────────────────────────────────────── */

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Limpieza automática cada 5 minutos para prevenir memory leaks
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupExpiredEntries() {
    const now = Date.now();
    if (now - lastCleanup < CLEANUP_INTERVAL) return;
    lastCleanup = now;

    const keys = Array.from(rateLimitStore.keys());
    for (const key of keys) {
        const entry = rateLimitStore.get(key);
        if (entry && now > entry.resetAt) {
            rateLimitStore.delete(key);
        }
    }
}

/**
 * Verifica si una IP ha excedido el límite de peticiones.
 * 
 * @param identifier - Identificador único (generalmente IP + ruta)
 * @param maxRequests - Máximo de peticiones permitidas en la ventana
 * @param windowMs - Duración de la ventana en milisegundos
 * @returns true si la petición está permitida, false si excede el límite
 */
export function checkRateLimit(
    identifier: string,
    maxRequests: number,
    windowMs: number
): boolean {
    cleanupExpiredEntries();

    const now = Date.now();
    const entry = rateLimitStore.get(identifier);

    if (!entry || now > entry.resetAt) {
        // Primera petición o ventana expirada → reiniciar
        rateLimitStore.set(identifier, { count: 1, resetAt: now + windowMs });
        return true;
    }

    if (entry.count >= maxRequests) {
        return false; // Límite excedido
    }

    entry.count++;
    return true;
}

/**
 * Extrae la IP del cliente desde los headers del request.
 * Funciona en Vercel (x-forwarded-for) y desarrollo local.
 */
export function getClientIp(req: Request): string {
    const forwarded = req.headers.get('x-forwarded-for');
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }
    return req.headers.get('x-real-ip') || '127.0.0.1';
}
