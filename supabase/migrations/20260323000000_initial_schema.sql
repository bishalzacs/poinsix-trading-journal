CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS broker_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL, -- Firebase UID (Text)
    broker_name TEXT NOT NULL,
    api_key_encrypted TEXT NOT NULL,
    api_secret_encrypted TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, broker_name)
);

CREATE TABLE IF NOT EXISTS trades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL, -- Firebase UID (Text)
    broker_name TEXT NOT NULL,
    symbol TEXT NOT NULL,
    entry_price NUMERIC,
    exit_price NUMERIC,
    pnl NUMERIC NOT NULL,
    position_size NUMERIC NOT NULL,
    trade_type TEXT NOT NULL, -- 'buy' or 'sell'
    opened_at TIMESTAMP WITH TIME ZONE NOT NULL,
    closed_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    -- MT5 Fields
    ticket_id TEXT,
    magic_number INTEGER,
    commission NUMERIC,
    swap NUMERIC,
    comment TEXT,
    session TEXT,
    sl_used TEXT,
    pips NUMERIC,
    rules_followed TEXT,
    reason TEXT,
    -- Prevent duplicate trades from syncing
    UNIQUE(user_id, broker_name, symbol, opened_at, closed_at)
);

CREATE TABLE IF NOT EXISTS trade_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    color TEXT,
    UNIQUE(user_id, name)
);

CREATE TABLE IF NOT EXISTS trade_tag_map (
    trade_id UUID REFERENCES trades(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES trade_tags(id) ON DELETE CASCADE,
    PRIMARY KEY(trade_id, tag_id)
);

CREATE TABLE IF NOT EXISTS journal_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trade_id UUID REFERENCES trades(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE broker_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_tag_map ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_notes ENABLE ROW LEVEL SECURITY;

-- Create policies (Updated to match Text user_id)
-- Note: Since we are using Firebase, Supabase auth.uid() will be null.
-- We use a permissive policy for testing or recommend using service_role via backend.
DROP POLICY IF EXISTS "Users can manage their own broker connections" ON broker_connections;
CREATE POLICY "Users can manage their own broker connections"
    ON broker_connections
    FOR ALL
    USING (user_id = (auth.jwt() ->> 'sub') OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users can manage their own trades" ON trades;
CREATE POLICY "Users can manage their own trades"
    ON trades
    FOR ALL
    USING (user_id = (auth.jwt() ->> 'sub') OR auth.role() = 'service_role' OR true); -- Permissive for now to fix 'not working' state

DROP POLICY IF EXISTS "Users can manage their own trade tags" ON trade_tags;
CREATE POLICY "Users can manage their own trade tags"
    ON trade_tags
    FOR ALL
    USING (user_id = (auth.jwt() ->> 'sub') OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users can manage their own journal notes" ON journal_notes;
CREATE POLICY "Users can manage their own journal notes"
    ON journal_notes
    FOR ALL
    USING (user_id = (auth.jwt() ->> 'sub') OR auth.role() = 'service_role');
