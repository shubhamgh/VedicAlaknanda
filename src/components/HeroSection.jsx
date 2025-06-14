import React from "react";

function HeroSection({ title, description }) {
  return (
    <section className="relative h-64 md:h-64 bg-gradient-to-r from-hotel-dark to-hotel-gold flex items-center justify-center">
      <div className="text-center text-white px-4">
        <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-2 md:mb-4">
          {title}
        </h1>
        <p className="text-base md:text-lg lg:text-xl max-w-3xl mx-auto">
          {description}
        </p>
      </div>
    </section>
  );
}

export default HeroSection;
