
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import BookingForm from "@/components/BookingForm";
import { useIsMobile } from "@/hooks/use-mobile";

interface RoomInventory {
  id: string;
  number: string;
  type: string;
  status: string;
}

interface RoomTypeAvailability {
  type: string;
  availableCount: number;
  totalCount: number;
  availableRooms: RoomInventory[];
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
  rooms: RoomInventory[];
  roomTypeAvailability: RoomTypeAvailability[];
  onSubmit: (data: any) => void;
  onFetchAvailability?: (checkIn: string, checkOut: string) => Promise<RoomTypeAvailability[]>;
}

const AdminBookingModal = ({
  isOpen,
  onClose,
  selectedBooking,
  selectedDates,
  rooms,
  roomTypeAvailability,
  onSubmit,
  onFetchAvailability,
}: AdminBookingModalProps) => {
  const isMobile = useIsMobile();

  const content = (
    <BookingForm
      booking={selectedBooking}
      selectedDates={selectedDates}
      rooms={rooms}
      roomTypeAvailability={roomTypeAvailability}
      onSubmit={onSubmit}
      onCancel={onClose}
      onFetchAvailability={onFetchAvailability}
    />
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {selectedBooking ? "Edit Booking" : "New Booking"}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            {content}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {selectedBooking ? "Edit Booking" : "New Booking"}
          </DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default AdminBookingModal;
