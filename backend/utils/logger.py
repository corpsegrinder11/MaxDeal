import json
import os
from datetime import datetime

LOG_FILE = "logs/events.json"

def ensure_log_dir():
    os.makedirs(os.path.dirname(LOG_FILE), exist_ok=True)

def log_event(event_type, ip, user_agent, path, method, status, details=None):
    ensure_log_dir()
    event = {
        "timestamp": datetime.now().isoformat(),
        "event_type": event_type,
        "ip": ip,
        "user_agent": user_agent,
        "path": path,
        "method": method,
        "status": status,
        "details": details or {}
    }
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps(event) + "\n")
