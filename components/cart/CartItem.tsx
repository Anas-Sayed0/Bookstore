'use client';

import { CartItem as CartItemType } from '@/types';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (bookId: string, quantity: number) => void;
  onRemove: (bookId: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const { book, quantity } = item;

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-12">
          <Image
            src={book.image}
            alt={book.title}
            fill
            className="rounded object-cover"
          />
        </div>
        <div>
          <p className="font-medium">{book.title}</p>
          <p className="text-sm text-muted-foreground">{book.author}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onUpdateQuantity(book.id, quantity - 1)}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onUpdateQuantity(book.id, quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="w-20 text-right">
          ${(book.price * quantity).toFixed(2)}
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(book.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}