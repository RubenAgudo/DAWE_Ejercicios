
var kBoardWidth = 8;
var kBoardHeight= 8;
var kPieceWidth = 50;
var kPieceHeight= 50;
var kPixelWidth = 1 + (kBoardWidth * kPieceWidth);
var kPixelHeight= 1 + (kBoardHeight * kPieceHeight);
var kFilasIniciales = 3;
var kNegras = "#000000";
var kBlancas = "#ffffff";


var gCanvasElement;
var gDrawingContext;
var gPattern;

var piezas = [];

var gNumPieces;
var gSelectedPieceIndex;
var gSelectedPieceHasMoved;
var gMoveCount;
var gMoveCountElem;
var gGameInProgress;

var gTurno = kBlancas; //guardamos el color del turno actual
//matriz de 3 dimensiones en la que guardamos que posicion esta ocupada con un color
//asi sabemos que posicion esta ocupada y si se puede hacer un salto
var tablero = inicializarTablero(); 


function getCursorPosition(e) {
	/* returns Cell with .row and .column properties */
	var x;
	var y;
	if (e.pageX != undefined && e.pageY != undefined) {
		x = e.pageX;
		y = e.pageY;
	}
	else {
		x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}
	x -= gCanvasElement.offsetLeft;
	y -= gCanvasElement.offsetTop;
	x = Math.min(x, kBoardWidth * kPieceWidth);
    y = Math.min(y, kBoardHeight * kPieceHeight);
    var cell = new Casilla(Math.floor(y/kPieceHeight), Math.floor(x/kPieceWidth));
    return cell;
}

function gGameInProgress(){
	return true;
}

function isTheGameOver(){
    var legalMoves = getLegalMoves(gTurno); 
    var resultado = false;
    var ganador;
    if(legalMoves.length === 0) {
        resultado = true;
        if(gTurno === kBlancas) {
            ganador = "negras";
        } else {
            ganador = "blancas";
        }
        console.log("Game Over. Ganan " + ganador);
    }

    return resultado;
}

function endGame(){

}

function drawBoard() {
    if (gGameInProgress && isTheGameOver()) {
        endGame();
    }

    gDrawingContext.clearRect(0, 0, kPixelWidth, kPixelHeight);

    gDrawingContext.beginPath();
   
    /* vertical lines */
    for (var x = 0; x <= kPixelWidth; x += kPieceWidth) {
        gDrawingContext.moveTo(0.5 + x, 0);
        gDrawingContext.lineTo(0.5 + x, kPixelHeight);
    }
    
    /* horizontal lines */
    for (var y = 0; y <= kPixelHeight; y += kPieceHeight) {
        gDrawingContext.moveTo(0, 0.5 + y);
        gDrawingContext.lineTo(kPixelWidth, 0.5 +  y);
    }
    
    /* draw it! */
    gDrawingContext.strokeStyle = "#ccc";
    gDrawingContext.stroke();
    
    //inicializamos el tablero antes de pintar las piezas (y de rellenar el tablero)
    tablero = inicializarTablero();

    for (var i = 0; i < piezas.length; i++) {
        
        tablero[piezas[i].row][piezas[i].column] = piezas[i].color;

        drawPiece(piezas[i], piezas[i].color, i == gSelectedPieceIndex);
    }


    gMoveCountElem.innerHTML = gMoveCount;

}

function drawPiece(p, color, selected) {
    var column = p.column;
    var row = p.row;
    var x = (column * kPieceWidth) + (kPieceWidth/2);
    var y = (row * kPieceHeight) + (kPieceHeight/2);
    var radius = (kPieceWidth/2) - (kPieceWidth/10);
    gDrawingContext.beginPath();
    gDrawingContext.arc(x, y, radius, 0, Math.PI*2, false);
    gDrawingContext.closePath();
    gDrawingContext.fillStyle = color;
    gDrawingContext.fill();
    gDrawingContext.strokeStyle = "#000";
    gDrawingContext.stroke();
    if (selected) {
        gDrawingContext.fillStyle = "#ff0000";
        gDrawingContext.fill();
    }
}

function guardarPosiciones() {
	for (var i=0; i < piezas.length; i++) { 
		localStorage.setItem("pieza" + i + ".fila", piezas[i].row); 
		localStorage.setItem("pieza" + i + ".columna", piezas[i].column); 
		localStorage.setItem("pieza" + i + ".color", piezas[i].color); 
	}
}

