import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Room {
  id: string;
  number: string;
  type: string;
  capacity: number;
  price_per_night: number;
  description: string | null;
  amenities: string[] | null;
  status: string;
}

export default function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    async function fetchRooms() {
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("status", "available");

      if (error) {
        console.error("Error fetching rooms:", error);
        return;
      }

      setRooms(data || []);
    }

    fetchRooms();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Our Rooms</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <Card key={room.id}>
              <CardHeader>
                <CardTitle>{room.type}</CardTitle>
                <CardDescription>Room {room.number}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>{room.description}</p>
                  <p className="font-semibold">
                    Capacity: {room.capacity} guests
                  </p>
                  <p className="font-semibold">
                    Price: ${room.price_per_night} per night
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
      </main>
      <Footer />
    </div>
  );
}
