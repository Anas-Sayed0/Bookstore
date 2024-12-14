"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { signIn } from "next-auth/react";

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    address?: string;
  }>({});
  const router = useRouter();
  const { toast } = useToast();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setErrors({});

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const address = formData.get("address") as string;

    // Validate name
    if (name.length < 2) {
      setErrors((prev) => ({
        ...prev,
        name: "Name must be at least 2 characters",
      }));
      setIsLoading(false);
      return;
    }

    // Validate email
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address",
      }));
      setIsLoading(false);
      return;
    }

    // Validate password
    if (password.length < 6) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must be at least 6 characters",
      }));
      setIsLoading(false);
      return;
    }

    // Validate address
    if (address.length < 5) {
      setErrors((prev) => ({
        ...prev,
        address: "Please enter a valid address",
      }));
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, address }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.error || "Failed to sign up",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Account created successfully",
      });

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        toast({
          title: "Error",
          description: "Failed to sign in after signup",
          variant: "destructive",
        });
      } else {
        router.push("/profile");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="John Doe"
          required
          aria-invalid={!!errors.name}
          className={errors.name ? "border-red-500" : ""}
          minLength={2}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="john@example.com"
          required
          aria-invalid={!!errors.email}
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          aria-invalid={!!errors.password}
          className={errors.password ? "border-red-500" : ""}
          minLength={6}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          name="address"
          type="text"
          placeholder="123 Main St"
          required
          aria-invalid={!!errors.address}
          className={errors.address ? "border-red-500" : ""}
          minLength={5}
        />
        {errors.address && (
          <p className="text-sm text-red-500">{errors.address}</p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Signing up..." : "Sign Up"}
      </Button>
    </form>
  );
}
