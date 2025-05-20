/*
  # Hotel Management Schema

  1. New Tables
    - `rooms`
      - `id` (uuid, primary key)
      - `number` (text, unique)
      - `type` (text)
      - `capacity` (int)
      - `price_per_night` (decimal)
      - `description` (text)
      - `amenities` (text[])
      - `status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `bookings`
      - `id` (uuid, primary key) 
      - `room_id` (uuid, foreign key)
      - `guest_name` (text)
      - `guest_email` (text)
      - `guest_phone` (text)
      - `check_in` (date)
      - `check_out` (date)
      - `adults` (int)
      - `children` (int)
      - `total_price` (decimal)
      - `status` (text)
      - `special_requests` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number text UNIQUE NOT NULL,
  type text NOT NULL,
  capacity int NOT NULL,
  price_per_night decimal NOT NULL,
  description text,
  amenities text[],
  status text NOT NULL DEFAULT 'available',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE,
  guest_name text NOT NULL,
  guest_email text NOT NULL,
  guest_phone text NOT NULL,
  check_in date NOT NULL,
  check_out date NOT NULL,
  adults int NOT NULL DEFAULT 1,
  children int NOT NULL DEFAULT 0,
  total_price decimal NOT NULL,
  status text NOT NULL DEFAULT 'confirmed',
  special_requests text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for rooms
CREATE POLICY "Allow public read access to rooms"
  ON rooms
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage rooms"
  ON rooms
  TO authenticated
  USING (true);

-- Create policies for bookings
CREATE POLICY "Allow authenticated users to manage bookings"
  ON bookings
  TO authenticated
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_rooms_updated_at
  BEFORE UPDATE ON rooms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample rooms
INSERT INTO rooms (number, type, capacity, price_per_night, description, amenities, status)
VALUES 
  ('101', 'Deluxe', 2, 3000, 'Spacious deluxe room with mountain view', ARRAY['Wi-Fi', 'AC', 'TV', 'Mini Bar'], 'available'),
  ('102', 'Suite', 4, 5000, 'Luxury suite with separate living area', ARRAY['Wi-Fi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi'], 'available'),
  ('201', 'Standard', 2, 2000, 'Comfortable standard room', ARRAY['Wi-Fi', 'AC', 'TV'], 'available');