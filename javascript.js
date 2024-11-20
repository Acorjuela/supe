// Generar OTP de tres dígitos
function generateOTP() {
    return String(Math.floor(Math.random() * 1000)).padStart(3, '0');
}

// Actualizar la sección de OTPs con la cantidad indicada
function updateOTPForms() {
    const otpSection = document.getElementById("otpSection");
    otpSection.innerHTML = ""; // Limpiar la sección antes de generar nuevos OTPs

    const quantity = parseInt(document.getElementById("Valor_boleta").value);
    if (isNaN(quantity) || quantity <= 0) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Ingresa una cantidad válida de boletas.",
        });
        return;
    }

    for (let i = 1; i <= quantity; i++) {
        const otp = generateOTP();
        const otpForm = document.createElement("div");
        otpForm.classList.add("otp-form");
        otpForm.innerHTML = `
            <p>OTP Bloque ${i}</p>
            <div class="otp-group">
                <input type="text" value="${otp[0]}" readonly>
                <input type="text" value="${otp[1]}" readonly>
                <input type="text" value="${otp[2]}" readonly>
            </div>
        `;
        otpSection.appendChild(otpForm);
    }
}

// Validar formulario y llenar el modal
function validateForm(event) {
    
    const Nombres = document.getElementById("Nombres").value.trim();
    const Apellido = document.getElementById("Apellido").value.trim();
    const Email = document.getElementById("Email").value.trim();
    const Ciudad = document.getElementById("Ciudad").value.trim();
    const País = document.getElementById("País").value.trim();
    const Nombre_de_responsable = document.getElementById("Nombre_de_responsable").value.trim();
    const Celular_de_responsable = document.getElementById("Celular_de_responsable").value.trim();
    const Premio = document.getElementById("Premio").value.trim();
    const Valor_boleta = parseInt(document.getElementById("Valor_boleta").value);

    if (!Nombres || !Apellido || !Email || !Ciudad || !País || !Nombre_de_responsable || !Celular_de_responsable || !Premio || isNaN(Valor_boleta) || Valor_boleta <= 0) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Todos los campos son obligatorios.",
        });
        return;
    }

    const total = Math.round(Valor_boleta * 20000);

    // Llenar el modal con datos válidos
    document.getElementById("modalNombres").textContent = ` Nombres: ${Nombres}`;
    document.getElementById("modalApellido").textContent = `Apellido: ${Apellido}`;
    document.getElementById("modalEmail").textContent = `Correo: ${Email}`;
    document.getElementById("modalCiudad").textContent = `Ciudad: ${Ciudad}`;
    document.getElementById("modalLocation").textContent = `País: ${País}`;
    document.getElementById("modalResponsable").textContent = `Responsable: ${Nombre_de_responsable}`;
    document.getElementById("modalCelular").textContent = `Celular: ${Celular_de_responsable}`;
    document.getElementById("modalPremio").textContent = `Premio: ${Premio}`;
    document.getElementById("modalBoletas").textContent = `Cantidad de Boletas: X${Valor_boleta}`;
    document.getElementById("modalTotal").textContent = `Total a Pagar: $${total.toLocaleString()}`;

    const modalOtps = document.getElementById("modalOtps");
    modalOtps.innerHTML = "";

    // Copiar OTPs al modal
    const otpForms = document.querySelectorAll(".otp-form");
    const otps = [];
    if (otpForms.length === 0) {
        const otpItem = document.createElement("p");
        otpItem.textContent = "No se generaron OTPs.";
        modalOtps.appendChild(otpItem);
    } else {
        otpForms.forEach((form, index) => {
            const otpInputs = form.querySelectorAll("input");
            const otpValue = Array.from(otpInputs).map(input => input.value).join("");
            otps.push(otpValue); // Guardar OTPs generados
            const otpItem = document.createElement("p");
            otpItem.textContent = `OTP Bloque ${index + 1}: ${otpValue}`;
            modalOtps.appendChild(otpItem);
        });
    }

    // Mostrar el modal
    document.getElementById("myModal").style.display = "flex";

    // Preparar los datos para enviar
    const data = {
        
        Nombres,
        Apellido,
        Email,
        Ciudad,
        País,
        Nombre_de_responsable,
        Celular_de_responsable,
        Premio,
        Valor_boleta,
        Total_a_Pagar: total,
        OTPs: otps, // Enviar los OTPs generados
    };

    // Enviar datos a Google Sheets
    sendDataToSheetBest(data);
}

// Cerrar el modal y resetear el formulario
function closeModal() {
    document.getElementById("myModal").style.display = "none";
    document.querySelector("form").reset();
    document.getElementById("otpSection").innerHTML = "";
}

// Enviar datos a Google Sheets usando Sheet.Best
async function sendDataToSheetBest(data) {
    const sheetBestURL = "https://api.sheetbest.com/sheets/261bd099-7a8d-4fea-a2a5-a5277af681d4"; // Reemplazar con tu URL de Sheet.Best

    try {
        const response = await fetch(sheetBestURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        if (response.ok) {
            Swal.fire({
                icon: "success",
                title: "¡Datos enviados!",
                text: "Tu información se guardó correctamente en Google Sheets.",
            });
        } else {
            throw new Error(result.message || "Error al enviar datos");
        }
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo enviar la información.",
        });
    }
}
