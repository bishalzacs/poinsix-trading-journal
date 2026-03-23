from cryptography.fernet import Fernet
import os


def encrypt_password(password: str) -> str:
    f = Fernet(ENCRYPTION_KEY.encode())
    return f.encrypt(password.encode()).decode()

def decrypt_password(token: str) -> str:
    f = Fernet(ENCRYPTION_KEY.encode())
    return f.decrypt(token.encode()).decode()
