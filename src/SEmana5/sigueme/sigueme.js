/* myLoc.js */

var watchId = null;
var map = null;
var ourCoords =  {
	latitude: 47.624851,
	longitude: -122.52099
};
var elevation;
var firstTracking = true;
var decimals = 100; //100 = 2 decimales, 1000 = 3...

window.onload = obtenerLocalizacion;

function obtenerLocalizacion() {
	if (navigator.geolocation) {
		var botonWatch = document.getElementById("watch");
		botonWatch.onclick = iniciarMonitorizacion;
		var botonClearWatch = document.getElementById("clearWatch");
		botonClearWatch.onclick = detenerMonitorizacion;
	} else {
		alert("No se ha podido acceder al API de geolocalizacion");
	}
}


function mostrarLocalizacion(posicion) {
	var latitude = posicion.coords.latitude;
	var longitude = posicion.coords.longitude;

	var div = document.getElementById("location");
	div.innerHTML = "Tu posición es: Latitud: " + latitude + ", Longitud: " + longitude;
	div.innerHTML += "<br> (con una precisión de " + posicion.coords.accuracy + " metros)";

	if (map == null) {
		mostrarMapa(posicion.coords);
	} else {
		centrarMapa(posicion.coords);
	}
}

function mostrarMapa(coords) {
	var googleLatAndLong = new google.maps.LatLng(coords.latitude, 
												  coords.longitude);
	var mapOptions = {
		zoom: 10,
		center: googleLatAndLong,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var mapDiv = document.getElementById("map");
	map = new google.maps.Map(mapDiv, mapOptions);

    if(coords.altitude === 0) {
        elevation = new google.maps.ElevationService();
        obtenerElevacion(googleLatAndLong);
    } else {
        // añadir marcador 
        var title = "Tu geolocalización:";
        var content = "Latitud: " + coords.latitude + ", Longitud: " + coords.longitude +", altitud: " + coords.altitude;
        addMarker(map, googleLatAndLong, title, content);
    }
}

function centrarMapa(coords) {

	var latitud = coords.latitude;
	var longitud = coords.longitude;
	var latlong = new google.maps.LatLng(latitud, longitud);

	map.panTo(latlong);
    
    if(coords.altitude === 0) {
        obtenerElevacion(latlong);
    } else {
        addMarker(map, latlong, "Tu nueva localización", "Te has movido a: " +
			 latitud + "," + longitud + ", altitud: " + coords.altitude);
    }

}

function addMarker(map, latlong, title, content) {
	var markerOptions = {
		position: latlong,
		map: map,
		title: title,
		clickable: true
	};
	var marker = new google.maps.Marker(markerOptions);

	var infoWindowOptions = {
		content: content,
		position: latlong
	};

	var infoWindow = new google.maps.InfoWindow(infoWindowOptions);

	google.maps.event.addListener(marker, 'click', function() {
		infoWindow.open(map);
	});
}

function obtenerElevacion(latLong) {
    
    var locations = [];
    locations.push(latLong);
    
    var positionalRequest = {
        'locations': locations
    }

    elevation.getElevationForLocations(positionalRequest, resultadoElevacion);
}

function resultadoElevacion(results, status) {
    if (status == google.maps.ElevationStatus.OK) {

        // Retrieve the first result
        if (results[0]) {
            var coords = results[0];
            var elevacionMetros = Math.round(coords.elevation*decimals)/decimals;
            
            var latlong = new google.maps.LatLng(coords.location.d, coords.location.e);
            
            if(firstTracking) {
                var title = "Tu geolocalización:";
                var content = "Latitud: " + latlong.d + ", Longitud: " + latlong.e + ", altitud: " + elevacionMetros;
                firstTracking = false;
            } else {
                var title = "Tu nueva localizacion:";
                var content = "Te has movido a: " + latlong.d + ", " + latlong.e + ", altitud: " + elevacionMetros;
            }
            addMarker(map, latlong, title, content);
            
        }
    } else {
        alert('Elevation service failed due to: ' + status);
    }
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
	var div = document.getElementById("location");
	div.innerHTML = errorMessage;
    firstTracking = true;
}


function iniciarMonitorizacion() {
	watchId = navigator.geolocation.watchPosition(mostrarLocalizacion,mostrarError,  {maximumAge:30000, timeout:5000, enableHighAccuracy:true});
}


function detenerMonitorizacion() {
	if (watchId) {
		navigator.geolocation.clearWatch(watchId);
		watchId = null;
        firstTracking = true;
	}
}

