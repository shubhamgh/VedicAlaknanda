import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface Review {
  id: number;
  name: string;
  review: string;
  rating: number;
  image?: string;
}

const reviews: Review[] = [
  // to be fetched from the database
];

const Reviews = () => {
  const [currentReview, setCurrentReview] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 5000); // Change review every 5 seconds

    return () => clearInterval(timer);
  }, []);

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

  if (reviews.length === 0) return;
  else
    return (
      <section className="py-16 bg-gray-50">
        {Reviews.length ? (
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
                          {review.image && (
                            <img
                              src={review.image}
                              alt={review.name}
                              className="w-20 h-20 rounded-full mb-4 object-cover"
                            />
                          )}
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
            </div>
          </div>
        ) : null}
      </section>
    );
};

export default Reviews;
