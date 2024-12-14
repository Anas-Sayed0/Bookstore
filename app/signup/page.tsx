"use client";

import { SignupForm } from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>
        <SignupForm />
      </div>
    </div>
  );
}
