var socket = new WebSocket("ws://192.0.0.1:8092/ws/demo");

var max = 1000;
var min = 0;

var centro = (max + min)/2;
var respuesta = undefined;


socket.onopen = function() {

    var max = 1000;
    var min = 0;

    var centro = (max + min)/2;
    var respuesta = undefined;
    
    var mensaje = {"name": "ragudo001", "number": centro};

    socket.postMessage(mensaje);
}

socket.onmessage = function(event) {
    respuesta = event.data;
    if(respuesta != "Exacto") {

        if(respuesta == "Mayor") {
            min = centro + 1;
        } else {
            max = centro - 1;
        }
    } else {
        console.log("Y el numero es: " + centro);
        socket.close();
    }
    centro = (max + min) / 2;
    mensaje = {"name": "ragudo001", "number": centro};
    socket.postMessage(mensaje);
}
