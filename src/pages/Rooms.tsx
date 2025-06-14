
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContentSection from "@/components/ContentSection";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const roomTypes = [
  {
    id: 1,
    type: "Deluxe Room with Balcony",
    size: "180 sq.ft",
    count: 15,
    description: "Comfortable rooms with private balcony with valley views",
    amenities: ["Wi-Fi", "AC", "Smart TV", "Private Balcony"],
    image: "", // Will be filled manually
  },
  {
    id: 2,
    type: "Standard Family Room",
    size: "205 sq.ft",
    count: 12,
    description: "Spacious deluxe room for the family",
    amenities: ["Wi-Fi", "Smart TV"],
    image: "", // Will be filled manually
  },
  {
    id: 3,
    type: "Family Room with Terrace",
    size: "215 sq.ft",
    count: 3,
    description:
      "Luxury and spacious room with direct access to terrace a splendid views",
    amenities: ["Wi-Fi", "AC", "Smart TV", "Terrace"],
    image: "", // Will be filled manually
  },
];

export default function Rooms() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative h-48 md:h-64 bg-gradient-to-r from-hotel-dark to-hotel-gold flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-2 md:mb-4">
            Accommodation Options
          </h1>
          <p className="text-base md:text-lg lg:text-xl">
            Choose from our variety of rooms designed for your comfort
          </p>
        </div>
      </section>

      <div className="flex-1 bg-gray-50 py-8 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {roomTypes.map((room) => (
            <Card key={room.id} className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg md:text-xl">{room.type}</CardTitle>
                <CardDescription className="text-sm">{room.count} rooms available</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <p className="text-sm md:text-base">{room.description}</p>
                  <p className="font-semibold text-sm md:text-base">Room size: {room.size}</p>
                  {room.amenities && room.amenities.length > 0 && (
                    <div>
                      <p className="font-semibold text-sm md:text-base">Amenities:</p>
                      <ul className="list-disc list-inside text-sm md:text-base">
                        {room.amenities.map((amenity, index) => (
                          <li key={index}>{amenity}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
