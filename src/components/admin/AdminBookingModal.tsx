
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import BookingForm from "@/components/BookingForm";

interface Room {
  id: string;
  room_number: string;
  room_type: string;
  price_per_night: number;
}

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
}

interface AdminBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBooking: Booking | null;
  selectedDates: { start: Date; end: Date } | null;
  rooms: Room[];
  onSubmit: (data: any) => void;
}

const AdminBookingModal = ({
  isOpen,
  onClose,
  selectedBooking,
  selectedDates,
  rooms,
  onSubmit,
}: AdminBookingModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {selectedBooking ? "Edit Booking" : "New Booking"}
          </DialogTitle>
        </DialogHeader>
        <BookingForm
          booking={selectedBooking}
          selectedDates={selectedDates}
          rooms={rooms}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AdminBookingModal;
