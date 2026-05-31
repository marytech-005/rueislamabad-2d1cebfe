import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
};

type CartState = {
  items: CartItem[];
  add: (item: Omit<CartItem, "quantity">) => void;
  remove: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  count: () => number;
  subtotal: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) =>
        set((s) => {
          const existing = s.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
              ),
            };
          }
          return { items: [...s.items, { ...item, quantity: 1 }] };
        }),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      setQuantity: (id, quantity) =>
        set((s) => ({
          items:
            quantity <= 0
              ? s.items.filter((i) => i.id !== id)
              : s.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        })),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((n, i) => n + i.quantity, 0),
      subtotal: () => get().items.reduce((n, i) => n + i.price * i.quantity, 0),
    }),
    { name: "rue-cart" },
  ),
);

export const formatPKR = (n: number) =>
  `Rs ${n.toLocaleString("en-PK", { maximumFractionDigits: 0 })}`;
