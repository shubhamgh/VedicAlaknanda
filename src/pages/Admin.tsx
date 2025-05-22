import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useBookings } from "@/hooks/useBookings";
import { useRooms } from "@/hooks/useRooms";
import AdminHeader from "@/components/admin/AdminHeader";
import BookingCalendar from "@/components/admin/BookingCalendar";
import BookingsList from "@/components/admin/BookingsList";
import AdminBookingModal from "@/components/admin/AdminBookingModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  roomType: string;
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
  const [selectedRoomType, setSelectedRoomType] = useState<string | null>(null);
  const [filteredBookings, setFilteredBookings] = useState<any[]>([]);

  // Convert bookings to calendar events with room types
  useEffect(() => {
    const newEvents = bookings.map((booking) => {
      const room = rooms.find((r) => r.id === booking.room_id);
      const roomType = room ? room.room_type : "Unknown room";
      const roomNumber = room ? room.room_number : "Unknown";
      
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
  }, [bookings, rooms]);

  // Filter bookings based on selected room type
  useEffect(() => {
    if (selectedRoomType) {
      const roomIds = rooms
        .filter(room => room.room_type === selectedRoomType)
        .map(room => room.id);
      
      const filtered = bookings.filter(booking => 
        roomIds.includes(booking.room_id)
      );
      
      setFilteredBookings(filtered);
    } else {
      setFilteredBookings(bookings);
    }
  }, [selectedRoomType, bookings, rooms]);

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
    setSelectedRoomType(prevType => prevType === roomType ? null : roomType);
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
        <Tabs defaultValue="bookings">
          <TabsList className="mb-4">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="inventory">Room Inventory</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <BookingCalendar 
              events={events}
              rooms={rooms}
              onSelectSlot={handleSelect}
              onSelectEvent={handleEventSelect}
              onSelectRoomType={handleRoomTypeSelect}
            />

            <div className="mb-4">
              {selectedRoomType && (
                <div className="bg-blue-100 p-2 rounded-md inline-flex items-center">
                  <span>Filtering by room type: <strong>{selectedRoomType}</strong></span>
                  <button 
                    className="ml-2 text-blue-500 hover:text-blue-700"
                    onClick={() => setSelectedRoomType(null)}
                  >
                    Clear filter
                  </button>
                </div>
              )}
            </div>

            <BookingsList
              bookings={filteredBookings}
              rooms={rooms}
              onEditBooking={(booking) => {
                setSelectedBooking(booking);
                setIsModalOpen(true);
              }}
              onDeleteBooking={handleDeleteBooking}
            />
          </TabsContent>

          <TabsContent value="inventory">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <Card key={room.id}>
                  <CardHeader>
                    <CardTitle>{room.type}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p>Room Number: {room.number}</p>
                      <p>Total Rooms: {room.total_rooms}</p>
                      <p>Available Rooms: {room.available_rooms}</p>
                      <p>Price per Night: ₹{room.price_per_night}</p>
                      <div className="mt-4 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-full bg-green-500 rounded-full"
                          style={{ 
                            width: `${(room.available_rooms / room.total_rooms) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
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