/*
  # Add Room Inventory Management

  1. Changes
    - Add `total_rooms` column to rooms table to track total inventory
    - Add `available_rooms` column to rooms table to track current availability
    - Add trigger to update available_rooms when bookings are made/updated
    - Insert initial room inventory data

  2. Security
    - Maintain existing RLS policies
*/

-- Add inventory columns to rooms table
ALTER TABLE rooms 
ADD COLUMN IF NOT EXISTS total_rooms integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS available_rooms integer NOT NULL DEFAULT 0;

-- Create trigger function to update room availability
CREATE OR REPLACE FUNCTION update_room_availability()
RETURNS TRIGGER AS $$
BEGIN
  -- For new bookings or status changes to confirmed
  IF (TG_OP = 'INSERT' AND NEW.status = 'confirmed') OR 
     (TG_OP = 'UPDATE' AND NEW.status = 'confirmed' AND OLD.status != 'confirmed') THEN
    UPDATE rooms 
    SET available_rooms = available_rooms - 1
    WHERE id = NEW.room_id;
  
  -- For cancelled bookings or status changes from confirmed
  ELSIF (TG_OP = 'DELETE' AND OLD.status = 'confirmed') OR 
        (TG_OP = 'UPDATE' AND OLD.status = 'confirmed' AND NEW.status != 'confirmed') THEN
    UPDATE rooms 
    SET available_rooms = available_rooms + 1
    WHERE id = OLD.room_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS update_room_availability_trigger ON bookings;
CREATE TRIGGER update_room_availability_trigger
AFTER INSERT OR UPDATE OR DELETE ON bookings
FOR EACH ROW
EXECUTE FUNCTION update_room_availability();

-- Insert initial room inventory
INSERT INTO rooms (number, type, capacity, price_per_night, total_rooms, available_rooms)
VALUES 
  ('FT-1', 'Family room with Terrace', 4, 3500, 3, 3),
  ('DS-1', 'Deluxe Single room with Balcony', 2, 2500, 15, 15),
  ('SF-1', 'Standard Family room', 4, 3000, 12, 12)
ON CONFLICT (number) 
DO UPDATE SET 
  total_rooms = EXCLUDED.total_rooms,
  available_rooms = EXCLUDED.available_rooms;