/*
  # Restaurant & Room Service Management System

  1. Roles: super_admin, manager, staff, kitchen, guest_session (OTP-based)
  2. Tables: profiles, menu_categories, menu_items, order_sessions, orders, order_items
  3. RLS policies for role-based access
*/

-- Create enum for user roles
CREATE TYPE user_role AS ENUM (
  'super_admin',
  'manager',
  'staff',
  'kitchen',
  'guest_session'
);

-- Create enum for order session status
CREATE TYPE order_session_status AS ENUM ('active', 'closed');

-- Create enum for order status
CREATE TYPE order_status AS ENUM (
  'pending',
  'confirmed',
  'preparing',
  'ready',
  'delivered',
  'completed',
  'cancelled'
);

-- Profiles table (linked to auth.users, extends administrators concept)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'staff',
  name text,
  email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Menu categories
CREATE TABLE IF NOT EXISTS menu_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Menu items
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES menu_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  is_available boolean NOT NULL DEFAULT true,
  is_veg boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Order sessions (OTP-based for guests)
CREATE TABLE IF NOT EXISTS order_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  otp text NOT NULL UNIQUE,
  room_number text,
  table_number text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  expires_at timestamptz NOT NULL,
  status order_session_status NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  CONSTRAINT room_or_table CHECK (room_number IS NOT NULL OR table_number IS NOT NULL)
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES order_sessions(id) ON DELETE CASCADE,
  room_id uuid REFERENCES rooms(id) ON DELETE SET NULL,
  status order_status NOT NULL DEFAULT 'pending',
  total_amount decimal NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  item_id uuid REFERENCES menu_items(id) ON DELETE SET NULL,
  quantity int NOT NULL DEFAULT 1,
  price_at_time decimal NOT NULL,
  custom_price decimal,
  notes text,
  item_name text,
  created_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_menu_items_category ON menu_items(category_id);
CREATE INDEX idx_order_sessions_otp ON order_sessions(otp);
CREATE INDEX idx_order_sessions_status ON order_sessions(status);
CREATE INDEX idx_orders_session ON orders(session_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- Trigger for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to get user role
CREATE OR REPLACE FUNCTION get_user_role(uid uuid)
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE user_id = uid LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Function to check if user is staff (manager, staff, kitchen, super_admin)
CREATE OR REPLACE FUNCTION is_staff(uid uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = uid 
    AND role IN ('super_admin', 'manager', 'staff', 'kitchen')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read own profile; staff can manage
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Staff can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (is_staff(auth.uid()));

CREATE POLICY "Super admin and manager can manage profiles"
  ON profiles FOR ALL
  TO authenticated
  USING (get_user_role(auth.uid()) IN ('super_admin', 'manager'))
  WITH CHECK (get_user_role(auth.uid()) IN ('super_admin', 'manager'));

-- Menu: public read, manager+ can mutate
CREATE POLICY "Public can read menu categories"
  ON menu_categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Manager can manage menu categories"
  ON menu_categories FOR ALL
  TO authenticated
  USING (get_user_role(auth.uid()) IN ('super_admin', 'manager'))
  WITH CHECK (get_user_role(auth.uid()) IN ('super_admin', 'manager'));

CREATE POLICY "Public can read menu items"
  ON menu_items FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Manager can manage menu items"
  ON menu_items FOR ALL
  TO authenticated
  USING (get_user_role(auth.uid()) IN ('super_admin', 'manager'))
  WITH CHECK (get_user_role(auth.uid()) IN ('super_admin', 'manager'));

-- Order sessions: staff create/read; guests read only their session (by OTP - handled in app)
CREATE POLICY "Staff can manage order sessions"
  ON order_sessions FOR ALL
  TO authenticated
  USING (is_staff(auth.uid()))
  WITH CHECK (is_staff(auth.uid()));

CREATE POLICY "anon can read order session by otp"
  ON order_sessions FOR SELECT
  TO anon, authenticated
  USING (true);

-- Orders: staff full access; guests can insert/select via their session (app validates OTP)
CREATE POLICY "Staff can manage orders"
  ON orders FOR ALL
  TO authenticated
  USING (is_staff(auth.uid()))
  WITH CHECK (is_staff(auth.uid()));

CREATE POLICY "Anyone can insert order with valid session"
  ON orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can select orders"
  ON orders FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Staff can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (is_staff(auth.uid()))
  WITH CHECK (is_staff(auth.uid()));

-- Order items: follow order access
CREATE POLICY "Staff can manage order items"
  ON order_items FOR ALL
  TO authenticated
  USING (is_staff(auth.uid()))
  WITH CHECK (is_staff(auth.uid()));

CREATE POLICY "Anyone can insert order items"
  ON order_items FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can select order items"
  ON order_items FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Staff can update order items"
  ON order_items FOR UPDATE
  TO authenticated
  USING (is_staff(auth.uid()))
  WITH CHECK (is_staff(auth.uid()));

-- Seed default menu categories
INSERT INTO menu_categories (name, sort_order) VALUES
  ('Breakfast', 1),
  ('Lunch', 2),
  ('Dinner', 3),
  ('Beverages', 4)
ON CONFLICT (name) DO NOTHING;

-- Sync existing administrators to profiles (assumes administrators.id = auth.users.id)
INSERT INTO profiles (user_id, role, name, email)
SELECT id, 'super_admin'::user_role, name, email FROM administrators
ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin', name = EXCLUDED.name, email = EXCLUDED.email;

-- Trigger: auto-create profile for new auth users (default role: staff)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, role, name, email)
  VALUES (
    NEW.id,
    'staff'::public.user_role,
    NEW.raw_user_meta_data->>'name',
    NEW.email
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
