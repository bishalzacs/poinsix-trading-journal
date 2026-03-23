from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from typing import List, Optional
import os
from contextlib import asynccontextmanager
from .services.sync import process_mt5_sync, supabase
from .utils.crypto import encrypt_password
from .worker import start_scheduler

@asynccontextmanager
async def lifespan(app: FastAPI):
    # start_scheduler() # Only enable if background sync is needed
    yield

app = FastAPI(title="Poinsix MT5 Sync API", version="2.0.0", lifespan=lifespan)

class MT5AccountRequest(BaseModel):
    user_id: str
    mt5_login: str
    mt5_server: str
    mt5_password: str

class SyncRequest(BaseModel):
    user_id: str
    account_id: str

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/add-account")
async def add_account(request: MT5AccountRequest):
    try:
        # 1. Encrypt password
        encrypted_pass = encrypt_password(request.mt5_password)
        
        # 2. Insert into Supabase
        res = supabase.table("trading_accounts").upsert({
            "user_id": request.user_id,
            "mt5_login": request.mt5_login,
            "mt5_server": request.mt5_server,
            "mt5_password_encrypted": encrypted_pass
        }).execute()
        
        return {"status": "success", "data": res.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/sync-trades")
async def sync_trades_endpoint(request: SyncRequest):
    try:
        # Use the updated MT5 sync service
        result = await process_mt5_sync(request)
        return result
    except Exception as e:
        print(f"Sync error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
