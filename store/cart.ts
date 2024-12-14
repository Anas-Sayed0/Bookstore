import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Book, CartItem } from '@/types';

interface CartStore {
  items: CartItem[];
  addItem: (book: Book) => void;
  removeItem: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      addItem: (book: Book) => {
        const items = get().items;
        const existingItem = items.find((item) => item.book.id === book.id);

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.book.id === book.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ items: [...items, { book, quantity: 1 }] });
        }

        set({ total: calculateTotal(get().items) });
      },
      removeItem: (bookId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.book.id !== bookId),
          total: calculateTotal(state.items.filter((item) => item.book.id !== bookId)),
        }));
      },
      updateQuantity: (bookId: string, quantity: number) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.book.id === bookId ? { ...item, quantity } : item
          ),
          total: calculateTotal(
            state.items.map((item) =>
              item.book.id === bookId ? { ...item, quantity } : item
            )
          ),
        }));
      },
      clearCart: () => set({ items: [], total: 0 }),
    }),
    {
      name: 'cart-storage',
    }
  )
);

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.book.price * item.quantity, 0);
};