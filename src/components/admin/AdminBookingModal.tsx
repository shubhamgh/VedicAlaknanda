
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

interface RoomTypeAvailability {
  type: string;
  availableCount: number;
  totalCount: number;
  availableRooms: any[];
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
  booking_source?: string;
  custom_booking_source?: string;
}

interface AdminBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBooking: Booking | null;
  selectedDates: { start: Date; end: Date } | null;
  rooms: Room[];
  roomTypeAvailability: RoomTypeAvailability[];
  onSubmit: (data: any) => void;
}

const AdminBookingModal = ({
  isOpen,
  onClose,
  selectedBooking,
  selectedDates,
  rooms,
  roomTypeAvailability,
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
          roomTypeAvailability={roomTypeAvailability}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AdminBookingModal;
