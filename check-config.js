import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import http from 'http';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkConfig() {
    const { data } = await supabase
        .from('configuracion_tienda')
        .select('*')
        .eq('llave', 'promo_banner')
        .single();

    console.log("ACTUAL DB CONFIG:", JSON.stringify(data?.valor));

    if (data && data.valor) {
        // Prueba con el código de la BD
        const payload = JSON.stringify({
            codigo: data.valor.codigo_cupon || "CUPÓN",
            subtotal: 100
        });

        const req = http.request({
            hostname: 'localhost',
            port: 3000,
            path: '/api/descuento/validar',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': payload.length
            }
        }, (res) => {
            let responseData = '';
            res.on('data', chunk => responseData += chunk);
            res.on('end', () => {
                console.log("=== RESPUESTA LOCAL API ===");
                console.log(responseData);
                // Expected format: {"valido":true,"monto":80,"tipo":"PORCENTAJE","valor":80,"codigo_id":null}
            });
        });

        req.write(payload);
        req.end();
    }
}

checkConfig();
