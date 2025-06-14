
import React, { useState, useEffect, useMemo } from "react";
import { useRooms } from "@/hooks/useRooms";
import { format, addDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import BookingDetailsModal from "./BookingDetailsModal";
import AdminBookingModal from "./AdminBookingModal";

interface RoomInventory {
  id: string;
  number: string;
  type: string;
  status: string;
}

interface BookingDetails {
  id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in: string;
  check_out: string;
  adults: number;
  children: number;
  total_price: number;
  status: string;
  special_requests?: string;
}

const InventoryTab = () => {
  const { roomInventory, fetchRoomInventoryForDate, fetchBookingForRoomAndDate, roomTypeAvailability, fetchRoomAvailabilityForDates } = useRooms();
  const [inventoryDate, setInventoryDate] = useState<Date>(new Date());
  const [selectedBooking, setSelectedBooking] = useState<BookingDetails | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<RoomInventory | null>(null);
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [showNewBookingModal, setShowNewBookingModal] = useState(false);
  const [newBookingDates, setNewBookingDates] = useState<{ start: Date; end: Date } | null>(null);

  // Add useEffect for inventory date changes
  useEffect(() => {
    if (inventoryDate) {
      const dateStr = format(inventoryDate, "yyyy-MM-dd");
      fetchRoomInventoryForDate(dateStr);
    }
  }, [inventoryDate, fetchRoomInventoryForDate]);

  // Group rooms by type for inventory display and sort by room number
  const roomsByType = useMemo(() => {
    return roomInventory.reduce((acc, room) => {
      if (!acc[room.type]) {
        acc[room.type] = [];
      }
      acc[room.type].push(room);
      return acc;
    }, {} as Record<string, RoomInventory[]>);
  }, [roomInventory]);

  // Sort rooms within each type by room number
  const sortedRoomsByType = useMemo(() => {
    const sorted = {} as Record<string, RoomInventory[]>;
    Object.entries(roomsByType).forEach(([type, rooms]) => {
      sorted[type] = rooms.sort((a, b) => parseInt(a.number) - parseInt(b.number));
    });
    return sorted;
  }, [roomsByType]);

  const handleRoomClick = async (room: RoomInventory) => {
    if (room.status === "booked") {
      // Show booking details for booked rooms
      const dateStr = format(inventoryDate, "yyyy-MM-dd");
      const booking = await fetchBookingForRoomAndDate(room.id, dateStr);
      if (booking) {
        setSelectedBooking(booking);
        setSelectedRoom(room);
        setShowBookingDetails(true);
      }
    } else if (room.status === "available") {
      // Show new booking modal for available rooms
      setSelectedRoom(room);
      
      // Set dates for the selected date as a single night booking
      const nextDay = addDays(inventoryDate, 1);
      
      setNewBookingDates({ start: inventoryDate, end: nextDay });
      
      // Fetch availability for the selected date
      const checkInStr = format(inventoryDate, "yyyy-MM-dd");
      const checkOutStr = format(nextDay, "yyyy-MM-dd");
      await fetchRoomAvailabilityForDates(checkInStr, checkOutStr);
      
      setShowNewBookingModal(true);
    }
  };

  const handleNewBooking = async () => {
    if (!selectedRoom) return;
    
    setShowBookingDetails(false);
    
    // Set dates for the next night after the current booking
    const nextDay = addDays(inventoryDate, 1);
    const dayAfter = addDays(nextDay, 1);
    
    setNewBookingDates({ start: nextDay, end: dayAfter });
    
    // Fetch availability for the next night
    const nextDayStr = format(nextDay, "yyyy-MM-dd");
    const dayAfterStr = format(dayAfter, "yyyy-MM-dd");
    await fetchRoomAvailabilityForDates(nextDayStr, dayAfterStr);
    
    setShowNewBookingModal(true);
  };

  const handleBookingSubmit = async (data: any) => {
    // Handle booking submission logic here
    console.log("New booking data:", data);
    setShowNewBookingModal(false);
    setNewBookingDates(null);
    setSelectedRoom(null);
    // Refresh inventory after booking
    const dateStr = format(inventoryDate, "yyyy-MM-dd");
    fetchRoomInventoryForDate(dateStr);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Select Date for Inventory</CardTitle>
          <CardDescription>
            Choose a date to view room availability and booking status. Click on booked rooms to view details or available rooms to create a new booking.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full md:w-auto justify-start text-left font-normal",
                  !inventoryDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {inventoryDate ? format(inventoryDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={inventoryDate}
                onSelect={(date) => date && setInventoryDate(date)}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>

      {Object.entries(sortedRoomsByType).map(([roomType, roomList]) => (
        <Card key={roomType}>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">{roomType}</CardTitle>
            <CardDescription>
              {roomList.length} rooms total - Status for {format(inventoryDate, "PPP")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {roomList.map((room) => (
                <div
                  key={room.id}
                  className={`p-2 sm:p-3 rounded border text-center text-sm cursor-pointer transition-colors ${
                    room.status === "available"
                      ? "bg-green-100 border-green-300 hover:bg-green-200"
                      : "bg-red-100 border-red-300 hover:bg-red-200"
                  }`}
                  onClick={() => handleRoomClick(room)}
                >
                  <div className="font-semibold text-xs sm:text-sm">
                    Room {room.number}
                  </div>
                  <div className="text-xs capitalize">
                    {room.status}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <BookingDetailsModal
        isOpen={showBookingDetails}
        onClose={() => setShowBookingDetails(false)}
        booking={selectedBooking}
        roomNumber={selectedRoom?.number || ""}
        onNewBooking={handleNewBooking}
      />

      <AdminBookingModal
        isOpen={showNewBookingModal}
        onClose={() => {
          setShowNewBookingModal(false);
          setNewBookingDates(null);
          setSelectedRoom(null);
        }}
        selectedBooking={null}
        selectedDates={newBookingDates}
        selectedRoom={selectedRoom}
        rooms={roomInventory}
        roomTypeAvailability={roomTypeAvailability}
        onSubmit={handleBookingSubmit}
        onFetchAvailability={fetchRoomAvailabilityForDates}
      />
    </div>
  );
};

export default InventoryTab;
