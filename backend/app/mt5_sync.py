import MetaTrader5 as mt5
from typing import List, Dict, Any
import pandas as pd
from datetime import datetime, timedelta

def sync_mt5_data(login: int, password: str, server: str, user_id: str):
    """
    Connects to MT5 and fetches trade history + open positions.
    """
    # 1. Initialize MT5
    if not mt5.initialize():
        return {"success": False, "error": f"MT5 initialize() failed, error code: {mt5.last_error()}"}

    # 2. Login
    authorized = mt5.login(login, password=password, server=server)
    if not authorized:
        mt5.shutdown()
        return {"success": False, "error": f"Failed to connect at login {login}, error code: {mt5.last_error()}"}

    try:
        # 3. Fetch History (last 90 days)
        from_date = datetime.now() - timedelta(days=90)
        to_date = datetime.now()
        
        deals = mt5.history_deals_get(from_date, to_date)
        normalized_trades = []
        
        if deals:
            for d in deals:
                # MT5 'deal' includes balance operations, we only want entry/exit of positions
                # Entry (0), Exit (1), In/Out (2)
                if d.type in [mt5.DEAL_TYPE_BUY, mt5.DEAL_TYPE_SELL]:
                    normalized_trades.append({
                        "user_id": user_id,
                        "symbol": d.symbol,
                        "lot_size": d.volume,
                        "entry_price": d.price,
                        "profit": d.profit,
                        "trade_type": "buy" if d.type == mt5.DEAL_TYPE_BUY else "sell",
                        "open_time": datetime.fromtimestamp(d.time).isoformat(),
                        "ticket_id": str(d.ticket),
                        "magic_number": d.magic,
                        "commission": d.commission,
                        "swap": d.swap,
                        "comment": d.comment
                    })

        # 4. Fetch Open Positions
        positions = mt5.positions_get()
        normalized_positions = []
        if positions:
            for p in positions:
                normalized_positions.append({
                    "user_id": user_id,
                    "symbol": p.symbol,
                    "volume": p.volume,
                    "price_open": p.price_open,
                    "price_current": p.price_current,
                    "profit": p.profit,
                    "trade_type": "buy" if p.type == mt5.POSITION_TYPE_BUY else "sell",
                    "open_time": datetime.fromtimestamp(p.time).isoformat(),
                    "ticket_id": str(p.ticket)
                })

        return {
            "success": True, 
            "trades": normalized_trades, 
            "positions": normalized_positions
        }

    finally:
        mt5.shutdown()