function cargarPosiciones() {
	piezas = [];
	for (var i=0; i < localStorage.length/3; i++) { 
		var row = parseInt(localStorage.getItem("pieza" + i + ".fila")); 
		var column = parseInt(localStorage.getItem("pieza" + i + ".columna")); 
		var color = localStorage.getItem("pieza" + i + ".color"); 
        if(row !== NaN && column !== NaN && color !== null && color !== undefined) {
            piezas.push(new Casilla(row, column, color));
        }
	}
}
function newGame() {
    //intentamos cargar los datos, si no hay piezas, se inicia un nuevo juego
    cargarPosiciones();
    if(piezas.length === 0) {

        for (var i=0; i< kFilasIniciales; i++){

            for (var j=(i+1)%2; j < kBoardHeight; j=j+2) {
                piezas.push(new Casilla(i,j, kNegras));
            }
        }

        for (var i=kBoardHeight-1; i >= kBoardHeight - kFilasIniciales; i--){

            for (var j=(i+1)%2; j < kBoardHeight; j=j+2) {
                piezas.push(new Casilla(i,j, kBlancas));
            }
        }
    } else {
        console.log("Saved data not found, starting new game");
    }

    gNumPieces = piezas.length;
    gSelectedPieceIndex = -1;
    gSelectedPieceHasMoved = false;
    gMoveCount = 0;
    gGameInProgress = true;
    drawBoard();
}

function Casilla(row, column, color) {
    this.row = row;
    this.column = column;
    this.color = color;
}

/**
 * casilla1: origen
 * casilla2: destino
 */
function isThereAPieceBetween(casilla1, casilla2) {
    var direccionColumna = 0,
        direccionFila = 0;
    
    var columna = 0;
    //sabemos que la diagonal es una funcion y = x
    //solo hay que saber en que direccion hay que moverse
    if(casilla1.column > casilla2.column) {
        columna = casilla1.column - 1;
        direccionColumna = -1;
    } else {
        columna = casilla1.column + 1;
        direccionColumna = 1;
    }

    if(gTurno === kBlancas) {
        direccionFila = -1;
    } else {
        direccionFila = 1;
    }
    var fila = casilla1.row + direccionFila; //no comprobamos nuestra fila 
    var salir = false;
    var resultado = false;
    //nos desplazamos en diagonal hasta que encontremos una pieza
    while(fila != casilla2.row && columna != casilla2.column && !salir ) {
        if(tablero[fila][columna] != undefined || tablero[fila][columna] != null) {
            salir = true;
            resultado = true;
        }
        fila += direccionFila;
        columna += direccionColumna;
    }

    return resultado;
}

function clickOnEmptyCell(cell) {
    if (gSelectedPieceIndex == -1) { return; }
   
    var direccion = piezas[gSelectedPieceIndex].color; 

    //var legalMoves = getLegalMoves(direccion);

    var rowDiff = cell.row - piezas[gSelectedPieceIndex].row;
    var columnDiff = cell.column - piezas[gSelectedPieceIndex].column;
    if (Math.abs(rowDiff) == 1 && Math.abs(columnDiff) == 1 && isLegalMove(piezas[gSelectedPieceIndex], cell)) {
        /* we already know that this click was on an empty square,
        so that must mean this was a valid single-square move */

        var fromRow = piezas[gSelectedPieceIndex].row,
            fromColumn = piezas[gSelectedPieceIndex].column,
            toRow = cell.row,
            toColumn = cell.column,
            color = piezas[gSelectedPieceIndex].color;

        piezas[gSelectedPieceIndex].row = cell.row;
        piezas[gSelectedPieceIndex].column = cell.column;
        gMoveCount += 1;
        gSelectedPieceIndex = -1;
        gSelectedPieceHasMoved = false;

        cambiarTurno();

        drawBoard();
        mostrarMovimiento(fromRow, 
                fromColumn,
                toRow, 
                toColumn,
                color);
        return;
    }
    if ( ( Math.abs(rowDiff) == 2 && Math.abs(columnDiff) == 2)  && 
        isThereAPieceBetween(piezas[gSelectedPieceIndex], cell) && isLegalMove(piezas[gSelectedPieceIndex], cell)) {
        /* this was a valid jump */
        if (!gSelectedPieceHasMoved) {
            gMoveCount += 1;
        }
        var fromRow = piezas[gSelectedPieceIndex].row,
            fromColumn = piezas[gSelectedPieceIndex].column,
            toRow = cell.row,
            toColumn = cell.column,
            color = piezas[gSelectedPieceIndex].color;
        gSelectedPieceHasMoved = true;
        //movemos la pieza a la casilla destino
        piezas[gSelectedPieceIndex].row = cell.row;
        piezas[gSelectedPieceIndex].column = cell.column;
        //deseleccionamos la pieza
        gSelectedPieceIndex = -1;
        //borramos la pieza
        borrarPieza((fromRow + toRow) / 2, (fromColumn + toColumn) / 2);
        cambiarTurno();
        drawBoard();
        mostrarMovimiento(fromRow, 
                fromColumn,
                toRow, 
                toColumn,
                color);
        return;
    }
    gSelectedPieceIndex = -1;
    gSelectedPieceHasMoved = false;
    drawBoard();
}

