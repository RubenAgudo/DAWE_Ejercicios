/**
 * Clase que representa una Maquina, hereda de Jugador
 */

function Maquina(nombre) {
	Jugador.apply(this, [nombre, Math.round(Math.random()*100), 130]);
};

Maquina.prototype = new Jugador();
Maquina.prototype.constructor = Maquina;