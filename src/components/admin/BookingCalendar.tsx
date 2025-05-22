
import React from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";

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
}

interface BookingCalendarProps {
  events: CalendarEvent[];
  onSelectSlot: (slotInfo: { start: Date; end: Date }) => void;
  onSelectEvent: (event: CalendarEvent) => void;
}

const BookingCalendar = ({
  events,
  onSelectSlot,
  onSelectEvent,
}: BookingCalendarProps) => {
  return (
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
          onSelectSlot={onSelectSlot}
          onSelectEvent={onSelectEvent}
        />
      </div>
    </div>
  );
};

export default BookingCalendar;
