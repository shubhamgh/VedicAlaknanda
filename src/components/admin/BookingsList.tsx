
import React, { useState, useMemo } from "react";
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
import { Download } from "lucide-react";

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
  bookings: any[];
  rooms: Room[];
  onEditBooking: (booking: any) => void;
  onDeleteBooking: (bookingId: string) => void;
}

const ITEMS_PER_PAGE = 10;

const BookingsList: React.FC<BookingsListProps> = ({
  bookings,
  rooms,
  onEditBooking,
  onDeleteBooking,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const getRoomDetails = (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId);
    return room
      ? `${room.room_type} - Room ${room.room_number}`
      : "Unknown Room";
  };

  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return bookings.slice(startIndex, endIndex);
  }, [bookings, currentPage]);

  const totalPages = Math.ceil(bookings.length / ITEMS_PER_PAGE);

  const exportToCSV = () => {
    if (!bookings.length) return;

    const csvHeaders = [
      "Guest Name",
      "Guest Email", 
      "Guest Phone",
      "Room Details",
      "Check-in Date",
      "Check-out Date",
      "Status",
      "Total Price",
      "Number of Guests",
      "Notes",
      "Address",
      "Gov ID Number"
    ];

    const csvData = bookings.map(booking => [
      booking.guest_name,
      booking.guest_email,
      booking.guest_phone,
      getRoomDetails(booking.room_id),
      new Date(booking.check_in_date).toLocaleDateString(),
      new Date(booking.check_out_date).toLocaleDateString(),
      booking.status,
      booking.total_price,
      booking.num_guests,
      booking.notes || "",
      booking.address || "",
      booking.gov_id_number || ""
    ]);

    const csvContent = [
      csvHeaders.join(","),
      ...csvData.map(row => row.map(field => `"${field}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookings_${format(new Date(), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">All Bookings</h2>
        <Button onClick={exportToCSV} variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>
      
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
            {paginatedBookings.map((booking) => (
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
            {paginatedBookings.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No bookings found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600">
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, bookings.length)} of {bookings.length} bookings
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="flex items-center px-3 text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsList;
