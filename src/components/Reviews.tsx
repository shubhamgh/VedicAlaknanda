
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import ReviewsCarousel from "./reviews/ReviewsCarousel";

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
        <ReviewsCarousel reviews={reviews} />
      </div>
    </section>
  );
};

export default Reviews;
