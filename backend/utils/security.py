import re
from collections import defaultdict
from datetime import datetime, timedelta

request_counts = defaultdict(list)

def sanitize_input(value):
    if not isinstance(value, str):
        return str(value)
    if not re.match(r"^[a-zA-Z0-9\s\.\-\@\+]+$", value):
        return None
    return value.strip()

def check_rate_limit(ip, max_requests=30, window_seconds=60):
    now = datetime.now()
    request_counts[ip] = [
        t for t in request_counts[ip]
        if now - t < timedelta(seconds=window_seconds)
    ]
    if len(request_counts[ip]) >= max_requests:
        return False
    request_counts[ip].append(now)
    return True
