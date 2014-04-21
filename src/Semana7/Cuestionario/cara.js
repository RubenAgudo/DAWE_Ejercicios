function pintarCara() {
    var canvas = document.getElementById("cara");
    var context = canvas.getContext("2d");
    context.beginPath();
    context.arc(300, 300, 200, 0, gradosARadianes(360), true);
    context.fillStyle = "#ffffcc";
    context.fill();
    context.stroke();
    context.beginPath();
    context.arc(200, 250, 25, 0, 2 * Math.PI, true);
    context.stroke();
    context.beginPath();
    context.arc(400, 250, 25, 0, 2*Math.PI, true);
    context.stroke();
    context.beginPath();
    context.moveTo(300, 300);
    context.lineTo(300, 350);
    context.stroke();
    context.beginPath();
    context.arc(300, 350, 75, gradosARadianes(20), gradosARadianes(160), false);
    context.stroke();
}

function gradosARadianes(grados) {
    var radianes = (grados * Math.PI)/180;
    return radianes;
}

window.onload = pintarCara;