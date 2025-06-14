
import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface SlideProps {
  imageUrl: string;
  heading: string;
  subheading: string;
}

import hotelImage from "../assets/hotel.webp";
import diningImage from "../assets/dining.webp";
import viewImage from "../assets/view.webp";
import roomImage from "../assets/room.webp";

const slides: SlideProps[] = [
  {
    imageUrl: viewImage,
    heading: "Breathtaking Views",
    subheading: "Wake up to stunning panoramic scenery that inspires your day",
  },
  {
    imageUrl: hotelImage,
    heading: "Experience Luxury",
    subheading: "Discover the perfect balance of modern comfort and timeless elegance",
  },
  {
    imageUrl: diningImage,
    heading: "Exquisite Dining",
    subheading: "Savor culinary masterpieces in our hygenic and inviting restaurants",
  },
  {
    imageUrl: roomImage,
    heading: "Comfortable Rooms",
    subheading: "Have a night of relaxation in our luxurious rooms",
  },
];

const Slideshow: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Preload images
  useEffect(() => {
    slides.forEach((slide, index) => {
      const img = new Image();
      img.src = slide.imageUrl;
      img.onload = () => {
        setLoadedImages((prev) => new Set([...prev, index]));
      };
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [currentSlide]);

  const nextSlide = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;
    
    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Sliding container */}
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
          width: `${slides.length * 100}%`
        }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="relative w-full h-full flex-shrink-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${slide.imageUrl})`,
              width: `${100 / slides.length}%`
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-3 md:mb-4 leading-tight">
                {slide.heading}
              </h1>
              <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-6 md:mb-8 leading-relaxed">
                {slide.subheading}
              </p>
              <Link
                to="/book-now"
                className="bg-hotel-gold hover:bg-opacity-90 text-white py-3 px-6 md:py-3 md:px-8 text-sm md:text-base uppercase tracking-wider font-medium transition-all touch-manipulation"
              >
                Book Your Stay
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-6 md:bottom-10 left-0 right-0 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (!isTransitioning && index !== currentSlide) {
                setIsTransitioning(true);
                setCurrentSlide(index);
                setTimeout(() => setIsTransitioning(false), 500);
              }
            }}
            className={cn(
              "h-2 rounded-full transition-all duration-300 touch-manipulation",
              index === currentSlide ? "w-6 md:w-8 bg-hotel-gold" : "w-2 bg-white/50"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slideshow;
