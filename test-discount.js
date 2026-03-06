// Script to test the /api/descuento/validar endpoint
async function testDiscountValidation() {
    try {
        console.log("----------------------------------------");
        console.log("Probando API de Validación de Descuento");
        console.log("----------------------------------------");

        // El código actual predeterminado en el admin es 'MUJER50'
        const payload = {
            codigo: "MUJER50",
            subtotal: 100 // Usamos 100 para hacer fácil la cuenta (esperamos 50 de descuento si es 50%)
        };

        console.log(`Enviando Payload: ${JSON.stringify(payload)}`);

        // Llamamos a la API local
        const res = await fetch("http://localhost:3000/api/descuento/validar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        console.log(`\nEstado HTTP: ${res.status}`);
        console.log("Respuesta:");
        console.log(JSON.stringify(data, null, 2));

        if (data.valido && data.monto === 50) {
            console.log("\n✅ ¡ÉXITO! El descuento dinámico (50%) funciona correctamente.");
            console.log("----------------------------------------");
        } else {
            console.error("\n❌ ERROR: La respuesta no es la esperada o el código no es válido.");
            console.log("Asegúrate de que 'MUJER50' está activo en http://localhost:3000/admin/descuentos");
            console.log("----------------------------------------");
        }
    } catch (e) {
        console.error("Excepción durante la prueba:", e);
    }
}

testDiscountValidation();
