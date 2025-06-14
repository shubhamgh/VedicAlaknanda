
import React, { useState, useEffect, useMemo } from "react";
import { useRooms } from "@/hooks/useRooms";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface RoomInventory {
  id: string;
  number: string;
  type: string;
  status: string;
}

const InventoryTab = () => {
  const { roomInventory, fetchRoomInventoryForDate } = useRooms();
  const [inventoryDate, setInventoryDate] = useState<Date>(new Date());

  // Add useEffect for inventory date changes
  useEffect(() => {
    if (inventoryDate) {
      const dateStr = format(inventoryDate, "yyyy-MM-dd");
      fetchRoomInventoryForDate(dateStr);
    }
  }, [inventoryDate, fetchRoomInventoryForDate]);

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

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Select Date for Inventory</CardTitle>
          <CardDescription>
            Choose a date to view room availability and booking status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full md:w-auto justify-start text-left font-normal",
                  !inventoryDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {inventoryDate ? format(inventoryDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={inventoryDate}
                onSelect={(date) => date && setInventoryDate(date)}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>

      {Object.entries(roomsByType).map(([roomType, roomList]) => (
        <Card key={roomType}>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">{roomType}</CardTitle>
            <CardDescription>
              {roomList.length} rooms total - Status for {format(inventoryDate, "PPP")}
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
  );
};

export default InventoryTab;
