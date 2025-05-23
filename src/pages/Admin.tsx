import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useBookings } from "@/hooks/useBookings";
import { useRooms } from "@/hooks/useRooms";
import AdminHeader from "@/components/admin/AdminHeader";
import BookingCalendar from "@/components/admin/BookingCalendar";
import BookingsList from "@/components/admin/BookingsList";
import AdminBookingModal from "@/components/admin/AdminBookingModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import NewsletterSubscribers from "./NewsletterSubscribers";

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  roomType: string;
  resource: any;
}

interface Room {
  id: string;
  room_number: string;
  room_type: string;
  price_per_night: number;
}

interface RoomInventory {
  id: string;
  number: string;
  type: string;
  status: string;
}

const ITEMS_PER_PAGE = 10;

const Admin = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, handleLogout } = useAdminAuth();
  const { bookings, handleDeleteBooking, handleBookingSubmit } = useBookings();
  const { rooms, roomInventory, roomTypeAvailability, refetchRooms } =
    useRooms();

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDates, setSelectedDates] = useState<{
    start: Date;
    end: Date;
  } | null>(null);
  const [selectedRoomType, setSelectedRoomType] = useState<string | null>(null);
  const [filteredBookings, setFilteredBookings] = useState<any[]>([]);

  // Messages state
  const [messages, setMessages] = useState([]);
  const [messagePage, setMessagePage] = useState(1);
  const [totalMessages, setTotalMessages] = useState(0);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
    from: undefined,
    to: undefined,
  });

  // Logs state
  const [logs, setLogs] = useState([]);
  const [logPage, setLogPage] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const [logDateRange, setLogDateRange] = useState<{ from?: Date; to?: Date }>({
    from: undefined,
    to: undefined,
  });

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      const start = (messagePage - 1) * ITEMS_PER_PAGE;
      let query = supabase
        .from("contact_messages")
        .select("*", { count: "exact" })
        .range(start, start + ITEMS_PER_PAGE - 1)
        .order("created_at", { ascending: false });

      if (dateRange.from && dateRange.to) {
        query = query
          .gte("created_at", dateRange.from.toISOString())
          .lte("created_at", dateRange.to.toISOString());
      }

      const { data, count, error } = await query;

      if (error) {
        console.error("Error fetching messages:", error);
        return;
      }

      setMessages(data);
      setTotalMessages(count);
    };

    if (isAuthenticated) {
      fetchMessages();
    }
  }, [messagePage, dateRange, isAuthenticated]);

  // Fetch logs
  useEffect(() => {
    const fetchLogs = async () => {
      const start = (logPage - 1) * ITEMS_PER_PAGE;
      let query = supabase
        .from("user_logs")
        .select("*", { count: "exact" })
        .range(start, start + ITEMS_PER_PAGE - 1)
        .order("created_at", { ascending: false });

      if (logDateRange.from && logDateRange.to) {
        query = query
          .gte("created_at", logDateRange.from.toISOString())
          .lte("created_at", logDateRange.to.toISOString());
      }

      const { data, count, error } = await query;

      if (error) {
        console.error("Error fetching logs:", error);
        return;
      }

      setLogs(data);
      setTotalLogs(count);
    };

    if (isAuthenticated) {
      fetchLogs();
    }
  }, [logPage, logDateRange, isAuthenticated]);

  // Convert bookings to calendar events
  useEffect(() => {
    const newEvents = bookings.map((booking) => {
      const room = roomInventory.find((r) => r.id === booking.room_id);
      const roomType = room ? room.type : "Unknown room";
      const roomNumber = room ? room.number : "Unknown";

      return {
        id: booking.id,
        title: `${booking.guest_name} - ${roomNumber}`,
        start: new Date(booking.check_in_date),
        end: new Date(booking.check_out_date),
        roomType: roomType,
        resource: booking,
      };
    });

    setEvents(newEvents);
  }, [bookings, roomInventory]);

  // Filter bookings based on selected room type
  useEffect(() => {
    if (selectedRoomType) {
      const roomIds = roomInventory
        .filter((room) => room.type === selectedRoomType)
        .map((room) => room.id);

      const filtered = bookings.filter((booking) =>
        roomIds.includes(booking.room_id)
      );

      setFilteredBookings(filtered);
    } else {
      setFilteredBookings(bookings);
    }
  }, [selectedRoomType, bookings, roomInventory]);

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

  const handleRoomTypeSelect = (roomType: string) => {
    setSelectedRoomType((prevType) =>
      prevType === roomType ? null : roomType
    );
  };

  const handleSubmit = async (bookingData: any) => {
    const success = await handleBookingSubmit(bookingData, selectedBooking);
    if (success) {
      setIsModalOpen(false);
      refetchRooms(); // Refresh room availability
    }
  };

  const exportToCSV = async (type: "messages" | "logs") => {
    const dateRangeToUse = type === "messages" ? dateRange : logDateRange;
    let query = supabase
      .from(type === "messages" ? "contact_messages" : "user_logs")
      .select("*")
      .order("created_at", { ascending: false });

    if (dateRangeToUse.from && dateRangeToUse.to) {
      query = query
        .gte("created_at", dateRangeToUse.from.toISOString())
        .lte("created_at", dateRangeToUse.to.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      console.error(`Error fetching ${type}:`, error);
      return;
    }

    const csvContent = [
      Object.keys(data[0]).join(","),
      ...data.map((item) => Object.values(item).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type}_${format(new Date(), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Group rooms by type for inventory display
  const roomsByType = useMemo(() => {
    const grouped = roomInventory.reduce((acc, room) => {
      if (!acc[room.type]) {
        acc[room.type] = [];
      }
      acc[room.type].push(room);
      return acc;
    }, {} as Record<string, typeof roomInventory>);

    return grouped;
  }, [roomInventory]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader
        onViewWebsite={() => navigate("/")}
        onLogout={handleLogout}
      />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Tabs defaultValue="bookings">
          <TabsList className="mb-4">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="inventory">Room Inventory</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
            <TabsTrigger value="logs">User Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <BookingCalendar
              events={events}
              rooms={roomInventory}
              onSelectSlot={handleSelect}
              onSelectEvent={handleEventSelect}
              onSelectRoomType={handleRoomTypeSelect}
            />

            <div className="mb-4">
              {selectedRoomType && (
                <div className="bg-blue-100 p-2 rounded-md inline-flex items-center">
                  <span>
                    Filtering by room type: <strong>{selectedRoomType}</strong>
                  </span>
                  <button
                    className="ml-2 text-blue-500 hover:text-blue-700"
                    onClick={() => setSelectedRoomType(null)}
                  >
                    Clear filter
                  </button>
                </div>
              )}
            </div>

            <BookingsList
              bookings={filteredBookings}
              rooms={rooms}
              onEditBooking={(booking) => {
                setSelectedBooking(booking);
                setIsModalOpen(true);
              }}
              onDeleteBooking={handleDeleteBooking}
            />
          </TabsContent>

          <TabsContent value="inventory">
            <div className="space-y-6">
              {Object.entries(roomsByType).map(([roomType, roomList]) => (
                <Card key={roomType}>
                  <CardHeader>
                    <CardTitle>{roomType}</CardTitle>
                    <CardDescription>
                      {roomList.length} rooms total
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {roomList.map((room) => (
                        <div
                          key={room.id}
                          className={`p-3 rounded border text-center ${
                            room.status === "available"
                              ? "bg-green-100 border-green-300"
                              : "bg-red-100 border-red-300"
                          }`}
                        >
                          <div className="font-semibold">
                            Room {room.number}
                          </div>
                          <div className="text-sm capitalize">
                            {room.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="messages">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "LLL dd, y")} -{" "}
                              {format(dateRange.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(dateRange.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick a date range</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        selected={
                          dateRange.from && dateRange.to
                            ? { from: dateRange.from, to: dateRange.to }
                            : undefined
                        }
                        onSelect={(range) =>
                          setDateRange(
                            range || { from: undefined, to: undefined }
                          )
                        }
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                  <Button onClick={() => exportToCSV("messages")}>
                    Export to CSV
                  </Button>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Message</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.map((message) => (
                    <TableRow key={message.id}>
                      <TableCell>
                        {format(new Date(message.created_at), "PPp")}
                      </TableCell>
                      <TableCell>{message.name}</TableCell>
                      <TableCell>{message.email}</TableCell>
                      <TableCell>{message.subject}</TableCell>
                      <TableCell className="max-w-md truncate">
                        {message.message}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex justify-between items-center mt-4">
                <div>
                  Showing {(messagePage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                  {Math.min(messagePage * ITEMS_PER_PAGE, totalMessages)} of{" "}
                  {totalMessages}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setMessagePage((p) => Math.max(1, p - 1))}
                    disabled={messagePage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setMessagePage((p) => p + 1)}
                    disabled={messagePage * ITEMS_PER_PAGE >= totalMessages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="logs">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {logDateRange.from ? (
                          logDateRange.to ? (
                            <>
                              {format(logDateRange.from, "LLL dd, y")} -{" "}
                              {format(logDateRange.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(logDateRange.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick a date range</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        selected={
                          logDateRange.from && logDateRange.to
                            ? { from: logDateRange.from, to: logDateRange.to }
                            : undefined
                        }
                        onSelect={(range) =>
                          setLogDateRange(
                            range || { from: undefined, to: undefined }
                          )
                        }
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                  <Button onClick={() => exportToCSV("logs")}>
                    Export to CSV
                  </Button>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Browser</TableHead>
                    <TableHead>OS</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Path</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        {format(new Date(log.created_at), "PPp")}
                      </TableCell>
                      <TableCell>{log.ip_address}</TableCell>
                      <TableCell>{log.device_type}</TableCell>
                      <TableCell>{log.browser}</TableCell>
                      <TableCell>{log.os}</TableCell>
                      <TableCell>
                        {log.city}, {log.country}
                      </TableCell>
                      <TableCell>{log.path}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex justify-between items-center mt-4">
                <div>
                  Showing {(logPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                  {Math.min(logPage * ITEMS_PER_PAGE, totalLogs)} of {totalLogs}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setLogPage((p) => Math.max(1, p - 1))}
                    disabled={logPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setLogPage((p) => p + 1)}
                    disabled={logPage * ITEMS_PER_PAGE >= totalLogs}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="newsletter">
            <div className="space-y-4">
              <NewsletterSubscribers />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <AdminBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedBooking={selectedBooking}
        selectedDates={selectedDates}
        rooms={rooms}
        roomTypeAvailability={roomTypeAvailability}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Admin;
