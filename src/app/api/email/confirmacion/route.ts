import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// El transportador de Gmail – configurado con las variables de entorno del servidor
// NUNCA se expone al cliente, 100% backend
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,       // Tu correo Gmail, ej: lorieperu@gmail.com
        pass: process.env.GMAIL_APP_PASSWORD, // Contraseña de Aplicación de 16 dígitos (NO tu contraseña normal)
    },
});

interface EmailPayload {
    email: string;
    nombre_completo: string;
    numero_pedido: string;
    productos: Array<{
        nombre: string;
        cantidad: number;
        precio_unitario: number;
        subtotal_linea: number;
    }>;
    subtotal: number;
    monto_descuento?: number;
    costo_envio: number;
    total: number;
    direccion: string;
    distrito: string;
    tipo_envio: string;
    celular: string;
    nombre_agencia?: string;
    referencia?: string;
}

// Genera el HTML Premium del correo de confirmación con branding Lorie Perú
function buildEmailHtml(d: EmailPayload): string {
    const productosHtml = d.productos
        .map(
            (p) => `
        <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #f0e9e3; font-family: Arial, sans-serif; font-size: 14px; color: #5c4033;">
                ${p.nombre} <span style="color: #9e7a6a;">x${p.cantidad}</span>
            </td>
            <td style="padding: 12px 0; border-bottom: 1px solid #f0e9e3; font-family: Arial, sans-serif; font-size: 14px; color: #5c4033; text-align: right; font-weight: bold;">
                S/ ${p.subtotal_linea.toFixed(2)}
            </td>
        </tr>`
        )
        .join('');

    const agenciaHtml = d.nombre_agencia
        ? `<tr><td style="padding: 4px 0; font-size: 13px; color: #7d5a4f;"><strong>Agencia Shalom:</strong> ${d.nombre_agencia}</td></tr>`
        : '';

    const referenciaHtml = d.referencia
        ? `<tr><td style="padding: 4px 0; font-size: 13px; color: #7d5a4f;"><strong>Referencia:</strong> ${d.referencia}</td></tr>`
        : '';

    const descuentoHtml = d.monto_descuento && d.monto_descuento > 0
        ? `<tr>
            <td style="padding: 4px 0; font-size: 13px; color: #27ae60;">Descuento aplicado:</td>
            <td style="padding: 4px 0; font-size: 13px; color: #27ae60; text-align: right; font-weight: bold;">- S/ ${d.monto_descuento.toFixed(2)}</td>
           </tr>`
        : '';

    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8" />
        <title>Confirmación de Pedido – Lorie Perú</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #fdf6f0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fdf6f0; padding: 40px 20px;">
            <tr>
                <td align="center">
                    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.07);">

                        <!-- Header con branding Lorie Perú -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #c4a38c 0%, #a67c7c 100%); padding: 40px 40px 30px; text-align: center;">
                                <style>
                                  @font-face {
                                    font-family: 'Aston';
                                    src: url('https://www.lorieperu.com/fonts/Aston-Script.woff2') format('woff2');
                                    font-weight: normal;
                                    font-style: normal;
                                  }
                                </style>
                                <h1 style="margin: 0; color: #ffffff; font-family: 'Aston', 'Parisienne', Georgia, cursive; font-size: 56px; font-weight: normal; letter-spacing: normal;">LORIE PERÚ</h1>
                                <p style="margin: 8px 0 0; color: rgba(255,255,255,0.85); font-size: 13px; letter-spacing: 1px;">Confeccionamos lo que imaginas</p>
                            </td>
                        </tr>

                        <!-- Banner de éxito -->
                        <tr>
                            <td style="background-color: #f0faf4; padding: 20px 40px; text-align: center; border-bottom: 1px solid #e8f5ee;">
                                <p style="margin: 0; font-size: 16px; color: #27ae60; font-weight: bold; font-family: Arial, sans-serif;">
                                    ✅ ¡Tu pedido y pago han sido confirmados exitosamente!
                                </p>
                            </td>
                        </tr>

                        <!-- Cuerpo principal -->
                        <tr>
                            <td style="padding: 36px 40px;">
                                <p style="margin: 0 0 24px; font-size: 15px; color: #5c4033; line-height: 1.7; font-family: Arial, sans-serif;">
                                    Hola <strong>${d.nombre_completo}</strong> 🌸<br/><br/>
                                    Hemos recibido y confirmado tu pedido exitosamente. A continuación te compartimos el resumen completo de tu compra.
                                </p>

                                <!-- Número de pedido destacado -->
                                <div style="background-color: #fdf0e8; border-radius: 12px; padding: 18px 24px; margin-bottom: 32px; text-align: center;">
                                    <p style="margin: 0 0 4px; font-size: 11px; color: #9e7a6a; text-transform: uppercase; letter-spacing: 1.5px; font-family: Arial, sans-serif;">Número de Pedido</p>
                                    <p style="margin: 0; font-size: 24px; font-weight: bold; color: #5c4033; font-family: monospace; letter-spacing: 2px;">${d.numero_pedido.toUpperCase()}</p>
                                </div>

                                <!-- Resumen de productos -->
                                <h2 style="margin: 0 0 16px; font-family: Georgia, serif; font-size: 17px; color: #3d2b1f; border-bottom: 2px solid #f0e9e3; padding-bottom: 10px;">
                                    Resumen de tu Pedido
                                </h2>
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    ${productosHtml}
                                </table>

                                <!-- Totales -->
                                <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 20px; border-top: 2px solid #f0e9e3; padding-top: 16px;">
                                    <tr>
                                        <td style="padding: 5px 0; font-family: Arial, sans-serif; font-size: 13px; color: #7d5a4f;">Subtotal:</td>
                                        <td style="padding: 5px 0; font-family: Arial, sans-serif; font-size: 13px; color: #7d5a4f; text-align: right;">S/ ${d.subtotal.toFixed(2)}</td>
                                    </tr>
                                    ${descuentoHtml}
                                    <tr>
                                        <td style="padding: 5px 0; font-family: Arial, sans-serif; font-size: 13px; color: #7d5a4f;">Envío:</td>
                                        <td style="padding: 5px 0; font-family: Arial, sans-serif; font-size: 13px; color: #7d5a4f; text-align: right;">
                                            ${d.costo_envio > 0 ? `S/ ${d.costo_envio.toFixed(2)}` : 'A coordinar'}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 14px 0 0; font-family: Georgia, serif; font-size: 18px; font-weight: bold; color: #3d2b1f;">TOTAL PAGADO:</td>
                                        <td style="padding: 14px 0 0; font-family: Georgia, serif; font-size: 18px; font-weight: bold; color: #a67c7c; text-align: right;">S/ ${d.total.toFixed(2)}</td>
                                    </tr>
                                </table>

                                <hr style="border: none; border-top: 1px solid #f0e9e3; margin: 32px 0;" />

                                <!-- Datos de envío -->
                                <h2 style="margin: 0 0 16px; font-family: Georgia, serif; font-size: 17px; color: #3d2b1f;">Dirección de Envío</h2>
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr><td style="padding: 5px 0; font-size: 13px; color: #7d5a4f; font-family: Arial, sans-serif;"><strong>Nombre:</strong> ${d.nombre_completo}</td></tr>
                                    <tr><td style="padding: 5px 0; font-size: 13px; color: #7d5a4f; font-family: Arial, sans-serif;"><strong>Celular:</strong> +51 ${d.celular}</td></tr>
                                    <tr><td style="padding: 5px 0; font-size: 13px; color: #7d5a4f; font-family: Arial, sans-serif;"><strong>Distrito:</strong> ${d.distrito}</td></tr>
                                    <tr><td style="padding: 5px 0; font-size: 13px; color: #7d5a4f; font-family: Arial, sans-serif;"><strong>Dirección:</strong> ${d.direccion}</td></tr>
                                    ${referenciaHtml}
                                    <tr><td style="padding: 5px 0; font-size: 13px; color: #7d5a4f; font-family: Arial, sans-serif;"><strong>Método de Envío:</strong> ${d.tipo_envio === 'LIMA_MOTORIZADO' ? 'Envío Motorizado Lima' : 'Envío a Provincia – Shalom'}</td></tr>
                                    ${agenciaHtml}
                                </table>

                                <hr style="border: none; border-top: 1px solid #f0e9e3; margin: 32px 0;" />

                                <!-- Aviso de comunicación -->
                                <div style="background-color: #fff8f5; border-left: 4px solid #c4a38c; border-radius: 8px; padding: 18px 20px; margin-bottom: 16px;">
                                    <p style="margin: 0; font-size: 13px; color: #7d5a4f; line-height: 1.7; font-family: Arial, sans-serif;">
                                        📧 Te mantendremos al tanto del estado de tu pedido y envío de forma obligatoria a través de este correo electrónico o al número de WhatsApp <strong>+51 ${d.celular}</strong> que registraste en tu compra.
                                    </p>
                                </div>

                                <p style="margin: 16px 0 0; font-size: 13px; color: #9e7a6a; text-align: center; font-family: Arial, sans-serif; line-height: 1.7;">
                                    ¿Tienes alguna consulta? Escríbenos por WhatsApp:<br/>
                                    <a href="https://wa.me/51957026753?text=Hola%20Lorie%20Per%C3%BA%2C%20tengo%20una%20consulta%20sobre%20el%20pedido%20${d.numero_pedido}" 
                                       style="color: #27ae60; font-weight: bold; text-decoration: none; font-size: 14px;">
                                        📱 +51 957 026 753
                                    </a>
                                </p>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #fdf0e8; padding: 24px 40px; text-align: center; border-top: 1px solid #f0e9e3;">
                                <p style="margin: 0 0 6px; font-family: Georgia, serif; font-size: 15px; color: #a67c7c; letter-spacing: 2px;">LORIE PERÚ</p>
                                <p style="margin: 0; font-size: 12px; color: #bfa99a; font-family: Arial, sans-serif;">❤️ Gracias por confiar en nosotras. ¡Espera cosas hermosas en tu puerta!</p>
                            </td>
                        </tr>

                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>`;
}

export async function POST(req: Request) {
    try {
        // Validar que las credenciales de Gmail estén configuradas
        if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
            console.error('FATAL: Credenciales de Gmail no configuradas (GMAIL_USER / GMAIL_APP_PASSWORD)');
            return NextResponse.json({ error: 'Error de configuración del servidor de correo' }, { status: 500 });
        }

        const body: EmailPayload = await req.json();

        if (!body.email) {
            return NextResponse.json({ error: 'Email de destino requerido' }, { status: 400 });
        }

        // Enviar correo vía Gmail SMTP
        await transporter.sendMail({
            from: `"Lorie Perú 🌸" <${process.env.GMAIL_USER}>`,
            to: body.email,
            subject: `✅ Tu pedido ${body.numero_pedido.toUpperCase()} en Lorie Perú ha sido confirmado`,
            html: buildEmailHtml(body),
        });

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (e) {
        console.error('Error al enviar correo Gmail:', e);
        return NextResponse.json({ error: 'Error interno al enviar el correo' }, { status: 500 });
    }
}
