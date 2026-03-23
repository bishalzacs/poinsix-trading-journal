import os
from supabase import create_client, Client
from .normalize import normalize_trades
from ..brokers.xness import xNessBroker
from ..brokers.xm import XMBroker
from typing import Dict, Any

# Initialize Supabase Admin Client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

async def sync_broker_trades(user_id: str, broker_name: str) -> Dict[str, Any]:
    """
    Orchestrates the real trade sync process.
    """
    # 1. Fetch user API keys from Supabase
    response = supabase.table("broker_connections") \
        .select("*") \
        .eq("user_id", user_id) \
        .eq("broker_name", broker_name) \
        .execute()

    if not response.data:
        raise ValueError(f"No connection found for {broker_name}")

    connection = response.data[0]
    api_key = connection.get("api_key")
    secret = connection.get("api_secret")

    # 2. Instantiate broker adapter
    broker = None
    if broker_name.lower().replace(' ', '_') == "xness":
        broker = xNessBroker(api_key, secret)
    elif broker_name.lower().replace(' ', '_') == "xm_global":
        broker = XMBroker(api_key, secret)
    else:
        raise ValueError(f"Unsupported broker: {broker_name}")

    # 3. Authenticate and fetch
    # Note: Broker adapters currently return stubs, which we will keep until user provides real API sample
    if not broker.authenticate():
        raise ValueError(f"Failed to authenticate with {broker_name}")

    raw_trades = broker.fetch_trades()
    normalized = normalize_trades(raw_trades, broker_name, user_id)

    # 4. Upsert into Supabase trades table
    if normalized:
        supabase.table("trades").upsert(normalized).execute()

    return {"synced_count": len(normalized)}
