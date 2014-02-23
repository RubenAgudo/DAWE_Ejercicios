/**
 * Clase que representa un Extraterrestre, y hereda de Jugador
 */
function Extraterrestre(nombre) {
	Jugador.apply(this, [nombre, Math.round(Math.random()*85), 150]);
    
    this.mostrarNombre = function() {
    
        //muy dependiente de la codificacion, para saber mas: https://github.com/mathiasbynens/esrever
        return this.nombre.split("").reverse().join("");
    
    }
};

Extraterrestre.prototype = new Jugador();
Extraterrestre.prototype.constructor = Extraterrestre;