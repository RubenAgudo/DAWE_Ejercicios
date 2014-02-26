/* localizacion.js */


window.onload = obtenerLocalizacion;

function obtenerLocalizacion() {
	if (navigator.geolocation) {

		navigator.geolocation.getCurrentPosition( mostrarLocalizacion , mostrarError );
	}
	else {
		alert("Este navegador no soporta Geolocation API");
	}
}

function mostrarLocalizacion(posicion) {

    var latitud = posicion.coords.latitude;
	var longitud = posicion.coords.longitude;
    
    latLong = new google.maps.LatLng(posicion.coords.latitude,posicion.coords.longitude);
    // Initiate the location request
    elevacion = new google.maps.ElevationService();
    obtenerElevacion(latLong);

}

function mostrarError(error) {
	var errorTypes = {
		0: "Error desconocido",
		1: "Permiso denegado",
		2: "Posición no disponible",
		3: "Tiempo de espera agotado"
	};
	var errorMessage = errorTypes[error.code];
	if (error.code == 0 || error.code == 2) {
		errorMessage = errorMessage + " " + error.message;
	}
	var div = document.getElementById("localizacion");
	div.innerHTML = errorMessage;
}
	


var map; // variable global
var elevacion;
var latLong;
var decimals = 100; //100 = 2 decimales, 1000 = 3...

function showMap(elevacion) {

	var mapOptions = {
		zoom: 10,
		center: latLong,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	var mapDiv = document.getElementById("mapa");
	map = new google.maps.Map(mapDiv, mapOptions);

	var titulo = "Tu geoposición";
	contenido = "Latitud: " + latLong.d + ", Longitud:" + latLong.e + ", elevacion: " + elevacion;
    
	addMarker(map, latLong, titulo, contenido);

}

function obtenerElevacion(latLong, contenido) {
    
    var locations = [];
    locations.push(latLong);
    
    var positionalRequest = {
        'locations': locations
    }

    elevacion.getElevationForLocations(positionalRequest, resultadoElevacion);
}

function resultadoElevacion(results, status) {
    if (status == google.maps.ElevationStatus.OK) {

        // Retrieve the first result
        if (results[0]) {
            var coords = results[0];
            var elevacionMetros = Math.round(coords.elevation*decimals)/decimals;
                
            var div = document.getElementById("localizacion");
            div.innerHTML = "Latitud de tu posición: " + latLong.d + ", Longitud: " + latLong.e;
            div.innerHTML += " Elevacion: " + elevacionMetros;

            showMap(elevacionMetros);
            
        } else {
            elevacionMetros = NaN;
        }
    } else {
        elevacionMetros = null;
        //alert('Elevation service failed due to: ' + status);
    }
}

function addMarker(mapa, latlong, titulo, contenido) 
{

	var markerOptions = {
		position: latlong,
		map: mapa,
		title: titulo,
		clickable: true
	};

	var marker = new google.maps.Marker(markerOptions);

	var infoWindowOptions = {
		content: contenido,
		position: latlong
	};

	var infoWindow = new google.maps.InfoWindow(infoWindowOptions);

	google.maps.event.addListener(marker, "click", function() {
		infoWindow.open(mapa);
	});
}


