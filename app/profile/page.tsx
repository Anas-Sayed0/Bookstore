"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderList } from "@/components/orders/OrderList";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        email: session.user.email || "",
        address: session.user.address || "", // Ensure address is set from session
      });
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log("Submitting form data:", formData); // Debugging step
      const response = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      // Update the session data
      if (session) {
        await update({
          ...session,
          user: {
            ...session.user,
            name: formData.name,
            email: formData.email,
            address: formData.address,
          },
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error); // Debugging step
      toast({
        title: "Error",
        description:
          (error as Error).message ||
          "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="mx-auto max-w-7xl p-8">
        <h1 className="mb-8 text-3xl font-bold">My Profile</h1>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and address
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      required
                    />
                  </div>
                  <Button type="submit">Update Profile</Button>
                </form>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                >
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <OrderList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
