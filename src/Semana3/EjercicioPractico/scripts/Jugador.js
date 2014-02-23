/**
 * Clase que representa la super clase Jugador.
 */

function Jugador(nombre, fuerza, salud) {
	this.nombre = nombre;
	this.fuerza = fuerza;
	this.salud = salud;
    
    this.luchar = function(jugador) {
        var herido = -1;
        if ( Math.random()* this.fuerza > jugador.fuerza )
        {
            jugador.salud -= this.fuerza;
            herido = 1;
        }
        else
        {
            this.salud -= jugador.fuerza;
            herido = 0;
        }
        return herido;
    }
    
    this.mostrarNombre = function() {
        return this.nombre;
    }
}

// /**
 // * Si el jugador herido es this: devuelve un cero
 // * Si el jugador herido es other: devuelve un 1;
 // * @param jugador
 // * @returns {Number}
 // */
// Jugador.prototype.luchar = function(jugador) {
	// var herido = -1;
	// if ( Math.random()* this.fuerza > jugador.fuerza )
	// {
		// jugador.salud -= this.fuerza;
		// herido = 1;
	// }
	// else
	// {
		// this.salud -= jugador.fuerza;
		// herido = 0;
	// }
	// return herido;
// };

// Jugador.prototype.mostrarNombre = function() {
	// return this.nombre;
// };
