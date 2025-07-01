//// ARRAYS Y VARIABLES ////

const contenedorElectrodomesticos = document.getElementById('contenedor-electrodomesticos')
const panelElectrodomesticos = document.getElementById('panel-electrodomesticos')

//// LISTA ELECTRODOMESTICOS ////
let electrodomesticos=[]

// JSON //
fetch('./data.json')
	.then((res) =>{
		if(!res.ok){
			throw new Error('No se encuentra el archivo');
		}
		return res.json();
	})
	.then((data) =>{
		electrodomesticos = data.electrodomesticos;
		main();
	})
	.catch((error) => {
		console.log('Error')
	})


//// FUNCIONES //
function creadoraDeCartas() {
	
	contenedorElectrodomesticos.innerHTML = '';

	electrodomesticos.forEach((ele) => {
		const card = document.createElement('div');
		card.className = `electrodomesticos-card ${ele.estaEncendido ? 'encendido' : ''}`;
		card.id = `${ele.id}C`;

		card.innerHTML = `<img src="${ele.imagen}" alt="${ele.nombre}"/>
                    <h3>${ele.nombre}</h3>
                    <span class="consumo">${ele.consumo} Watts</span>
					 <div class="tecla-contenedor">
                        <div class="tecla ${ele.estaEncendido ? 'encendido' : ''}" data-id="${ele.id}">
                            <div class="tecla-visual"></div>
                        </div>
                    </div>
                `;

		const tecla = card.querySelector('.tecla');
		tecla.addEventListener('click', () => botonElectrodomestico(ele.id));
		contenedorElectrodomesticos.appendChild(card);
	});
}

function botonElectrodomestico(id) {
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

	panelElectrodomesticos.innerHTML = '<h3>Electrodomésticos Encendidos</h3>';

	if (encendidos.length === 0) {
		panelElectrodomesticos.innerHTML += '<p class="sin-electrodomesticos">Ningún electrodoméstico encendido</p>';
	} else {
		encendidos.forEach(ele => {
			panelElectrodomesticos.innerHTML += `
                        <div class="electrodomestico-encendido">
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