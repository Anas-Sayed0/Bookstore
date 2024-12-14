import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status } = await request.json();

    const order = await prisma.order.update({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      data: {
        status,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 }
    );
  }
}