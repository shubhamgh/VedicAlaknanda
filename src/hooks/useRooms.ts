import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Room {
  id: string;
  room_number: string;
  room_type: string;
  price_per_night: number;
  total_rooms: number;
  available_rooms: number;
}

export const useRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase.from("rooms").select("*");

      if (error) throw error;

      // Map the database fields to our interface
      const mappedRooms: Room[] = (data || []).map((room: any) => ({
        id: room.id,
        room_number: room.number,
        room_type: room.type,
        price_per_night: room.price_per_night,
        total_rooms: room.total_rooms,
        available_rooms: room.available_rooms,
      }));

      setRooms(mappedRooms);
    } catch (error: any) {
      toast({
        title: "Error fetching rooms",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return { rooms };
};