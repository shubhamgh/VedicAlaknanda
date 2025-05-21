import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod"; // Changed to namespace import
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Define the form schema with namespace import
const formSchema = z.object({
  guest_name: z.string().min(2, "Name is required"),
  guest_email: z.string().email("Invalid email address"),
  guest_phone: z.string().min(5, "Phone number is required"),
  address: z.string().min(5, "Address is required"),
  gov_id_number: z.string().min(5, "Government ID number is required"),
  room_id: z.string().min(1, "Room is required"),
  check_in_date: z.date({ required_error: "Check-in date is required" }),
  check_out_date: z.date({ required_error: "Check-out date is required" }),
  num_guests: z.number().int().min(1, "At least 1 guest is required"),
  special_requests: z.string().optional(),
  status: z.string().default("confirmed"),
});

interface Room {
  id: string;
  room_number: string;
  room_type: string;
  price_per_night: number;
}

interface BookingFormProps {
  booking: any | null;
  selectedDates: { start: Date; end: Date } | null;
  rooms: Room[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const BookingForm = ({
  booking,
  selectedDates,
  rooms,
  onSubmit,
  onCancel,
}: BookingFormProps) => {
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(
    booking?.check_in_date
      ? new Date(booking.check_in_date)
      : selectedDates?.start
  );
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(
    booking?.check_out_date
      ? new Date(booking.check_out_date)
      : selectedDates?.end
  );
  const [selectedRoomId, setSelectedRoomId] = useState<string>(
    booking?.room_id || ""
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      guest_name: booking?.guest_name || "",
      guest_email: booking?.guest_email || "",
      guest_phone: booking?.guest_phone || "",
      address: booking?.address || "",
      gov_id_number: booking?.gov_id_number || "",
      room_id: booking?.room_id || "",
      check_in_date: checkInDate,
      check_out_date: checkOutDate,
      num_guests: booking?.num_guests || 1,
      special_requests: booking?.special_requests || "",
      status: booking?.status || "confirmed",
    },
  });

  // Update form when dates or booking changes
  useEffect(() => {
    if (selectedDates) {
      form.setValue("check_in_date", selectedDates.start);
      form.setValue("check_out_date", selectedDates.end);
      setCheckInDate(selectedDates.start);
      setCheckOutDate(selectedDates.end);
    } else if (booking) {
      const checkIn = new Date(booking.check_in_date);
      const checkOut = new Date(booking.check_out_date);
      form.setValue("check_in_date", checkIn);
      form.setValue("check_out_date", checkOut);
      setCheckInDate(checkIn);
      setCheckOutDate(checkOut);

      // Set all other values
      form.setValue("guest_name", booking.guest_name);
      form.setValue("guest_email", booking.guest_email);
      form.setValue("guest_phone", booking.guest_phone);
      form.setValue("address", booking.address || "");
      form.setValue("gov_id_number", booking.gov_id_number || "");
      form.setValue("room_id", booking.room_id);
      form.setValue("num_guests", booking.num_guests);
      form.setValue("special_requests", booking.special_requests || "");
      form.setValue("status", booking.status);

      setSelectedRoomId(booking.room_id);
    }
  }, [booking, selectedDates, form]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    // Calculate total price based on room rate and nights
    const selectedRoom = rooms.find((room) => room.id === values.room_id);
    const nights = calculateNights(values.check_in_date, values.check_out_date);
    const total_price =
      selectedRoom && nights > 0 ? selectedRoom.price_per_night * nights : 0;

    onSubmit({
      ...values,
      check_in_date: format(values.check_in_date, "yyyy-MM-dd"),
      check_out_date: format(values.check_out_date, "yyyy-MM-dd"),
      total_price,
    });
  };

  const calculateNights = (checkIn: Date, checkOut: Date) => {
    const diffInTime = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(diffInTime / (1000 * 3600 * 24));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="guest_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="guest_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="guest_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gov_id_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Government ID Number</FormLabel>
                <FormControl>
                  <Input placeholder="ID number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="room_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room Type</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedRoomId(value);
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a room" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {rooms.map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        {room.room_type} - Room {room.room_number} (₹
                        {room.price_per_night}/night)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="check_in_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Check-in Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setCheckInDate(date);
                      }}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
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
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Check-out Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setCheckOutDate(date);
                      }}
                      disabled={(date) =>
                        date <= (checkInDate || new Date()) ||
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="num_guests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Guests</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {booking && (
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Booking Status</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <FormField
          control={form.control}
          name="special_requests"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Special Requests</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any special requirements or requests"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedRoomId && checkInDate && checkOutDate && (
          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="font-semibold mb-2">Booking Summary</h3>
            <div className="space-y-1 text-sm">
              <p>
                Room:{" "}
                {rooms.find((r) => r.id === selectedRoomId)?.room_type || ""}
              </p>
              <p>
                Check-in:{" "}
                {checkInDate ? format(checkInDate, "PPP") : "Not selected"}
              </p>
              <p>
                Check-out:{" "}
                {checkOutDate ? format(checkOutDate, "PPP") : "Not selected"}
              </p>
              <p>
                Total nights:{" "}
                {checkInDate && checkOutDate
                  ? calculateNights(checkInDate, checkOutDate)
                  : 0}
              </p>
              <p className="font-semibold">
                Total price: ₹
                {checkInDate &&
                  checkOutDate &&
                  selectedRoomId &&
                  (
                    calculateNights(checkInDate, checkOutDate) *
                    (rooms.find((r) => r.id === selectedRoomId)
                      ?.price_per_night || 0)
                  ).toFixed(2)}
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {booking ? "Update Booking" : "Create Booking"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BookingForm;