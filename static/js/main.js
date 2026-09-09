document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("checkout-form");

  if (form) {
    const servicePrices = {
      landing: { total: 95000, deposit: 47500, currency: "CLP" },
      whatsapp: { total: 47000, deposit: 23500, currency: "CLP" },
      web_completa: { total: 190000, deposit: 95000, currency: "CLP" },
      pack: { total: 133000, deposit: 66500, currency: "CLP" }
    };

    const serviceNames = {
      landing: "Landing Page Profesional",
      whatsapp: "Automatización WhatsApp",
      web_completa: "Página Web Completa",
      pack: "Pack Emprendedor"
    };

    const serviceSelect = form.querySelector("#service_type");
    const serviceSummary = form.querySelector("#service_summary");
    const serviceName = form.querySelector("#service_name");
    const serviceTotal = form.querySelector("#service_total");
    const serviceDeposit = form.querySelector("#service_deposit");
    const submitButton = form.querySelector("#submit_button");

    const formatCLP = (amount) =>
      `$${amount.toLocaleString("es-CL")} CLP`;

    if (
      serviceSelect &&
      serviceSummary &&
      serviceName &&
      serviceTotal &&
      serviceDeposit &&
      submitButton
    ) {
      serviceSelect.addEventListener("change", (event) => {
        const service = event.target.value;
        const price = servicePrices[service];

        if (!price) {
          serviceSummary.style.display = "none";
          submitButton.textContent = "Continuar al pago";
          return;
        }

        serviceName.textContent = serviceNames[service];
        serviceTotal.textContent = formatCLP(price.total);
        serviceDeposit.textContent = formatCLP(price.deposit);
        serviceSummary.style.display = "block";
        submitButton.textContent =
          `Solicitar ${serviceNames[service]} · Anticipo ${formatCLP(price.deposit)}`;
      });
    }

    const cardInput = form.querySelector("#card-number");
    const brandIcon = form.querySelector("#card-brand-icon");
    const expiryInput = form.querySelector("#card-expiry");

    function sanitizeCardNumber(value) {
      return value.replace(/\D/g, "");
    }

    function detectCardBrand(cardNumber) {
      if (/^4/.test(cardNumber)) return "VISA";

      const firstTwo = Number(cardNumber.slice(0, 2));
      const firstFour = Number(cardNumber.slice(0, 4));

      if (
        (firstTwo >= 51 && firstTwo <= 55) ||
        (firstFour >= 2221 && firstFour <= 2720)
      ) {
        return "MASTERCARD";
      }

      if (/^(34|37)/.test(cardNumber)) return "AMEX";
      if (/^(30[0-5]|36|38|39)/.test(cardNumber)) return "DINERS";
      if (/^(352[8-9]|35[3-8][0-9])/.test(cardNumber)) return "JCB";
      if (/^(6011|65|64[4-9])/.test(cardNumber)) return "DISCOVER";

      return "";
    }

    function luhnCheck(cardNumber) {
      if (!/^\d{13,19}$/.test(cardNumber)) return false;

      let total = 0;
      let doubleDigit = false;

      for (let index = cardNumber.length - 1; index >= 0; index -= 1) {
        let digit = Number(cardNumber[index]);

        if (doubleDigit) {
          digit *= 2;
          if (digit > 9) digit -= 9;
        }

        total += digit;
        doubleDigit = !doubleDigit;
      }

      return total % 10 === 0;
    }

    if (cardInput && brandIcon) {
      cardInput.addEventListener("input", (event) => {
        const cardNumber = sanitizeCardNumber(event.target.value);
        const brand = detectCardBrand(cardNumber);

        event.target.value = cardNumber.replace(/(\d{4})(?=\d)/g, "$1 ");

        brandIcon.textContent = brand;
        brandIcon.style.color = brand ? "#63e6ff" : "#8994a5";
        event.target.style.borderColor = "";
      });

      cardInput.addEventListener("blur", (event) => {
        const cardNumber = sanitizeCardNumber(event.target.value);

        if (!cardNumber) return;

        if (luhnCheck(cardNumber)) {
          event.target.style.borderColor = "#41d792";
          return;
        }

        event.target.style.borderColor = "#ff5b5b";
        brandIcon.textContent = "REVISA EL NÚMERO";
        brandIcon.style.color = "#ff5b5b";
      });
    }

    if (expiryInput) {
      expiryInput.addEventListener("input", (event) => {
        const numbers = event.target.value.replace(/\D/g, "").slice(0, 4);

        if (numbers.length <= 2) {
          event.target.value = numbers;
          return;
        }

        event.target.value = `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
      });
    }

    const paymentMethods = form.querySelectorAll(
      'input[name="payment_method"]'
    );
    const cardForm = form.querySelector("#card-payment-form");
    const transferForm = form.querySelector("#transfer-payment-form");
    const paypalForm = form.querySelector("#paypal-payment-form");

    function setCardFieldsRequired(isRequired) {
      if (!cardForm) return;

      ["card_number", "card_expiry", "card_cvv"].forEach((name) => {
        const input = cardForm.querySelector(`[name="${name}"]`);

        if (!input) return;

        if (isRequired) {
          input.setAttribute("required", "");
        } else {
          input.removeAttribute("required");
        }
      });
    }

    function updatePaymentMethod(method) {
      if (!cardForm || !transferForm || !paypalForm) return;

      cardForm.style.display = "none";
      transferForm.style.display = "none";
      paypalForm.style.display = "none";
      setCardFieldsRequired(false);

      if (method === "card") {
        cardForm.style.display = "block";
        setCardFieldsRequired(true);
      }

      if (method === "transfer") {
        transferForm.style.display = "block";
      }

      if (method === "paypal") {
        paypalForm.style.display = "block";
      }
    }

    paymentMethods.forEach((method) => {
      method.addEventListener("change", (event) => {
        updatePaymentMethod(event.target.value);
      });
    });

    const selectedMethod = form.querySelector(
      'input[name="payment_method"]:checked'
    );

    if (selectedMethod) {
      updatePaymentMethod(selectedMethod.value);
    }

    const regionsByCountry = {
      CL: [
        "Arica y Parinacota",
        "Tarapacá",
        "Antofagasta",
        "Atacama",
        "Coquimbo",
        "Valparaíso",
        "Metropolitana de Santiago",
        "Libertador General Bernardo O'Higgins",
        "Maule",
        "Ñuble",
        "Biobío",
        "La Araucanía",
        "Los Ríos",
        "Los Lagos",
        "Aysén del General Carlos Ibáñez del Campo",
        "Magallanes y de la Antártica Chilena"
      ],
      AR: [
        "Buenos Aires",
        "Ciudad Autónoma de Buenos Aires",
        "Catamarca",
        "Chaco",
        "Chubut",
        "Córdoba",
        "Corrientes",
        "Entre Ríos",
        "Formosa",
        "Jujuy",
        "La Pampa",
        "La Rioja",
        "Mendoza",
        "Misiones",
        "Neuquén",
        "Río Negro",
        "Salta",
        "San Juan",
        "San Luis",
        "Santa Cruz",
        "Santa Fe",
        "Santiago del Estero",
        "Tierra del Fuego",
        "Tucumán"
      ],
      BO: [
        "Beni",
        "Chuquisaca",
        "Cochabamba",
        "La Paz",
        "Oruro",
        "Pando",
        "Potosí",
        "Santa Cruz",
        "Tarija"
      ],
      BR: [
        "Acre",
        "Alagoas",
        "Amapá",
        "Amazonas",
        "Bahia",
        "Ceará",
        "Distrito Federal",
        "Espírito Santo",
        "Goiás",
        "Maranhão",
        "Mato Grosso",
        "Mato Grosso do Sul",
        "Minas Gerais",
        "Pará",
        "Paraíba",
        "Paraná",
        "Pernambuco",
        "Piauí",
        "Rio de Janeiro",
        "Rio Grande do Norte",
        "Rio Grande do Sul",
        "Rondônia",
        "Roraima",
        "Santa Catarina",
        "São Paulo",
        "Sergipe",
        "Tocantins"
      ],
      CO: [
        "Amazonas",
        "Antioquia",
        "Arauca",
        "Atlántico",
        "Bolívar",
        "Boyacá",
        "Caldas",
        "Caquetá",
        "Casanare",
        "Cauca",
        "Cesar",
        "Chocó",
        "Córdoba",
        "Cundinamarca",
        "Guainía",
        "Guaviare",
        "Huila",
        "La Guajira",
        "Magdalena",
        "Meta",
        "Nariño",
        "Norte de Santander",
        "Putumayo",
        "Quindío",
        "Risaralda",
        "San Andrés y Providencia",
        "Santander",
        "Sucre",
        "Tolima",
        "Valle del Cauca",
        "Vaupés",
        "Vichada"
      ],
      CR: [
        "Alajuela",
        "Cartago",
        "Guanacaste",
        "Heredia",
        "Limón",
        "Puntarenas",
        "San José"
      ],
      EC: [
        "Azuay",
        "Bolívar",
        "Cañar",
        "Carchi",
        "Chimborazo",
        "Cotopaxi",
        "El Oro",
        "Esmeraldas",
        "Galápagos",
        "Guayas",
        "Imbabura",
        "Loja",
        "Los Ríos",
        "Manabí",
        "Morona Santiago",
        "Napo",
        "Orellana",
        "Pastaza",
        "Pichincha",
        "Santa Elena",
        "Santo Domingo de los Tsáchilas",
        "Sucumbíos",
        "Tungurahua",
        "Zamora Chinchipe"
      ],
      MX: [
        "Aguascalientes",
        "Baja California",
        "Baja California Sur",
        "Campeche",
        "Chiapas",
        "Chihuahua",
        "Ciudad de México",
        "Coahuila",
        "Colima",
        "Durango",
        "Estado de México",
        "Guanajuato",
        "Guerrero",
        "Hidalgo",
        "Jalisco",
        "Michoacán",
        "Morelos",
        "Nayarit",
        "Nuevo León",
        "Oaxaca",
        "Puebla",
        "Querétaro",
        "Quintana Roo",
        "San Luis Potosí",
        "Sinaloa",
        "Sonora",
        "Tabasco",
        "Tamaulipas",
        "Tlaxcala",
        "Veracruz",
        "Yucatán",
        "Zacatecas"
      ],
      PE: [
        "Amazonas",
        "Áncash",
        "Apurímac",
        "Arequipa",
        "Ayacucho",
        "Cajamarca",
        "Callao",
        "Cusco",
        "Huancavelica",
        "Huánuco",
        "Ica",
        "Junín",
        "La Libertad",
        "Lambayeque",
        "Lima",
        "Loreto",
        "Madre de Dios",
        "Moquegua",
        "Pasco",
        "Piura",
        "Puno",
        "San Martín",
        "Tacna",
        "Tumbes",
        "Ucayali"
      ],
      UY: [
        "Artigas",
        "Canelones",
        "Cerro Largo",
        "Colonia",
        "Durazno",
        "Flores",
        "Florida",
        "Lavalleja",
        "Maldonado",
        "Montevideo",
        "Paysandú",
        "Río Negro",
        "Rivera",
        "Rocha",
        "Salto",
        "San José",
        "Soriano",
        "Tacuarembó",
        "Treinta y Tres"
      ]
    };

    const countrySelect = form.querySelector("#country-select");
    const regionSelect = form.querySelector("#region-select");

    function updateRegions(countryCode) {
      if (!regionSelect) return;

      const regions = regionsByCountry[countryCode] || [];
      regionSelect.innerHTML = "";

      const placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = regions.length
        ? "Seleccionar región"
        : "Selecciona un país disponible";
      regionSelect.appendChild(placeholder);

      regions.forEach((region) => {
        const option = document.createElement("option");
        option.value = region;
        option.textContent = region;
        regionSelect.appendChild(option);
      });
    }

    if (countrySelect && regionSelect) {
      countrySelect.addEventListener("change", (event) => {
        updateRegions(event.target.value);
      });

      if (countrySelect.value) {
        updateRegions(countrySelect.value);
      }
    }

    form.addEventListener("submit", (event) => {
      const requiredFields = [
        "service_type",
        "full_name",
        "email",
        "phone",
        "shipping_name",
        "country",
        "region",
        "city",
        "address",
        "postal_code",
        "shipping_phone",
        "shipping_email"
      ];

      const currentPaymentMethod = form.querySelector(
        'input[name="payment_method"]:checked'
      );

      if (currentPaymentMethod?.value === "card") {
        requiredFields.push("card_number", "card_expiry", "card_cvv");
      }

      let isValid = true;
      let firstInvalidInput = null;

      requiredFields.forEach((fieldName) => {
        const input = form.querySelector(`[name="${fieldName}"]`);

        if (!input) return;

        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = "#ff5b5b";

          if (!firstInvalidInput) {
            firstInvalidInput = input;
          }
        } else {
          input.style.borderColor = "";
        }
      });

      if (
        isValid &&
        currentPaymentMethod?.value === "card" &&
        cardInput
      ) {
        const cardNumber = sanitizeCardNumber(cardInput.value);

        if (!luhnCheck(cardNumber)) {
          isValid = false;
          cardInput.style.borderColor = "#ff5b5b";
          firstInvalidInput = cardInput;

          if (brandIcon) {
            brandIcon.textContent = "REVISA EL NÚMERO";
            brandIcon.style.color = "#ff5b5b";
          }
        }
      }

      if (!isValid) {
        event.preventDefault();
        firstInvalidInput?.focus();
      }
    });
  }

  const animatedElements = document.querySelectorAll(
    ".section, .hero, .service-card, .testimonial-card, .bundle-offer"
  );

  if (!animatedElements.length) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reducedMotion || !("IntersectionObserver" in window)) {
    return;
  }

  animatedElements.forEach((element) => {
    element.classList.add("js-reveal");
  });

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -7% 0px"
    }
  );

  animatedElements.forEach((element) => observer.observe(element));
});
