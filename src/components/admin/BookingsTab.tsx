
import React, { useState, useEffect, useMemo } from "react";
import { useBookings } from "@/hooks/useBookings";
import { useRooms } from "@/hooks/useRooms";
import BookingCalendar from "@/components/admin/BookingCalendar";
import BookingsList from "@/components/admin/BookingsList";
import AdminBookingModal from "@/components/admin/AdminBookingModal";

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  roomType: string;
  resource: any;
}

interface Room {
  id: string;
  room_number: string;
  room_type: string;
  price_per_night: number;
}

const BookingsTab = () => {
  const { bookings, handleDeleteBooking, handleBookingSubmit } = useBookings();
  const { roomInventory, roomTypeAvailability, refetchRooms, fetchRoomAvailabilityForDates } = useRooms();

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDates, setSelectedDates] = useState<{
    start: Date;
    end: Date;
  } | null>(null);
  const [selectedRoomType, setSelectedRoomType] = useState<string | null>(null);
  const [filteredBookings, setFilteredBookings] = useState<any[]>([]);

  // Convert bookings to calendar events
  useEffect(() => {
    const newEvents = bookings.map((booking) => {
      const room = roomInventory.find((r) => r.id === booking.room_id);
      const roomType = room ? room.type : "Unknown room";
      const roomNumber = room ? room.number : "Unknown";

      return {
        id: booking.id,
        title: `${booking.guest_name} - ${roomNumber}`,
        start: new Date(booking.check_in_date),
        end: new Date(booking.check_out_date),
        roomType: roomType,
        resource: booking,
      };
    });

    setEvents(newEvents);
  }, [bookings, roomInventory]);

  // Filter bookings based on selected room type
  useEffect(() => {
    if (selectedRoomType) {
      const roomIds = roomInventory
        .filter((room) => room.type === selectedRoomType)
        .map((room) => room.id);

      const filtered = bookings.filter((booking) =>
        roomIds.includes(booking.room_id)
      );

      setFilteredBookings(filtered);
    } else {
      setFilteredBookings(bookings);
    }
  }, [selectedRoomType, bookings, roomInventory]);

  // Transform roomInventory to Room type for BookingsList
  const transformedRooms = useMemo(() => {
    return roomInventory.map((room): Room => ({
      id: room.id,
      room_number: room.number,
      room_type: room.type,
      price_per_night: room.type === "Family Room with Terrace" ? 6000 : 5000,
    }));
  }, [roomInventory]);

  const handleSelect = ({ start, end }: { start: Date; end: Date }) => {
    setSelectedDates({ start, end });
    setSelectedBooking(null);
    setIsModalOpen(true);
  };

  const handleEventSelect = (event: CalendarEvent) => {
    setSelectedBooking(event.resource);
    setSelectedDates(null);
    setIsModalOpen(true);
  };

  const handleRoomTypeSelect = (roomType: string) => {
    setSelectedRoomType((prevType) =>
      prevType === roomType ? null : roomType
    );
  };

  const handleSubmit = async (bookingData: any) => {
    const success = await handleBookingSubmit(bookingData, selectedBooking);
    if (success) {
      setIsModalOpen(false);
      refetchRooms();
    }
  };

  return (
    <div className="space-y-4">
      <BookingCalendar
        events={events}
        rooms={roomInventory}
        onSelectSlot={handleSelect}
        onSelectEvent={handleEventSelect}
        onSelectRoomType={handleRoomTypeSelect}
      />

      {selectedRoomType && (
        <div className="bg-blue-100 p-3 rounded-md">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="text-sm">
              Filtering by: <strong>{selectedRoomType}</strong>
            </span>
            <button
              className="text-blue-500 hover:text-blue-700 text-sm underline"
              onClick={() => setSelectedRoomType(null)}
            >
              Clear filter
            </button>
          </div>
        </div>
      )}

      <BookingsList
        bookings={filteredBookings}
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
        selectedDates={selectedDates}
        rooms={roomInventory}
        roomTypeAvailability={roomTypeAvailability}
        onSubmit={handleSubmit}
        onFetchAvailability={fetchRoomAvailabilityForDates}
      />
    </div>
  );
};

export default BookingsTab;
