from cryptography.fernet import Fernet
import os

# To generate a key: Fernet.generate_key()
# ENCRYPTION_KEY must be in .env
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY", "uE_jXN7v4-6z7z7z-7z7z7z7z7z7z7z7z7z7z7z7z7=") 

def encrypt_password(password: str) -> str:
    f = Fernet(ENCRYPTION_KEY.encode())
    return f.encrypt(password.encode()).decode()

def decrypt_password(token: str) -> str:
    f = Fernet(ENCRYPTION_KEY.encode())
    return f.decrypt(token.encode()).decode()
