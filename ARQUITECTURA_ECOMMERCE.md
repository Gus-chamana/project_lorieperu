# 🛍️ ARQUITECTURA E-COMMERCE – LORIE PERÚ

> **Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Supabase (PostgreSQL + Storage) · supabase-js
>
> ⚠️ **Regla:** Nunca modificar el diseño visual existente. Solo extender funcionalidad.

---

## FASE 1 – Base de Datos en Supabase

### 1.1 Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) → **New Project**
2. Elige nombre: `lorieperu-prod`
3. Región más cercana (ej. South America)
4. Guarda tu **Database Password** en un lugar seguro
5. Una vez creado, ve a **Settings → API**:
   - Copia `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - Copia `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

### 1.2 SQL – Creación de todas las tablas

Ve a **SQL Editor** en Supabase y ejecuta los siguientes bloques **en orden**:

#### BLOQUE 1 – Extensión UUID (ejecutar primero)
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

---

#### BLOQUE 2 – Tabla: clientes
```sql
CREATE TABLE clientes (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre_completo  TEXT NOT NULL,
  dni              TEXT NOT NULL,
  celular          TEXT NOT NULL,
  email            TEXT NOT NULL,
  creado_en        TIMESTAMPTZ DEFAULT NOW(),
  actualizado_en   TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE clientes IS 'Datos personales del comprador';
COMMENT ON COLUMN clientes.dni IS 'Documento Nacional de Identidad (8 dígitos)';
COMMENT ON COLUMN clientes.celular IS 'Número de celular peruano (9 dígitos, inicia en 9)';
```

---

#### BLOQUE 3 – Tabla: distritos
```sql
CREATE TABLE distritos (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre                TEXT NOT NULL,
  es_lima_metropolitana BOOLEAN NOT NULL DEFAULT FALSE,
  activo                BOOLEAN NOT NULL DEFAULT TRUE
);

COMMENT ON TABLE distritos IS 'Distritos de Perú. Los de Lima Metropolitana usan envío motorizado.';

-- ─────────────────────────────────────────────────────────────
-- DISTRITOS DE LIMA METROPOLITANA (envío motorizado S/ 10)
-- ─────────────────────────────────────────────────────────────
INSERT INTO distritos (nombre, es_lima_metropolitana) VALUES
  ('Ancón', true), ('Ate', true), ('Barranco', true),
  ('Breña', true), ('Carabayllo', true), ('Chaclacayo', true),
  ('Chorrillos', true), ('Cieneguilla', true), ('Comas', true),
  ('El Agustino', true), ('Independencia', true), ('Jesús María', true),
  ('La Molina', true), ('La Victoria', true), ('Lima (Cercado)', true),
  ('Lince', true), ('Los Olivos', true), ('Lurigancho-Chosica', true),
  ('Lurín', true), ('Magdalena del Mar', true), ('Miraflores', true),
  ('Pachacámac', true), ('Pucusana', true), ('Pueblo Libre', true),
  ('Puente Piedra', true), ('Punta Hermosa', true), ('Punta Negra', true),
  ('Rímac', true), ('San Bartolo', true), ('San Borja', true),
  ('San Isidro', true), ('San Juan de Lurigancho', true),
  ('San Juan de Miraflores', true), ('San Luis', true),
  ('San Martín de Porres', true), ('San Miguel', true),
  ('Santa Anita', true), ('Santa María del Mar', true),
  ('Santa Rosa', true), ('Santiago de Surco', true),
  ('Surquillo', true), ('Villa El Salvador', true),
  ('Villa María del Triunfo', true),
  -- Callao
  ('Bellavista', true), ('Callao', true), ('Carmen de La Legua', true),
  ('La Perla', true), ('La Punta', true), ('Mi Perú', true),
  ('Ventanilla', true);

-- ─────────────────────────────────────────────────────────────
-- PROVINCIAS (envío Shalom)
-- ─────────────────────────────────────────────────────────────
INSERT INTO distritos (nombre, es_lima_metropolitana) VALUES
  ('Arequipa', false), ('Cusco', false), ('Trujillo', false),
  ('Chiclayo', false), ('Piura', false), ('Iquitos', false),
  ('Huancayo', false), ('Tacna', false), ('Ica', false),
  ('Cajamarca', false), ('Puno', false), ('Ayacucho', false),
  ('Chimbote', false), ('Pucallpa', false), ('Tarapoto', false),
  ('Juliaca', false), ('Tumbes', false), ('Moquegua', false),
  ('Huaraz', false), ('Otro (provincia)', false);
```

