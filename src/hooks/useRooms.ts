
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Room {
  id: string;
  room_number: string;
  room_type: string;
  price_per_night: number;
}

export const useRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from("rooms")
        .select("id, number, type, status");

      if (error) throw error;

      // Transform the data to match the expected interface
      const transformedRooms = (data || []).map(room => ({
        id: room.id,
        room_number: room.number,
        room_type: room.type,
        price_per_night: room.type === "Family Room with Terrace" ? 6000 : 5000 // Set price based on type
      }));

      setRooms(transformedRooms);
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
