import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import BookingForm from "@/components/BookingForm";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

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
  room_type?: string;
}

interface Room {
  id: string;
  room_number: string;
  room_type: string;
  price_per_night: number;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Booking;
}

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDates, setSelectedDates] = useState<{
    start: Date;
    end: Date;
  } | null>(null);
  const navigate = useNavigate();

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();

        if (!data.session) {
          navigate("/admin-login");
          return;
        }

        // For now, we'll accept any authenticated user
        // In a production app, you would check against a list of admin emails
        // or use custom claims to verify admin status

        setIsAuthenticated(true);
      } catch (error) {
        console.error("Authentication error:", error);
        navigate("/admin-login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  // Fetch bookings and rooms data
  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
      fetchRooms();
    }
  }, [isAuthenticated]);

  // Convert bookings to calendar events
  useEffect(() => {
    const newEvents = bookings.map((booking) => ({
      id: booking.id,
      title: `${booking.guest_name} - ${getRoomTypeById(booking.room_id)}`,
      start: new Date(booking.check_in_date),
      end: new Date(booking.check_out_date),
      resource: booking,
    }));

    setEvents(newEvents);
  }, [bookings, rooms]);

  const fetchBookings = async () => {
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
        num_guests: item.adults + item.children,
        notes: item.special_requests,
      }));

      setBookings(mappedBookings);
    } catch (error: any) {
      toast({
        title: "Error fetching bookings",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase.from("rooms").select("*");

      if (error) throw error;

      // Map the database fields to our interface
      const mappedRooms: Room[] = (data || []).map((room: any) => ({
        id: room.id,
        room_number: room.number,
        room_type: room.type,
        price_per_night: room.price_per_night,
      }));

      setRooms(mappedRooms);
    } catch (error: any) {
      toast({
        title: "Error fetching rooms",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getRoomTypeById = (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId);
    return room ? room.room_type : "Unknown room";
  };

  const handleSelect = ({ start, end }: { start: Date; end: Date }) => {
    setSelectedDates({ start, end });
    setSelectedBooking(null);
    setIsModalOpen(true);
  };

  const handleEventSelect = (event: CalendarEvent) => {
    setSelectedBooking(event.resource);
    setSelectedDates(null);
    setIsModalOpen(true);
  };

  const handleBookingSubmit = async (bookingData: any) => {
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
          })
          .eq("id", selectedBooking.id)
          .select();

        if (error) throw error;

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
            },
          ])
          .select();

        if (error) throw error;

        toast({
          title: "Booking created",
          description: "The booking has been created successfully.",
        });
      }

      setIsModalOpen(false);
      fetchBookings();
    } catch (error: any) {
      toast({
        title: "Error saving booking",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        const { error } = await supabase.from("bookings").delete().eq("id", id);

        if (error) throw error;

        toast({
          title: "Booking deleted",
          description: "The booking has been deleted successfully.",
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin-login");
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Admin Dashboard
          </h1>
          <div className="flex gap-4">
            <Button onClick={() => navigate("/")}>View Website</Button>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Booking Calendar</h2>
          <div className="bg-white p-4 rounded-lg shadow">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
              selectable
              onSelectSlot={handleSelect}
              onSelectEvent={handleEventSelect}
            />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">All Bookings</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Room Type</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>{booking.guest_name}</TableCell>
                    <TableCell>{getRoomTypeById(booking.room_id)}</TableCell>
                    <TableCell>
                      {new Date(booking.check_in_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(booking.check_out_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : booking.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setIsModalOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteBooking(booking.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {bookings.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No bookings found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
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
            onSubmit={handleBookingSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
