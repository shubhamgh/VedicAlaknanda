
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import StarRating from "./StarRating";
import ReviewAvatar from "./ReviewAvatar";

interface Review {
  id: string;
  name: string;
  review: string;
  rating: number;
  image?: string | null;
  gender?: string | null;
  source?: string | null;
}

interface ReviewCardProps {
  review: Review;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  return (
    <Card className="border-none shadow-lg">
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <ReviewAvatar
            name={review.name}
            image={review.image}
            gender={review.gender}
          />
          <StarRating rating={review.rating} />
          <p className="text-base md:text-lg italic leading-relaxed">"{review.review}"</p>
          <div className="pt-2">
            <p className="font-semibold text-gray-800 text-sm md:text-base">{review.name}</p>
            {review.source && (
              <p className="text-xs md:text-sm text-gray-600 mt-1">via {review.source}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
