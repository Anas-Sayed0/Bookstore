"use client";

import { Book } from "@/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useCartStore } from "@/store/cart";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

interface BookCardProps {
  book: Book;
  onAddToCart: (book: Book) => void;
}

export function BookCard({ book, onAddToCart }: BookCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const { toast } = useToast();
  const { data: session } = useSession();

  const handleClick = async () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add items to cart",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      addItem(book);
      toast({
        title: "Added to cart",
        description: `${book.title} has been added to your cart.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm transition-transform transform hover:scale-105 hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={book.image}
            alt={book.title}
            fill
            className="rounded-t-lg object-cover"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold">{book.title}</h3>
        <p className="text-sm text-muted-foreground">{book.author}</p>
        <div className="mt-2 flex items-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < (book.averageRating || 0)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
          <span className="text-sm text-muted-foreground">
            ({(book.averageRating || 0).toFixed(1)}/5)
          </span>
        </div>
        <p className="mt-2 text-xl font-bold">${book.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleClick} disabled={isLoading}>
          {isLoading ? "Adding..." : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}
