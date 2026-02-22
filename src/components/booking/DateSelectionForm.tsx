
import React from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DateSelectionFormProps {
  checkInDate?: Date;
  checkOutDate?: Date;
  onCheckInChange: (date: Date | undefined) => void;
  onCheckOutChange: (date: Date | undefined) => void;
  onConfirmDates: () => void;
  datesConfirmed: boolean;
  loading: boolean;
  disabled?: boolean;
}

const DateSelectionForm = ({
  checkInDate,
  checkOutDate,
  onCheckInChange,
  onCheckOutChange,
  onConfirmDates,
  datesConfirmed,
  loading,
  disabled = false,
}: DateSelectionFormProps) => {
  const form = useFormContext();

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="check_in_date"
        rules={{ required: "Check-in date is required" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Check-in Date</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !checkInDate && "text-muted-foreground"
                    )}
                    disabled={disabled}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkInDate ? (
                      format(checkInDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={checkInDate}
                  onSelect={(date) => {
                    onCheckInChange(date);
                    field.onChange(date);
                  }}
                  disabled={(date) =>
                    date < new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="check_out_date"
        rules={{ required: "Check-out date is required" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Check-out Date</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !checkOutDate && "text-muted-foreground"
                    )}
                    disabled={disabled}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkOutDate ? (
                      format(checkOutDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={checkOutDate}
                  onSelect={(date) => {
                    onCheckOutChange(date);
                    field.onChange(date);
                  }}
                  disabled={(date) =>
                    date <= (checkInDate || new Date()) ||
                    date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      {!datesConfirmed && !disabled && checkInDate && checkOutDate && (
        <Button
          type="button"
          onClick={onConfirmDates}
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking Availability...
            </>
          ) : (
            "Check Availability"
          )}
        </Button>
      )}

      {datesConfirmed && (
        <div className="text-sm text-green-600 font-medium text-center">
          ✓ Dates confirmed - Room availability loaded
        </div>
      )}
    </div>
  );
};

export default DateSelectionForm;
