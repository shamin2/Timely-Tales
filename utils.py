from cryptography.fernet import Fernet

def generate_key():
    return Fernet.generate_key()

def encrypt_content(content, key):
    cipher_suite = Fernet(key)
    return cipher_suite.encrypt(content.encode('utf-8'))

def decrypt_content(encrypted_content, key):
    cipher_suite = Fernet(key)
    return cipher_suite.decrypt(encrypted_content).decode('utf-8')