---

#### BLOQUE 4 – Tabla: metodos_envio
```sql
CREATE TABLE metodos_envio (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre      TEXT NOT NULL,
  empresa     TEXT NOT NULL,
  precio      NUMERIC(10,2) NOT NULL DEFAULT 0,
  tipo_envio  TEXT NOT NULL CHECK (tipo_envio IN ('LIMA', 'PROVINCIA')),
  activo      BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO metodos_envio (nombre, empresa, precio, tipo_envio) VALUES
  ('Motorizado Lima',   'Guerreros', 10.00, 'LIMA'),
  ('Shalom Provincia',  'Shalom',     0.00, 'PROVINCIA');

COMMENT ON COLUMN metodos_envio.precio IS 'Para Shalom el precio se coordina con la agencia';
```

---

#### BLOQUE 5 – Tabla: direcciones
```sql
CREATE TABLE direcciones (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id       UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  distrito_id      UUID NOT NULL REFERENCES distritos(id),
  direccion        TEXT NOT NULL,
  referencia       TEXT,
  tipo_envio       TEXT NOT NULL CHECK (tipo_envio IN ('LIMA_MOTORIZADO', 'PROVINCIA_SHALOM')),
  nombre_agencia   TEXT,
  creado_en        TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON COLUMN direcciones.nombre_agencia IS 'Obligatorio si tipo_envio = PROVINCIA_SHALOM';
```

---

#### BLOQUE 6 – Tabla: productos
```sql
CREATE TABLE productos (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre       TEXT NOT NULL,
  descripcion  TEXT,
  precio       NUMERIC(10,2) NOT NULL,
  precio_oferta NUMERIC(10,2),
  stock        INTEGER NOT NULL DEFAULT 0,
  nuevo        BOOLEAN NOT NULL DEFAULT FALSE,
  agotado      BOOLEAN NOT NULL DEFAULT FALSE,
  activo       BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en    TIMESTAMPTZ DEFAULT NOW()
);
```

---

#### BLOQUE 7 – Tabla: producto_imagenes
```sql
CREATE TABLE producto_imagenes (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  producto_id  UUID NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  url_imagen   TEXT NOT NULL,
  orden        INTEGER NOT NULL DEFAULT 0,
  creado_en    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_producto_imagenes_producto ON producto_imagenes(producto_id, orden);

COMMENT ON TABLE producto_imagenes IS 'Cada producto tiene entre 2 y 3 imágenes almacenadas en Supabase Storage';
COMMENT ON COLUMN producto_imagenes.orden IS '0 = imagen principal, 1 = detalle, 2 = interior';
```

---

#### BLOQUE 8 – Tabla: codigos_descuento
```sql
CREATE TABLE codigos_descuento (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codigo           TEXT NOT NULL UNIQUE,
  tipo_descuento   TEXT NOT NULL CHECK (tipo_descuento IN ('PORCENTAJE', 'MONTO_FIJO')),
  valor            NUMERIC(10,2) NOT NULL,
  activo           BOOLEAN NOT NULL DEFAULT TRUE,
  fecha_expiracion TIMESTAMPTZ,
  usos_maximos     INTEGER,
  veces_usado      INTEGER NOT NULL DEFAULT 0,
  creado_en        TIMESTAMPTZ DEFAULT NOW()
);

-- Código de ejemplo para pruebas
INSERT INTO codigos_descuento (codigo, tipo_descuento, valor, activo, usos_maximos)
VALUES ('LORIE10', 'PORCENTAJE', 10, true, 100);

INSERT INTO codigos_descuento (codigo, tipo_descuento, valor, activo, fecha_expiracion)
VALUES ('VERANO5', 'MONTO_FIJO', 5, true, '2026-12-31');
```

