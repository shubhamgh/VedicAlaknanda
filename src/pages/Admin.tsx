
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useBookings } from "@/hooks/useBookings";
import { useRooms } from "@/hooks/useRooms";
import AdminHeader from "@/components/admin/AdminHeader";
import BookingCalendar from "@/components/admin/BookingCalendar";
import BookingsList from "@/components/admin/BookingsList";
import AdminBookingModal from "@/components/admin/AdminBookingModal";

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: any;
}

const Admin = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, handleLogout } = useAdminAuth();
  const { bookings, handleDeleteBooking, handleBookingSubmit } = useBookings();
  const { rooms } = useRooms();
  
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDates, setSelectedDates] = useState<{
    start: Date;
    end: Date;
  } | null>(null);

  // Convert bookings to calendar events
  useEffect(() => {
    const newEvents = bookings.map((booking) => {
      const room = rooms.find((r) => r.id === booking.room_id);
      const roomType = room ? room.room_type : "Unknown room";
      
      return {
        id: booking.id,
        title: `${booking.guest_name} - ${roomType}`,
        start: new Date(booking.check_in_date),
        end: new Date(booking.check_out_date),
        resource: booking,
      };
    });

    setEvents(newEvents);
  }, [bookings, rooms]);

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

  const handleSubmit = async (bookingData: any) => {
    const success = await handleBookingSubmit(bookingData, selectedBooking);
    if (success) {
      setIsModalOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader 
        onViewWebsite={() => navigate("/")} 
        onLogout={handleLogout} 
      />
      
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <BookingCalendar 
          events={events}
          onSelectSlot={handleSelect}
          onSelectEvent={handleEventSelect}
        />

        <BookingsList
          bookings={bookings}
          rooms={rooms}
          onEditBooking={(booking) => {
            setSelectedBooking(booking);
            setIsModalOpen(true);
          }}
          onDeleteBooking={handleDeleteBooking}
        />
      </main>

      <AdminBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedBooking={selectedBooking}
        selectedDates={selectedDates}
        rooms={rooms}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Admin;