function gestorClick(e){
	var casilla = getCursorPosition(e);
	for (var i = 0; i < piezas.length; i++) {
		if ((piezas[i].row == casilla.row) && 
				(piezas[i].column == casilla.column)) {
					clickOnPiece(i);
					return;
				}
	}
	clickOnEmptyCell(casilla);	
}

function clickOnPiece(indicePieza){
    //Si la pieza es de distinto color del turno actual, no hacemos nada
    if(piezas[indicePieza].color != gTurno) { alert("No es tu turno!"); return; }

	if (gSelectedPieceIndex == indicePieza) { return; }
    	gSelectedPieceIndex = indicePieza;
    	gSelectedPieceHasMoved = false;
    	drawBoard();
}

function iniciarJuego(canvasElement, moveCountElement) {
    gCanvasElement = canvasElement;
    gCanvasElement.width = kPixelWidth;
    gCanvasElement.height = kPixelHeight;
    gCanvasElement.addEventListener("click", gestorClick, false);
    gMoveCountElem = moveCountElement;
    gDrawingContext = gCanvasElement.getContext("2d");
    newGame();
}

////////////////////////////////////////////////////////////////////////////
//clase Move
function Move(r1, c1, r2, c2) {
    this.fromRow = r1;
    this.fromCol = c1;
    this.toRow = r2;
    this.toCol = c2;

}

/**
 * Clase que representa a una reina,
 * tecnicamente es igual que una casilla, pero
 * se podria hacer instanceof para realizar los movimientos
 * legales
 */
function Reina(row, column, color) {
    Casilla.apply(this, [row, column, color]);
}

/**
 * Funcion que devuelve los movimientos legales para el turno actual 
 */
function getLegalMoves(color) {

    var legalMoves = new Array();

    for (var i = 0, l = piezas.length; i < l; i ++) {
        var unaPieza = piezas[i];

        if(unaPieza.color == color) {  
        
            var topeIzq= topeIzquierda(unaPieza);
            var topeDer= topeDerecha(unaPieza);
            var coronada = haCoronado(unaPieza, color);

            var contrincante;
            if(color == kBlancas) {
                contrincante = kNegras;
            } else {
                contrincante = kBlancas;
            }

            //Si es una reina hacemos un tipo de comprobacion, si no, hacemos la otra
            if(unaPieza instanceof Reina) {

            } else {
                
                var direccionFilas = 0;
                var direccionColumnas = 0;

                if(color === kBlancas) {
                    direccionFilas--;
                } else {
                    direccionFilas++;
                }
               
                var toRow, toColumn; 

                if(!topeIzq && !coronada) {
                    direccionColumnas = -1;
                    comprobarYMover(legalMoves, direccionFilas, direccionColumnas, unaPieza, contrincante); 
                }

                if(!topeDer && !coronada) {
                    direccionColumnas = 1;
                    comprobarYMover(legalMoves, direccionFilas, direccionColumnas, unaPieza, contrincante);
                }
                
            }
           
        }
       
    }

    return legalMoves;
}

/**
 * Function que comprueba si es un movimiento valido, y en caso de serlo lo inserta en el array
 * de movimientos validos
 */
