// ── Tipos para la base de datos de Supabase ──

export interface Distrito {
    id: string;
    nombre: string;
    es_lima_metropolitana: boolean;
    activo: boolean;
}

export interface MetodoEnvio {
    id: string;
    nombre: string;
    empresa: string;
    precio: number;
    tipo_envio: 'LIMA' | 'PROVINCIA';
    activo: boolean;
}

export interface ImagenProducto {
    id: string;
    producto_id: string;
    url_imagen: string;
    orden: number;
}

export interface Producto {
    id: string;
    nombre: string;
    descripcion: string;
    precio: number;
    precio_oferta: number | null;
    stock: number;
    nuevo: boolean;
    agotado: boolean;
    activo: boolean;
    creado_en: string;
    producto_imagenes: ImagenProducto[];
}

export interface CodigoDescuento {
    id: string;
    codigo: string;
    tipo_descuento: 'PORCENTAJE' | 'MONTO_FIJO';
    valor: number;
    activo: boolean;
    fecha_expiracion: string | null;
    usos_maximos: number | null;
    veces_usado: number;
}

export interface ValidacionDescuento {
    valido: boolean;
    monto?: number;
    tipo?: 'PORCENTAJE' | 'MONTO_FIJO';
    valor?: number;
    codigo_id?: string;
    error?: string;
}

// ── Tipos para el formulario de checkout ──

export interface FormularioCliente {
    nombre_completo: string;
    dni: string;
    celular: string;
    email: string;
}

export interface FormularioDireccion {
    distrito_id: string;
    direccion: string;
    referencia: string;
    tipo_envio: 'LIMA_MOTORIZADO' | 'PROVINCIA_SHALOM';
    nombre_agencia: string;
}

export interface ItemCarritoCheckout {
    producto_id: string;
    nombre_producto_snapshot: string;
    precio_unitario_snapshot: number;
    cantidad: number;
    subtotal_linea: number;
    imagen_url: string;
}

export interface PayloadOrden {
    cliente: FormularioCliente;
    direccion: FormularioDireccion;
    metodo_envio_id: string;
    codigo_descuento_id: string | null;
    items: ItemCarritoCheckout[];
    subtotal: number;
    monto_descuento: number;
    costo_envio: number;
    total: number;
}
