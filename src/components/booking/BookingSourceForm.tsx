
import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BookingSourceFormProps {
  onBookingSourceChange: (source: string | undefined) => void;
}

const BookingSourceForm: React.FC<BookingSourceFormProps> = ({ 
  onBookingSourceChange 
}) => {
  const form = useFormContext();

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="booking_source"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Booking Source</FormLabel>
            <Select
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
                onBookingSourceChange(value);
              }}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select booking source" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Booking.com">Booking.com</SelectItem>
                <SelectItem value="AirBnB">AirBnB</SelectItem>
                <SelectItem value="MMT/GoIbibo">MMT/GoIbibo</SelectItem>
                <SelectItem value="Yatra">Yatra</SelectItem>
                <SelectItem value="EaseMyTrip">EaseMyTrip</SelectItem>
                <SelectItem value="Offline">Offline</SelectItem>
                <SelectItem value="Custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {form.watch("booking_source") === "Custom" && (
        <FormField
          control={form.control}
          name="custom_booking_source"
          rules={{ 
            required: form.watch("booking_source") === "Custom" ? "Please enter the custom booking source" : false
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custom Booking Source</FormLabel>
              <FormControl>
                <Input placeholder="Enter custom booking source" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default BookingSourceForm;
