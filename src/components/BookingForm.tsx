
import React from "react";
import { FormProvider } from "react-hook-form";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { calculateNights } from "@/lib/utils";
import { useBookingFormLogic } from "./booking/useBookingFormLogic";
import BookingFormLayout from "./booking/BookingFormLayout";
import { FormValues, RoomInventory, RoomTypeAvailability } from "./booking/types";

interface BookingFormProps {
  booking: any | null;
  selectedDates: { start: Date; end: Date } | null;
  selectedRoom?: RoomInventory | null;
  rooms: RoomInventory[];
  roomTypeAvailability: RoomTypeAvailability[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
  onFetchAvailability?: (checkIn: string, checkOut: string) => Promise<RoomTypeAvailability[]>;
  lockDates?: boolean;
}

const BookingForm = ({
  booking,
  selectedDates,
  selectedRoom,
  rooms,
  roomTypeAvailability,
  onSubmit,
  onCancel,
  onFetchAvailability,
  lockDates = false,
}: BookingFormProps) => {
  const {
    methods,
    checkInDate,
    checkOutDate,
    selectedRoomId,
    bookingSource,
    datesConfirmed,
    availabilityLoading,
    transformedRooms,
    handleConfirmDates,
    handleDateChange,
    setSelectedRoomId,
    setBookingSource,
  } = useBookingFormLogic({
    booking,
    selectedDates,
    selectedRoom,
    rooms,
    onFetchAvailability,
  });

  const handleSubmit = (values: FormValues) => {
    // Calculate total price based on entered price per night and nights
    const nights = calculateNights(values.check_in_date, values.check_out_date);
    const total_price = nights > 0 ? values.price_per_night * nights : 0;

    onSubmit({
      ...values,
      check_in_date: format(values.check_in_date, "yyyy-MM-dd"),
      check_out_date: format(values.check_out_date, "yyyy-MM-dd"),
      total_price,
      notes: values.special_requests,
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)} className="space-y-4 md:space-y-6">
        <BookingFormLayout
          methods={methods}
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          selectedRoomId={selectedRoomId}
          datesConfirmed={datesConfirmed}
          availabilityLoading={availabilityLoading}
          transformedRooms={transformedRooms}
          rooms={rooms}
          roomTypeAvailability={roomTypeAvailability}
          booking={booking}
          selectedRoom={selectedRoom}
          lockDates={lockDates}
          onDateChange={handleDateChange}
          onConfirmDates={handleConfirmDates}
          onRoomChange={setSelectedRoomId}
          onBookingSourceChange={setBookingSource}
        />

        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button type="submit" className="w-full sm:w-auto" disabled={!datesConfirmed}>
            {booking ? "Update Booking" : "Create Booking"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default BookingForm;
