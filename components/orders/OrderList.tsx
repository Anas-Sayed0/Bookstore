"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Order } from "@/types";
import { OrderDetails } from "./OrderDetails";

export function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch("/api/orders");
      const data = await response.json();
      setOrders(data);
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order Number</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.orderNumber}</TableCell>
              <TableCell>
                {order.orderDate
                  ? format(new Date(order.orderDate), "MMM d, yyyy")
                  : "-"}
              </TableCell>
              <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
              <TableCell>
                <span
                  className={`capitalize ${
                    order.status.toLowerCase() === "completed"
                      ? "text-green-600"
                      : order.status.toLowerCase() === "cancelled"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {order.status}
                </span>
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  onClick={() => setSelectedOrder(order)}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
