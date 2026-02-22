
import React from "react";

interface RoomInventory {
  id: string;
  number: string;
  type: string;
  status: string;
}

interface RoomTileProps {
  room: RoomInventory;
  onClick: (room: RoomInventory) => void;
}

const RoomTile = ({ room, onClick }: RoomTileProps) => {
  return (
    <div
      className={`p-2 sm:p-3 rounded border text-center text-sm cursor-pointer transition-colors ${
        room.status === "available"
          ? "bg-green-100 border-green-300 hover:bg-green-200"
          : "bg-red-100 border-red-300 hover:bg-red-200"
      }`}
      onClick={() => onClick(room)}
    >
      <div className="font-semibold text-xs sm:text-sm">
        Room {room.number}
      </div>
      <div className="text-xs capitalize">
        {room.status}
      </div>
    </div>
  );
};

export default RoomTile;
