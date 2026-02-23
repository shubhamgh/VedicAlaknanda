-- Migration: add guest contact fields to order_sessions

BEGIN;

ALTER TABLE IF EXISTS order_sessions
  ADD COLUMN IF NOT EXISTS guest_name text,
  ADD COLUMN IF NOT EXISTS guest_phone text;

-- Optional index to speed up lookups by phone
CREATE INDEX IF NOT EXISTS idx_order_sessions_guest_phone ON order_sessions (guest_phone);

COMMIT;
