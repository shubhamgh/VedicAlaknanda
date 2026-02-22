import { Card, CardContent } from "@/components/ui/card";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeroSection from "../components/HeroSection";
import {
  Wifi,
  ArrowUpDown,
  Bell,
  Car,
  Camera,
  CarTaxiFront,
  Stethoscope,
} from "lucide-react";

const Amenities = () => {
  const amenities = [
    {
      title: "High speed Wi-Fi",
      description: "Stay connected to the internet with high-speed Wi-Fi.",
      icon: (
        <Wifi className="h-6 w-6 md:h-8 md:w-8 text-hotel-gold mb-3 md:mb-4" />
      ),
    },
    {
      title: "Lift",
      description: "Access to the lift for easy navigation for all age groups.",
      icon: (
        <ArrowUpDown className="h-6 w-6 md:h-8 md:w-8 text-hotel-gold mb-3 md:mb-4" />
      ),
    },
    {
      title: "Room services",
      description: "Enjoy the convenience of room services.",
      icon: (
        <Bell className="h-6 w-6 md:h-8 md:w-8 text-hotel-gold mb-3 md:mb-4" />
      ),
    },
    {
      title: "Parking",
      description: "Secure parking for your convenience.",
      icon: (
        <Car className="h-6 w-6 md:h-8 md:w-8 text-hotel-gold mb-3 md:mb-4" />
      ),
    },
    {
      title: "Security cameras",
      description:
        "Stay safe with our advanced security cameras throughout the public areas of hotel.",
      icon: (
        <Camera className="h-6 w-6 md:h-8 md:w-8 text-hotel-gold mb-3 md:mb-4" />
      ),
    },
    {
      title: "On demand cab service",
      description:
        "Get a cab service on demand to all nearby attractions including Shri Badrinath, Kedarnath and Airport.",
      icon: (
        <CarTaxiFront className="h-6 w-6 md:h-8 md:w-8 text-hotel-gold mb-3 md:mb-4" />
      ),
    },
    {
      title: "Doctor on Call",
      description:
        "For your peace of mind, we offer prompt access to medical assistance with a doctor available on call.",
      icon: (
        <Stethoscope className="h-6 w-6 md:h-8 md:w-8 text-hotel-gold mb-3 md:mb-4" />
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <HeroSection
        title="Premium Facilities"
        description="Enjoy our comprehensive range of amenities designed for your comfort and convenience"
      />

      <div className="flex-1 bg-gray-50 py-8 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {amenities.map((amenity, index) => (
            <Card key={index} className="h-full">
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col items-center text-center h-full">
                  {amenity.icon}
                  <h2 className="text-lg md:text-xl font-semibold mb-2">
                    {amenity.title}
                  </h2>
                  <p className="text-gray-600 text-sm md:text-base flex-1">
                    {amenity.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Amenities;
