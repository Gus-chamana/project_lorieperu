interface CheckoutStepsProps {
    paso: 1 | 2 | 3 | 4; // 1=Carrito, 2=Pedido, 3=Pago, 4=Confirmación
}

const pasos = [
    { num: 1, label: 'Carrito', icon: 'ri-shopping-cart-2-line' },
    { num: 2, label: 'Pedido', icon: 'ri-file-list-3-line' },
    { num: 3, label: 'Pago', icon: 'ri-secure-payment-line' },
    { num: 4, label: 'Confirmación', icon: 'ri-checkbox-circle-line' },
];

export default function CheckoutSteps({ paso }: CheckoutStepsProps) {
    return (
        <div className="w-full max-w-2xl mx-auto mb-8 px-2 sm:px-0">
            <div className="flex items-center justify-between w-full">
                {pasos.map((p, idx) => {
                    const activo = p.num === paso;
                    const completado = p.num < paso;

                    return (
                        <div key={p.num} className="flex items-center flex-1 last:flex-none">
                            {/* Paso */}
                            <div className="flex flex-col items-center min-w-0">
                                <div
                                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 flex-shrink-0 ${completado
                                        ? 'bg-lorie-brown text-white'
                                        : activo
                                            ? 'bg-lorie-rose text-white shadow-md shadow-lorie-rose/30'
                                            : 'bg-lorie-beige text-lorie-brown/40 border border-lorie-beige'
                                        }`}
                                >
                                    {completado ? (
                                        <i className="ri-check-line text-base" />
                                    ) : (
                                        <i className={`${p.icon} text-base`} />
                                    )}
                                </div>
                                <span
                                    className={`text-[10px] sm:text-xs font-sans mt-1.5 font-medium text-center ${activo
                                        ? 'text-lorie-rose'
                                        : completado
                                            ? 'text-lorie-brown'
                                            : 'text-lorie-brown/30'
                                        }`}
                                >
                                    {p.label}
                                </span>
                            </div>

                            {/* Línea conectora */}
                            {idx < pasos.length - 1 && (
                                <div
                                    className={`flex-1 h-px min-w-[16px] sm:min-w-[24px] mx-1 sm:mx-2 mb-5 transition-all duration-300 ${completado ? 'bg-lorie-brown' : 'bg-lorie-beige'
                                        }`}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
