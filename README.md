# Bolt Book Store - Next.js E-commerce Application

A modern e-commerce platform for selling books built with Next.js 13, Tailwind CSS, and Shadcn UI components.

## Features

- 📚 Book catalog with search and filtering
- 🛒 Shopping cart functionality
- 👤 User authentication and authorization
- 🔐 Secure payment processing with Stripe
- ⭐ Book ratings and reviews
- 📱 Responsive design
- 🎨 Modern UI with Shadcn components

## Tech Stack

- **Framework:** Next.js 13 with App Router
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI
- **Authentication:** NextAuth.js
- **Database:** PostgreSQL with Prisma ORM
- **Payment:** Stripe Integration
- **Deployment:** Vercel

## Getting Started

1. Clone the repository:

```bash
git clone <repository-url>
cd bolt-nextjs

```

Install dependencies:

npm install

Set up environment variables:

# Create a .env file with:

DATABASE_URL=your_postgresql_url
NEXTAUTH_SECRET=your_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_APP_URL=http://localhost:3000

Run database migrations:

npx prisma migrate dev

Start the development server:

npm run dev

Project Structure

.
├── app/ # Next.js app router pages
├── components/ # Reusable UI components
├── lib/ # Utility functions and configurations
├── prisma/ # Database schema and migrations
├── public/ # Static assets
├── store/ # Global state management
└── types/ # TypeScript type definitions

Key Features Explained

Authentication

User registration and login
Protected routes for authenticated users
Admin dashboard with restricted access

Book Management

CRUD operations for books (Admin only)
Book search and filtering
Rating and review system

Shopping Experience

Add/remove items from cart
Order management
Secure checkout process
Order history

Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

License
This project is licensed under the MIT License.
