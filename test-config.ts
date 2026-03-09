import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) throw new Error("Missing keys");

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkT() {
    console.log("Checking configuracion_tienda...");
    const { data, error } = await supabase
        .from('configuracion_tienda')
        .select('*');

    console.log("Rows:", data);
    if (error) console.error("Error:", error);
}

checkT();
