"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Book } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface AdminBookFormProps {
  book: Book | null;
  onClose: () => void;
}

export function AdminBookForm({ book, onClose }: AdminBookFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    price: "",
    description: "",
    image: "",
    stock: "",
  });

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        price: book.price.toString(),
        description: book.description,
        image: book.image,
        stock: book.stock.toString(),
      });
    }
  }, [book]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/books/${book?.id || ""}`, {
        method: book ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          author: formData.author,
          price: parseFloat(formData.price),
          description: formData.description,
          image: formData.image,
          stock: parseInt(formData.stock),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save book");
      }

      const updatedBook = await response.json();

      onClose();
      router.refresh();
      toast({
        title: book ? "Book Updated" : "Book Added",
        description: book
          ? "The book has been updated successfully."
          : "The book has been added successfully.",
      });
    } catch (error) {
      console.error("Error saving book:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save book",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{book ? "Edit Book" : "Add New Book"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) =>
                setFormData({ ...formData, author: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="stock">Stock</Label>
            <Input
              id="stock"
              type="number"
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{book ? "Save Changes" : "Add Book"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
