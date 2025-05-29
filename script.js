///// ARRAYS Y VARIABLES /////

// LISTA ELECTRODOMESTICOS
const electrodomesticos = [
  { nombre: "Heladera", consumo: 328, encendido: false },
  { nombre: "Lavarropas", consumo: 875, encendido: false },
  { nombre: "Microondas", consumo: 800, encendido: false },
  { nombre: "Aire acondicionado", consumo: 1200, encendido: false },
  { nombre: "Televisor", consumo: 250, encendido: false },
  { nombre: "PC", consumo: 470, encendido: false },
];

// MAXIMO CONSUMO PERMITIDO
const consumoMaximo = 500;

///// FUNCIONES /////

// MOSTRAR ELECTRODOMESTICOS
function mostrarElectrodomesticos() {
  let mensaje = "📋 Lista de Electrodomesticos:\n\n";
  for (let i = 0; i < electrodomesticos.length; i++) {
    let estado = electrodomesticos[i].encendido ? "Encendido ⚡" : "Apagado ❌";
    mensaje += (i + 1) + ". " + electrodomesticos[i].nombre + " - " + "Consumo: " + electrodomesticos[i].consumo +" W " + " - " + estado + "\n";
  }
  alert(mensaje);
}

// CONECTAR ELECTRODOMESTICOS
function conectarElectrodomesticos() {
  let lista = "🔌 ¿Qué electrodoméstico quieres conectar?:\n";
  for (let i = 0; i < electrodomesticos.length; i++) {
    lista += (i + 1) + ". " + electrodomesticos[i].nombre + "\n";
  }

  let opcion = prompt(lista);
  let indice = parseInt(opcion) - 1;

  if (indice >= 0 && indice < electrodomesticos.length) {
    let electrodoméstico = electrodomesticos[indice];

    if (electrodoméstico.encendido) {
      alert("⚠️ Este electrodoméstico ya está encendido.");
    } else if (electrodoméstico.consumo > consumoMaximo) {
      alert("⚡ ¡Saltó la térmica! El consumo de este electrodoméstico (" + electrodoméstico.consumo + "W) supera el máximo permitido de " + consumoMaximo + "W.\nNo se puede encender.");
    } else {
      electrodoméstico.encendido = true;
      alert("✅ " + electrodoméstico.nombre + " encendido correctamente.");
    }
  } else {
    alert("❌ Opción inválida.");
  }
}

// MENU DEL SIMULADOR
function menuCentralElectrica() {
  alert("⚡ Bienvenidos al Simulador de Central Eléctrica");

  let salir = false;

  while (!salir) {
    let opcion = prompt(
      "🧭 MENÚ PRINCIPAL:\n" +
      "1. Ver electrodomésticos\n" +
      "2. Conectar un electrodoméstico\n" +
      "3. Salir"
    );

    if (opcion === "1") {
      mostrarElectrodomesticos();
    } else if (opcion === "2") {
      conectarElectrodomesticos();
    } else if (opcion === "3") {
      alert("¡Gracias por usar el simulador!.");
      salir = true;
    } else {
      alert("❌ Opción no válida. Elegí 1, 2 o 3.");
    }
  }
}

// INICIALIZACION DEL MENU 
menuCentralElectrica();
