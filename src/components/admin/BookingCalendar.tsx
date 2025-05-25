import React, { useMemo } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, addDays } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: {
    "en-US": enUS,
  },
});

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: any;
  roomType: string;
}

interface RoomInventory {
  id: string;
  number: string;
  type: string;
  status: string;
}

interface BookingCalendarProps {
  events: CalendarEvent[];
  rooms: RoomInventory[];
  onSelectSlot: (slotInfo: { start: Date; end: Date }) => void;
  onSelectEvent: (event: CalendarEvent) => void;
  onSelectRoomType?: (roomType: string) => void;
}

const BookingCalendar = ({
  events,
  rooms,
  onSelectSlot,
  onSelectEvent,
  onSelectRoomType,
}: BookingCalendarProps) => {
  // Group events by room type
  const eventsByRoomType = useMemo(() => {
    // Adjust end dates to be one day before the check-out date for visualization
    return events.map((event) => ({
      ...event,
      end: addDays(new Date(event.end), -1), // End date is now check-out day - 1
    }));
  }, [events]);

  // Create color mapping for room types
  const roomTypeColors = useMemo(() => {
    const uniqueRoomTypes = [...new Set(rooms.map((room) => room.type))];
    const colors = ["#3182CE", "#E53E3E", "#38A169", "#D69E2E", "#805AD5"];

    return uniqueRoomTypes.reduce((acc, type, index) => {
      acc[type] = colors[index % colors.length];
      return acc;
    }, {} as Record<string, string>);
  }, [rooms]);

  // Custom event component to show room type colors
  const EventComponent = ({ event }: { event: CalendarEvent }) => {
    const backgroundColor = roomTypeColors[event.roomType] || "#3182CE";

    return (
      <div
        style={{
          backgroundColor,
          color: "white",
          borderRadius: "4px",
          padding: "2px 4px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
        title={`${event.title} (${event.roomType})`}
      >
        {event.title}
      </div>
    );
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Booking Calendar</h2>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="mb-4 flex flex-wrap gap-2">
          {Object.entries(roomTypeColors).map(([roomType, color]) => (
            <div
              key={roomType}
              className="inline-flex items-center cursor-pointer"
              onClick={() => onSelectRoomType && onSelectRoomType(roomType)}
            >
              <div
                className="w-4 h-4 mr-1 rounded-sm"
                style={{ backgroundColor: color }}
              />
              <span>{roomType}</span>
            </div>
          ))}
        </div>

        <Calendar
          localizer={localizer}
          events={eventsByRoomType}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          selectable
          onSelectSlot={onSelectSlot}
          onSelectEvent={onSelectEvent}
          components={{
            event: EventComponent,
          }}
          views={["month", "week", "day"]}
        />
      </div>
    </div>
  );
};

export default BookingCalendar;
