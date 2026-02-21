
import { useState, useEffect } from 'react';

export interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  precioOferta: number | null;
  imagen: string;
  cantidad: number;
}

const CART_STORAGE_KEY = 'lorie_cart';

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch {
        setCartItems([]);
      }
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    // Disparar evento para actualizar otros componentes
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cartItems }));
  }, [cartItems]);

  const addToCart = (item: Omit<CartItem, 'cantidad'>) => {
    setCartItems((prev) => {
      const existingItem = prev.find((i) => i.id === item.id);
      if (existingItem) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, cantidad: i.cantidad + 1 } : i
        );
      }
      return [...prev, { ...item, cantidad: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, cantidad: number) => {
    if (cantidad <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, cantidad } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
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
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
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
