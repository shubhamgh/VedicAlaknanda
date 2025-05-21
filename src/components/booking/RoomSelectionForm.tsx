
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

interface Room {
  id: string;
  room_number: string;
  room_type: string;
  price_per_night: number;
}

interface RoomSelectionFormProps {
  rooms: Room[];
  onRoomChange: (roomId: string) => void;
  booking?: any;
}

export interface RoomFormValues {
  room_id: string;
  num_guests: number;
  status?: string;
}

const RoomSelectionForm: React.FC<RoomSelectionFormProps> = ({ 
  rooms, 
  onRoomChange,
  booking 
}) => {
  const form = useFormContext<RoomFormValues>();

  return (
    <>
      <FormField
        control={form.control}
        name="room_id"
        rules={{ required: "Room is required" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Room Type</FormLabel>
            <Select
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
                onRoomChange(value);
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
        name="num_guests"
        rules={{ 
          required: "Number of guests is required",
          min: { value: 1, message: "At least 1 guest is required" }
        }}
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
    </>
  );
};

export default RoomSelectionForm;
