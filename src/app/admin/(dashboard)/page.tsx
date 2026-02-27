export default function AdminDashboard() {
    return (
        <div className="p-8 pt-20 md:pt-8 w-full max-w-7xl mx-auto space-y-8">
            <header>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-lorie-dark mb-2">
                    Resumen General
                </h1>
                <p className="font-sans text-lorie-brown/70 text-base">
                    Bienvenido al panel de administración de Lorie Perú.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Placeholder cards para métricas rápidas */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-lorie-beige">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-lorie-cream flex items-center justify-center text-iloris-brown">
                            <i className="ri-shopping-bag-3-line text-2xl text-[#BB9B8A]"></i>
                        </div>
                        <div>
                            <p className="font-sans text-sm text-lorie-brown/70 font-medium">Gestión Rápida</p>
                            <h3 className="font-serif text-xl font-bold text-lorie-dark">Productos</h3>
                        </div>
                    </div>
                    <p className="text-sm font-sans text-lorie-brown/80 mb-4">Actualiza stock, agrega fotos y promociones al instante.</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-lorie-beige">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-lorie-cream flex items-center justify-center text-iloris-brown">
                            <i className="ri-file-list-3-line text-2xl text-[#BB9B8A]"></i>
                        </div>
                        <div>
                            <p className="font-sans text-sm text-lorie-brown/70 font-medium">Control Total</p>
                            <h3 className="font-serif text-xl font-bold text-lorie-dark">Órdenes</h3>
                        </div>
                    </div>
                    <p className="text-sm font-sans text-lorie-brown/80 mb-4">Visualiza las compras verificadas de tus clientes fácilmente.</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-lorie-beige">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-lorie-cream flex items-center justify-center text-iloris-brown">
                            <i className="ri-price-tag-3-line text-2xl text-[#BB9B8A]"></i>
                        </div>
                        <div>
                            <p className="font-sans text-sm text-lorie-brown/70 font-medium">Promociones</p>
                            <h3 className="font-serif text-xl font-bold text-lorie-dark">Descuentos</h3>
                        </div>
                    </div>
                    <p className="text-sm font-sans text-lorie-brown/80 mb-4">Maneja el cintillo superior de anuncios interactivos.</p>
                </div>
            </div>
        </div>
    );
}
