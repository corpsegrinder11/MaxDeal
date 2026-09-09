"""
Generador de datos ficticios para auditoría y testing.
Solo usar en entorno de pruebas, NO en producción.
"""

import random
from datetime import datetime, timedelta

# Nombres comunes en Latinoamérica
FIRST_NAMES = [
    "Juan", "María", "Carlos", "Ana", "Luis", "Laura", "Pedro", "Sofía",
    "Miguel", "Carmen", "José", "Elena", "David", "Patricia", "Javier", "Lucía"
]

LAST_NAMES = [
    "García", "Rodríguez", "González", "López", "Martínez", "Sánchez", "Pérez",
    "Díaz", "Torres", "Ramírez", "Flores", "Gómez", "Ruiz", "Morales", "Vargas"
]

# Generadores por país
CITIES_BY_COUNTRY = {
    "CL": ["Santiago", "Valparaíso", "Concepción", "La Serena", "Antofagasta", "Temuco", "Rancagua", "Talca"],
    "AR": ["Buenos Aires", "Córdoba", "Rosario", "Mendoza", "La Plata", "San Miguel de Tucumán", "Mar del Plata"],
    "MX": ["Ciudad de México", "Guadalajara", "Monterrey", "Puebla", "Tijuana", "León", "Juárez"],
    "CO": ["Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena", "Cúcuta", "Bucaramanga"],
    "PE": ["Lima", "Arequipa", "Trujillo", "Chiclayo", "Piura", "Cusco", "Iquitos"],
}

def generate_email(first_name, last_name):
    domains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"]
    return f"{first_name.lower()}.{last_name.lower()}{random.randint(10, 99)}@{random.choice(domains)}"

def generate_rut_chile():
    # RUT chileno ficticio (no válido realmente, solo para testing)
    base = random.randint(1000000, 9999999)
    dv = random.choice([str(random.randint(1, 9)), "K"])
    return f"{base}-{dv}"

def generate_dni_argentina():
    return str(random.randint(20000000, 45000000))

def generate_phone(country):
    if country == "CL":
        return f"+56 9 {random.randint(1000, 9999)} {random.randint(1000, 9999)}"
    elif country == "AR":
        return f"+54 9 11 {random.randint(1000, 9999)} {random.randint(1000, 9999)}"
    elif country == "MX":
        return f"+52 55 {random.randint(1000, 9999)} {random.randint(1000, 9999)}"
    else:
        return f"+{random.randint(1, 99)} {random.randint(100, 999)} {random.randint(1000, 9999)}"

def generate_card_number(brand=None):
    """Genera número de tarjeta ficticio (NO válido para compras reales)"""
    if brand == "visa" or not brand:
        prefix = "4"
        length = 16
    elif brand == "mastercard":
        prefix = str(random.choice([51, 52, 53, 54, 55]))
        length = 16
    elif brand == "amex":
        prefix = str(random.choice([34, 37]))
        length = 15
    else:
        prefix = "4"
        length = 16
    
    remaining = length - len(prefix)
    card = prefix + "".join([str(random.randint(0, 9)) for _ in range(remaining - 1)])
    
    # Añadir dígito verificador (simplificado, no Luhn real)
    card += str(random.randint(0, 9))
    return card

def generate_card_expiry():
    """Genera fecha de expiración futura (MM/YY)"""
    now = datetime.now()
    future = now + timedelta(days=random.randint(365, 1825))  # 1-5 años en el futuro
    return f"{future.month:02d}/{future.year % 100:02d}"

def generate_cvv():
    """Genera CVV de 3 o 4 dígitos"""
    length = random.choice([3, 4])
    return "".join([str(random.randint(0, 9)) for _ in range(length)])

def generate_address(country):
    """Genera dirección ficticia"""
    streets = ["Av. Principal", "Calle Central", "Av. Libertador", "Calle Los Andes", "Av. del Sol"]
    numbers = random.randint(100, 9999)
    return f"{random.choice(streets)} {numbers}"

def generate_postal_code(country):
    """Genera código postal ficticio"""
    if country == "CL":
        return str(random.randint(1000000, 9999999))
    elif country == "AR":
        return f"{random.randint(1000, 9999)}{random.choice('ABCDEFGHIJKLMNOPQRSTUVWXYZ')}"
    elif country == "MX":
        return str(random.randint(10000, 99999))
    else:
        return str(random.randint(10000, 99999))

def generate_full_audit_data():
    """Genera un set completo de datos ficticios para auditoría"""
    first_name = random.choice(FIRST_NAMES)
    last_name = random.choice(LAST_NAMES)
    full_name = f"{first_name} {last_name}"
    
    country = random.choice(["CL", "AR", "MX", "CO", "PE"])
    region = random.choice(CITIES_BY_COUNTRY.get(country, ["Capital"])[:5])
    city = random.choice(CITIES_BY_COUNTRY.get(country, ["Capital"]))
    
    # Determinar tipo de documento según país
    if country == "CL":
        rut_dni = generate_rut_chile()
    elif country == "AR":
        rut_dni = generate_dni_argentina()
    else:
        rut_dni = str(random.randint(10000000, 99999999))
    
    # Datos de pago
    card_brand = random.choice(["visa", "mastercard", "amex"])
    card_number = generate_card_number(card_brand)
    card_expiry = generate_card_expiry()
    card_cvv = generate_cvv()
    
    return {
        "personal": {
            "full_name": full_name,
            "email": generate_email(first_name, last_name),
            "rut_dni": rut_dni,
            "phone": generate_phone(country)
        },
        "payment": {
            "card_number": card_number,
            "card_expiry": card_expiry,
            "card_cvv": card_cvv
        },
        "shipping": {
            "shipping_name": full_name,
            "country": country,
            "region": region,
            "city": city,
            "address": generate_address(country),
            "postal_code": generate_postal_code(country),
            "shipping_phone": generate_phone(country),
            "shipping_email": generate_email(first_name, last_name)
        }
    }

if __name__ == "__main__":
    # Ejecutar para probar
    import json
    data = generate_full_audit_data()
    print(json.dumps(data, indent=2, ensure_ascii=False))