function comprobarYMover(legalMoves, direccionFilas, direccionColumnas, unaPieza, contrincante) {
    var toRow, toColumn;
    if(tablero[unaPieza.row + direccionFilas][unaPieza.column + direccionColumnas] === undefined) {
            
        toRow = unaPieza.row + direccionFilas;
        toColumn = unaPieza.column + direccionColumnas;

        legalMoves.push(new Move(
                    unaPieza.row,
                    unaPieza.column,
                    toRow,
                    toColumn));

    } else if(tablero[unaPieza.row + direccionFilas][unaPieza.column + direccionColumnas ] === contrincante) {
        var filasAMoverse = 2;
        var columnasAMoverse = 2;
        var columnaDestino = unaPieza.column +(direccionColumnas * columnasAMoverse);
        var filaDestino = unaPieza.row + (direccionFilas * filasAMoverse);

        if(destinoEstaDentroDeTablero(filaDestino, columnaDestino)) {
            if(tablero[filaDestino][columnaDestino] === undefined) {
                toRow = filaDestino; 
                toColumn = columnaDestino;
                
                //insertamos la pieza al principio
                legalMoves.unshift(new Move(
                            unaPieza.row,
                            unaPieza.column,
                            toRow,
                            toColumn));
            }

        }

         
    }
    if(toRow !== undefined && toColumn !== undefined) {

    }
}

/**
 * Comprueba si una pieza esta en el tope izquierdo
 */
function topeIzquierda(pieza) {
    return pieza.column == 0;
}

/**
 * comprueba si una pieza esta en el tope derecho
 */
function topeDerecha(pieza) {
    return pieza.column == kBoardWidth - 1;
}

/**
 * Comprueba si una pieza ha coronado,
 * actualmente solo devuelve si ha coronado, en un futuro
 * convertiria la pieza actual, en una reina
 */
function haCoronado(pieza, color) {
    if(color === kBlancas) {
        return pieza.row === 0;
    } else {
        return pieza.row === (kBoardHeight - 1);
    }
}

/**
 * Inicializa el tablero bidimensional para poder hacer comprobaciones
 * de una manera mas sencilla, devuelve un tablero de kBoardHeight x kBoardWidth 
 * vacio
 */
function inicializarTablero() {
    var unTablero = new Array(kBoardWidth);
    for (var i = 0; i < kBoardWidth; i++) {
        unTablero[i] = new Array(kBoardHeight);
    }

    return unTablero;
}

/**
 * Muestra los movimientos que se van realizando
 */
function mostrarMovimiento(fromRow, fromColumn, toRow, toColumn, color) {
    var movimientosRealizados;

    if(color == kNegras) { 
        movimientosRealizados = document.getElementById("negras");
    } else {
        movimientosRealizados = document.getElementById("blancas");
    }
    var nuevoMovimiento = document.createElement("p");
    nuevoMovimiento.innerHTML = "(" + fromRow + ", " + fromColumn +") --> (" + toRow + ", " + toColumn + ")";
    movimientosRealizados.appendChild(nuevoMovimiento);
}

/**
 * Funcion que borra una pieza de las piezas actuales
 */
function borrarPieza(row, column) {
    for (var i = 0; i < piezas.length; i++) {
        var unaPieza = piezas[i];
        if(unaPieza.row == row && unaPieza.column == column) {
            piezas.splice(i, 1);
            return;
        }
    };
}

/**
 * Comprueba que el movimiento con origen 'origen' y destino 'destino'
 * es un movimiento legal, ademas tiene en cuenta si hay posibilidad de comer
 */
function isLegalMove(origen, destino) {
    var legalMoves = getLegalMoves(gTurno);
    var isLegal = false;
    //comprobamos si hay posibilidad de comer
    var youMustEat = Math.abs(legalMoves[0].fromRow - legalMoves[0].toRow) > 1;
    console.log("youMustEat= " + youMustEat);
    var ind = 0;

    while(ind < legalMoves.length && !isLegal) {
        var move = legalMoves[ind];
        
        //si el movimiento actual es el realizado y ademas si hay salto o si no hay que comer, es valido
        if((move.fromRow === origen.row && move.fromCol === origen.column)&&
           (move.toRow === destino.row && move.toCol === destino.column)) {
                if(Math.abs(move.fromRow - move.toRow) > 1) {
                    isLegal = true;
                } else if(!youMustEat) {
                    isLegal = true;
                }
        }
        ind++;
    }
    return isLegal;
}

/**
 * Comprobamos si el destino esta dentro del tablero, para poder mover
 */
function destinoEstaDentroDeTablero(filaDestino, columnaDestino) {
    return ((columnaDestino >= 0 &&
            columnaDestino < kBoardWidth) &&
           (filaDestino >= 0 &&
            filaDestino < kBoardHeight))
}

/**
 * Cambia el turno siempre y guarda el progreso
 */
function cambiarTurno() {

    if(gTurno == kBlancas) {
        gTurno = kNegras;
    } else {
        gTurno = kBlancas;
    }

    guardarPosiciones();
}
