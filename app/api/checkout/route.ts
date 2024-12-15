import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    // Only check if user is authenticated, not if they're admin
    if (!session?.user) {
      return NextResponse.json(
        { error: "Please login to continue" },
        { status: 401 }
      );
    }

    const { items } = await request.json();

    // Validate cart items
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

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

    // Create order in database
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        orderNumber: `ORD-${Date.now()}`,
        orderDate: new Date(),
        status: "PENDING", // Add initial status
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
