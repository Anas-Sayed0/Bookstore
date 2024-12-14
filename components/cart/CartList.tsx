'use client';

import { useCartStore } from '@/store/cart';
import { CartItem } from './CartItem';
import { CartSummary } from './CartSummary';

export function CartList() {
  const { items, total, updateQuantity, removeItem } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-muted-foreground">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {items.map((item) => (
          <CartItem
            key={item.book.id}
            item={item}
            onUpdateQuantity={updateQuantity}
            onRemove={removeItem}
          />
        ))}
      </div>
      <CartSummary total={total} />
    </div>
  );
}