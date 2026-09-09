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

def luhn_check(card_number):
    """
    Valida un número de tarjeta usando el algoritmo de Luhn.
    Retorna True si es válido, False si no.
    """
    if not card_number or not card_number.isdigit():
        return False
    
    digits = [int(d) for d in card_number]
    odd_digits = digits[-1::-2]
    even_digits = digits[-2::-2]
    
    total = sum(odd_digits)
    for d in even_digits:
        doubled = d * 2
        total += doubled if doubled < 10 else doubled - 9
    
    return total % 10 == 0

def validate_card_format(card_number):
    """
    Valida formato básico de tarjeta (longitud y dígitos).
    """
    if not card_number or not card_number.isdigit():
        return False, "Solo se permiten números"
    
    if len(card_number) < 13 or len(card_number) > 19:
        return False, "Longitud inválida (13-19 dígitos)"
    
    if not luhn_check(card_number):
        return False, "Número de tarjeta inválido"
    
    return True, "Válida"
