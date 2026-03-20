import { useState, useEffect } from 'react';
import type { ValidacionDescuento } from '@/types/checkout';

export interface CartItem {
  cartItemId: string;    // id + '-' + medida (para diferenciar tallas del mismo producto)
  id: string;            // UUID de Supabase
  nombre: string;
  precio: number;
  precioOferta: number | null;
  imagen: string;
  cantidad: number;
  medida?: string;       // Ej: "13 pulgadas"
}

const CART_STORAGE_KEY = 'lorie_cart';
const DISCOUNT_STORAGE_KEY = 'lorie_cart_discount';

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [descuentoData, setDescuentoData] = useState<ValidacionDescuento | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hidratación: cargar desde localStorage solo en el cliente
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch {
        setCartItems([]);
      }
    }

    const savedDiscount = localStorage.getItem(DISCOUNT_STORAGE_KEY);
    if (savedDiscount) {
      try {
        setDescuentoData(JSON.parse(savedDiscount));
      } catch {
        setDescuentoData(null);
      }
    }
    setIsHydrated(true);
  }, []);

  // Persistir en localStorage cuando el carrito cambie (solo tras hidratación)
  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cartItems }));
  }, [cartItems, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    if (descuentoData) {
      localStorage.setItem(DISCOUNT_STORAGE_KEY, JSON.stringify(descuentoData));
    } else {
      localStorage.removeItem(DISCOUNT_STORAGE_KEY);
    }
  }, [descuentoData, isHydrated]);

  const addToCart = (item: Omit<CartItem, 'cantidad' | 'cartItemId'>) => {
    const generatedCartItemId = item.medida ? `${item.id}-${item.medida}` : item.id;

    setCartItems((prev) => {
      const existingItem = prev.find((i) => i.cartItemId === generatedCartItemId);
      if (existingItem) {
        return prev.map((i) =>
          i.cartItemId === generatedCartItemId ? { ...i, cantidad: i.cantidad + 1 } : i
        );
      }
      return [...prev, { ...item, cartItemId: generatedCartItemId, cantidad: 1 }];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, cantidad: number) => {
    if (cantidad <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.cartItemId === cartItemId ? { ...item, cantidad } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setDescuentoData(null);
    localStorage.removeItem(CART_STORAGE_KEY);
    localStorage.removeItem(DISCOUNT_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: [] }));
  };

  const setDescuento = (descuento: ValidacionDescuento | null) => {
    setDescuentoData(descuento);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const precio = item.precioOferta || item.precio;
      return total + precio * item.cantidad;
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.cantidad, 0);
  };

  return {
    cartItems,
    descuentoData,
    isHydrated,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    setDescuento,
  };
}

// Hook para obtener solo el conteo del carrito (para el navbar)
export function useCartCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Cargar inicial
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const items: CartItem[] = JSON.parse(savedCart);
        setCount(items.reduce((c, item) => c + item.cantidad, 0));
      } catch {
        setCount(0);
      }
    }

    // Escuchar cambios
    const handleCartUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<CartItem[]>;
      setCount(customEvent.detail.reduce((c, item) => c + item.cantidad, 0));
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  return count;
}
