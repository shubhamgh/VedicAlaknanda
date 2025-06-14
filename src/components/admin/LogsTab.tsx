
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

const LogsTab = () => {
  const [logs, setLogs] = useState([]);
  const [logPage, setLogPage] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const [logDateRange, setLogDateRange] = useState<{ from?: Date; to?: Date }>({
    from: undefined,
    to: undefined,
  });

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

    fetchLogs();
  }, [logPage, logDateRange]);

  const exportToCSV = async () => {
    let query = supabase
      .from("user_logs")
      .select("*")
      .order("created_at", { ascending: false });

    if (logDateRange.from && logDateRange.to) {
      query = query
        .gte("created_at", logDateRange.from.toISOString())
        .lte("created_at", logDateRange.to.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching logs:", error);
      return;
    }

    if (!data?.length) {
      console.error("No logs data found");
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
    a.download = `logs_${format(new Date(), "yyyy-MM-dd")}.csv`;
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
          <Button onClick={exportToCSV} className="w-full sm:w-auto text-xs sm:text-sm">
            Export CSV
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs sm:text-sm">Date & Time</TableHead>
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
                  <div className="flex flex-col">
                    <span>{format(new Date(log.created_at), "MM/dd/yyyy")}</span>
                    <span className="text-gray-500 text-xs">{format(new Date(log.created_at), "HH:mm:ss")}</span>
                  </div>
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
  );
};

export default LogsTab;
