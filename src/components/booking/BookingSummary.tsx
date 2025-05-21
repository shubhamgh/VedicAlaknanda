
import React from 'react';
import { format } from 'date-fns';
import { calculateNights } from '@/utils/validationUtils';

interface Room {
  id: string;
  room_number: string;
  room_type: string;
  price_per_night: number;
}

interface BookingSummaryProps {
  selectedRoomId: string;
  checkInDate?: Date | null;
  checkOutDate?: Date | null;
  rooms: Room[];
}

const BookingSummary: React.FC<BookingSummaryProps> = ({ 
  selectedRoomId, 
  checkInDate, 
  checkOutDate,
  rooms 
}) => {
  if (!selectedRoomId || !checkInDate || !checkOutDate) {
    return null;
  }
  
  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);
  const nights = calculateNights(checkInDate, checkOutDate);
  const totalPrice = selectedRoom ? nights * selectedRoom.price_per_night : 0;
  
  return (
    <div className="p-4 bg-gray-50 rounded-md">
      <h3 className="font-semibold mb-2">Booking Summary</h3>
      <div className="space-y-1 text-sm">
        <p>
          Room: {selectedRoom?.room_type || ""}
        </p>
        <p>
          Check-in: {checkInDate ? format(checkInDate, "PPP") : "Not selected"}
        </p>
        <p>
          Check-out: {checkOutDate ? format(checkOutDate, "PPP") : "Not selected"}
        </p>
        <p>
          Total nights: {nights}
        </p>
        <p className="font-semibold">
          Total price: ₹{totalPrice.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default BookingSummary;
