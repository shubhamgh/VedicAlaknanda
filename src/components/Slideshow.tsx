import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SlideProps {
  imageUrl: string;
  heading: string;
  subheading: string;
}
import hotelImage from "../assets/hotel.png";
import diningImage from "../assets/dining.png";
import viewImage from "../assets/view.jpg";
import roomImage from "../assets/room.png";

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

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setFade(false);
      }, 1000);
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const currentSlideData = slides[currentSlide];

  return (
    <div className="relative w-full h-screen">
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

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

      {/* Content */}
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
        <a
          href="/book-now"
          className="bg-hotel-gold hover:bg-opacity-90 text-white py-3 px-8 text-base uppercase tracking-wider font-medium transition-all"
        >
          Book Your Stay
        </a>
      </div>

      {/* Slide indicators */}
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
