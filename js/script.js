//// ARRAYS Y VARIABLES ////

const contenedorElectrodomesticos = document.getElementById('contenedor-electrodomesticos')
const panelElectrodomesticos = document.getElementById('panel-electrodomesticos')

const consumoMaximo = 2000;
let sistemaDesconectado = false;

//// LISTA ELECTRODOMESTICOS ////
let electrodomesticos=[]

//// JSON ////
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
		Swal.fire({
        title: 'Error al cargar datos',
        text: 'No se pudieron cargar los electrodomésticos. Por favor, recarga la página.',
        icon: 'error',
        confirmButtonText: 'Entendido'
    });
})


//// FUNCIONES ////
function creadoraDeCartas() {
	
	contenedorElectrodomesticos.innerHTML = '';

	electrodomesticos.forEach((ele) => {
		const card = document.createElement('div');
		card.className = `electrodomesticos-card ${ele.estaEncendido ? 'encendido' : ''} ${sistemaDesconectado ? 'deshabilitado' : ''}`;
		card.id = `${ele.id}C`;

		card.innerHTML = `<img src="${ele.imagen}" alt="${ele.nombre}"/>
                    <h3>${ele.nombre}</h3>
                    <span class="consumo">${ele.consumo} Watts</span>
					 <div class="tecla-contenedor">
                        <div class="tecla ${ele.estaEncendido ? 'encendido' : ''} ${sistemaDesconectado ? 'deshabilitado' : ''}" data-id="${ele.id}">
                            <div class="tecla-visual"></div>
                        </div>
                    </div>
                `;

		const tecla = card.querySelector('.tecla');
		if (!sistemaDesconectado) {
			tecla.addEventListener('click', () => botonElectrodomestico(ele.id));
		}
		contenedorElectrodomesticos.appendChild(card);
	});
}

function botonElectrodomestico(id) {
	if (sistemaDesconectado) {
		Swal.fire({
			title: '⚠️ Sistema Desconectado',
			text: 'El sistema está desconectado. Por favor, restablece el sistema desde el panel de control.',
			icon: 'warning',
			confirmButtonText: 'Entendido',
			confirmButtonColor: '#ff6b35'
		});
		return;
	}

	const electrodomestico = electrodomesticos.find(ele => ele.id === id);

	if (electrodomestico) {
		const estadoAnterior = electrodomestico.estaEncendido;
		electrodomestico.estaEncendido = !electrodomestico.estaEncendido;

		const consumoTotal = calcularConsumoTotal();
		
		if (consumoTotal > consumoMaximo) {
			electrodomestico.estaEncendido = estadoAnterior;
			activarTermica(consumoTotal);
			return;
		}

		const accion = electrodomestico.estaEncendido ? 'encendido' : 'apagado';

		actualizarInterfaz();
		actualizarPanel();
		alertaElectrodomesticos(electrodomestico, accion);
	}
}

function calcularConsumoTotal() {
	return electrodomesticos
		.filter(ele => ele.estaEncendido)
		.reduce((total, ele) => total + ele.consumo, 0);
}

function activarTermica(consumoTotal) {
	sistemaDesconectado = true; 
	
	Swal.fire({
		title: '🔴 ¡TÉRMICA ACTIVADA!',
		html: `
			<div class="alerta-termica">
				<div class="termica-visual">
					<div class="termica-caja">
						<div class="termica-switch"></div>
						<div class="termica-indicador"></div>
					</div>
				</div>
				
				<div class="termica-info">
					<h3>🚨 SOBRECARGA DETECTADA</h3>
					<div class="consumo-detalle">
						<p>Consumo: ${consumoTotal} Watts</p>
						<p>Consumo Maximo: ${consumoMaximo} Watts</p>
						<p>Exceso: ${consumoTotal - consumoMaximo} Watts</p>
					</div>
					
					<div class="mensaje-desconexion">
						<h4>⚡ SISTEMA DESCONECTADO</h4>
						<p>Todos los electrodomésticos han sido desconectados automáticamente por seguridad.</p>
						<p class="restablecer-mensaje">🔧 <strong>Para continuar, debe restablecer el sistema desde el Panel de Control.</strong></p>
					</div>
				</div>
			</div>
		`,
		icon: 'error',
		confirmButtonText: '🔧 Entendido',
		confirmButtonColor: '#dc2626',
		background: 'linear-gradient(135deg, #596689ff, #0f3460)',
		color: '#000',
		width: '650px',
		customClass: {
			title: 'titulo-termica'
		}
	});
	
	electrodomesticos.forEach(ele => ele.estaEncendido = false);
	
	actualizarInterfaz();
	actualizarPanel();
}

function restablecerSistema() {
	Swal.fire({
		title: '🔄 Restablecer Sistema',
		background: 'linear-gradient(135deg, #596689ff, #0f3460)',
		text: '¿Está seguro que desea restablecer el sistema eléctrico?',
		color: 'white',
		icon: 'question',
		showCancelButton: true,
		confirmButtonText: '✅ Sí, Restablecer',
		cancelButtonText: '❌ Cancelar',
		confirmButtonColor: '#00d084',
		cancelButtonColor: '#dc2626'
	}).then((result) => {
		if (result.isConfirmed) {
			sistemaDesconectado = false;
			electrodomesticos.forEach(ele => ele.estaEncendido = false);
			
			actualizarInterfaz();
			actualizarPanel();
			
			Swal.fire({
				title: '✅ Sistema Restablecido',
				background: 'linear-gradient(135deg, #596689ff, #0f3460)',
				text: 'El sistema eléctrico ha sido restablecido correctamente. Ahora puede volver a encender los electrodomésticos.',
				color: 'white',
				icon: 'success',
				confirmButtonText: '🚀 Continuar',
				confirmButtonColor: '#00d084'
			});
		}
	});
}

