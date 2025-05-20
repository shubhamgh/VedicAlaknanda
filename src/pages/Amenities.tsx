import { Card, CardContent } from "@/components/ui/card";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const Amenities = () => {
  const amenities = [
    {
      title: "Swimming Pool",
      description: "Enjoy our outdoor swimming pool with stunning views.",
    },
    {
      title: "Fitness Center",
      description: "Stay fit in our fully-equipped fitness center.",
    },
    {
      title: "Spa",
      description: "Relax and rejuvenate with our spa services.",
    },
    {
      title: "Business Center",
      description: "Stay connected in our modern business center.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
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