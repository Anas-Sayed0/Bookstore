import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { rating } = await request.json();

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Create or update user's rating
    const userRating = await prisma.bookRating.upsert({
      where: {
        userId_bookId: {
          userId: session.user.id,
          bookId: params.id,
        },
      },
      update: {
        rating: rating,
      },
      create: {
        rating: rating,
        userId: session.user.id,
        bookId: params.id,
      },
    });

    // Calculate new average rating
    const ratings = await prisma.bookRating.findMany({
      where: {
        bookId: params.id,
      },
      select: {
        rating: true,
      },
    });

    const averageRating =
      ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length;

    // Update book's average rating
    const updatedBook = await prisma.book.update({
      where: {
        id: params.id,
      },
      data: {
        averageRating: averageRating,
      },
    });

    return NextResponse.json({
      rating: userRating.rating,
      averageRating: updatedBook.averageRating,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to rate book" }, { status: 500 });
  }
}
