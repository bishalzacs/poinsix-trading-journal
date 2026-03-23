from cryptography.fernet import Fernet
import os

# To generate a key: Fernet.generate_key()
# ENCRYPTION_KEY must be in .env
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY", "super_secret_production_key_12345") 

def encrypt_password(password: str) -> str:
    f = Fernet(ENCRYPTION_KEY.encode())
    return f.encrypt(password.encode()).decode()

def decrypt_password(token: str) -> str:
    f = Fernet(ENCRYPTION_KEY.encode())
    return f.decrypt(token.encode()).decode()
