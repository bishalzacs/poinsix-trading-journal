import os
from supabase import create_client, Client
from pydantic import BaseModel
from .mt5_sync import sync_mt5_data
from .utils.crypto import decrypt_password, encrypt_password
from typing import Dict, Any

# Initialize Supabase Admin Client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

class SyncRequest(BaseModel):
    user_id: str
    account_id: str

async def process_mt5_sync(request: SyncRequest) -> Dict[str, Any]:
    # 1. Fetch encrypted credentials
    response = supabase.table("trading_accounts").select("*").eq("id", request.account_id).execute()
    if not response.data:
        raise ValueError("Trading account not found")
    
    acc = response.data[0]
    
    # 2. Decrypt password
    try:
        password = decrypt_password(acc["mt5_password_encrypted"])
    except Exception as e:
        raise ValueError(f"Decryption failed: {str(e)}")

    # 3. Perform MT5 Sync
    result = sync_mt5_data(
        login=int(acc["mt5_login"]),
        password=password,
        server=acc["mt5_server"],
        user_id=request.user_id
    )

    if not result["success"]:
        return {"status": "error", "message": result["error"]}

    # 4. Upsert to Supabase
    if result["trades"]:
        supabase.table("trades").upsert(result["trades"]).execute()
    
    if result["positions"]:
        # Delete old positions for this user before updating with fresh ones
        supabase.table("positions").delete().eq("user_id", request.user_id).execute()
        supabase.table("positions").insert(result["positions"]).execute()

    return {
        "status": "success",
        "synced_trades": len(result["trades"]),
        "synced_positions": len(result["positions"])
    }
