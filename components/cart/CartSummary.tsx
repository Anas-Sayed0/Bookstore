import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart';
import { useToast } from '@/hooks/use-toast';

interface CartSummaryProps {
  total: number;
}

export function CartSummary({ total }: CartSummaryProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const { items } = useCartStore();

  const handleCheckout = async () => {
    if (!session) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to checkout',
        variant: 'destructive',
      });
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="rounded-lg border p-6">
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Shipping</span>
          <span>Free</span>
        </div>
        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
      <Button 
        className="w-full mt-4"
        onClick={handleCheckout}
      >
        Proceed to Checkout
      </Button>
    </div>
  );
}