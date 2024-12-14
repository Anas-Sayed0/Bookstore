import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items } = await request.json();

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.book.title,
          description: item.book.author,
        },
        unit_amount: Math.round(item.book.price * 100),
      },
      quantity: item.quantity,
    }));

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        orderNumber: `ORD-${Date.now()}`,
        orderDate: new Date(),
        totalPrice: items.reduce(
          (total: number, item: any) => total + item.book.price * item.quantity,
          0
        ),
        items: {
          create: items.map((item: any) => ({
            bookId: item.book.id,
            quantity: item.quantity,
            price: item.book.price,
          })),
        },
      },
    });

    const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/order-success?orderId=${order.id}`;
    const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/cart?canceled=true`;

    const stripeSession = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        orderId: order.id,
      },
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Checkout session creation failed" },
      { status: 500 }
    );
  }
}
