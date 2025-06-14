
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
      <CardContent className="p-8">
        <div className="flex flex-col items-center text-center">
          <ReviewAvatar
            name={review.name}
            image={review.image}
            gender={review.gender}
          />
          <StarRating rating={review.rating} />
          <p className="text-lg italic mb-4">"{review.review}"</p>
          <p className="font-semibold text-gray-800 mb-2">{review.name}</p>
          {review.source && (
            <p className="text-sm text-gray-600">via {review.source}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
