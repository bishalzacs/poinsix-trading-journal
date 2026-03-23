from .normalize import normalize_trades
from ..brokers.xness import xNessBroker
from ..brokers.xm import XMBroker
from typing import Dict, Any

async def sync_broker_trades(user_id: str, broker_name: str) -> Dict[str, Any]:
    """
    1. Fetch user API keys from Supabase via user_id + broker_name
    2. Instantiate the correct broker adapter
    3. Authenticate and fetch raw trades
    4. Normalize the trades
    5. Upsert into Supabase trades table
    """
    
    # Stub: Fetch keys from Supabase (to be implemented)
    api_key = "stub_key"
    secret = "stub_secret"
    
    broker = None
    if broker_name.lower() == "xness":
        broker = xNessBroker(api_key, secret)
    elif broker_name.lower() == "xm_global":
        broker = XMBroker(api_key, secret)
    else:
        raise ValueError(f"Unsupported broker: {broker_name}")

    if not broker.authenticate():
        raise ValueError(f"Failed to authenticate with {broker_name}")

    raw_trades = broker.fetch_trades()
    normalized = normalize_trades(raw_trades, broker_name, user_id)

    # Stub: Upsert to Supabase
    # client.table("trades").upsert(normalized).execute()

    return {"synced_count": len(normalized)}
