// components/books/BookRating.tsx
"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

interface BookRatingProps {
  bookId: string;
  initialRating?: number;
  averageRating?: number;
}

export function BookRating({
  bookId,
  initialRating = 0,
  averageRating = 0,
}: BookRatingProps) {
  const [userRating, setUserRating] = useState(initialRating);
  const [hoveredRating, setHoveredRating] = useState(0);
  const { toast } = useToast();
  const { data: session } = useSession();

  const handleRating = async (rating: number) => {
    if (!session) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to rate books",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/books/${bookId}/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit rating");
      }

      setUserRating(rating);
      toast({
        title: "Thank you!",
        description: "Your rating has been submitted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit rating. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            title="Rate book"
            key={rating}
            onClick={() => handleRating(rating)}
            onMouseEnter={() => setHoveredRating(rating)}
            onMouseLeave={() => setHoveredRating(0)}
            className="focus:outline-none"
            disabled={!session}
          >
            <Star
              className={`h-5 w-5 transition-colors ${
                rating <= (hoveredRating || userRating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
      {averageRating > 0 && (
        <p className="text-sm text-muted-foreground">
          Average rating: {averageRating.toFixed(1)}
        </p>
      )}
    </div>
  );
}
