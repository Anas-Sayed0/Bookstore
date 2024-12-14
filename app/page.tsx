"use client";

import { useEffect, useState } from "react";
import { BookCard } from "@/components/BookCard";
import { Navbar } from "@/components/Navbar";
import type { Book, CartItem } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("/api/books");
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error("Failed to fetch books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleAddToCart = (book: Book) => {
    const existingItem = cartItems.find((item) => item.book.id === book.id);

    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.book.id === book.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { book, quantity: 1 }]);
    }

    toast({
      title: "Added to cart",
      description: `${book.title} has been added to your cart.`,
    });
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="mx-auto max-w-7xl p-8">
        <h1 className="mb-8 text-3xl font-bold">Featured Books</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {books.map((book) => (
            <BookCard key={book.id} book={book} onAddToCart={handleAddToCart} />
          ))}
        </div>
      </div>
      <Toaster />
    </main>
  );
}
