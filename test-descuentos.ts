import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseKey) throw new Error("Missing keys");

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDescuento() {
    console.log("Checking configuracion_tienda table...");
    const { data: configData, error: configError } = await supabase
        .from('configuracion_tienda')
        .select('*')
        .eq('llave', 'promo_banner')
        .single();

    console.log("Promo Banner config:", configData);
    if (configError) console.error("Error:", configError);

    console.log("\nChecking codigos_descuento table...");
    const { data, error } = await supabase
        .from('codigos_descuento')
        .select('*');

    console.log("Codigos descuento count:", data?.length);
    if (data && data.length > 0) console.log("First code:", data[0]);
    if (error) console.error("Error:", error);
}

checkDescuento();
