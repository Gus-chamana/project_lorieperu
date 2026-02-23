// Layout dedicado para el flujo de checkout.
// SIN Navbar ni Footer globales — la experiencia de checkout debe estar libre de distracciones.
// El componente PreCheckout ya incluye todo el contenido necesario.
export default function CheckoutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
