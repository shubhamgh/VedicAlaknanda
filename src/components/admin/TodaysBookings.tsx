
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

interface Booking {
  id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in_date: string;
  check_out_date: string;
  room_id: string;
  status: string;
  total_price: number;
  num_guests: number;
  notes?: string;
  address?: string;
  gov_id_number?: string;
  room_type?: string;
}

interface Room {
  id: string;
  room_number: string;
  room_type: string;
  price_per_night: number;
}

interface TodaysBookingsProps {
  bookings: Booking[];
  rooms: Room[];
  onEditBooking: (booking: any) => void;
}

const TodaysBookings: React.FC<TodaysBookingsProps> = ({
  bookings,
  rooms,
  onEditBooking,
}) => {
  const today = format(new Date(), 'yyyy-MM-dd');
  
  const todaysBookings = bookings.filter(booking => {
    const checkIn = format(new Date(booking.check_in_date), 'yyyy-MM-dd');
    const checkOut = format(new Date(booking.check_out_date), 'yyyy-MM-dd');
    return checkIn <= today && checkOut > today;
  });

  const getRoomDetails = (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId);
    return room
      ? `${room.room_type} - Room ${room.room_number}`
      : "Unknown Room";
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Today's Bookings</h2>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Guest Name</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Check-in</TableHead>
              <TableHead>Check-out</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {todaysBookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.guest_name}</TableCell>
                <TableCell>{getRoomDetails(booking.room_id)}</TableCell>
                <TableCell>
                  {new Date(booking.check_in_date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(booking.check_out_date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      booking.status === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : booking.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {booking.status}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEditBooking(booking)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {todaysBookings.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No bookings for today.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TodaysBookings;
