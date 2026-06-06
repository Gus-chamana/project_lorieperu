-- ============================================================
-- SCRIPT DE SEGURIDAD — Lorie Perú E-Commerce
-- ============================================================
-- Ejecutar este SQL en: Supabase → SQL Editor → New Query
-- IMPORTANTE: Ejecutar ANTES de desplegar los cambios de código.
-- ============================================================


-- ──────────────────────────────────────────────────────────────
-- 1. FUNCIÓN: Decrementar stock de un producto de forma atómica
--    Evita race conditions cuando dos pagos se confirman al
--    mismo tiempo. Todo ocurre en una sola operación de BD.
-- ──────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION decrementar_stock_producto(
    p_producto_id uuid,
    p_cantidad int
)
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_nuevo_stock int;
BEGIN
    UPDATE productos
    SET
        stock   = GREATEST(0, stock - p_cantidad),
        agotado = CASE WHEN (stock - p_cantidad) <= 0 THEN true ELSE agotado END
    WHERE id = p_producto_id
    RETURNING stock INTO v_nuevo_stock;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Producto % no encontrado', p_producto_id;
    END IF;

    RETURN v_nuevo_stock;
END;
$$;


-- ──────────────────────────────────────────────────────────────
-- 2. FUNCIÓN: Incrementar uso de un código de descuento de
--    forma atómica. Evita que un cupón se use más veces de las
--    permitidas cuando dos clientes lo aplican a la vez.
-- ──────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION incrementar_uso_cupon(
    p_codigo_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE codigos_descuento
    SET veces_usado = veces_usado + 1
    WHERE id = p_codigo_id;
END;
$$;


-- ──────────────────────────────────────────────────────────────
-- 3. HABILITAR pgcrypto (necesario para bcrypt)
-- ──────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- ──────────────────────────────────────────────────────────────
-- 4. HASHEAR CONTRASEÑA DEL ADMIN
--    Tu tabla admin_users ya tiene la columna 'password'.
--    Simplemente reemplazamos el texto plano con un hash bcrypt.
-- ──────────────────────────────────────────────────────────────
-- Ejecuta esta query reemplazando los valores con los tuyos:
--
--   UPDATE admin_users
--   SET password = crypt('TU_PASSWORD_ACTUAL', gen_salt('bf', 12))
--   WHERE username = 'TU_USERNAME';
--
-- Verifica que el hash se generó correctamente:
--
--   SELECT username, password FROM admin_users;
--   (Deberías ver algo como: $2a$12$xxxxx...)
--

-- ============================================================
-- FIN DEL SCRIPT
-- ============================================================
