/**
 * Clase que representa un Humano, hereda de Jugador
 */

function Humano(nombre) {
	Jugador.apply(this, [nombre, 70, 150]);
};

Humano.prototype = new Jugador();
Humano.prototype.constructor = Humano;