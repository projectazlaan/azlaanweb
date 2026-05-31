-- Create gift_cards table
-- Run this in Supabase SQL Editor

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE gift_cards (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code          TEXT UNIQUE NOT NULL,
  tier_id       TEXT NOT NULL,        -- 'starter' | 'value' | 'premium' | 'luxury'
  initial_balance NUMERIC(10,2) NOT NULL,
  remaining_balance NUMERIC(10,2) NOT NULL,
  status        TEXT NOT NULL DEFAULT 'active',  -- active | used | expired | cancelled
  purchaser_email TEXT,
  purchased_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at    TIMESTAMPTZ NOT NULL,
  used_at       TIMESTAMPTZ,
  order_id      TEXT
);

CREATE INDEX idx_gift_cards_code ON gift_cards(code);
CREATE INDEX idx_gift_cards_status ON gift_cards(status);
CREATE INDEX idx_gift_cards_expires_at ON gift_cards(expires_at);
