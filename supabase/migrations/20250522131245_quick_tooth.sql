/*
  # Insert Room Details

  1. Changes
    - Insert all 30 rooms with their specific room numbers and types
    - Update room inventory counts
    - Set default prices and capacities

  2. Room Types
    - Deluxe Single Room with Balcony (15 rooms: 101-105, 201-205, 301-305)
    - Standard Family Room (12 rooms: 106-109, 206-209, 306-309)
    - Family Room with Terrace (3 rooms: 401, 402, 403)
*/

-- Insert all room details
INSERT INTO rooms (number, type, capacity, price_per_night, total_rooms, available_rooms, status)
VALUES 
  -- Deluxe Single Room with Balcony (First Floor)
  ('101', 'Deluxe Single Room with Balcony', 2, 2500, 1, 1, 'available'),
  ('102', 'Deluxe Single Room with Balcony', 2, 2500, 1, 1, 'available'),
  ('103', 'Deluxe Single Room with Balcony', 2, 2500, 1, 1, 'available'),
  ('104', 'Deluxe Single Room with Balcony', 2, 2500, 1, 1, 'available'),
  ('105', 'Deluxe Single Room with Balcony', 2, 2500, 1, 1, 'available'),
  
  -- Deluxe Single Room with Balcony (Second Floor)
  ('201', 'Deluxe Single Room with Balcony', 2, 2500, 1, 1, 'available'),
  ('202', 'Deluxe Single Room with Balcony', 2, 2500, 1, 1, 'available'),
  ('203', 'Deluxe Single Room with Balcony', 2, 2500, 1, 1, 'available'),
  ('204', 'Deluxe Single Room with Balcony', 2, 2500, 1, 1, 'available'),
  ('205', 'Deluxe Single Room with Balcony', 2, 2500, 1, 1, 'available'),
  
  -- Deluxe Single Room with Balcony (Third Floor)
  ('301', 'Deluxe Single Room with Balcony', 2, 2500, 1, 1, 'available'),
  ('302', 'Deluxe Single Room with Balcony', 2, 2500, 1, 1, 'available'),
  ('303', 'Deluxe Single Room with Balcony', 2, 2500, 1, 1, 'available'),
  ('304', 'Deluxe Single Room with Balcony', 2, 2500, 1, 1, 'available'),
  ('305', 'Deluxe Single Room with Balcony', 2, 2500, 1, 1, 'available'),
  
  -- Standard Family Room (First Floor)
  ('106', 'Standard Family Room', 4, 3000, 1, 1, 'available'),
  ('107', 'Standard Family Room', 4, 3000, 1, 1, 'available'),
  ('108', 'Standard Family Room', 4, 3000, 1, 1, 'available'),
  ('109', 'Standard Family Room', 4, 3000, 1, 1, 'available'),
  
  -- Standard Family Room (Second Floor)
  ('206', 'Standard Family Room', 4, 3000, 1, 1, 'available'),
  ('207', 'Standard Family Room', 4, 3000, 1, 1, 'available'),
  ('208', 'Standard Family Room', 4, 3000, 1, 1, 'available'),
  ('209', 'Standard Family Room', 4, 3000, 1, 1, 'available'),
  
  -- Standard Family Room (Third Floor)
  ('306', 'Standard Family Room', 4, 3000, 1, 1, 'available'),
  ('307', 'Standard Family Room', 4, 3000, 1, 1, 'available'),
  ('308', 'Standard Family Room', 4, 3000, 1, 1, 'available'),
  ('309', 'Standard Family Room', 4, 3000, 1, 1, 'available'),
  
  -- Family Room with Terrace (Fourth Floor)
  ('401', 'Family Room with Terrace', 4, 3500, 1, 1, 'available'),
  ('402', 'Family Room with Terrace', 4, 3500, 1, 1, 'available'),
  ('403', 'Family Room with Terrace', 4, 3500, 1, 1, 'available')
ON CONFLICT (number) 
DO UPDATE SET 
  type = EXCLUDED.type,
  capacity = EXCLUDED.capacity,
  price_per_night = EXCLUDED.price_per_night,
  total_rooms = EXCLUDED.total_rooms,
  available_rooms = EXCLUDED.available_rooms,
  status = EXCLUDED.status;