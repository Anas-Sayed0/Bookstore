import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const books = await prisma.book.findMany();
    return NextResponse.json(books);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const book = await prisma.book.create({ data });
    
    return NextResponse.json(book);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create book' }, { status: 500 });
  }
}