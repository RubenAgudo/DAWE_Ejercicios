
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
var tablero; 


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
	return false;
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
    
    for (var i = 0; i < piezas.length; i++) {
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
		piezas.push(new Casilla(row, column, color));
	}
	drawBoard();
}
function newGame() {

    tablero = new Array();

	for (var i=0; i< kFilasIniciales; i++){

        tablero[i] = new Array();

		for (var j=(i+1)%2; j < kBoardHeight; j=j+2) {
			piezas.push(new Casilla(i,j, kNegras));
            tablero[i][j] = kNegras;
		}
	}

	for (var i=kBoardHeight-1; i >= kBoardHeight - kFilasIniciales; i--){

        tablero[i] = new Array();

		for (var j=(i+1)%2; j < kBoardHeight; j=j+2) {
			piezas.push(new Casilla(i,j, kBlancas));
            tablero[i][j] = kBlancas;
		}
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

function isThereAPieceBetween(casilla1, casilla2) {
	console.log("Sin hacer...");
	return true;
}

function clickOnEmptyCell(cell) {
    if (gSelectedPieceIndex == -1) { return; }
   
    var direccion = piezas[gSelectedPieceIndex].color; 

    var rowDiff = cell.row - piezas[gSelectedPieceIndex].row;
    var columnDiff = cell.column - piezas[gSelectedPieceIndex].column;
    if (Math.abs(rowDiff) == 1 && Math.abs(columnDiff) == 1) {
        /* we already know that this click was on an empty square,
        so that must mean this was a valid single-square move */
        piezas[gSelectedPieceIndex].row = cell.row;
        piezas[gSelectedPieceIndex].column = cell.column;
        gMoveCount += 1;
        gSelectedPieceIndex = -1;
        gSelectedPieceHasMoved = false;

        //cambiamos el turno
        if(gTurno == kBlancas) {
            gTurno = kNegras;
        } else {
            gTurno = kBlancas;
        }

        drawBoard();
        return;
    }
    if ( ( direccion==kBlancas && rowDiff == -2 && Math.abs(columnDiff == 2) ) && 
        isThereAPieceBetween(piezas[gSelectedPieceIndex], cell)) {
        /* this was a valid jump */
        if (!gSelectedPieceHasMoved) {
            gMoveCount += 1;
        }
        gSelectedPieceHasMoved = true;
        piezas[gSelectedPieceIndex].row = cell.row;
        piezas[gSelectedPieceIndex].column = cell.column;
        drawBoard();
        return;
    }
    gSelectedPieceIndex = -1;
    gSelectedPieceHasMoved = false;
    drawBoard();
}

function gestorClick(e){
	var casilla = getCursorPosition(e);
	for (var i = 0; i < gNumPieces; i++) {
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

function getLegalMoves() {

    var legalMoves;

    for (var i = 0, l = piezas.length; i < l; i ++) {
        var unaPieza = piezas[i];

        if(unaPieza.color == kBlancas) {  
        
            if(unaPieza.column == 0) {
                //solo miramos la columna +1
            } else if(unaPieza.column == kBoardWidth -1) {
                //solo miramos la columna -1 
                //pieza de arriba a la derecha
            }else if(tablero[unaPieza.row - 1][unaPieza.column + 1] == null) {
                legalMoves.push(new Move(
                            unaPieza.row, 
                            unaPieza.column, 
                            unaPieza.row -1, 
                            unaPieza.column + 1));
            //pieza de arriba a la izquierda
            } else if(tablero[unaPieza.row - 1][unaPieza.column - 1] == null) {
                legalMoves.push(new Move(
                            unaPieza.row, 
                            unaPieza.column, 
                            unaPieza.row -1, 
                            unaPieza.column - 1)); 
            //ahora se comprobaria si se pueden realizar saltos
            } else if(tablero[unaPieza.row - 1][unaPieza.column - 1] == null) {
            
            }
        }
       
    }

    return legalMoves;
}
