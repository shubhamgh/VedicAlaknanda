
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

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

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingDetails | null;
  roomNumber: string;
  onNewBooking: () => void;
}

const BookingDetailsModal = ({
  isOpen,
  onClose,
  booking,
  roomNumber,
  onNewBooking,
}: BookingDetailsModalProps) => {
  if (!booking) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Booking Details - Room {roomNumber}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Guest Name</label>
              <p className="text-sm">{booking.guest_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Status</label>
              <p className="text-sm capitalize">{booking.status}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Check-in</label>
              <p className="text-sm">{format(new Date(booking.check_in), "PPP")}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Check-out</label>
              <p className="text-sm">{format(new Date(booking.check_out), "PPP")}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-sm">{booking.guest_email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Phone</label>
              <p className="text-sm">{booking.guest_phone}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Guests</label>
              <p className="text-sm">{booking.adults} adults, {booking.children} children</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Total Price</label>
              <p className="text-sm">₹{booking.total_price}</p>
            </div>
          </div>

          {booking.special_requests && (
            <div>
              <label className="text-sm font-medium text-gray-600">Special Requests</label>
              <p className="text-sm">{booking.special_requests}</p>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={onNewBooking}>
              Book Next Night
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDetailsModal;
