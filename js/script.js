///// ARRAYS Y VARIABLES /////

const contenedorElectrodomesticos = document.getElementById('contenedor-electrodomesticos')
const panelEncendidos = document.getElementById('panel-encendidos')


// LISTA ELECTRODOMESTICOS (usando imágenes de placeholder)
const electrodomesticos = [
	{ id: 1, nombre: "Heladera", consumo: 328, estaEncendido: false, imagen: "img/refrigerador.png" },
	{ id: 2, nombre: "Lavarropas", consumo: 875, estaEncendido: false, imagen: "img/lavarropas.png" },
	{ id: 3, nombre: "Microondas", consumo: 800, estaEncendido: false, imagen: "img/microondas.png" },
	{ id: 4, nombre: "Aire Acondicionado", consumo: 1200, estaEncendido: false, imagen: "img/aireAcondicionado.png" },
	{ id: 5, nombre: "Televisor", consumo: 200, estaEncendido: false, imagen: "img/televisores.png" },
	{ id: 6, nombre: "PC", consumo: 470, estaEncendido: false, imagen: "img/pc.png" },
];

function creadoraDeCartas() {
	
	contenedorElectrodomesticos.innerHTML = '';

	electrodomesticos.forEach((ele) => {
		const card = document.createElement('div');
		card.className = `electrodomesticos-card ${ele.estaEncendido ? 'encendido' : ''}`;
		card.id = `${ele.id}C`;

		card.innerHTML = `<img src="${ele.imagen}" alt="${ele.nombre}"/>
                    <h3>${ele.nombre}</h3>
                    <span class="consumo">${ele.consumo} Watts</span>
                    <button class="btn-encender" data-id="${ele.id}">${ele.estaEncendido ? 'APAGAR' : 'ENCENDER'}</button>
                `;

	
		const boton = card.querySelector('.btn-encender');
		boton.addEventListener('click', () => toggleElectrodomestico(ele.id));

		contenedorElectrodomesticos.appendChild(card);
	});
}

function toggleElectrodomestico(id) {
	const electrodomestico = electrodomesticos.find(ele => ele.id === id);

	if (electrodomestico) {
		electrodomestico.estaEncendido = !electrodomestico.estaEncendido;

		actualizarInterfaz();
		actualizarPanel();
	}
}

function actualizarInterfaz() {
	creadoraDeCartas();
}

function actualizarPanel() {
	const encendidos = electrodomesticos.filter(ele => ele.estaEncendido);

	panelEncendidos.innerHTML = '<h3>Electrodomésticos Encendidos</h3>';

	if (encendidos.length === 0) {
		panelEncendidos.innerHTML += '<p class="sin-electrodomesticos">Ningún electrodoméstico encendido</p>';
	} else {
		encendidos.forEach(ele => {
			panelEncendidos.innerHTML += `
                        <div class="item-encendido">
                            <span class="nombre-electrodomestico">${ele.nombre}</span>
                            <span class="consumo-electrodomestico">${ele.consumo} Watts</span>
                        </div>
                    `;
		});

	}
}

function main() {
	creadoraDeCartas();
	actualizarPanel();
}

main();