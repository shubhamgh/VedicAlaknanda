
import React, { useState, useMemo } from "react";
import { useBookings } from "@/hooks/useBookings";
import { useRooms } from "@/hooks/useRooms";
import BookingsList from "@/components/admin/BookingsList";
import AdminBookingModal from "@/components/admin/AdminBookingModal";
import { Button } from "@/components/ui/button";

interface Room {
  id: string;
  room_number: string;
  room_type: string;
  price_per_night: number;
}

const AllBookingsTab = () => {
  const { bookings, handleDeleteBooking, handleBookingSubmit } = useBookings();
  const { roomInventory, roomTypeAvailability, refetchRooms, fetchRoomAvailabilityForDates } = useRooms();

  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedRoomType, setSelectedRoomType] = useState<string | null>(null);

  // Transform roomInventory to Room type for BookingsList
  const transformedRooms = useMemo(() => {
    return roomInventory.map((room): Room => ({
      id: room.id,
      room_number: room.number,
      room_type: room.type,
      price_per_night: room.type === "Family Room with Terrace" ? 6000 : 5000,
    }));
  }, [roomInventory]);

  // Filter bookings based on selected room type and sort by future bookings first
  const filteredAndSortedBookings = useMemo(() => {
    let filtered = bookings;
    
    if (selectedRoomType) {
      const roomIds = roomInventory
        .filter((room) => room.type === selectedRoomType)
        .map((room) => room.id);
      filtered = bookings.filter((booking) =>
        roomIds.includes(booking.room_id)
      );
    }

    // Sort by check-in date with future bookings first
    return filtered.sort((a, b) => {
      const dateA = new Date(a.check_in_date);
      const dateB = new Date(b.check_in_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const aIsFuture = dateA >= today;
      const bIsFuture = dateB >= today;

      if (aIsFuture && !bIsFuture) return -1;
      if (!aIsFuture && bIsFuture) return 1;
      
      return dateA.getTime() - dateB.getTime();
    });
  }, [selectedRoomType, bookings, roomInventory]);

  // Get unique room types for filtering
  const roomTypes = useMemo(() => {
    return [...new Set(roomInventory.map(room => room.type))];
  }, [roomInventory]);

  const handleSubmit = async (bookingData: any) => {
    const success = await handleBookingSubmit(bookingData, selectedBooking);
    if (success) {
      setIsModalOpen(false);
      refetchRooms();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm font-medium">Filter by Room Type:</span>
        <Button
          variant={selectedRoomType === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedRoomType(null)}
        >
          All Rooms
        </Button>
        {roomTypes.map((roomType) => (
          <Button
            key={roomType}
            variant={selectedRoomType === roomType ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedRoomType(roomType)}
          >
            {roomType}
          </Button>
        ))}
      </div>

      <BookingsList
        bookings={filteredAndSortedBookings}
        rooms={transformedRooms}
        onEditBooking={(booking) => {
          setSelectedBooking(booking);
          setIsModalOpen(true);
        }}
        onDeleteBooking={handleDeleteBooking}
      />

      <AdminBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedBooking={selectedBooking}
        selectedDates={null}
        rooms={roomInventory}
        roomTypeAvailability={roomTypeAvailability}
        onSubmit={handleSubmit}
        onFetchAvailability={fetchRoomAvailabilityForDates}
        lockDates={false}
      />
    </div>
  );
};

export default AllBookingsTab;
