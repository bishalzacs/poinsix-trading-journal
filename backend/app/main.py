from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
import os
from contextlib import asynccontextmanager
from .services.sync import sync_broker_trades
from .worker import start_scheduler

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Start APScheduler
    start_scheduler()
    yield
    # Shutdown logic if any

app = FastAPI(title="Trading Journal Sync API", version="1.0.0", lifespan=lifespan)

class SyncRequest(BaseModel):
    user_id: str
    broker_name: str

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/sync-trades")
async def sync_trades_endpoint(request: SyncRequest):
    try:
        # Calls the sync service to fetch keys, hit broker, normalize, and save
        result = await sync_broker_trades(request.user_id, request.broker_name)
        return {"status": "success", "synced_count": result.get("synced_count", 0)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
