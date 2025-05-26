
import { Card, CardContent } from "@/components/ui/card";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ContentSection from "@/components/ContentSection";
import {
  Wifi,
  ArrowUpDown,
  Bell,
  Car,
  Camera,
  CarTaxiFront,
} from "lucide-react";

const Amenities = () => {
  const amenities = [
    {
      title: "High speed Wi-Fi",
      description: "Stay connected to the internet with high-speed Wi-Fi.",
      icon: <Wifi className="h-8 w-8 text-hotel-gold mb-4" />,
    },
    {
      title: "Lift",
      description: "Access to the lift for easy navigation for all age groups.",
      icon: <ArrowUpDown className="h-8 w-8 text-hotel-gold mb-4" />,
    },
    {
      title: "Room services",
      description: "Enjoy the convenience of room services.",
      icon: <Bell className="h-8 w-8 text-hotel-gold mb-4" />,
    },
    {
      title: "Parking",
      description: "Secure parking for your convenience.",
      icon: <Car className="h-8 w-8 text-hotel-gold mb-4" />,
    },
    {
      title: "Security cameras",
      description:
        "Stay safe with our advanced security cameras throughout the public areas of hotel.",
      icon: <Camera className="h-8 w-8 text-hotel-gold mb-4" />,
    },
    {
      title: "On demand cab service",
      description:
        "Get a cab service on demand to all nearby attractions including Shri Badrinath, Kedarnath and Airport.",
      icon: <CarTaxiFront className="h-8 w-8 text-hotel-gold mb-4" />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-64 bg-gradient-to-r from-hotel-dark to-hotel-gold flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Hotel Amenities</h1>
          <p className="text-lg md:text-xl">Modern comforts and convenience for your perfect stay</p>
        </div>
      </section>

      <ContentSection
        id="amenities-content"
        title="Premium Facilities"
        subtitle="Enjoy our comprehensive range of amenities designed for your comfort and convenience"
        className="bg-gray-50"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {amenities.map((amenity, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  {amenity.icon}
                  <h2 className="text-xl font-semibold mb-2">
                    {amenity.title}
                  </h2>
                  <p className="text-gray-600">{amenity.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ContentSection>
      
      <Footer />
    </div>
  );
};

export default Amenities;