---

#### BLOQUE 9 – Tabla: ordenes
```sql
CREATE TABLE ordenes (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id        UUID NOT NULL REFERENCES clientes(id),
  direccion_id      UUID NOT NULL REFERENCES direcciones(id),
  metodo_envio_id   UUID NOT NULL REFERENCES metodos_envio(id),
  codigo_descuento_id UUID REFERENCES codigos_descuento(id),
  subtotal          NUMERIC(10,2) NOT NULL,
  monto_descuento   NUMERIC(10,2) NOT NULL DEFAULT 0,
  costo_envio       NUMERIC(10,2) NOT NULL DEFAULT 0,
  total             NUMERIC(10,2) NOT NULL,
  estado            TEXT NOT NULL DEFAULT 'PENDIENTE'
                      CHECK (estado IN ('PENDIENTE','PAGADO','ENVIADO','ENTREGADO','CANCELADO')),
  estado_pago       TEXT NOT NULL DEFAULT 'PENDIENTE'
                      CHECK (estado_pago IN ('PENDIENTE','PAGADO','FALLIDO')),
  proveedor_pago    TEXT,
  creado_en         TIMESTAMPTZ DEFAULT NOW()
);
```

---

#### BLOQUE 10 – Tabla: orden_items
```sql
CREATE TABLE orden_items (
  id                       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  orden_id                 UUID NOT NULL REFERENCES ordenes(id) ON DELETE CASCADE,
  producto_id              UUID REFERENCES productos(id),
  nombre_producto_snapshot TEXT NOT NULL,
  precio_unitario_snapshot NUMERIC(10,2) NOT NULL,
  cantidad                 INTEGER NOT NULL DEFAULT 1,
  subtotal_linea           NUMERIC(10,2) NOT NULL
);
```

---

#### BLOQUE 11 – Row Level Security (RLS)
```sql
-- Activar RLS en tablas sensibles
ALTER TABLE clientes       ENABLE ROW LEVEL SECURITY;
ALTER TABLE ordenes        ENABLE ROW LEVEL SECURITY;
ALTER TABLE orden_items    ENABLE ROW LEVEL SECURITY;
ALTER TABLE direcciones    ENABLE ROW LEVEL SECURITY;

-- Políticas de inserción anónima (para el checkout)
CREATE POLICY "Inserción pública de clientes"
  ON clientes FOR INSERT WITH CHECK (true);

CREATE POLICY "Inserción pública de direcciones"
  ON direcciones FOR INSERT WITH CHECK (true);

CREATE POLICY "Inserción pública de ordenes"
  ON ordenes FOR INSERT WITH CHECK (true);

CREATE POLICY "Inserción pública de orden_items"
  ON orden_items FOR INSERT WITH CHECK (true);

-- Lectura pública de catálogo
ALTER TABLE productos        ENABLE ROW LEVEL SECURITY;
ALTER TABLE producto_imagenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE distritos        ENABLE ROW LEVEL SECURITY;
ALTER TABLE metodos_envio    ENABLE ROW LEVEL SECURITY;
ALTER TABLE codigos_descuento ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública de productos"
  ON productos FOR SELECT USING (activo = true);

CREATE POLICY "Lectura pública de imagenes"
  ON producto_imagenes FOR SELECT USING (true);

CREATE POLICY "Lectura pública de distritos"
  ON distritos FOR SELECT USING (activo = true);

CREATE POLICY "Lectura pública de metodos de envio"
  ON metodos_envio FOR SELECT USING (activo = true);

CREATE POLICY "Lectura pública de codigos descuento"
  ON codigos_descuento FOR SELECT USING (activo = true);
```

---

