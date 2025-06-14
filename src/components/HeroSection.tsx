
import React from "react";

interface HeroSectionProps {
  title: string;
  description: string;
}

function HeroSection({ title, description }: HeroSectionProps) {
  return (
    <section 
      className="relative h-64 md:h-64 flex items-center justify-center"
      style={{
        background: 'linear-gradient(to right, #1f2937, #eab308)'
      }}
    >
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
