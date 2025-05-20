import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface SlideProps {
  imageUrl: string;
  heading: string;
  subheading: string;
}

import hotelImage from "../assets/hotel.jpg";
import diningImage from "../assets/dining.jpg";
import viewImage from "../assets/view.jpg";
import roomImage from "../assets/room.jpg";
import { Link } from "react-router-dom";

const slides: SlideProps[] = [
  {
    imageUrl: hotelImage,
    heading: "Experience Luxury",
    subheading:
      "Discover the perfect balance of modern comfort and timeless elegance",
  },
  {
    imageUrl: diningImage,
    heading: "Exquisite Dining",
    subheading:
      "Savor culinary masterpieces in our hygenic and inviting restaurants",
  },
  {
    imageUrl: viewImage,
    heading: "Breathtaking Views",
    subheading: "Wake up to stunning panoramic scenery that inspires your day",
  },
  {
    imageUrl: roomImage,
    heading: "Comfortable Rooms",
    subheading: "Have a night of relaxation in our luxurious rooms",
  },
];

const Slideshow: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fade, setFade] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setFade(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setFade(false);
    }, 500);
  };

  const prevSlide = () => {
    setFade(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
      setFade(false);
    }, 500);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diff = touchStartX.current - touchEndX.current;
      if (Math.abs(diff) > 50) {
        // swipe left
        if (diff > 0) {
          nextSlide();
        } else {
          // swipe right
          prevSlide();
        }
      }
    }

    // reset values
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div
      className="relative w-full h-screen"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {slides.map((slide, index) => (
        <div
          key={index}
          className={cn(
            "absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000",
            index === currentSlide
              ? fade
                ? "opacity-0"
                : "opacity-100"
              : "opacity-0"
          )}
          style={{ backgroundImage: `url(${slide.imageUrl})` }}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

      <div
        className={cn(
          "absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4 transition-opacity duration-1000",
          fade ? "opacity-0" : "opacity-100"
        )}
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-4">
          {currentSlideData.heading}
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8">
          {currentSlideData.subheading}
        </p>
        <Link to="/book-now">
          <a className="bg-hotel-gold hover:bg-opacity-90 text-white py-3 px-8 text-base uppercase tracking-wider font-medium transition-all">
            Book Your Stay
          </a>
        </Link>
      </div>

      <div className="absolute bottom-10 left-0 right-0 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              index === currentSlide ? "w-8 bg-hotel-gold" : "w-2 bg-white/50"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slideshow;
