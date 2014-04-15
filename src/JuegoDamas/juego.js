var piezas = [];
var filasIniciales = 3;
var alturaTablero = 8;
var kNegras = "#000000";
var kBlancas = "#ffffff";
var lienzo;
var contexto; 

// mis variables
var ladoCasilla;
var radio;
var proporcionPieza = 0.7;


function Casilla(fila, columna, color) {
    this.fila = fila;
    this.columna = columna;
    this.color = color;
}


function iniciarJuego(canvas) {

	lienzo = canvas;
	contexto = lienzo.getContext("2d");
    
    //se asume que el tablero es perfectamente cuadrado, es decir width === height
    ladoCasilla = lienzo.width / alturaTablero;
    //vamos a llenar el 70% de cada casilla con una pieza
    radio = (ladoCasilla * proporcionPieza) / 2;

	// cargar piezas negras en array de piezas
	for (var i=0; i< filasIniciales; i++){
		for (var j=(i+1)%2; j < alturaTablero; j=j+2) {
			piezas.push(new Casilla(i,j, kNegras));
		}
	}

	// cargar piezas blancas
	for (var i=alturaTablero-1; i >= alturaTablero - filasIniciales; i--){
		for (var j=(i+1)%2; j < alturaTablero; j=j+2) {
			piezas.push(new Casilla(i,j, kBlancas));
		}
	}

    pintarTablero();
}

function pintarTablero() {

    // borrar tablero
    contexto.clearRect(0,0, lienzo. height, lienzo.width);

    // pintar tablero
    pintarRejilla();
 
    // pintarPiezas
    for (var i = 0; i < piezas.length; i++) {
        pintarPieza(piezas[i], piezas[i].color);
    }


}

function pintarPieza(p, color) {
    contexto.fillStyle = color;
    
    var x = (ladoCasilla * p.columna) + (ladoCasilla / 2);
    var y = (ladoCasilla * p.fila) + (ladoCasilla /2);
    contexto.beginPath();
    contexto.arc(x,y, radio, 0, 2 * Math.PI, false);
	
    contexto.stroke();
    contexto.fill();
}

function pintarRejilla() {

    for (var x = 0; x <= lienzo.width; x += ladoCasilla) {
        contexto.moveTo(x, 0);
        contexto.lineTo(x, lienzo.height);
    }
    
    for (var y = 0; y <= lienzo.height; y += ladoCasilla) {
        contexto.moveTo(0, y);
        contexto.lineTo(lienzo.width, y);
    }
    
    contexto.stroke();  

}