### 1.3 Supabase Storage – Imágenes de Productos

#### Paso a paso para crear el bucket:

1. En Supabase: **Storage → New Bucket**
2. Nombre: `productos`
3. Marcar **Public bucket** ✅
4. Clic en **Create**

#### Subir imágenes:

1. Entrar al bucket `productos`
2. **Upload files** → selecciona las fotos JPG/WebP de cada producto
3. Organiza por carpetas opcionales: `productos/cartera-lazo-clasico/`
4. Una vez subida, clic en el archivo → **Get URL** o **Copy URL**

#### La URL tendrá este formato:
```
https://TU_PROJECT.supabase.co/storage/v1/object/public/productos/cartera-lazo-clasico-1.jpg
```

#### Guardar URL en la tabla:
```sql
-- Primero crea el producto y obtén su ID
INSERT INTO productos (nombre, descripcion, precio, stock, nuevo)
VALUES ('Cartera Lazo Clásico', 'Tela drill premium • 25x18x8 cm', 45.00, 12, true)
RETURNING id;

-- Luego inserta las imágenes con ese ID
INSERT INTO producto_imagenes (producto_id, url_imagen, orden) VALUES
  ('UUID-DEL-PRODUCTO', 'https://...cartera-lazo-clasico-1.jpg', 0),
  ('UUID-DEL-PRODUCTO', 'https://...cartera-lazo-clasico-2.jpg', 1),
  ('UUID-DEL-PRODUCTO', 'https://...cartera-lazo-clasico-3.jpg', 2);
```

---

### ✅ FASE 1 – Completada

**Tablas creadas:** `clientes`, `distritos`, `metodos_envio`, `direcciones`, `productos`, `producto_imagenes`, `codigos_descuento`, `ordenes`, `orden_items`

**Datos sembrados:** 50+ distritos Lima + 20 provincias + 2 métodos de envío + 2 códigos de descuento de prueba

---

## FASE 2 – Conexión Next.js ↔ Supabase

### 2.1 Instalar dependencia

```bash
npm install @supabase/supabase-js
```

### 2.2 Variables de entorno

Crear archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://TU_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

> ⚠️ NUNCA subas `.env.local` a Git. Está en `.gitignore` por defecto en Next.js.

### 2.3 Archivo de conexión: `src/lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 2.4 Actualizar `next.config.mjs`

```js
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'static.readdy.ai' },
    ],
  },
};
```

### 2.5 Probar conexión

```typescript
// En cualquier Server Component o API route:
const { data, error } = await supabase.from('distritos').select('*').limit(5);
console.log(data, error);
```

---

## FASE 3 – Productos e Imágenes desde Supabase

### API Routes

#### `GET /api/productos` → `src/app/api/productos/route.ts`
```typescript
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  const { data, error } = await supabase
    .from('productos')
    .select(`*, producto_imagenes(url_imagen, orden)`)
    .eq('activo', true)
    .order('creado_en', { ascending: false });

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json(data);
}
```

#### `GET /api/distritos` → `src/app/api/distritos/route.ts`
```typescript
export async function GET() {
  const { data } = await supabase
    .from('distritos')
    .select('id, nombre, es_lima_metropolitana')
    .eq('activo', true)
    .order('nombre');
  return NextResponse.json(data);
}
```

#### `POST /api/descuento/validar` → `src/app/api/descuento/validar/route.ts`
```typescript
export async function POST(req: Request) {
  const { codigo, subtotal } = await req.json();

  const { data, error } = await supabase
    .from('codigos_descuento')
    .select('*')
    .eq('codigo', codigo.toUpperCase())
    .eq('activo', true)
    .single();

  if (error || !data) return NextResponse.json({ valido: false, error: 'Código no válido' });

  if (data.fecha_expiracion && new Date(data.fecha_expiracion) < new Date())
    return NextResponse.json({ valido: false, error: 'Código expirado' });

  if (data.usos_maximos && data.veces_usado >= data.usos_maximos)
    return NextResponse.json({ valido: false, error: 'Código agotado' });

  const monto = data.tipo_descuento === 'PORCENTAJE'
    ? (subtotal * data.valor) / 100
    : data.valor;

  return NextResponse.json({ valido: true, monto: parseFloat(monto.toFixed(2)), tipo: data.tipo_descuento, valor: data.valor });
}
```

