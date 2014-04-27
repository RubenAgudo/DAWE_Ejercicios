
var socket = new WebSocket("ws://127.0.0.1:8092/ws/demo");

var max;
var min;
var numIntentos;
var centro;
var respuesta;
var numero;

socket.onopen = function() {
    console.log("Socket abierto");
}

socket.onmessage = function(event) {
    respuesta = event.data;
    imprimir(respuesta, "resultados");
    if(respuesta !== "Exacto") {

        if(respuesta === "Mayor") {
            if (centro === numero) {
                min = centro + 1;
            }
        } else {
            if(centro === numero) {
                max = centro - 1;
            }
        }
        numIntentos++;
        centro = parseInt((max + min) / 2);

        var ultimoNumRecomendado = document.getElementById('ultimoNumRecomendado');
        ultimoNumRecomendado.innerHTML = "Te recomiendo: " + centro;

    } else {
        console.log("Y el numero es: " + centro);
        console.log("Lo he resuelto en " + numIntentos + " intentos");
        socket.close();
    }
}

function imprimir(datos, donde) {
    var div = document.getElementById(donde);
    var p = document.createElement("p");
    p.innerHTML = datos;
    div.appendChild(p);
}

function enviarOnclick() {
    var cajaNumero = document.getElementById('cajaNumero');
    numero = parseInt(cajaNumero.value);
    mensaje = '{"name": "ragudo001", "number":' + numero + '}'; 
    imprimir("Enviado: " + numero + ", recomendado: " + centro, "intentos");
    socket.send(mensaje);
}

window.onload = function() {
    max = 1000;
    min = 0;
    numIntentos = 0;
    centro = (max + min)/2;
    respuesta = undefined;
    
    var ultimoNumRecomendado = document.getElementById('ultimoNumRecomendado');
    ultimoNumRecomendado.innerHTML = "Te recomiendo: " + centro;


    var boton = document.getElementById('enviar');
    boton.onclick = enviarOnclick;
}
