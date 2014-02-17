/**
 * Ejecucion del programa
 */

function iniciar() {
	var campo = [];
	
	for(var x = 0; x < 2; x++) {
		var humano = new Humano("h" + (x+1));
		var maquina = new Maquina("m" + (x+1));
		var extraterrestre = new Extraterrestre("e" + (x+1));
		
		campo.push(humano);
		campo.push(maquina);
		campo.push(extraterrestre);
		
	}
	
	return campo;
}

function calcularLimite(campo) {

    if(campo.length % 2 == 0) {
        return limite = campo.length;
    } else {    
        return limite = campo.length - 1;
    }
    
}

function duelos(campo){
    
     /*
        Si en una ejecucion solo se borra un elemento, no se pueden
        pelear por pares, asi que el ultimo se queda sin pelear.
    */
    var limite = calcularLimite(campo);
    var paBorrar = [];

    for(var i = 0; i < limite; i += 2) {
			
        /*
         * como siempre lucha i contra i + 1 podemos usar la variable 
         * herido para realizar la comprobacion
         * sobre aquel que ha sido herido, y no sobre los dos. 
         * 
         * Ejemplo: Si el herido ha sido campo[i], herido valdra 0, y por 
         * tanto campo[i + herido] = campo[i] y sirve para las 
         * comprobaciones como para borrar del array
        */
        var herido = campo[i].luchar(campo[i + 1]);
        
        if(campo[i + herido].salud < 0) {
            paBorrar.push(i + herido);
        }
    }
    return paBorrar;
}

/**
    Metodo que borra a los muertos, en paBorrar se guardan los indices de los
    muertos y despues se borran de campo.
*/
function borrar(paBorrar, campo) {
    //Borramos los elementos despues de terminar la lucha.
    for(var i = 0; i < paBorrar.length; i++) {
        campo.splice(paBorrar[i]-i, 1);
    }
}

/**
    Metodo que mientras quede mas de un jugador los hace luchar,
    y cada vez que termina una ronda elimina a los muertos.
*/
function luchar(campo) {

    while(campo.length > 1) {
        campo.shuffle();
        var paBorrar = duelos(campo);
        borrar(paBorrar, campo);
	}
}

function imprimir(winner) {
    var imprimir = document.getElementById('ganador');
    imprimir.innerHTML = "Y el ganador es: " + winner;
}

/**
    Metodo principal que inicializa, hace luchar a los jugadores y devuelve
    el nombre del ganador
*/
function main() {
	var campo = iniciar();
	luchar(campo);
    imprimir(campo.pop().mostrarNombre());
}

Array.prototype.shuffle = function() {
	  
	var i = this.length, j, temp;
	  
	if ( i == 0 ) return this;
  
	while ( --i ) {
		j = Math.floor( Math.random() * ( i + 1 ) );
		temp = this[i];
		this[i] = this[j];
		this[j] = temp;
	}
	return this;
}

window.onload = main;