import { Card, CardContent } from "@/components/ui/card";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const Amenities = () => {
  const amenities = [
    {
      title: "High speed Wi-Fi",
      description: "Stay connected to the internet with high-speed Wi-Fi.",
    },
    {
      title: "Lift",
      description: "Access to the lift for easy navigation for all age groups.",
    },
    {
      title: "Room services",
      description: "Enjoy the convenience of room services.",
    },
    {
      title: "Parking",
      description: "Secure parking for your convenience.",
    },
    {
      title: "Secutity cameras",
      description:
        "Stay safe with our advanced security cameras throughout the public areas of hotel.",
    },
    {
      title: "On demand cab service",
      description:
        "Get a cab service on demand to all nearby attractions including Shri Badrinath, Kedarnath and Airport.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-center mb-8">Hotel Amenities</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {amenities.map((amenity, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-2">{amenity.title}</h2>
                <p className="text-gray-600">{amenity.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Amenities;
