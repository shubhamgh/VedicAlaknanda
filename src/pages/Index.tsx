
import React from "react";
import Header from "../components/Header";
import Slideshow from "../components/Slideshow";
import ContentSection from "../components/ContentSection";
import Footer from "../components/Footer";
import Reviews from "../components/Reviews";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <Slideshow />

      <div className="flex-1">
        <ContentSection
          id="welcome"
          title="Welcome to Hotel Vedic Alaknanda"
          subtitle="A sanctuary of luxury and comfort away from the city's hustle and bustle."
          className="bg-gray-50"
        >
          <div className="max-w-4xl mx-auto text-center px-4">
            <p className="mb-6 md:mb-8 text-gray-600 text-sm md:text-base">
              Unwind at our tranquil hotel in Narkota, Rudraprayag. Wake up to
              panoramic mountain and river views, right at Kedarnath and Badrinath
              routes. Perfect for pilgrims and nature lovers alike.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mt-8 md:mt-12">
              <Link
                to="/rooms"
                className="p-4 md:p-6 border border-gray-200 rounded-lg bg-hotel-gold hover:bg-opacity-90 transition-all touch-manipulation"
              >
                <h3 className="font-semibold text-lg md:text-xl mb-2 md:mb-3">
                  Luxury Accommodations
                </h3>
                <p className="text-white text-sm md:text-base">
                  Spacious rooms and suites designed for your ultimate comfort and
                  relaxation.
                </p>
              </Link>
              <Link
                to="/dining"
                className="p-4 md:p-6 border border-gray-200 rounded-lg bg-hotel-gold hover:bg-opacity-90 transition-all touch-manipulation"
              >
                <h3 className="font-semibold text-lg md:text-xl mb-2 md:mb-3">Fine Dining</h3>
                <p className="text-white text-sm md:text-base">
                  Savor culinary masterpieces in our hygenic and inviting
                  restaurants
                </p>
              </Link>
              <Link
                to="/amenities"
                className="p-4 md:p-6 border border-gray-200 rounded-lg bg-hotel-gold hover:bg-opacity-90 transition-all touch-manipulation"
              >
                <h3 className="font-semibold text-lg md:text-xl mb-2 md:mb-3">Premium Amenities</h3>
                <p className="text-white text-sm md:text-base">
                  24x7 security cameras, room service, high speed Wi-Fi, and more
                </p>
              </Link>
            </div>
          </div>
        </ContentSection>

        <Reviews />
      </div>

      <Footer />
    </main>
  );
};

export default Index;
