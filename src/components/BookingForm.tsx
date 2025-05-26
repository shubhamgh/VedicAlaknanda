
import React, { useEffect, useState, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import PersonalInfoForm from "./booking/PersonalInfoForm";
import RoomSelectionForm from "./booking/RoomSelectionForm";
import DateSelectionForm from "./booking/DateSelectionForm";
import SpecialRequestsForm from "./booking/SpecialRequestsForm";
import BookingSummary from "./booking/BookingSummary";
import BookingSourceForm from "./booking/BookingSourceForm";
import { calculateNights } from "@/lib/utils";

interface FormValues {
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  address?: string;
  gov_id_number?: string;
  room_type: string;
  room_id: string;
  check_in_date: Date;
  check_out_date: Date;
  num_guests: number;
  special_requests?: string;
  status: string;
  booking_source?: string;
  custom_booking_source?: string;
}

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

interface BookingFormProps {
  booking: any | null;
  selectedDates: { start: Date; end: Date } | null;
  rooms: RoomInventory[];
  roomTypeAvailability: RoomTypeAvailability[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const BookingForm = ({
  booking,
  selectedDates,
  rooms,
  roomTypeAvailability,
  onSubmit,
  onCancel,
}: BookingFormProps) => {
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(
    booking?.check_in_date
      ? new Date(booking.check_in_date)
      : selectedDates?.start
  );
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(
    booking?.check_out_date
      ? new Date(booking.check_out_date)
      : selectedDates?.end
  );
  const [selectedRoomId, setSelectedRoomId] = useState<string>(
    booking?.room_id || ""
  );
  const [bookingSource, setBookingSource] = useState<string | undefined>(
    booking?.booking_source || undefined
  );

  const methods = useForm<FormValues>({
    defaultValues: {
      guest_name: booking?.guest_name || "",
      guest_email: booking?.guest_email || "",
      guest_phone: booking?.guest_phone || "",
      address: booking?.address || "",
      gov_id_number: booking?.gov_id_number || "",
      room_type: "",
      room_id: booking?.room_id || "",
      check_in_date: checkInDate,
      check_out_date: checkOutDate,
      num_guests: booking?.num_guests || 1,
      special_requests: booking?.notes || "",
      status: booking?.status || "confirmed",
      booking_source: booking?.booking_source || undefined,
      custom_booking_source: booking?.custom_booking_source || "",
    },
  });

  // Transform rooms to match the expected format for BookingSummary
  const transformedRooms = useMemo(() => {
    return rooms.map((room) => ({
      id: room.id,
      room_number: room.number,
      room_type: room.type,
      price_per_night: room.type === "Family Room with Terrace" ? 6000 : 5000,
    }));
  }, [rooms]);

  // Update form when dates or booking changes
  useEffect(() => {
    if (selectedDates) {
      methods.setValue("check_in_date", selectedDates.start);
      methods.setValue("check_out_date", selectedDates.end);
      setCheckInDate(selectedDates.start);
      setCheckOutDate(selectedDates.end);
    } else if (booking) {
      const checkIn = new Date(booking.check_in_date);
      const checkOut = new Date(booking.check_out_date);
      methods.setValue("check_in_date", checkIn);
      methods.setValue("check_out_date", checkOut);
      setCheckInDate(checkIn);
      setCheckOutDate(checkOut);

      // Set all other values
      methods.setValue("guest_name", booking.guest_name);
      methods.setValue("guest_email", booking.guest_email);
      methods.setValue("guest_phone", booking.guest_phone);
      methods.setValue("address", booking.address || "");
      methods.setValue("gov_id_number", booking.gov_id_number || "");
      methods.setValue("room_id", booking.room_id);
      methods.setValue("num_guests", booking.num_guests);
      methods.setValue("special_requests", booking.notes || "");
      methods.setValue("status", booking.status);
      methods.setValue("booking_source", booking.booking_source);
      methods.setValue(
        "custom_booking_source",
        booking.custom_booking_source || ""
      );

      // Set room type based on the room_id
      const bookingRoom = rooms.find((room) => room.id === booking.room_id);
      if (bookingRoom) {
        methods.setValue("room_type", bookingRoom.type);
      }

      setSelectedRoomId(booking.room_id);
      setBookingSource(booking.booking_source);
    }
  }, [booking, selectedDates, methods, rooms]);

  const handleSubmit = (values: FormValues) => {
    // Calculate total price based on room rate and nights
    const selectedRoom = transformedRooms.find(
      (room) => room.id === values.room_id
    );
    const nights = calculateNights(values.check_in_date, values.check_out_date);
    const total_price =
      selectedRoom && nights > 0 ? selectedRoom.price_per_night * nights : 0;

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-4">
            <PersonalInfoForm />
          </div>

          <div className="space-y-4">
            <RoomSelectionForm
              rooms={rooms}
              roomTypeAvailability={roomTypeAvailability}
              onRoomChange={setSelectedRoomId}
              booking={booking}
            />

            <DateSelectionForm
              checkInDate={checkInDate}
              checkOutDate={checkOutDate}
              onCheckInChange={(date) => setCheckInDate(date || undefined)}
              onCheckOutChange={(date) => setCheckOutDate(date || undefined)}
            />

            <BookingSourceForm onBookingSourceChange={setBookingSource} />
          </div>
        </div>

        <SpecialRequestsForm />

        {selectedRoomId && checkInDate && checkOutDate && (
          <BookingSummary
            selectedRoomId={selectedRoomId}
            checkInDate={checkInDate}
            checkOutDate={checkOutDate}
            rooms={transformedRooms}
          />
        )}

        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button type="submit" className="w-full sm:w-auto">
            {booking ? "Update Booking" : "Create Booking"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default BookingForm;
