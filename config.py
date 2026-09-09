import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-in-prod")
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.example.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASS = os.getenv("SMTP_PASS", "")
EMAIL_TO = os.getenv("EMAIL_TO", "")

LOG_FILE = "logs/events.json"
MAX_REQUESTS_PER_MINUTE = 30

# Modo auditoría (SOLO para testing, NO usar en producción)
AUDIT_MODE = os.getenv("AUDIT_MODE", "false").lower() == "true"
