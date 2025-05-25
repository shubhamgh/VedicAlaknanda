import React from "react";
import Header from "../components/Header";
import Slideshow from "../components/Slideshow";
import ContentSection from "../components/ContentSection";
import Footer from "../components/Footer";
import Reviews from "../components/Reviews";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Header />
      <Slideshow />

      <ContentSection
        id="welcome"
        title="Welcome to Hotel Vedic Alaknanda"
        subtitle="A sanctuary of luxury and comfort away from the city's hustle and bustle."
        className="bg-gray-50"
      >
        <div className="max-w-4xl mx-auto text-center">
          <p className="mb-8 text-gray-600">
            Unwind at our tranquil hotel in Narkota, Rudraprayag. Wake up to
            panoramic mountain and river views, right at Kedarnath and Badrinath
            routes. Perfect for pilgrims and nature lovers alike.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <Link
              to={"/Rooms"}
              className="p-6 border border-gray-200 rounded-lg bg-hotel-gold"
            >
              <h3 className="font-semibold text-xl mb-3">
                Luxury Accommodations
              </h3>
              <p className="text-white">
                Spacious rooms and suites designed for your ultimate comfort and
                relaxation.
              </p>
            </Link>
            <Link
              to={"/Dining"}
              className="p-6 border border-gray-200 rounded-lg bg-hotel-gold"
            >
              <h3 className="font-semibold text-xl mb-3">Fine Dining</h3>
              <p className="text-white">
                Savor culinary masterpieces in our hygenic and inviting
                restaurants
              </p>
            </Link>
            <Link
              to={"/amenities"}
              className="p-6 border border-gray-200 rounded-lg bg-hotel-gold"
            >
              <h3 className="font-semibold text-xl mb-3">Premium Amenities</h3>
              <p className="text-white">
                24x7 security cameras, room service, high speed Wi-Fi, and more
              </p>
            </Link>
          </div>
        </div>
      </ContentSection>

      <Reviews />

      {/* More content sections can be added here in the future */}

      <Footer />
    </main>
  );
};

export default Index;
