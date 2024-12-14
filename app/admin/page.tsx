"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Book } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminBookForm } from "@/components/admin/AdminBookForm";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  useEffect(() => {
    console.log("Session:", session);
    console.log("Status:", status);

    if (
      status === "unauthenticated" ||
      !session?.user ||
      session.user.role !== "ADMIN"
    ) {
      router.push("/");
    }
  }, [session]);

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await fetch("/api/books");
      const data = await response.json();
      setBooks(data);
    };

    fetchBooks();
  }, []);

  const handleEditClick = (book: Book) => {
    setSelectedBook(book);
    setIsFormOpen(true);
  };

  const handleDeleteClick = async (bookId: string) => {
    try {
      // First, delete related ratings
      const response = await fetch(`/api/books/${bookId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setBooks(books.filter((book) => book.id !== bookId));
        toast({
          title: "Book Deleted",
          description: "The book has been deleted successfully.",
        });
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Failed to parse error response" }));
        console.error("Failed to delete book:", errorData);
        toast({
          title: "Error",
          description:
            errorData.error || "Failed to delete book. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      toast({
        title: "Error",
        description: "Failed to delete book. Please try again.",
        variant: "destructive",
      });
    }
  };
  const refreshBooks = async () => {
    try {
      const response = await fetch("/api/books");
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Error refreshing books:", error);
      toast({
        title: "Error",
        description: "Failed to refresh books list",
        variant: "destructive",
      });
    }
  };
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button onClick={() => setIsFormOpen(true)}>Add New Book</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {books.map((book) => (
            <TableRow key={book.id}>
              <TableCell>{book.title}</TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell>${book.price}</TableCell>
              <TableCell>{book.stock}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  onClick={() => handleEditClick(book)}
                  className="mr-2"
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteClick(book.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {isFormOpen && (
        <AdminBookForm
          book={selectedBook}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedBook(null);
            refreshBooks();
          }}
        />
      )}
    </div>
  );
}
