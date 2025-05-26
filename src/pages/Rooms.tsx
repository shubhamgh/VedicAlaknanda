
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
    type: "Deluxe Single Room with Balcony",
    count: 15,
    description: "Comfortable rooms with private balcony with valley views",
    capacity: 2,
    price: 5000,
    amenities: ["Wi-Fi", "AC", "Smart TV", "Private Balcony"],
    image: "", // Will be filled manually
  },
  {
    id: 2,
    type: "Standard Family Room",
    count: 12,
    description: "Spacious deluxe room for the family",
    capacity: 3,
    price: 5000,
    amenities: ["Wi-Fi", "Smart TV"],
    image: "", // Will be filled manually
  },
  {
    id: 3,
    type: "Family Room with Terrace",
    count: 3,
    description:
      "Luxury and spacious room with direct access to terrace a splendid views",
    capacity: 3,
    price: 6000,
    amenities: ["Wi-Fi", "AC", "Smart TV", "Terrace"],
    image: "", // Will be filled manually
  },
];

export default function Rooms() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-64 bg-gradient-to-r from-hotel-dark to-hotel-gold flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Our Rooms</h1>
          <p className="text-lg md:text-xl">Comfortable accommodations for your perfect stay</p>
        </div>
      </section>

      <ContentSection
        id="rooms-content"
        title="Accommodation Options"
        subtitle="Choose from our variety of rooms designed for your comfort"
        className="bg-gray-50"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roomTypes.map((room) => (
            <Card key={room.id}>
              <CardHeader>
                <CardTitle>{room.type}</CardTitle>
                <CardDescription>{room.count} rooms available</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>{room.description}</p>
                  <p className="font-semibold">
                    Capacity: {room.capacity} guests
                  </p>
                  {room.amenities && room.amenities.length > 0 && (
                    <div>
                      <p className="font-semibold">Amenities:</p>
                      <ul className="list-disc list-inside">
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
      </ContentSection>
      
      <Footer />
    </div>
  );
}
