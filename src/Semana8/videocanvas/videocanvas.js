var efecto = null;
var clip = "video/demovideo1"; // nombre del vídeo, sin extensión

window.onload = function() {

	var video = document.getElementById("video");
	var botonByN = document.getElementById("byn");
	botonByN.onclick = cambiarEfecto;
	var botonNormal = document.getElementById("normal");
	botonNormal.onclick = cambiarEfecto;
    var botonPausa = document.getElementById("pausa");
    botonPausa.onclick = pausarReanudar;
    var botonSciFi = document.getElementById("scifi");
    botonSciFi.onclick = cambiarEfecto;
				
	video.addEventListener("play", procesarframe, false);
	
	video.src = clip + getFormatExtension();
	video.load();
	video.play();
	
}

/**
    Funcion que pausa o reanuda el video dependiendo del estado actual del video.
    Si esta reproduciendo lo pausa, si esta pausado lo reanuda.
*/
function pausarReanudar(e) {
    var video = document.getElementById("video");
    if(video.paused) {
        video.play();
    } else {
        video.pause();
    }
}

function cambiarEfecto(e){
	var id = e.target.getAttribute("id");
	if ( id == "byn" ){
		efecto = byn;
	} else if(id == "scifi") { //se ha añadido la opcion scifi y se asigna la referencia a la funcion correspondiente
		efecto = scifi;
	} else {
        efecto = null;
    }
}

function getFormatExtension() {
	var video = document.getElementById("video");
	if (video.canPlayType("video/mp4") != "") {
		return ".mp4";
	} 
	else if (video.canPlayType("video/ogg") != "") {
		return ".ogv";
	}
	else if (video.canPlayType("video/webm") != "") {
		return ".webm";
	} 
}


function procesarframe(e) {
	var video = document.getElementById("video");

	if (video.paused || video.ended) {
		return;
	}

	var buffercanvas = document.getElementById("buffer");
	var displaycanvas = document.getElementById("display");
	var buffer = buffercanvas.getContext("2d");
	var display = displaycanvas.getContext("2d");

	buffer.drawImage(video, 0, 0, buffercanvas.width, buffercanvas.height);
	var frame = buffer.getImageData(0, 0, buffercanvas.width, buffercanvas.height);
	var length = frame.data.length / 4;

	for (var i = 0; i < length; i++) {
		var r = frame.data[i * 4 + 0];
		var g = frame.data[i * 4 + 1];
		var b = frame.data[i * 4 + 2];
		if (efecto){		
            efecto(i, r, g, b, frame.data);
        }
		
	}
	display.putImageData(frame, 0, 0);

	setTimeout(procesarframe, 0);
	// en los navegadores modernos, es mejor usar :
	// requestanimationframe(procesarframe);

}

function byn(pos, r, g, b, data) {
	var gris = (r+g+b)/3;

	data[pos * 4 + 0] = gris;
	data[pos * 4 + 1] = gris;
	data[pos * 4 + 2] = gris;
}

/**
    funcion que convierte cada frame en su frame "negativo"
*/
function scifi(pos, r, g, b, data) {

	var offset = pos * 4;

	data[offset] = Math.round(255 - r) ;

	data[offset+1] = Math.round(255 - g) ;

	data[offset+2] = Math.round(255 - b) ;

}

