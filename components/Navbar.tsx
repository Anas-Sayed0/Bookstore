"use client";

import Link from "next/link";
import { ShoppingCart, User, BookOpen, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleProfileClick = () => {
    if (status === "authenticated") {
      router.push("/profile");
    } else {
      router.push("/login");
    }
  };

  const handleDashboardClick = () => {
    router.push("/admin");
  };

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <BookOpen className="h-6 w-6" />
          <span>BookStore</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/cart">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </Link>
          {session?.user?.role === "ADMIN" && (
            <Button variant="ghost" size="icon" onClick={handleDashboardClick}>
              <LayoutDashboard className="h-5 w-5" />
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={handleProfileClick}>
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
