
import React from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
}

const StarRating = ({ rating }: StarRatingProps) => {
  return (
    <div className="flex mb-4">
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={`w-5 h-5 ${
            index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

export default StarRating;
