CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE broker_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- references auth.users(id)
    broker_name TEXT NOT NULL,
    api_key_encrypted TEXT NOT NULL,
    api_secret_encrypted TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, broker_name)
);

CREATE TABLE trades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    broker_name TEXT NOT NULL,
    symbol TEXT NOT NULL,
    entry_price NUMERIC NOT NULL,
    exit_price NUMERIC NOT NULL,
    pnl NUMERIC NOT NULL,
    position_size NUMERIC NOT NULL,
    trade_type TEXT NOT NULL, -- 'buy' or 'sell'
    opened_at TIMESTAMP WITH TIME ZONE NOT NULL,
    closed_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    -- Prevent duplicate trades from syncing
    UNIQUE(user_id, broker_name, symbol, opened_at, closed_at)
);

CREATE TABLE trade_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    color TEXT,
    UNIQUE(user_id, name)
);

CREATE TABLE trade_tag_map (
    trade_id UUID REFERENCES trades(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES trade_tags(id) ON DELETE CASCADE,
    PRIMARY KEY(trade_id, tag_id)
);

CREATE TABLE journal_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trade_id UUID REFERENCES trades(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
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

-- Create policies (Users can only see their own data)
CREATE POLICY "Users can manage their own broker connections"
    ON broker_connections
    FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own trades"
    ON trades
    FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own trade tags"
    ON trade_tags
    FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own journal notes"
    ON journal_notes
    FOR ALL
    USING (auth.uid() = user_id);
