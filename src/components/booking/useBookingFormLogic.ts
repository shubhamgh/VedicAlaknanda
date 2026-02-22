
import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { calculateNights } from "@/lib/utils";
import { FormValues, RoomInventory, RoomTypeAvailability } from "./types";

interface UseBookingFormLogicProps {
  booking: any | null;
  selectedDates: { start: Date; end: Date } | null;
  selectedRoom?: RoomInventory | null;
  rooms: RoomInventory[];
  onFetchAvailability?: (checkIn: string, checkOut: string) => Promise<RoomTypeAvailability[]>;
}

export const useBookingFormLogic = ({
  booking,
  selectedDates,
  selectedRoom,
  rooms,
  onFetchAvailability,
}: UseBookingFormLogicProps) => {
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
    booking?.room_id || selectedRoom?.id || ""
  );
  const [bookingSource, setBookingSource] = useState<string | undefined>(
    booking?.booking_source || undefined
  );
  const [datesConfirmed, setDatesConfirmed] = useState<boolean>(false);
  const [availabilityLoading, setAvailabilityLoading] = useState<boolean>(false);

  // Default price based on room type, but allow user to override
  const getDefaultPrice = (roomType?: string) => {
    if (roomType === "Family Room with Terrace") return 6000;
    return 5000;
  };

  const methods = useForm<FormValues>({
    defaultValues: {
      guest_name: booking?.guest_name || "",
      guest_email: booking?.guest_email || "",
      guest_phone: booking?.guest_phone || "",
      address: booking?.address || "",
      gov_id_number: booking?.gov_id_number || "",
      room_type: selectedRoom?.type || "",
      room_id: booking?.room_id || selectedRoom?.id || "",
      check_in_date: checkInDate,
      check_out_date: checkOutDate,
      num_guests: booking?.num_guests || 1,
      special_requests: booking?.notes || "",
      status: booking?.status || "confirmed",
      booking_source: booking?.booking_source || undefined,
      custom_booking_source: booking?.custom_booking_source || "",
      price_per_night: booking?.total_price && checkInDate && checkOutDate 
        ? Math.round(booking.total_price / calculateNights(checkInDate, checkOutDate))
        : getDefaultPrice(selectedRoom?.type),
    },
  });

  // Transform rooms to match the expected format for BookingSummary
  const transformedRooms = useMemo(() => {
    return rooms.map((room) => {
      const pricePerNight = methods.watch("price_per_night") || getDefaultPrice(room.type);
      return {
        id: room.id,
        room_number: room.number,
        room_type: room.type,
        price_per_night: pricePerNight,
      };
    });
  }, [rooms, methods.watch("price_per_night")]);

  // Auto-confirm dates if they come from calendar selection or editing existing booking
  useEffect(() => {
    if ((selectedDates || booking) && checkInDate && checkOutDate) {
      setDatesConfirmed(true);
      handleConfirmDates();
    }
  }, [selectedDates, booking, checkInDate, checkOutDate]);

  // Update form when dates, booking, or selectedRoom changes
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
      methods.setValue("custom_booking_source", booking.custom_booking_source || "");

      // Calculate price per night from total price and nights
      const nights = calculateNights(checkIn, checkOut);
      const pricePerNight = nights > 0 ? Math.round(booking.total_price / nights) : getDefaultPrice();
      methods.setValue("price_per_night", pricePerNight);

      // Set room type based on the room_id
      const bookingRoom = rooms.find((room) => room.id === booking.room_id);
      if (bookingRoom) {
        methods.setValue("room_type", bookingRoom.type);
      }

      setSelectedRoomId(booking.room_id);
      setBookingSource(booking.booking_source);
    }

    // If we have a selectedRoom, pre-fill the room type and room ID
    if (selectedRoom) {
      methods.setValue("room_type", selectedRoom.type);
      methods.setValue("room_id", selectedRoom.id);
      methods.setValue("price_per_night", getDefaultPrice(selectedRoom.type));
      setSelectedRoomId(selectedRoom.id);
    }
  }, [booking, selectedDates, selectedRoom, methods, rooms]);

  const handleConfirmDates = async () => {
    if (!checkInDate || !checkOutDate || !onFetchAvailability) return;
    
    setAvailabilityLoading(true);
    try {
      const checkInStr = format(checkInDate, "yyyy-MM-dd");
      const checkOutStr = format(checkOutDate, "yyyy-MM-dd");
      await onFetchAvailability(checkInStr, checkOutStr);
      setDatesConfirmed(true);
    } catch (error) {
      console.error("Error fetching availability:", error);
    } finally {
      setAvailabilityLoading(false);
    }
  };

  const handleDateChange = (type: 'checkIn' | 'checkOut', date: Date | undefined) => {
    if (type === 'checkIn') {
      setCheckInDate(date || undefined);
    } else {
      setCheckOutDate(date || undefined);
    }
    setDatesConfirmed(false);
  };

  return {
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
  };
};
