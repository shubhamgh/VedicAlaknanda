
import React from "react";
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

interface DateSelectorProps {
  inventoryDate: Date;
  onDateChange: (date: Date) => void;
}

const DateSelector = ({ inventoryDate, onDateChange }: DateSelectorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Select Date for Inventory</CardTitle>
        <CardDescription>
          Choose a date to view room availability and booking status. Click on booked rooms to view details or available rooms to create a new booking.
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
              onSelect={(date) => date && onDateChange(date)}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </CardContent>
    </Card>
  );
};

export default DateSelector;
