document.addEventListener("DOMContentLoaded", () => {
    cargarDestinos();
    precargarFormulario();
});

// Función para precargar datos desde localStorage
function precargarFormulario() {
    document.getElementById("destino").value = localStorage.getItem("destino") || "";
    document.getElementById("dias").value = localStorage.getItem("dias") || "";
    document.getElementById("personas").value = localStorage.getItem("personas") || "";
    document.getElementById("tipoGasto").value = localStorage.getItem("tipoGasto") || "Medio";
}

// Evento para guardar datos del formulario en localStorage
document.getElementById("formulario").addEventListener("input", () => {
    localStorage.setItem("destino", document.getElementById("destino").value);
    localStorage.setItem("dias", document.getElementById("dias").value);
    localStorage.setItem("personas", document.getElementById("personas").value);
    localStorage.setItem("tipoGasto", document.getElementById("tipoGasto").value);
});

// Función para cargar destinos desde el archivo JSON
function cargarDestinos() {
    fetch("destinos.json")
        .then(response => response.json())
        .then(destinos => {
            let selectDestino = document.getElementById("destino");
            destinos.forEach(destino => {
                let option = document.createElement("option");
                option.value = destino.nombre;
                option.textContent = destino.nombre;
                selectDestino.appendChild(option);
            });
        })
        .catch(error => console.error("Error al cargar destinos:", error));
}

// Función para calcular el costo del viaje
function calcularCosto(dias, personas, tipoGasto, destino, destinos) {
    let destinoData = destinos.find(d => d.nombre === destino);
    if (!destinoData) return 0;

    let costoPorDia = 0;
    switch (tipoGasto) {
        case "Económico":
            costoPorDia = destinoData.economico;
            break;
        case "Medio":
            costoPorDia = destinoData.medio;
            break;
        case "Lujoso":
            costoPorDia = destinoData.lujoso;
            break;
        default:
            costoPorDia = destinoData.medio;
    }

    return costoPorDia * dias * personas;
}

// Evento para calcular el presupuesto cuando el formulario es enviado
document.getElementById("formulario").addEventListener("submit", function(event) {
    event.preventDefault();

    let destinoSeleccionado = document.getElementById("destino").value;
    let dias = parseInt(document.getElementById("dias").value);
    let personas = parseInt(document.getElementById("personas").value);
    let tipoGasto = document.getElementById("tipoGasto").value;

    // Validación de campos
    if (!destinoSeleccionado || isNaN(dias) || dias <= 0 || isNaN(personas) || personas <= 0) {
        Swal.fire({
            icon: "error",
            title: "Datos inválidos",
            text: "Por favor, ingresa valores válidos en todos los campos."
        });
        return;
    }

    // Obtener datos del archivo JSON y realizar el cálculo
    fetch("destinos.json")
        .then(response => response.json())
        .then(destinos => {
            let costoTotal = calcularCosto(dias, personas, tipoGasto, destinoSeleccionado, destinos);
            mostrarResultado(destinoSeleccionado, dias, personas, costoTotal);
        })
        .catch(error => console.error("Error al calcular presupuesto:", error));
});

// Función para mostrar el resultado en el HTML de forma dinámica
function mostrarResultado(destino, dias, personas, costoTotal) {
    let resultadoDiv = document.getElementById("resultado");
    resultadoDiv.innerHTML = `
        <h2>Presupuesto para tu viaje a ${destino}</h2>
        <p>Costo total para ${personas} personas durante ${dias} días: <strong>$${costoTotal}</strong></p>
    `;
}
