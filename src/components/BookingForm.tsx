
import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import PersonalInfoForm from "./booking/PersonalInfoForm";
import RoomSelectionForm from "./booking/RoomSelectionForm";
import DateSelectionForm from "./booking/DateSelectionForm";
import SpecialRequestsForm from "./booking/SpecialRequestsForm";
import BookingSummary from "./booking/BookingSummary";
import { calculateNights } from "@/utils/validationUtils";

interface FormValues {
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  address: string;
  gov_id_number: string;
  room_id: string;
  check_in_date: Date;
  check_out_date: Date;
  num_guests: number;
  special_requests: string;
  status: string;
}

interface Room {
  id: string;
  room_number: string;
  room_type: string;
  price_per_night: number;
}

interface BookingFormProps {
  booking: any | null;
  selectedDates: { start: Date; end: Date } | null;
  rooms: Room[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const BookingForm = ({
  booking,
  selectedDates,
  rooms,
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

  const form = useForm<FormValues>({
    defaultValues: {
      guest_name: booking?.guest_name || "",
      guest_email: booking?.guest_email || "",
      guest_phone: booking?.guest_phone || "",
      address: booking?.address || "",
      gov_id_number: booking?.gov_id_number || "",
      room_id: booking?.room_id || "",
      check_in_date: checkInDate,
      check_out_date: checkOutDate,
      num_guests: booking?.num_guests || 1,
      special_requests: booking?.special_requests || "",
      status: booking?.status || "confirmed",
    },
  });

  // Update form when dates or booking changes
  useEffect(() => {
    if (selectedDates) {
      form.setValue("check_in_date", selectedDates.start);
      form.setValue("check_out_date", selectedDates.end);
      setCheckInDate(selectedDates.start);
      setCheckOutDate(selectedDates.end);
    } else if (booking) {
      const checkIn = new Date(booking.check_in_date);
      const checkOut = new Date(booking.check_out_date);
      form.setValue("check_in_date", checkIn);
      form.setValue("check_out_date", checkOut);
      setCheckInDate(checkIn);
      setCheckOutDate(checkOut);

      // Set all other values
      form.setValue("guest_name", booking.guest_name);
      form.setValue("guest_email", booking.guest_email);
      form.setValue("guest_phone", booking.guest_phone);
      form.setValue("address", booking.address || "");
      form.setValue("gov_id_number", booking.gov_id_number || "");
      form.setValue("room_id", booking.room_id);
      form.setValue("num_guests", booking.num_guests);
      form.setValue("special_requests", booking.special_requests || "");
      form.setValue("status", booking.status);

      setSelectedRoomId(booking.room_id);
    }
  }, [booking, selectedDates, form]);

  const handleSubmit = (values: FormValues) => {
    // Calculate total price based on room rate and nights
    const selectedRoom = rooms.find((room) => room.id === values.room_id);
    const nights = calculateNights(values.check_in_date, values.check_out_date);
    const total_price =
      selectedRoom && nights > 0 ? selectedRoom.price_per_night * nights : 0;

    onSubmit({
      ...values,
      check_in_date: format(values.check_in_date, "yyyy-MM-dd"),
      check_out_date: format(values.check_out_date, "yyyy-MM-dd"),
      total_price,
    });
  };

  return (
    <FormProvider {...form}>
      <Form>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PersonalInfoForm />
            
            <RoomSelectionForm 
              rooms={rooms} 
              onRoomChange={setSelectedRoomId} 
              booking={booking}
            />
            
            <DateSelectionForm 
              checkInDate={checkInDate}
              checkOutDate={checkOutDate}
              onCheckInChange={(date) => setCheckInDate(date || undefined)}
              onCheckOutChange={(date) => setCheckOutDate(date || undefined)}
            />
          </div>

          <SpecialRequestsForm />

          {selectedRoomId && checkInDate && checkOutDate && (
            <BookingSummary 
              selectedRoomId={selectedRoomId}
              checkInDate={checkInDate}
              checkOutDate={checkOutDate}
              rooms={rooms}
            />
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {booking ? "Update Booking" : "Create Booking"}
            </Button>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
};

export default BookingForm;
