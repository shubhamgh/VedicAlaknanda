
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
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
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  };

  const getAvatarBackgroundColor = (gender: string | null) => {
    switch (gender) {
      case "female":
        return "bg-pink-500";
      case "male":
        return "bg-blue-500";
      default:
        return "bg-purple-500";
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Guests Say
          </h2>
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hotel-gold"></div>
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Guests Say
          </h2>
          <div className="text-center text-gray-600">
            <p>No reviews available yet.</p>
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
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {reviews.map((review) => (
                <CarouselItem key={review.id}>
                  <Card className="border-none shadow-lg">
                    <CardContent className="p-8">
                      <div className="flex flex-col items-center text-center">
                        {review.image ? (
                          <img
                            src={review.image}
                            alt={review.name}
                            className="w-20 h-20 rounded-full mb-4 object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              const parent = target.parentElement;
                              if (parent) {
                                const initialsDiv = document.createElement("div");
                                initialsDiv.className = `w-20 h-20 rounded-full mb-4 flex items-center justify-center text-white font-bold text-xl ${getAvatarBackgroundColor(
                                  review.gender
                                )}`;
                                initialsDiv.textContent = getInitials(review.name);
                                parent.insertBefore(initialsDiv, target);
                              }
                            }}
                          />
                        ) : (
                          <div
                            className={`w-20 h-20 rounded-full mb-4 flex items-center justify-center text-white font-bold text-xl ${getAvatarBackgroundColor(
                              review.gender
                            )}`}
                          >
                            {getInitials(review.name)}
                          </div>
                        )}
                        <div className="flex mb-4">
                          {renderStars(review.rating)}
                        </div>
                        <p className="text-lg italic mb-4">"{review.review}"</p>
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
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
