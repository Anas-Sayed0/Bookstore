"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, Home } from "lucide-react";
import { OrderDetails } from "@/components/orders/OrderDetails";
import { Order } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";

export default function OrderSuccessPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const { toast } = useToast();
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        // Update order status first
        const statusResponse = await fetch(`/api/orders/${orderId}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "COMPLETED" }),
        });

        if (!statusResponse.ok) {
          throw new Error("Failed to update order status");
        }

        // Then fetch the updated order
        const response = await fetch(`/api/orders/${orderId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch order");
        }

        const data = await response.json();
        setOrder(data);
        clearCart(); // Clear cart after successful order completion
      } catch (error) {
        console.error("Error fetching order:", error);
        toast({
          title: "Error",
          description: "Failed to load order details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId, toast, clearCart]);

  const handleClose = () => {
    router.push("/"); // Redirect to home page when closing
  };

  return (
    <div className="container mx-auto py-8">
      {loading ? (
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : !order ? (
        <div className="flex h-[50vh] items-center justify-center flex-col gap-4">
          <p className="text-center text-lg">Order not found</p>
          <p className="text-sm text-muted-foreground">
            The order you are looking for does not exist or you may not have
            permission to view it.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-green-600">
              Order Successful!
            </h1>
            <p className="text-gray-600">Thank you for your purchase</p>
          </div>

          <div className="mx-auto max-w-2xl rounded-lg border p-6 shadow-sm">
            <OrderDetails order={order} onClose={handleClose} />
          </div>
        </>
      )}
    </div>
  );
}
