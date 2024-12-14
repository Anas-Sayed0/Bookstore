import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log("DELETE request received for book ID:", params.id);
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      console.log("Unauthorized request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const book = await prisma.book.findUnique({
      where: { id: params.id },
    });

    if (!book) {
      console.log("Book not found");
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    // First delete all related ratings
    await prisma.bookRating.deleteMany({
      where: { bookId: params.id },
    });

    // Then delete related OrderItem records
    await prisma.orderItem.deleteMany({
      where: { bookId: params.id },
    });

    // Finally delete the book
    await prisma.book.delete({
      where: { id: params.id },
    });

    console.log("Book deleted successfully");
    return NextResponse.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Failed to delete book:", error);
    return NextResponse.json(
      { error: "Failed to delete book" },
      { status: 500 }
    );
  }
}
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const book = await prisma.book.update({
      where: { id: params.id },
      data: {
        title: data.title,
        author: data.author,
        price: parseFloat(data.price),
        description: data.description,
        image: data.image,
        stock: parseInt(data.stock),
      },
    });

    return NextResponse.json(book);
  } catch (error) {
    console.error("Error updating book:", error);
    return NextResponse.json(
      { error: "Failed to update book" },
      { status: 500 }
    );
  }
}
