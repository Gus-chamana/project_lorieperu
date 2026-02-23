// Layout dedicado para la confirmación de pedido.
// SIN Navbar ni Footer globales — página de "Thank You" debe estar libre de distracciones.
// La vista ConfirmacionPage ya incluye su propio Navbar simplificado si es necesario.
export default function ConfirmacionLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
