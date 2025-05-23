
import { useState, useEffect, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  
  const fetchBookings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("check_in", { ascending: true });

      if (error) throw error;

      // Map the database fields to our interface
      const mappedBookings: Booking[] = (data || []).map((item: any) => ({
        id: item.id,
        guest_name: item.guest_name,
        guest_email: item.guest_email,
        guest_phone: item.guest_phone,
        check_in_date: item.check_in,
        check_out_date: item.check_out,
        room_id: item.room_id,
        status: item.status,
        total_price: item.total_price,
        num_guests: item.adults + (item.children || 0),
        notes: item.special_requests,
        address: item.address,
        gov_id_number: item.gov_id_number,
        booking_source: item.booking_source,
        custom_booking_source: item.custom_booking_source,
      }));

      setBookings(mappedBookings);
    } catch (error: any) {
      toast({
        title: "Error fetching bookings",
        description: error.message,
        variant: "destructive",
      });
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleDeleteBooking = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        // First get the booking to find the room_id
        const { data: booking, error: fetchError } = await supabase
          .from("bookings")
          .select("room_id")
          .eq("id", id)
          .single();

        if (fetchError) throw fetchError;

        // Delete the booking
        const { error: deleteError } = await supabase.from("bookings").delete().eq("id", id);
        if (deleteError) throw deleteError;

        // Update room status to available
        const { error: roomError } = await supabase
          .from("rooms")
          .update({ status: "available" })
          .eq("id", booking.room_id);

        if (roomError) throw roomError;

        toast({
          title: "Booking deleted",
          description: "The booking has been deleted successfully and room is now available.",
        });

        fetchBookings();
      } catch (error: any) {
        toast({
          title: "Error deleting booking",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleBookingSubmit = async (bookingData: any, selectedBooking: Booking | null) => {
    try {
      if (selectedBooking) {
        // Update existing booking
        const { data, error } = await supabase
          .from("bookings")
          .update({
            guest_name: bookingData.guest_name,
            guest_email: bookingData.guest_email,
            guest_phone: bookingData.guest_phone,
            check_in: bookingData.check_in_date,
            check_out: bookingData.check_out_date,
            room_id: bookingData.room_id,
            adults: bookingData.num_adults || 1,
            children: bookingData.num_children || 0,
            total_price: bookingData.total_price,
            special_requests: bookingData.notes,
            status: bookingData.status,
            address: bookingData.address,
            gov_id_number: bookingData.gov_id_number,
            booking_source: bookingData.booking_source,
            custom_booking_source: bookingData.custom_booking_source,
          })
          .eq("id", selectedBooking.id)
          .select();

        if (error) throw error;

        // If room changed, update room statuses
        if (selectedBooking.room_id !== bookingData.room_id) {
          // Make old room available
          await supabase
            .from("rooms")
            .update({ status: "available" })
            .eq("id", selectedBooking.room_id);

          // Make new room booked
          await supabase
            .from("rooms")
            .update({ status: "booked" })
            .eq("id", bookingData.room_id);
        }

        toast({
          title: "Booking updated",
          description: "The booking has been updated successfully.",
        });
      } else {
        // Create new booking
        const { data, error } = await supabase
          .from("bookings")
          .insert([
            {
              guest_name: bookingData.guest_name,
              guest_email: bookingData.guest_email,
              guest_phone: bookingData.guest_phone,
              check_in: bookingData.check_in_date,
              check_out: bookingData.check_out_date,
              room_id: bookingData.room_id,
              adults: bookingData.num_adults || 1,
              children: bookingData.num_children || 0,
              total_price: bookingData.total_price,
              special_requests: bookingData.notes,
              status: "confirmed",
              address: bookingData.address,
              gov_id_number: bookingData.gov_id_number,
              booking_source: bookingData.booking_source,
              custom_booking_source: bookingData.custom_booking_source,
            },
          ])
          .select();

        if (error) throw error;

        // Update room status to booked
        const { error: roomError } = await supabase
          .from("rooms")
          .update({ status: "booked" })
          .eq("id", bookingData.room_id);

        if (roomError) throw roomError;

        toast({
          title: "Booking created",
          description: "The booking has been created successfully.",
        });
      }

      fetchBookings();
      return true;
    } catch (error: any) {
      toast({
        title: "Error saving booking",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    bookings,
    fetchBookings,
    handleDeleteBooking,
    handleBookingSubmit,
  };
};
