
import React, { useState, useEffect } from "react";
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

interface RoomInventory {
  id: string;
  number: string;
  type: string;
  status: string;
}

interface RoomTypeAvailability {
  type: string;
  availableCount: number;
  totalCount: number;
  availableRooms: RoomInventory[];
}

interface RoomSelectionFormProps {
  rooms: RoomInventory[];
  roomTypeAvailability: RoomTypeAvailability[];
  onRoomChange: (roomId: string) => void;
  booking?: any;
  datesConfirmed?: boolean;
}

export interface RoomFormValues {
  room_type: string;
  room_id: string;
  num_guests: number;
  status?: string;
}

const RoomSelectionForm: React.FC<RoomSelectionFormProps> = ({
  rooms,
  roomTypeAvailability,
  onRoomChange,
  booking,
  datesConfirmed = false,
}) => {
  const form = useFormContext<RoomFormValues>();
  const [selectedRoomType, setSelectedRoomType] = useState<string>("");
  const [availableRoomsForType, setAvailableRoomsForType] = useState<
    RoomInventory[]
  >([]);

  // Watch for room type changes
  const watchedRoomType = form.watch("room_type");

  useEffect(() => {
    if (watchedRoomType && datesConfirmed) {
      setSelectedRoomType(watchedRoomType);
      const typeData = roomTypeAvailability.find(
        (rt) => rt.type === watchedRoomType
      );
      // Sort rooms by room number
      const sortedRooms = typeData?.availableRooms.sort((a, b) => 
        parseInt(a.number) - parseInt(b.number)
      ) || [];
      setAvailableRoomsForType(sortedRooms);

      // Only reset room_id if it's not already set (avoids resetting during edit)
      const currentRoomId = form.getValues("room_id");
      if (currentRoomId) {
        const roomStillAvailable = sortedRooms.some(
          (room) => room.id === currentRoomId
        );
        if (!roomStillAvailable) {
          form.setValue("room_id", "");
        }
      } else {
        form.setValue("room_id", "");
      }
    }
  }, [watchedRoomType, roomTypeAvailability, datesConfirmed]);

  // Set initial values for editing
  useEffect(() => {
    if (booking && rooms.length > 0) {
      const bookingRoom = rooms.find((room) => room.id === booking.room_id);
      if (bookingRoom) {
        form.reset({
          room_type: bookingRoom.type,
          room_id: booking.room_id,
          num_guests: booking.num_guests,
          status: booking.status || "confirmed",
        });
        setSelectedRoomType(bookingRoom.type);
      }
    }
  }, [booking, rooms]);

  if (!datesConfirmed) {
    return (
      <div className="text-center text-muted-foreground p-4 border rounded-lg">
        Please confirm your dates first to check room availability
      </div>
    );
  }

  return (
    <>
      <FormField
        control={form.control}
        name="room_type"
        rules={{ required: "Room type is required" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Room Type</FormLabel>
            <Select
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
                setSelectedRoomType(value);
              }}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a room type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {roomTypeAvailability.map((roomType) => (
                  <SelectItem key={roomType.type} value={roomType.type}>
                    {roomType.type} - {roomType.availableCount} available
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {selectedRoomType && (
        <FormField
          control={form.control}
          name="room_id"
          rules={{ required: "Room number is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room Number</FormLabel>
              <Select
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  onRoomChange(value);
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={
                      availableRoomsForType.length > 0 
                        ? "Select a room number" 
                        : "No rooms available for selected dates"
                    } />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableRoomsForType.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      Room {room.number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="num_guests"
        rules={{
          required: "Number of guests is required",
          min: { value: 1, message: "At least 1 guest is required" },
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
