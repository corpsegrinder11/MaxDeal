document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("checkout-form");
  if (!form) return;

  // Validación de campos obligatorios
  form.addEventListener("submit", (e) => {
    const requiredFields = [
      "full_name", "email", "rut_dni", "phone",
      "card_number", "card_expiry", "card_cvv",
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
      else if (value.startsWith('30') || value.startsWith('36') || value.startsWith('38')) brand = 'DINERS';
      else if (value.length >= 4) {
        const firstFour = parseInt(value.slice(0, 4));
        if (firstFour >= 3528 && firstFour <= 3589) brand = 'JCB';
      }
      
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

  // Regiones por país (Latinoamérica)
  const regionsByCountry = {
    "AR": ["Buenos Aires", "Catamarca", "Chaco", "Chubut", "Córdoba", "Corrientes", "Entre Ríos", "Formosa", "Jujuy", "La Pampa", "La Rioja", "Mendoza", "Misiones", "Neuquén", "Río Negro", "Salta", "San Juan", "San Luis", "Santa Cruz", "Santa Fe", "Santiago del Estero", "Tierra del Fuego", "Tucumán"],
    "BO": ["Beni", "Chuquisaca", "Cochabamba", "La Paz", "Oruro", "Pando", "Potosí", "Santa Cruz", "Tarija"],
    "BR": ["Acre", "Alagoas", "Amapá", "Amazonas", "Bahía", "Ceará", "Distrito Federal", "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul", "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí", "Río de Janeiro", "Río Grande do Norte", "Río Grande do Sul", "Rondônia", "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins"],
    "CL": ["Arica y Parinacota", "Tarapacá", "Antofagasta", "Atacama", "Coquimbo", "Valparaíso", "Metropolitana", "O'Higgins", "Maule", "Ñuble", "Biobío", "Araucanía", "Los Ríos", "Los Lagos", "Aysén", "Magallanes"],
    "CO": ["Amazonas", "Antioquia", "Arauca", "Atlántico", "Bolívar", "Boyacá", "Caldas", "Caquetá", "Casanare", "Cauca", "Cesar", "Chocó", "Córdoba", "Cundinamarca", "Guainía", "Guaviare", "Huila", "La Guajira", "Magdalena", "Meta", "Nariño", "Norte de Santander", "Putumayo", "Quindío", "Risaralda", "San Andrés y Providencia", "Santander", "Sucre", "Tolima", "Valle del Cauca", "Vaupés", "Vichada"],
    "CR": ["Alajuela", "Cartago", "Guanacaste", "Heredia", "Limón", "Puntarenas", "San José"],
    "EC": ["Azuay", "Bolívar", "Cañar", "Carchi", "Chimborazo", "Cotopaxi", "El Oro", "Esmeraldas", "Galápagos", "Guayas", "Imbabura", "Loja", "Los Ríos", "Manabí", "Morona Santiago", "Napo", "Orellana", "Pastaza", "Pichincha", "Santa Elena", "Santo Domingo", "Sucumbíos", "Tungurahua", "Zamora Chinchipe"],
    "SV": ["Ahuachapán", "Cabañas", "Chalatenango", "Cuscatlán", "La Libertad", "La Paz", "La Unión", "Morazán", "San Miguel", "San Salvador", "San Vicente", "Santa Ana", "Sonsonate", "Usulután"],
    "GT": ["Alta Verapaz", "Baja Verapaz", "Chimaltenango", "Chiquimula", "El Progreso", "Escuintla", "Guatemala", "Huehuetenango", "Izabal", "Jalapa", "Jutiapa", "Petén", "Quetzaltenango", "Quiché", "Retalhuleu", "Sacatepéquez", "San Marcos", "Santa Rosa", "Sololá", "Suchitepéquez", "Totonicapán", "Zacapa"],
    "HN": ["Atlántida", "Choluteca", "Colón", "Comayagua", "Copán", "Cortés", "El Paraíso", "Francisco Morazán", "Gracias a Dios", "Intibucá", "Islas de la Bahía", "La Paz", "Lempira", "Ocotepeque", "Olancho", "Santa Bárbara", "Valle", "Yoro"],
    "MX": ["Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas", "Chihuahua", "Ciudad de México", "Coahuila", "Colima", "Durango", "Estado de México", "Guanajuato", "Guerrero", "Hidalgo", "Jalisco", "Michoacán", "Morelos", "Nayarit", "Nuevo León", "Oaxaca", "Puebla", "Querétaro", "Quintana Roo", "San Luis Potosí", "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas"],
    "NI": ["Boaco", "Carazo", "Chinandega", "Chontales", "Estelí", "Granada", "Jinotega", "León", "Madriz", "Managua", "Masaya", "Matagalpa", "Nueva Segovia", "Río San Juan", "RACCN", "RACCS"],
    "PA": ["Bocas del Toro", "Chiriquí", "Coclé", "Colón", "Darién", "Herrera", "Los Santos", "Panamá", "Panamá Oeste", "Veraguas"],
    "PY": ["Alto Paraguay", "Alto Paraná", "Amambay", "Asunción", "Boquerón", "Caaguazú", "Caazapá", "Canindeyú", "Central", "Concepción", "Cordillera", "Guairá", "Itapúa", "Misiones", "Ñeembucú", "Paraguarí", "Presidente Hayes", "San Pedro"],
    "PE": ["Amazonas", "Áncash", "Apurímac", "Arequipa", "Ayacucho", "Cajamarca", "Callao", "Cusco", "Huancavelica", "Huánuco", "Ica", "Junín", "La Libertad", "Lambayeque", "Lima", "Loreto", "Madre de Dios", "Moquegua", "Pasco", "Piura", "Puno", "San Martín", "Tacna", "Tumbes", "Ucayali"],
    "DO": ["Azua", "Baoruco", "Barahona", "Dajabón", "Distrito Nacional", "Duarte", "El Seibo", "Elías Piña", "Espaillat", "Hato Mayor", "Hermanas Mirabal", "Independencia", "La Altagracia", "La Romana", "La Vega", "María Trinidad Sánchez", "Monseñor Nouel", "Monte Cristi", "Monte Plata", "Pedernales", "Peravia", "Puerto Plata", "Samaná", "San Cristóbal", "San José de Ocoa", "San Juan", "San Pedro de Macorís", "Sánchez Ramírez", "Santiago", "Santiago Rodríguez", "Santo Domingo", "Valverde"],
    "UY": ["Artigas", "Canelones", "Cerro Largo", "Colonia", "Durazno", "Flores", "Florida", "Lavalleja", "Maldonado", "Montevideo", "Paysandú", "Río Negro", "Rivera", "Rocha", "Salto", "San José", "Soriano", "Tacuarembó", "Treinta y Tres"],
    "VE": ["Amazonas", "Anzoátegui", "Apure", "Aragua", "Barinas", "Bolívar", "Carabobo", "Cojedes", "Delta Amacuro", "Distrito Capital", "Falcón", "Guárico", "Lara", "Mérida", "Miranda", "Monagas", "Nueva Esparta", "Portuguesa", "Sucre", "Táchira", "Trujillo", "Vargas", "Yaracuy", "Zulia"]
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

  // Actualizar texto del botón según servicio seleccionado
  const serviceSelect = form.querySelector('#service_type');
  const submitButton = form.querySelector('button[type="submit"]');
  
  if (serviceSelect && submitButton) {
    const prices = {
      'landing': 'Pagar $47.500 CLP (50% anticipo)',
      'whatsapp': 'Pagar $23.500 CLP (50% anticipo)',
      'web_completa': 'Pagar $95.000 CLP (50% anticipo)',
      'pack': 'Pagar $66.500 CLP (50% anticipo)'
    };
    
    serviceSelect.addEventListener('change', (e) => {
      const selectedService = e.target.value;
      if (selectedService && prices[selectedService]) {
        submitButton.textContent = prices[selectedService];
      } else {
        submitButton.textContent = 'Pagar 50% de anticipo';
      }
    });
  }
