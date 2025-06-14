
import React, { useState, useEffect, useMemo } from "react";
import { useRooms } from "@/hooks/useRooms";
import { format, addDays } from "date-fns";
import DateSelector from "./DateSelector";
import RoomTypeSection from "./RoomTypeSection";
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

  useEffect(() => {
    if (inventoryDate) {
      const dateStr = format(inventoryDate, "yyyy-MM-dd");
      fetchRoomInventoryForDate(dateStr);
    }
  }, [inventoryDate, fetchRoomInventoryForDate]);

  const sortedRoomsByType = useMemo(() => {
    const roomsByType = roomInventory.reduce((acc, room) => {
      if (!acc[room.type]) {
        acc[room.type] = [];
      }
      acc[room.type].push(room);
      return acc;
    }, {} as Record<string, RoomInventory[]>);

    const sorted = {} as Record<string, RoomInventory[]>;
    Object.entries(roomsByType).forEach(([type, rooms]) => {
      sorted[type] = rooms.sort((a, b) => parseInt(a.number) - parseInt(b.number));
    });
    return sorted;
  }, [roomInventory]);

  const handleRoomClick = async (room: RoomInventory) => {
    if (room.status === "booked") {
      const dateStr = format(inventoryDate, "yyyy-MM-dd");
      const booking = await fetchBookingForRoomAndDate(room.id, dateStr);
      if (booking) {
        setSelectedBooking(booking);
        setSelectedRoom(room);
        setShowBookingDetails(true);
      }
    } else if (room.status === "available") {
      setSelectedRoom(room);
      
      const nextDay = addDays(inventoryDate, 1);
      
      setNewBookingDates({ start: inventoryDate, end: nextDay });
      
      const checkInStr = format(inventoryDate, "yyyy-MM-dd");
      const checkOutStr = format(nextDay, "yyyy-MM-dd");
      await fetchRoomAvailabilityForDates(checkInStr, checkOutStr);
      
      setShowNewBookingModal(true);
    }
  };

  const handleNewBooking = async () => {
    if (!selectedRoom) return;
    
    setShowBookingDetails(false);
    
    const nextDay = addDays(inventoryDate, 1);
    const dayAfter = addDays(nextDay, 1);
    
    setNewBookingDates({ start: nextDay, end: dayAfter });
    
    const nextDayStr = format(nextDay, "yyyy-MM-dd");
    const dayAfterStr = format(dayAfter, "yyyy-MM-dd");
    await fetchRoomAvailabilityForDates(nextDayStr, dayAfterStr);
    
    setShowNewBookingModal(true);
  };

  const handleBookingSubmit = async (data: any) => {
    console.log("New booking data:", data);
    setShowNewBookingModal(false);
    setNewBookingDates(null);
    setSelectedRoom(null);
    const dateStr = format(inventoryDate, "yyyy-MM-dd");
    fetchRoomInventoryForDate(dateStr);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <DateSelector 
        inventoryDate={inventoryDate}
        onDateChange={setInventoryDate}
      />

      {Object.entries(sortedRoomsByType).map(([roomType, roomList]) => (
        <RoomTypeSection
          key={roomType}
          roomType={roomType}
          rooms={roomList}
          inventoryDate={inventoryDate}
          onRoomClick={handleRoomClick}
        />
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
