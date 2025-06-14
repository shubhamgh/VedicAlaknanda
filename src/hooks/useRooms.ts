import { useState, useEffect, useCallback } from "react";
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

  const fetchRoomAvailabilityForDates = async (checkIn: string, checkOut: string) => {
    try {
      console.log("Fetching room availability for dates:", checkIn, checkOut);
      
      // Get all rooms
      const { data: rooms, error: roomsError } = await supabase
        .from("rooms")
        .select("id, number, type, status");

      if (roomsError) throw roomsError;

      // Get bookings that actually overlap with the selected date range
      // A booking overlaps if: booking.check_in < selected.check_out AND booking.check_out > selected.check_in
      const { data: overlappingBookings, error: bookingsError } = await supabase
        .from("bookings")
        .select("room_id")
        .lt("check_in", checkOut)
        .gt("check_out", checkIn)
        .neq("status", "cancelled");

      if (bookingsError) throw bookingsError;

      console.log("Overlapping bookings:", overlappingBookings);

      // Get room IDs that are booked during the selected period
      const bookedRoomIds = new Set(overlappingBookings?.map(booking => booking.room_id) || []);
      
      // Filter available rooms (not booked during the selected period)
      const availableRooms = (rooms || []).filter(room => !bookedRoomIds.has(room.id));
      
      console.log("Available rooms for dates:", availableRooms);

      // Group available rooms by type
      const roomGroups = availableRooms.reduce((acc, room) => {
        if (!acc[room.type]) {
          acc[room.type] = {
            type: room.type,
            totalCount: 0,
            availableCount: 0,
            availableRooms: [],
          };
        }
        acc[room.type].totalCount++;
        acc[room.type].availableCount++;
        acc[room.type].availableRooms.push(room);
        return acc;
      }, {} as Record<string, RoomTypeAvailability>);

      // Also include room types with no available rooms
      (rooms || []).forEach(room => {
        if (!roomGroups[room.type]) {
          roomGroups[room.type] = {
            type: room.type,
            totalCount: 1,
            availableCount: 0,
            availableRooms: [],
          };
        }
      });

      const availability = Object.values(roomGroups);
      console.log("Room availability by type:", availability);
      
      setRoomTypeAvailability(availability);
      return availability;
    } catch (error: any) {
      console.error("Error fetching room availability:", error);
      toast({
        title: "Error fetching room availability",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }
  };

  const fetchRoomInventoryForDate = useCallback(async (selectedDate: string) => {
    try {
      console.log("Fetching room inventory for date:", selectedDate);
      
      // Get all rooms
      const { data: rooms, error: roomsError } = await supabase
        .from("rooms")
        .select("id, number, type, status");

      if (roomsError) throw roomsError;

      // Get bookings that overlap with the selected date
      // A room is booked on a specific date if: booking.check_in <= date < booking.check_out
      const { data: overlappingBookings, error: bookingsError } = await supabase
        .from("bookings")
        .select("room_id")
        .lte("check_in", selectedDate)
        .gt("check_out", selectedDate)
        .neq("status", "cancelled");

      if (bookingsError) throw bookingsError;

      console.log("Bookings for date:", overlappingBookings);

      // Get room IDs that are booked on the selected date
      const bookedRoomIds = new Set(overlappingBookings?.map(booking => booking.room_id) || []);
      
      // Update room inventory with booking status for the specific date
      const inventoryWithBookingStatus = (rooms || []).map(room => ({
        ...room,
        status: bookedRoomIds.has(room.id) ? "booked" : "available"
      }));
      
      console.log("Room inventory for date:", inventoryWithBookingStatus);
      
      setRoomInventory(inventoryWithBookingStatus);
      return inventoryWithBookingStatus;
    } catch (error: any) {
      console.error("Error fetching room inventory for date:", error);
      toast({
        title: "Error fetching room inventory",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, []);

  return { 
    roomInventory, 
    roomTypeAvailability, 
    refetchRooms: fetchRooms, 
    fetchRoomAvailabilityForDates,
    fetchRoomInventoryForDate
  };
};