function actualizarInterfaz() {
	creadoraDeCartas();
}

function actualizarPanel() {
	const encendidos = electrodomesticos.filter(ele => ele.estaEncendido);
	const consumoTotal = calcularConsumoTotal();
	const porcentajeConsumo = Math.min((consumoTotal / consumoMaximo) * 100, 100);

	let estadoSistema = '';
	let colorEstado = '';
	let iconoEstado = '';
	
	if (sistemaDesconectado) {
		estadoSistema = 'DESCONECTADO';
		colorEstado = '#dc2626';
		iconoEstado = '🔴';
	} else if (porcentajeConsumo <= 60) {
		estadoSistema = 'ÓPTIMO';
		colorEstado = '#00d084';
		iconoEstado = '✅';
	} else if (porcentajeConsumo <= 80) {
		estadoSistema = 'PRECAUCIÓN';
		colorEstado = '#ffd700';
		iconoEstado = '⚠️';
	} else if (porcentajeConsumo <= 95) {
		estadoSistema = 'PELIGRO';
		colorEstado = '#ff6b35';
		iconoEstado = '🚨';
	} else {
		estadoSistema = 'CRÍTICO';
		colorEstado = '#dc2626';
		iconoEstado = '🔥';
	}

	panelElectrodomesticos.innerHTML = `
		<h3>Panel de Control</h3>
		
		<div class="consumo-total-container">
			<h3> Consumo Actual</h3>
			<div class="consumo-info">
				<span class="consumo-actual">${consumoTotal}W</span>
				<span class="consumo-limite">/ ${consumoMaximo}W</span>
			</div>
		</div>

		<h3> Estado del Sistema</h3>
		<div class="estado-sistema">
			<div class="estado-container">
				<p class="estado-icono">${iconoEstado}</p>
				<p class="estado-texto" style="color: ${colorEstado}">${estadoSistema}</p>
			</div>
			<div class="estado-descripcion">
				${getDescripcionEstado(porcentajeConsumo)}
			</div>
			${sistemaDesconectado ? `
				<div class="boton-restablecer-container">
					<button class="boton-restablecer" onclick="restablecerSistema()">
						🔄 Restablecer Sistema
					</button>
				</div>
			` : ''}
		</div>

		<h4>Electrodomésticos Encendidos</h4>
	`;

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

function getDescripcionEstado(porcentaje) {
	if (sistemaDesconectado) {
		return 'El sistema fue desconectado por seguridad debido a una sobrecarga. Restablezca el sistema para continuar.';
	} else if (porcentaje <= 50) {
		return 'Sistema funcionando normalmente. Consumo bajo, apto para agregar más electrodomésticos.';
	} else if (porcentaje <= 70) {
		return 'Consumo moderado. Tenga cuidado al encender electrodomésticos adicionales.';
	} else if (porcentaje <= 90) {
		return 'Consumo alto. Riesgo de activación de la térmica. Considere apagar algunos electrodomésticos.';
	} else {
		return 'Consumo crítico. La térmica puede activarse en cualquier momento.';
	}
}

//// ALERTAS ////
function alertaBienvenida() {
    Swal.fire({
        title: '⚡ ¡Bienvenidos al Simulador de Central Eléctrica!',
        html: `
            <div class="bienvenidos">
                <p class="bienvenidos-title">🏠 Instrucciones:</p>
                <ul class="bienvenidos-list">
                    <li class="bienvenidos-item"> 🔌 Puedes encender/apagar electrodomésticos con los interruptores</li>
                    <li class="bienvenidos-item">⚡ Cada electrodoméstico tiene un consumo específico en Watts</li>
                    <li class="bienvenidos-item"> 🛡️ El límite máximo es de 2000 Watts</li>
                    <li class="bienvenidos-item"> 🚨 Si superas el límite maximo, saltará la térmica automáticamente</li>
                </ul>
                <p class="bienvenidos-warning">⚠️ ¡Administra tu consumo con cuidado!</p>
            </div>
        `,
        icon: 'info',
        confirmButtonText: '🚀 Comenzar Simulación',
        confirmButtonColor: '#ffd700',
        background: 'linear-gradient(135deg, #596689ff, #0f3460)',
        color: 'white',
		customClass: {
            confirmButton: 'boton-confirmar'
        }
    });
}

function alertaElectrodomesticos(electrodomestico, accion) {
    const iconoAccion = accion === 'encendido' ? '🟢' : '🔴';
    const mensajeAccion = accion === 'encendido' ? 'ENCENDIDO' : 'APAGADO';
    
    Swal.fire({
        html: `
            <div class="alerta-electrodomesticos"> 
			<div class="titulo-imagen">
                    <img src="${electrodomestico.imagen}" alt="${electrodomestico.nombre}" class="imagen-alerta"/>
                    <h3 class="nombre-titulo">${electrodomestico.nombre}</h3>
                </div>
                <p class="estado-electrodomesticos">Estado: ${mensajeAccion} ${iconoAccion}</p>
                <p class="consumo-electrodomesticos">Consumo: ${electrodomestico.consumo} Watts</p>
            </div>
        `,
        icon: 'success',
        position: 'top-end',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
        toast: true,
        background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        color: 'black',
		customClass:{
			popup: 'popup-alerta'
		}
    });
}

function main() {
	creadoraDeCartas();
	actualizarPanel();
	alertaBienvenida();
}