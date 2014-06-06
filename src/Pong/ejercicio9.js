var campo;
var contexto; 
var color = "#ffffff";
var bola;
var timer;
var topeInferior, topeSuperior, topeIzquierdo, topeDerecho;
var margen = 8;
var raquetaD, raquetaI;
var rebotes = 0;

function iniciar(canvas) {
    
	campo = canvas;
    
    //inicializamos los topes
    topeInferior = canvas.height;
    topeSuperior = 0;
    topeDerecho = campo.width - margen;
    topeIzquierdo = margen;

    bola = new Bola([campo.width/2, campo.height/2], color, 20, [0.0, 0.0]);
    raquetaI = new Raqueta(0 + 4, campo.height/2);
    raquetaD = new Raqueta(topeDerecho + 4 , campo.height/2);

    if(window.jQuery) { //comprobamos si jQuery esta cargado
    
        $(document).keydown(function(e) {
            var cual = e.which;
            switch(e.which) {
                case 37: //left
                    bola.cambiarVelocidad([bola.velocidad[0]-1, bola.velocidad[1]]);
                    break;
                case 38: //up
                    bola.cambiarVelocidad([bola.velocidad[0], bola.velocidad[1]-1]);
                    break;
                case 39: //right
                    bola.cambiarVelocidad([bola.velocidad[0]+1, bola.velocidad[1]]);
                    break;
                case 40: //left
                    bola.cambiarVelocidad([bola.velocidad[0], bola.velocidad[1]+1]);
                    break;
                case 81: //raquetaIzquierda mover arriba
                    if(raquetaI.posY > 24) {
                        raquetaI.mover(-1);
                    }
                    break;
                case 65: //raquetaIzquierda mover abajo
                    if(raquetaI.posY < campo.height -24) {
                        raquetaI.mover(1);
                    }
                    break;
                case 80: //raquetaDerecha mover arriba
                    if(raquetaD.posY > 24) {
                        raquetaD.mover(-1);
                    }
                    break;
                case 76: //raquetaDerecha mover abajo
                    if(raquetaD.posY < campo.height - 24) {
                        raquetaD.mover(1);
                    }
                    break;
                default: return;
            }
            //actualizar();
            e.preventDefault();
        });
    }
    timer = setInterval(actualizar, 60);
	contexto = campo.getContext("2d");
    pintarTablero();
}

function pintarTablero() {

    // borrar tablero
    contexto.clearRect(0,0,  campo.width, campo.height);
    contexto.lineWidth = 2;
    pintarRebotes();
    pintarBola();
    pintarCampo();
    raquetaD.pintar(contexto);
    raquetaI.pintar(contexto);
}

function pintarRebotes() {
    contexto.fillStyle = "red";
    contexto.font = "18pt Arial";
    contexto.fillText(
            "Rebotes " + rebotes,
            10,20);
    contexto.stroke();
    contexto.fill();
}

function actualizar() {
    colision();
    bola.mover();
    pintarTablero();
}

function colision() {
    var xMin = bola.posicion[0] - bola.radio;
    var xMax = xMin + 2 * bola.radio;
    var yMin = bola.posicion[1] - bola.radio;
    var yMax = yMin + 2 * bola.radio;
    var y = bola.posicion[1];

    //ya se que esta feo poner los numeros ahi a lo bruto
    if((xMin <= topeIzquierdo && (y> raquetaI.posY - 24) && (y< raquetaI.posY + 24)) ||
        (xMax >= topeDerecho && (y> raquetaD.posY -24) && (y< raquetaD.posY + 24))) {
        bola.cambiarVelocidad([bola.velocidad[0] * -1, bola.velocidad[1]]);
        rebotes++;
    
    } else if(xMin <= topeIzquierdo || xMax >= topeDerecho) {
        clearInterval(timer);
        console.log("FIN!"); 
        actualizarRecord();
    }
    
    if(yMax >= topeInferior || yMin <= topeSuperior) {
       bola.cambiarVelocidad([bola.velocidad[0], bola.velocidad[1] * -1]);
    } 
}

function actualizarRecord() {
    var record = localStorage.getItem("examen_ragudo001");
    if(rebotes > record) {
        localStorage.setItem("examen_ragudo001", rebotes);
        console.log("Actualizado el record porque rebotes="+rebotes+" es mayor que el record=" + record);
    } else {
        console.log("No se ha actualizado el record porque rebotes="+rebotes+" es menos o igual que el record=" + record);
    }
}


function pintarBola() {
    contexto.fillStyle = color;
    
    var x = bola.posicion[0];
    var y = bola.posicion[1];
    contexto.beginPath();
    contexto.arc(x,y, bola.radio, 0, 2 * Math.PI, false);
	contexto.closePath();
    contexto.stroke();
    contexto.fill();
}

function pintarCampo() {
    contexto.strokeStyle = color;
    contexto.beginPath();
    contexto.moveTo(topeIzquierdo, 0);
    contexto.lineTo(topeIzquierdo, campo.height);

    contexto.moveTo(campo.width / 2, 0);
    contexto.lineTo(campo.width / 2, campo.height);

    contexto.moveTo(topeDerecho, 0);
    contexto.lineTo(topeDerecho, campo.height);
    contexto.closePath();
    contexto.stroke();  
    contexto.fill();
}

function adivinar() {
	
//la posicion es: [111, 222] 
	var iActual, jActual;
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if(xhr.status == 200) {
			if(xhr.responseText == "correcto") {
				console.log([iActual, jActual]);
			}
		}
	};
	
	for (var i = 100; i <= 200; i++) {
        console.log(i);
        for (var j = 200; j <= 300; j++) {
        	iActual = i;
        	jActual = j;
        	var mensaje = '{"nombre": "ragudo001", "posicion":[' + [i,j] + ']}';
        	
        	//No se porque, si lo pones asincrono, solo recibe un mensaje,
        	//asi que sintiendolo mucho, a sangrar al servidor
            xhr.open('POST', 'http://188.226.176.242/dawe/rebotes.php', true);
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		    xhr.send('mensaje=' + mensaje);

        }
    }

    
}
