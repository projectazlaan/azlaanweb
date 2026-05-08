-- ============================================================
-- Azlaan Super Easy Dashboard — Supabase DB Setup Script
-- Run this ONCE in your Supabase SQL Editor
-- ============================================================

-- 1. Products Table
CREATE TABLE IF NOT EXISTS products (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  price        NUMERIC NOT NULL DEFAULT 0,
  category     TEXT NOT NULL DEFAULT 'Men',
  stock_count  INTEGER NOT NULL DEFAULT 0,
  in_stock     BOOLEAN NOT NULL DEFAULT true,
  description  TEXT,
  image_url    TEXT,
  tag          TEXT,
  sizes        TEXT[] DEFAULT ARRAY['S','M','L','XL'],
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

-- 2. Reels Table
CREATE TABLE IF NOT EXISTS reels (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title      TEXT NOT NULL,
  link       TEXT NOT NULL,
  platform   TEXT DEFAULT 'YouTube',
  views      TEXT DEFAULT '0',
  trending   BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  phone       TEXT,
  address     TEXT,
  items       JSONB,
  total       NUMERIC NOT NULL DEFAULT 0,
  status      TEXT NOT NULL DEFAULT 'pending',
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- 4. VIP Members / Users Table
CREATE TABLE IF NOT EXISTS vip_members (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  email        TEXT UNIQUE NOT NULL,
  tier         TEXT DEFAULT 'Silver',
  points       INTEGER DEFAULT 0,
  total_spent  NUMERIC DEFAULT 0,
  is_premier   BOOLEAN DEFAULT false,
  avatar_color TEXT DEFAULT 'bg-blue-500',
  joined_at    TIMESTAMPTZ DEFAULT now()
);

-- 5. Site Config Table
CREATE TABLE IF NOT EXISTS site_config (
  key   TEXT PRIMARY KEY,
  value TEXT
);

-- Insert default config values
INSERT INTO site_config (key, value) VALUES
  ('hero_title',        'Define Your Style'),
  ('hero_subtitle',     'Premium Bangladeshi Ethnics. Crafted For the Modern World.'),
  ('newsletter_title',  'Register & Get Free Delivery.'),
  ('newsletter_sub',    'Join the Azlaan Inner Circle today and enjoy complimentary shipping on your first order.'),
  ('delivery_charge',   '100'),
  ('free_delivery_min', '2000'),
  ('premier_price',     '1000'),
  ('loyalty_rate',      '10'),
  ('show_reels',        'true'),
  ('show_vip_panel',    'true'),
  ('show_banner',       'true'),
  ('flash_sale_active', 'false'),
  ('flash_sale_pct',    '20'),
  ('flash_sale_ends',   '')
ON CONFLICT (key) DO NOTHING;

-- 6. Promo Codes Table
CREATE TABLE IF NOT EXISTS promo_codes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code        TEXT UNIQUE NOT NULL,
  discount    NUMERIC NOT NULL DEFAULT 10,
  uses        INTEGER DEFAULT 0,
  max_uses    INTEGER DEFAULT 100,
  active      BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- 7. Gift Cards Table
CREATE TABLE IF NOT EXISTS gift_cards (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code        TEXT UNIQUE NOT NULL,
  amount      NUMERIC NOT NULL,
  balance     NUMERIC NOT NULL,
  recipient   TEXT,
  sent_to     TEXT,
  redeemed    BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- 8. Loyalty Transactions Table
CREATE TABLE IF NOT EXISTS loyalty_transactions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id  UUID REFERENCES vip_members(id) ON DELETE CASCADE,
  points     INTEGER NOT NULL,
  reason     TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- Storage Bucket (run in Supabase Dashboard > Storage)
-- Create a bucket named: product-images  (Public = ON)
-- ============================================================
