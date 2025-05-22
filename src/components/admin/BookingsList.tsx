
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

interface BookingsListProps {
  bookings: Booking[];
  rooms: Room[];
  onEditBooking: (booking: Booking) => void;
  onDeleteBooking: (id: string) => void;
}

const BookingsList = ({
  bookings,
  rooms,
  onEditBooking,
  onDeleteBooking,
}: BookingsListProps) => {
  const getRoomTypeById = (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId);
    return room ? room.room_type : "Unknown room";
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">All Bookings</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Room Type</TableHead>
              <TableHead>Check-in</TableHead>
              <TableHead>Check-out</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.guest_name}</TableCell>
                <TableCell>{getRoomTypeById(booking.room_id)}</TableCell>
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
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEditBooking(booking)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDeleteBooking(booking.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {bookings.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No bookings found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BookingsList;
