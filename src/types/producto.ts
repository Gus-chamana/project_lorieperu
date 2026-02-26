// Tipo normalizado de Producto para el frontend.
// Mapea tanto los mocks como los datos de Supabase a una forma consistente.

export interface ProductoFrontend {
    id: string;               // UUID de Supabase
    nombre: string;
    descripcion: string;
    caracteristicas?: string; // Nuevo campo agregado para el carrito
    precio: number;
    precioOferta: number | null;
    imagenes: string[];       // Array de URLs (aplanado de producto_imagenes)
    stock: number;
    nuevo: boolean;
    agotado: boolean;
    requiere_medida?: boolean;
}
