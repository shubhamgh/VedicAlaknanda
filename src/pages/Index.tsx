
import React from 'react';
import Header from '../components/Header';
import Slideshow from '../components/Slideshow';
import ContentSection from '../components/ContentSection';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <main className="min-h-screen">
      <Header />
      <Slideshow />
      
      <ContentSection
        id="welcome"
        title="Welcome to Grand Hotel"
        subtitle="A sanctuary of luxury and comfort in the heart of the city"
        className="bg-white"
      >
        <div className="max-w-4xl mx-auto text-center">
          <p className="mb-8 text-gray-600">
            Nestled in the heart of the vibrant cityscape, Grand Hotel offers an unparalleled blend of timeless elegance and contemporary luxury. 
            Our commitment to exceptional service ensures that each guest experiences the pinnacle of hospitality.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-xl mb-3">Luxury Accommodations</h3>
              <p className="text-gray-600">Spacious rooms and suites designed for your ultimate comfort and relaxation.</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-xl mb-3">Fine Dining</h3>
              <p className="text-gray-600">Exquisite culinary experiences crafted by award-winning chefs.</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-xl mb-3">Premium Amenities</h3>
              <p className="text-gray-600">From spa services to fitness facilities, enjoy our world-class amenities.</p>
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
