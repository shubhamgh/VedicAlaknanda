
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";

const ITEMS_PER_PAGE = 10;

const MessagesTab = () => {
  const [messages, setMessages] = useState([]);
  const [messagePage, setMessagePage] = useState(1);
  const [totalMessages, setTotalMessages] = useState(0);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
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

    fetchMessages();
  }, [messagePage, dateRange]);

  const exportToCSV = async () => {
    let query = supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (dateRange.from && dateRange.to) {
      query = query
        .gte("created_at", dateRange.from.toISOString())
        .lte("created_at", dateRange.to.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching messages:", error);
      return;
    }

    if (!data?.length) {
      console.error("No messages data found");
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
    a.download = `messages_${format(new Date(), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
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
          <Button onClick={exportToCSV} className="w-full sm:w-auto text-xs sm:text-sm">
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
  );
};

export default MessagesTab;
