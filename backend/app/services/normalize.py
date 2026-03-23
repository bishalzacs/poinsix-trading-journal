from typing import Dict, Any, List
import datetime

def normalize_trade(raw_trade: Dict[str, Any], broker_name: str, user_id: str) -> Dict[str, Any]:
    """
    Normalizes a raw trade from a broker into our universal schema.
    """
    # This is a stub. Real implementation needs to handle broker-specific fields.
    return {
        "user_id": user_id,
        "broker_name": broker_name,
        "symbol": raw_trade.get("symbol", "UNKNOWN"),
        "entry_price": float(raw_trade.get("entry_price", 0.0)),
        "exit_price": float(raw_trade.get("exit_price", 0.0)),
        "pnl": float(raw_trade.get("pnl", 0.0)),
        "position_size": float(raw_trade.get("position_size", 0.0)),
        "trade_type": raw_trade.get("trade_type", "buy").lower(),
        "opened_at": raw_trade.get("opened_at", datetime.datetime.utcnow().isoformat()),
        "closed_at": raw_trade.get("closed_at", datetime.datetime.utcnow().isoformat())
    }

def normalize_trades(raw_trades: List[Dict[str, Any]], broker_name: str, user_id: str) -> List[Dict[str, Any]]:
    return [normalize_trade(t, broker_name, user_id) for t in raw_trades]
