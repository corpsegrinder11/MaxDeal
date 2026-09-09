document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("checkout-form");
  if (!form) return;

  // Precios de servicios
  const servicePrices = {
    'landing': { total: 95000, deposit: 47500, currency: 'CLP' },
    'whatsapp': { total: 47000, deposit: 23500, currency: 'CLP' },
    'web_completa': { total: 190000, deposit: 95000, currency: 'CLP' },
    'pack': { total: 133000, deposit: 66500, currency: 'CLP' }
  };

  const serviceNames = {
    'landing': 'Landing Page Profesional',
    'whatsapp': 'Automatización WhatsApp',
    'web_completa': 'Página Web Completa',
    'pack': 'Pack Emprendedor'
  };

  // Actualizar resumen del servicio
  const serviceSelect = form.querySelector('#service_type');
  const serviceSummary = form.querySelector('#service_summary');
  const serviceName = form.querySelector('#service_name');
  const serviceTotal = form.querySelector('#service_total');
  const serviceDeposit = form.querySelector('#service_deposit');
  const submitButton = form.querySelector('#submit_button');

  if (serviceSelect && serviceSummary) {
    serviceSelect.addEventListener('change', (e) => {
      const selectedService = e.target.value;
      
      if (selectedService && servicePrices[selectedService]) {
        const price = servicePrices[selectedService];
        const name = serviceNames[selectedService];
        
        serviceName.textContent = name;
        serviceTotal.textContent = `$${price.total.toLocaleString('es-CL')} ${price.currency}`;
        serviceDeposit.textContent = `$${price.deposit.toLocaleString('es-CL')} ${price.currency}`;
        serviceSummary.style.display = 'block';
        submitButton.textContent = `Pagar $${price.deposit.toLocaleString('es-CL')} (50% anticipo)`;
      } else {
        serviceSummary.style.display = 'none';
        submitButton.textContent = 'Continuar al pago';
      }
    });
  }

  // Validación de campos obligatorios
  form.addEventListener("submit", (e) => {
    const requiredFields = [
      "service_type", "full_name", "email", "phone",
      "shipping_name", "country", "region", "city", "address", "postal_code", "shipping_phone", "shipping_email"
    ];

    let valid = true;
    requiredFields.forEach(field => {
      const input = form.querySelector(`[name="${field}"]`);
      if (input && !input.value.trim()) {
        valid = false;
        input.style.borderColor = "#cc0000";
      } else if (input) {
        input.style.borderColor = "#444";
      }
    });

    if (!valid) {
      e.preventDefault();
      alert("Completa todos los campos obligatorios.");
    }
  });

  // Auto-separador para fecha de expiración (MM/YY)
  const expiryInput = form.querySelector('#card-expiry');
  if (expiryInput) {
    expiryInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "");
      if (value.length >= 2) {
        value = value.slice(0, 2) + "/" + value.slice(2, 4);
      }
      e.target.value = value;
    });
  }

  // Detección de marca de tarjeta
  const cardInput = form.querySelector('#card-number');
  const brandIcon = form.querySelector('#card-brand-icon');

  if (cardInput && brandIcon) {
    cardInput.addEventListener('input', (e) => {
      const value = e.target.value.replace(/\D/g, '');
      let brand = '';
      
      if (value.startsWith('4')) brand = 'VISA';
      else if (value.startsWith('5') && value.length >= 2) {
        const second = parseInt(value[1]);
        if (second >= 1 && second <= 5) brand = 'MASTERCARD';
      }
      else if (value.startsWith('3') && value.length >= 2) {
        const second = parseInt(value[1]);
        if (second === 4 || second === 7) brand = 'AMEX';
      }
      else if (value.startsWith('6')) brand = 'DISCOVER';
      
      brandIcon.textContent = brand;
      brandIcon.style.color = brand ? '#00aa00' : '#888';
    });
  }

  // Algoritmo de Luhn para validación de tarjeta
  function luhnCheck(cardNumber) {
    const digits = cardNumber.split('').map(Number);
    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = digits[i];
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  // Validar tarjeta al salir del input
  if (cardInput) {
    cardInput.addEventListener('blur', (e) => {
      const value = e.target.value.replace(/\D/g, '');
      if (value.length >= 13) {
        if (!luhnCheck(value)) {
          e.target.style.borderColor = "#cc0000";
          brandIcon.textContent = 'INVÁLIDA';
          brandIcon.style.color = '#cc0000';
        } else {
          e.target.style.borderColor = "#00aa00";
        }
      }
    });

    cardInput.addEventListener('input', (e) => {
      e.target.style.borderColor = "#444";
      brandIcon.style.color = "#888";
    });
  }

  // Mostrar/ocultar formulario según método de pago
  const paymentMethods = form.querySelectorAll('input[name="payment_method"]');
  const cardForm = form.querySelector('#card-payment-form');
  const transferForm = form.querySelector('#transfer-payment-form');
  const paypalForm = form.querySelector('#paypal-payment-form');

  paymentMethods.forEach(method => {
    method.addEventListener('change', (e) => {
      const selectedMethod = e.target.value;
      
      // Ocultar todos
      cardForm.style.display = 'none';
      transferForm.style.display = 'none';
      paypalForm.style.display = 'none';
      
      // Mostrar el seleccionado
      if (selectedMethod === 'card') {
        cardForm.style.display = 'block';
        cardForm.querySelector('[name="card_number"]').setAttribute('required', '');
        cardForm.querySelector('[name="card_expiry"]').setAttribute('required', '');
        cardForm.querySelector('[name="card_cvv"]').setAttribute('required', '');
      } else if (selectedMethod === 'transfer') {
        transferForm.style.display = 'block';
        cardForm.querySelector('[name="card_number"]').removeAttribute('required');
        cardForm.querySelector('[name="card_expiry"]').removeAttribute('required');
        cardForm.querySelector('[name="card_cvv"]').removeAttribute('required');
      } else if (selectedMethod === 'paypal') {
        paypalForm.style.display = 'block';
        cardForm.querySelector('[name="card_number"]').removeAttribute('required');
        cardForm.querySelector('[name="card_expiry"]').removeAttribute('required');
        cardForm.querySelector('[name="card_cvv"]').removeAttribute('required');
      }
    });
  });

  // Regiones por país (Latinoamérica)
  const regionsByCountry = {
    "CL": ["Arica y Parinacota", "Tarapacá", "Antofagasta", "Atacama", "Coquimbo", "Valparaíso", "Metropolitana", "O'Higgins", "Maule", "Ñuble", "Biobío", "Araucanía", "Los Ríos", "Los Lagos", "Aysén", "Magallanes"],
    "AR": ["Buenos Aires", "Catamarca", "Chaco", "Chubut", "Córdoba", "Corrientes", "Entre Ríos", "Formosa", "Jujuy", "La Pampa", "La Rioja", "Mendoza", "Misiones", "Neuquén", "Río Negro", "Salta", "San Juan", "San Luis", "Santa Cruz", "Santa Fe", "Santiago del Estero", "Tierra del Fuego", "Tucumán"],
    "BO": ["Beni", "Chuquisaca", "Cochabamba", "La Paz", "Oruro", "Pando", "Potosí", "Santa Cruz", "Tarija"],
    "BR": ["Acre", "Alagoas", "Amapá", "Amazonas", "Bahía", "Ceará", "Distrito Federal", "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul", "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí", "Río de Janeiro", "Río Grande do Norte", "Río Grande do Sul", "Rondônia", "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins"],
    "CO": ["Amazonas", "Antioquia", "Arauca", "Atlántico", "Bolívar", "Boyacá", "Caldas", "Caquetá", "Casanare", "Cauca", "Cesar", "Chocó", "Córdoba", "Cundinamarca", "Guainía", "Guaviare", "Huila", "La Guajira", "Magdalena", "Meta", "Nariño", "Norte de Santander", "Putumayo", "Quindío", "Risaralda", "San Andrés y Providencia", "Santander", "Sucre", "Tolima", "Valle del Cauca", "Vaupés", "Vichada"],
    "MX": ["Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas", "Chihuahua", "Ciudad de México", "Coahuila", "Colima", "Durango", "Estado de México", "Guanajuato", "Guerrero", "Hidalgo", "Jalisco", "Michoacán", "Morelos", "Nayarit", "Nuevo León", "Oaxaca", "Puebla", "Querétaro", "Quintana Roo", "San Luis Potosí", "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas"],
    "PE": ["Amazonas", "Áncash", "Apurímac", "Arequipa", "Ayacucho", "Cajamarca", "Callao", "Cusco", "Huancavelica", "Huánuco", "Ica", "Junín", "La Libertad", "Lambayeque", "Lima", "Loreto", "Madre de Dios", "Moquegua", "Pasco", "Piura", "Puno", "San Martín", "Tacna", "Tumbes", "Ucayali"],
    "EC": ["Azuay", "Bolívar", "Cañar", "Carchi", "Chimborazo", "Cotopaxi", "El Oro", "Esmeraldas", "Galápagos", "Guayas", "Imbabura", "Loja", "Los Ríos", "Manabí", "Morona Santiago", "Napo", "Orellana", "Pastaza", "Pichincha", "Santa Elena", "Santo Domingo", "Sucumbíos", "Tungurahua", "Zamora Chinchipe"],
    "UY": ["Artigas", "Canelones", "Cerro Largo", "Colonia", "Durazno", "Flores", "Florida", "Lavalleja", "Maldonado", "Montevideo", "Paysandú", "Río Negro", "Rivera", "Rocha", "Salto", "San José", "Soriano", "Tacuarembó", "Treinta y Tres"]
  };

  const countrySelect = form.querySelector('#country-select');
  const regionSelect = form.querySelector('#region-select');

  if (countrySelect && regionSelect) {
    countrySelect.addEventListener('change', () => {
      const selectedCountry = countrySelect.value;
      regionSelect.innerHTML = '<option value="">Seleccionar región</option>';
      
      if (selectedCountry && regionsByCountry[selectedCountry]) {
        regionsByCountry[selectedCountry].forEach(region => {
          const option = document.createElement('option');
          option.value = region;
          option.textContent = region;
          regionSelect.appendChild(option);
        });
      }
    });
  }
});
