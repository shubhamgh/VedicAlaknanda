import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useBookings } from "@/hooks/useBookings";
import { useRooms } from "@/hooks/useRooms";
import AdminHeader from "@/components/admin/AdminHeader";
import BookingCalendar from "@/components/admin/BookingCalendar";
import BookingsList from "@/components/admin/BookingsList";
import AdminBookingModal from "@/components/admin/AdminBookingModal";
import ReviewsManagement from "@/components/admin/ReviewsManagement";
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
  const { roomInventory, roomTypeAvailability, refetchRooms, fetchRoomAvailabilityForDates } = useRooms();

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

  // Transform roomInventory to Room type for BookingsList - FIXED TYPE ERROR
  const transformedRooms = useMemo(() => {
    return roomInventory.map((room): Room => ({
      id: room.id,
      room_number: room.number,
      room_type: room.type,
      price_per_night: room.type === "Family Room with Terrace" ? 6000 : 5000,
    }));
  }, [roomInventory]);

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
    const config = {
      messages: {
        table: "contact_messages" as const,
        dateRange: dateRange,
      },
      logs: {
        table: "user_logs" as const,
        dateRange: logDateRange,
      },
    };

    const { table, dateRange: selectedRange } = config[type];

    let query = supabase
      .from(table)
      .select("*")
      .order("created_at", { ascending: false });

    if (selectedRange.from && selectedRange.to) {
      query = query
        .gte("created_at", selectedRange.from.toISOString())
        .lte("created_at", selectedRange.to.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      console.error(`Error fetching ${type}:`, error);
      return;
    }

    if (!data?.length) {
      console.error(`No ${type} data found`);
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
    return roomInventory.reduce((acc, room) => {
      if (!acc[room.type]) {
        acc[room.type] = [];
      }
      acc[room.type].push(room);
      return acc;
    }, {} as Record<string, RoomInventory[]>);
  }, [roomInventory]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate("/admin/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader
        onViewWebsite={() => navigate("/")}
        onLogout={handleLogout}
      />

      <main className="mx-auto max-w-7xl px-2 sm:px-4 py-4 sm:py-6 lg:px-8">
        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="mb-4 w-full grid grid-cols-3 md:grid-cols-6 text-xs sm:text-sm">
            <TabsTrigger value="bookings" className="px-2 py-1">
              Bookings
            </TabsTrigger>
            <TabsTrigger value="inventory" className="px-2 py-1">
              Inventory
            </TabsTrigger>
            <TabsTrigger value="reviews" className="px-2 py-1">
              Reviews
            </TabsTrigger>
            <TabsTrigger value="messages" className="px-2 py-1">
              Messages
            </TabsTrigger>
            <TabsTrigger value="newsletter" className="px-2 py-1">
              Newsletter
            </TabsTrigger>
            <TabsTrigger value="logs" className="px-2 py-1">
              Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <div className="space-y-4">
              <BookingCalendar
                events={events}
                rooms={roomInventory}
                onSelectSlot={handleSelect}
                onSelectEvent={handleEventSelect}
                onSelectRoomType={handleRoomTypeSelect}
              />

              {selectedRoomType && (
                <div className="bg-blue-100 p-3 rounded-md">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <span className="text-sm">
                      Filtering by: <strong>{selectedRoomType}</strong>
                    </span>
                    <button
                      className="text-blue-500 hover:text-blue-700 text-sm underline"
                      onClick={() => setSelectedRoomType(null)}
                    >
                      Clear filter
                    </button>
                  </div>
                </div>
              )}

              <BookingsList
                bookings={filteredBookings}
                rooms={transformedRooms}
                onEditBooking={(booking) => {
                  setSelectedBooking(booking);
                  setIsModalOpen(true);
                }}
                onDeleteBooking={handleDeleteBooking}
              />
            </div>
          </TabsContent>

          <TabsContent value="inventory">
            <div className="space-y-4 sm:space-y-6">
              {Object.entries(roomsByType).map(([roomType, roomList]) => (
                <Card key={roomType}>
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">{roomType}</CardTitle>
                    <CardDescription>
                      {roomList.length} rooms total
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                      {roomList.map((room) => (
                        <div
                          key={room.id}
                          className={`p-2 sm:p-3 rounded border text-center text-sm ${
                            room.status === "available"
                              ? "bg-green-100 border-green-300"
                              : "bg-red-100 border-red-300"
                          }`}
                        >
                          <div className="font-semibold text-xs sm:text-sm">
                            Room {room.number}
                          </div>
                          <div className="text-xs capitalize">
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

          <TabsContent value="reviews">
            <ReviewsManagement />
          </TabsContent>

          <TabsContent value="messages">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full sm:w-auto text-xs sm:text-sm">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "MMM dd")} -{" "}
                              {format(dateRange.to, "MMM dd")}
                            </>
                          ) : (
                            format(dateRange.from, "MMM dd, y")
                          )
                        ) : (
                          <span>Pick dates</span>
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
                        numberOfMonths={1}
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <Button onClick={() => exportToCSV("messages")} className="w-full sm:w-auto text-xs sm:text-sm">
                    Export CSV
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm">Date</TableHead>
                      <TableHead className="text-xs sm:text-sm">Name</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Email</TableHead>
                      <TableHead className="text-xs sm:text-sm">Subject</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden md:table-cell">Message</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {messages.map((message) => (
                      <TableRow key={message.id}>
                        <TableCell className="text-xs sm:text-sm">
                          {format(new Date(message.created_at), "MM/dd")}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm">{message.name}</TableCell>
                        <TableCell className="text-xs sm:text-sm hidden sm:table-cell">{message.email}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{message.subject}</TableCell>
                        <TableCell className="text-xs sm:text-sm hidden md:table-cell max-w-xs truncate">
                          {message.message}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
                <div className="text-xs sm:text-sm">
                  Showing {(messagePage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                  {Math.min(messagePage * ITEMS_PER_PAGE, totalMessages)} of{" "}
                  {totalMessages}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setMessagePage((p) => Math.max(1, p - 1))}
                    disabled={messagePage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
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
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full sm:w-auto text-xs sm:text-sm">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {logDateRange.from ? (
                          logDateRange.to ? (
                            <>
                              {format(logDateRange.from, "MMM dd")} -{" "}
                              {format(logDateRange.to, "MMM dd")}
                            </>
                          ) : (
                            format(logDateRange.from, "MMM dd, y")
                          )
                        ) : (
                          <span>Pick dates</span>
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
                        numberOfMonths={1}
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <Button onClick={() => exportToCSV("logs")} className="w-full sm:w-auto text-xs sm:text-sm">
                    Export CSV
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm">Date</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden sm:table-cell">IP</TableHead>
                      <TableHead className="text-xs sm:text-sm">Device</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden md:table-cell">Browser</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden lg:table-cell">OS</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Location</TableHead>
                      <TableHead className="text-xs sm:text-sm">Path</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-xs sm:text-sm">
                          {format(new Date(log.created_at), "MM/dd")}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden sm:table-cell">{log.ip_address}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{log.device_type}</TableCell>
                        <TableCell className="text-xs sm:text-sm hidden md:table-cell">{log.browser}</TableCell>
                        <TableCell className="text-xs sm:text-sm hidden lg:table-cell">{log.os}</TableCell>
                        <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                          {log.city}, {log.country}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm">{log.path}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
                <div className="text-xs sm:text-sm">
                  Showing {(logPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                  {Math.min(logPage * ITEMS_PER_PAGE, totalLogs)} of {totalLogs}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLogPage((p) => Math.max(1, p - 1))}
                    disabled={logPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
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
        rooms={roomInventory}
        roomTypeAvailability={roomTypeAvailability}
        onSubmit={handleSubmit}
        onFetchAvailability={fetchRoomAvailabilityForDates}
      />
    </div>
  );
};

export default Admin;
