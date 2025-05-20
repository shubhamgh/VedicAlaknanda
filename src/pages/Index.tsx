import React from "react";
import Header from "../components/Header";
import Slideshow from "../components/Slideshow";
import ContentSection from "../components/ContentSection";
import Footer from "../components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Header />
      <Slideshow />

      <ContentSection
        id="welcome"
        title="Welcome to Hotel Vedic Alaknanda"
        subtitle="A sanctuary of luxury and comfort away from the city's hustle and bustle."
        className="bg-white"
      >
        <div className="max-w-4xl mx-auto text-center">
          <p className="mb-8 text-gray-600">
            Unwind at our tranquil hotel in Narkota, Rudraprayag. Wake up to
            panoramic mountain and river views, just minutes from Kedarnath and
            Badrinath routes. Perfect for pilgrims and nature lovers alike.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-xl mb-3">
                Luxury Accommodations
              </h3>
              <p className="text-gray-600">
                Spacious rooms and suites designed for your ultimate comfort and
                relaxation.
              </p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-xl mb-3">Fine Dining</h3>
              <p className="text-gray-600">
                Savor culinary masterpieces in our hygenic and inviting
                restaurants
              </p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-xl mb-3">Premium Amenities</h3>
              <p className="text-gray-600">
                24x7 security cameras, room service, high speed Wi-Fi, and more
              </p>
            </div>
          </div>
        </div>
      </ContentSection>

      {/* More content sections can be added here in the future */}

      <Footer />
    </main>
  );
};

export default Index;