#### `POST /api/ordenes` → `src/app/api/ordenes/route.ts`
```typescript
export async function POST(req: Request) {
  const body = await req.json();
  const { cliente, direccion, items, metodo_envio_id, subtotal, costo_envio, monto_descuento, total, codigo_descuento_id } = body;

  // 1. Crear cliente
  const { data: clienteCreado } = await supabase.from('clientes').insert(cliente).select().single();

  // 2. Crear dirección
  const { data: direccionCreada } = await supabase.from('direcciones')
    .insert({ ...direccion, cliente_id: clienteCreado.id }).select().single();

  // 3. Crear orden
  const { data: orden } = await supabase.from('ordenes').insert({
    cliente_id: clienteCreado.id,
    direccion_id: direccionCreada.id,
    metodo_envio_id,
    codigo_descuento_id,
    subtotal, costo_envio, monto_descuento, total
  }).select().single();

  // 4. Insertar items
  const ordenItems = items.map((item: any) => ({ ...item, orden_id: orden.id }));
  await supabase.from('orden_items').insert(ordenItems);

  // 5. Incrementar uso de código
  if (codigo_descuento_id) {
    await supabase.rpc('incrementar_uso_descuento', { codigo_id: codigo_descuento_id });
  }

  return NextResponse.json({ success: true, orden_id: orden.id });
}
```

---

## FASE 4 – Pre-Checkout UI

**Archivo:** `src/views/checkout/PreCheckout.tsx`

**Secciones:**
1. **Resumen del pedido** — imagen, nombre, precio, cantidad, subtotal, campo descuento, envío, TOTAL
2. **Datos del cliente** — nombre, DNI, celular, email, distrito (select dinámico), dirección, referencia
3. **Tipo de envío** — dinámico según distrito (Lima = motorizado S/10 | Provincia = Shalom + campo agencia)
4. **Política de cambios** — texto + checkbox obligatorio

**Ruta de acceso:** `/checkout` → `src/app/checkout/page.tsx`

---

## FASE 5 – Código de Descuento

**Flujo:**
1. Usuario escribe código → clic "Aplicar"
2. `POST /api/descuento/validar` con `{ codigo, subtotal }`
3. Si válido → mostrar monto descontado, recalcular total en tiempo real
4. Si inválido → mostrar mensaje de error

---

## FASE 6 – Validaciones y Flujo Final

| Validación | Regla |
|---|---|
| DNI | Exactamente 8 dígitos numéricos |
| Celular | 9 dígitos, debe iniciar en `9` |
| Email | Formato válido |
| Nombre completo | Mínimo 3 caracteres |
| Distrito | Obligatorio, del listado |
| Dirección | Mínimo 10 caracteres |
| Agencia Shalom | Obligatorio si tipo_envio = PROVINCIA |
| Checkbox política | Debe estar marcado |
| País | Solo Perú (bloqueado por lógica de distritos) |

**El botón "Proceder al Pago" se activa solo cuando:**
- Todos los campos están completos y válidos
- El checkbox de política está marcado
- Si es Provincia: el campo de agencia está completo

---

## Flujo Completo de Datos

```
[Carrito] → [/checkout]
   │
   ├─ Carga distritos desde Supabase
   ├─ Muestra resumen del carrito (imagen + items)
   ├─ Usuario llena formulario
   ├─ Selecciona distrito → calcula tipo de envío
   ├─ Aplica código de descuento (opcional)
   ├─ Recalcula total en tiempo real
   ├─ Marca checkbox de política
   └─ "Proceder al Pago" → POST /api/ordenes
         └─ Guarda: cliente + dirección + orden + items → Redirige a pasarela
```
