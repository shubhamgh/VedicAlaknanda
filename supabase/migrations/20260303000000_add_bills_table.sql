-- Add bills table to store generated bills and prevent duplicates per order
CREATE TABLE IF NOT EXISTS bills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  gst_included boolean NOT NULL DEFAULT false,
  data jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bills_order_id ON bills(order_id);
CREATE INDEX IF NOT EXISTS idx_bills_created_at ON bills(created_at);

-- Enable RLS and allow staff to manage bills
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can manage bills"
  ON bills FOR ALL
  TO authenticated
  USING (get_user_role(auth.uid()) IN ('super_admin', 'manager', 'staff', 'kitchen'))
  WITH CHECK (get_user_role(auth.uid()) IN ('super_admin', 'manager', 'staff', 'kitchen'));
