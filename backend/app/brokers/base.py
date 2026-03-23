from abc import ABC, abstractmethod
from typing import List, Dict, Any

class BaseBroker(ABC):
    def __init__(self, api_key: str, secret: str):
        self.api_key = api_key
        self.secret = secret

    @abstractmethod
    def authenticate(self) -> bool:
        """Authenticate with the broker. Returns True if successful."""
        pass

    @abstractmethod
    def fetch_trades(self, from_date=None, to_date=None) -> List[Dict[str, Any]]:
        """Fetch raw trades from the broker."""
        pass
