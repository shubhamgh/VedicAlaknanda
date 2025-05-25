
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
  source?: string | null;
}

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentReview, setCurrentReview] = useState(0);

  // Fetch reviews from database
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        console.log("Fetching reviews from Supabase...");
        const { data, error } = await supabase
          .from("reviews")
          .select("*")
          .order("entered_on", { ascending: false });

        if (error) {
          console.error("Error fetching reviews:", error);
          return;
        }

        console.log("Reviews fetched:", data);
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  const getAvatarBackgroundColor = (gender: string | null) => {
    if (gender === "female") {
      return "bg-pink-500";
    } else if (gender === "male") {
      return "bg-blue-500";
    } else {
      return "bg-purple-500";
    }
  };

  if (reviews.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Guests Say
          </h2>
          <div className="text-center">
            <p className="text-gray-600">Loading reviews...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          What Our Guests Say
        </h2>
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentReview * 100}%)` }}
            >
              {reviews.map((review, index) => (
                <div
                  key={review.id}
                  className="w-full flex-shrink-0 px-2"
                >
                  <Card className="border-none shadow-lg">
                    <CardContent className="p-8">
                      <div className="flex flex-col items-center text-center">
                        <div className={`w-20 h-20 rounded-full mb-4 flex items-center justify-center text-white font-bold text-xl ${getAvatarBackgroundColor(review.gender)}`}>
                          {getInitials(review.name)}
                        </div>
                        <div className="flex mb-4">
                          {renderStars(review.rating)}
                        </div>
                        <p className="text-lg italic mb-4">
                          "{review.review}"
                        </p>
                        <p className="font-semibold text-gray-800 mb-2">
                          {review.name}
                        </p>
                        {review.source && (
                          <p className="text-sm text-gray-600">
                            via {review.source}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
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
