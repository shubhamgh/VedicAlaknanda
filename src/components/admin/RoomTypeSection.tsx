
import React from "react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import RoomTile from "./RoomTile";

interface RoomInventory {
  id: string;
  number: string;
  type: string;
  status: string;
}

interface RoomTypeSectionProps {
  roomType: string;
  rooms: RoomInventory[];
  inventoryDate: Date;
  onRoomClick: (room: RoomInventory) => void;
}

const RoomTypeSection = ({ roomType, rooms, inventoryDate, onRoomClick }: RoomTypeSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">{roomType}</CardTitle>
        <CardDescription>
          {rooms.length} rooms total - Status for {format(inventoryDate, "PPP")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {rooms.map((room) => (
            <RoomTile
              key={room.id}
              room={room}
              onClick={onRoomClick}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RoomTypeSection;
