import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface RoomInventory {
  id: string;
  number: string;
  type: string;
  status: string;
}

interface RoomTypeAvailability {
  type: string;
  availableCount: number;
  totalCount: number;
  availableRooms: RoomInventory[];
}

export const useRooms = () => {
  const [roomInventory, setRoomInventory] = useState<RoomInventory[]>([]);
  const [roomTypeAvailability, setRoomTypeAvailability] = useState<
    RoomTypeAvailability[]
  >([]);

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from("rooms")
        .select("id, number, type, status");

      if (error) throw error;

      setRoomInventory(data || []);

      // Group rooms by type and calculate availability
      const roomGroups = (data || []).reduce((acc, room) => {
        if (!acc[room.type]) {
          acc[room.type] = {
            type: room.type,
            totalCount: 0,
            availableCount: 0,
            availableRooms: [],
          };
        }
        acc[room.type].totalCount++;
        if (room.status === "available") {
          acc[room.type].availableCount++;
          acc[room.type].availableRooms.push(room);
        }
        return acc;
      }, {} as Record<string, RoomTypeAvailability>);

      setRoomTypeAvailability(Object.values(roomGroups));
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

  return { roomInventory, roomTypeAvailability, refetchRooms: fetchRooms };
};
