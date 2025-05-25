
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Review {
  id: string;
  name: string;
  review: string;
  rating: number;
  image?: string | null;
  gender?: string | null;
}

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentReview, setCurrentReview] = useState(0);

  // Fetch reviews from database
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from("reviews")
          .select("*")
          .order("entered_on", { ascending: false });

        if (error) {
          console.error("Error fetching reviews:", error);
          return;
        }

        setReviews(data || []);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchReviews();
  }, []);

  useEffect(() => {
    if (reviews.length === 0) return;

    const timer = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 5000); // Change review every 5 seconds

    return () => clearInterval(timer);
  }, [reviews.length]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const getDefaultAvatar = (gender: string | null) => {
    if (gender === "female") {
      return "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face";
    } else if (gender === "male") {
      return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face";
    } else {
      return "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face";
    }
  };

  if (reviews.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          What Our Guests Say
        </h2>
        <div className="max-w-4xl mx-auto">
          <div className="relative h-[400px]">
            {reviews.map((review, index) => (
              <div
                key={review.id}
                className={`absolute inset-0 transition-all duration-500 transform ${
                  index === currentReview
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-full pointer-events-none"
                }`}
              >
                <Card className="border-none shadow-lg h-full">
                  <CardContent className="p-8 h-full flex flex-col justify-center">
                    <div className="flex flex-col items-center text-center">
                      <img
                        src={review.image || getDefaultAvatar(review.gender)}
                        alt={review.name}
                        className="w-20 h-20 rounded-full mb-4 object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = getDefaultAvatar(review.gender);
                        }}
                      />
                      <div className="flex mb-4">
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-lg italic mb-4">
                        "{review.review}"
                      </p>
                      <p className="font-semibold text-gray-800">
                        {review.name}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
          {reviews.length > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentReview(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentReview ? "bg-hotel-gold" : "bg-gray-300"
                  }`}
                  aria-label={`Go to review ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
