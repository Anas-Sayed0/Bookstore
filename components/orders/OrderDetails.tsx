"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Order } from "@/types";
import { format, parseISO } from "date-fns";
import { BookRating } from "@/components/books/BookRating";

interface OrderDetailsProps {
  order: Order;
  onClose?: () => void;
}

export function OrderDetails({ order, onClose }: OrderDetailsProps) {
  const formatDate = (dateString: string | Date | null | undefined) => {
    try {
      if (!dateString) return "-";
      if (typeof dateString === "string") {
        return format(parseISO(dateString), "PPP");
      }
      return format(dateString, "PPP");
    } catch (error) {
      return "-";
    }
  };

  // If no onClose prop is provided, render without Dialog wrapper
  if (!onClose) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Order Date</p>
            <p className="font-medium">{formatDate(order.orderDate)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Status</p>
            <p className="font-medium capitalize">{order.status}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Items</h3>
          {order.items?.map((item) => (
            <div
              key={item.book.id}
              className="flex items-center justify-between border-b pb-4"
            >
              <div>
                <p className="font-medium">{item.book.title}</p>
                <p className="text-sm text-muted-foreground">
                  Quantity: {item.quantity}
                </p>
                <div className="mt-2">
                  <BookRating
                    bookId={item.book.id}
                    initialRating={item.book.rating}
                    averageRating={item.book.averageRating}
                  />
                </div>
              </div>
              <p className="font-medium">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-between border-t pt-4">
          <span className="font-semibold">Total</span>
          <span className="font-semibold">${order.totalPrice.toFixed(2)}</span>
        </div>
      </div>
    );
  }

  const items = order.items || [];

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Order Details - {order.orderNumber}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Order Date</p>
              <p className="font-medium">{formatDate(order.orderDate)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Status</p>
              <p className="font-medium capitalize">{order.status}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Items ({items.length})</h3>
            {items.map((item) => (
              <div
                key={item.book.id}
                className="flex items-center justify-between border-b pb-4"
              >
                <div>
                  <p className="font-medium">{item.book.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {item.quantity}
                  </p>
                  <div className="mt-2">
                    <BookRating
                      bookId={item.book.id}
                      initialRating={item.book.rating}
                      averageRating={item.book.averageRating}
                    />
                  </div>
                </div>
                <p className="font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-between border-t pt-4">
            <span className="font-semibold">Total</span>
            <span className="font-semibold">
              ${order.totalPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
