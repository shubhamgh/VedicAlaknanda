
export interface FormValues {
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  address?: string;
  gov_id_number?: string;
  room_type: string;
  room_id: string;
  check_in_date: Date;
  check_out_date: Date;
  num_guests: number;
  special_requests?: string;
  status: string;
  booking_source?: string;
  custom_booking_source?: string;
  price_per_night: number;
}

export interface RoomInventory {
  id: string;
  number: string;
  type: string;
  status: string;
}

export interface RoomTypeAvailability {
  type: string;
  availableCount: number;
  totalCount: number;
  availableRooms: RoomInventory[];
}
