var socket = new WebSocket("ws://127.0.0.1:8092/ws/demo");

var max = 1000;
var min = 0;
var numIntentos = 0;
var centro = (max + min)/2;
var respuesta = undefined;


socket.onopen = function() {

    var max = 1000;
    var min = 0;

    var centro = parseInt((max + min)/2);
    var respuesta = undefined;
    
    var mensaje = '{"name": "ragudo001", "number":' +  centro + '}';

    socket.send(mensaje);
    //socket.close();
}

socket.onmessage = function(event) {
    respuesta = event.data;
    console.log("[" + min + ", " + max + "]");
    if(respuesta != "Exacto") {

        if(respuesta == "Mayor") {
            min = centro + 1;
        } else {
            max = centro - 1;
        }
        numIntentos++;
    } else {
        console.log("Y el numero es: " + centro);
        console.log("Lo he resuelto en " + numIntentos + " intentos");
        socket.close();
    }
    centro = parseInt((max + min) / 2);
    mensaje = '{"name": "ragudo001", "number":' + centro + '}';
    socket.send(mensaje);
    //socket.close();
}
