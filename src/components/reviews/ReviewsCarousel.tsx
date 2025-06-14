
import React, { useState, useEffect, useCallback } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import ReviewCard from "./ReviewCard";

interface Review {
  id: string;
  name: string;
  review: string;
  rating: number;
  image?: string | null;
  gender?: string | null;
  source?: string | null;
}

interface ReviewsCarouselProps {
  reviews: Review[];
}

const ReviewsCarousel = ({ reviews }: ReviewsCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const scrollNext = useCallback(() => {
    if (!api) return;
    api.scrollNext();
  }, [api]);

  // Auto-play functionality
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      scrollNext();
    }, 8000); // 8 seconds

    return () => clearInterval(interval);
  }, [api, scrollNext]);

  // Track current slide
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    onSelect();

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div className="max-w-4xl mx-auto px-4 relative">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {reviews.map((review, index) => (
            <CarouselItem key={review.id} className="pl-2 md:pl-4 basis-full">
              <div className={`transition-opacity duration-500 ${index === current ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}>
                <ReviewCard review={review} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden sm:block">
          <CarouselPrevious className="-left-16 top-1/2 -translate-y-1/2" />
          <CarouselNext className="-right-16 top-1/2 -translate-y-1/2" />
        </div>
      </Carousel>
    </div>
  );
};

export default ReviewsCarousel;
