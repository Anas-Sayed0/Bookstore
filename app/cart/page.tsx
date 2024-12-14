'use client';

import { Navbar } from '@/components/Navbar';
import { CartList } from '@/components/cart/CartList';

export default function CartPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="mx-auto max-w-7xl p-8">
        <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>
        <CartList />
      </div>
    </div>
  );
}