
import React from "react";
import { UseFormReturn } from "react-hook-form";
import PersonalInfoForm from "./PersonalInfoForm";
import RoomSelectionForm from "./RoomSelectionForm";
import DateSelectionForm from "./DateSelectionForm";
import SpecialRequestsForm from "./SpecialRequestsForm";
import BookingSummary from "./BookingSummary";
import BookingSourceForm from "./BookingSourceForm";
import PricePerNightForm from "./PricePerNightForm";
import { FormValues, RoomInventory, RoomTypeAvailability } from "./types";

interface BookingFormLayoutProps {
  methods: UseFormReturn<FormValues>;
  checkInDate: Date | undefined;
  checkOutDate: Date | undefined;
  selectedRoomId: string;
  datesConfirmed: boolean;
  availabilityLoading: boolean;
  transformedRooms: any[];
  rooms: RoomInventory[];
  roomTypeAvailability: RoomTypeAvailability[];
  booking: any | null;
  selectedRoom?: RoomInventory | null;
  lockDates?: boolean;
  onDateChange: (type: 'checkIn' | 'checkOut', date: Date | undefined) => void;
  onConfirmDates: () => Promise<void>;
  onRoomChange: (roomId: string) => void;
  onBookingSourceChange: (source: string) => void;
}

const BookingFormLayout = ({
  methods,
  checkInDate,
  checkOutDate,
  selectedRoomId,
  datesConfirmed,
  availabilityLoading,
  transformedRooms,
  rooms,
  roomTypeAvailability,
  booking,
  selectedRoom,
  lockDates = false,
  onDateChange,
  onConfirmDates,
  onRoomChange,
  onBookingSourceChange,
}: BookingFormLayoutProps) => {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="space-y-4">
          <PersonalInfoForm />
        </div>

        <div className="space-y-4">
          <DateSelectionForm
            checkInDate={checkInDate}
            checkOutDate={checkOutDate}
            onCheckInChange={(date) => onDateChange('checkIn', date)}
            onCheckOutChange={(date) => onDateChange('checkOut', date)}
            onConfirmDates={onConfirmDates}
            datesConfirmed={datesConfirmed}
            loading={availabilityLoading}
            disabled={lockDates}
          />

          {datesConfirmed && (
            <RoomSelectionForm
              rooms={rooms}
              roomTypeAvailability={roomTypeAvailability}
              onRoomChange={onRoomChange}
              booking={booking}
              selectedRoom={selectedRoom}
              datesConfirmed={datesConfirmed}
            />
          )}

          <PricePerNightForm />

          <BookingSourceForm onBookingSourceChange={onBookingSourceChange} />
        </div>
      </div>

      <SpecialRequestsForm />

      {selectedRoomId && checkInDate && checkOutDate && (
        <div className="mt-6">
          <BookingSummary
            selectedRoomId={selectedRoomId}
            checkInDate={checkInDate}
            checkOutDate={checkOutDate}
            rooms={transformedRooms}
          />
        </div>
      )}
    </div>
  );
};

export default BookingFormLayout;
