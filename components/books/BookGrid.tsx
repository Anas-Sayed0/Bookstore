'use client';

import { Book } from '@/types';
import { BookCard } from './BookCard';
import { useCartStore } from '@/store/cart';

interface BookGridProps {
  books: Book[];
}

export function BookGrid({ books }: BookGridProps) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onAddToCart={addItem}
        />
      ))}
    </div>
  );
}