/* myLoc.js */

var watchId = null;
var map = null;
var ourCoords =  {
	latitude: 47.624851,
	longitude: -122.52099
};

var elevation; //variable para el elevationService
var firstTracking = true; //para comprobar si es el primer tracking.
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
	div.innerHTML = "Tu posición es: Latitud: " + latitude + 
                ", Longitud: " + longitude;
	div.innerHTML += "<br> (con una precisión de " + 
                posicion.coords.accuracy + " metros)";

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

    if(coords.altitude === 0 || coords.altitude === null || coords.altitude === NaN) { //si no nos devuelve la altitud la calculamos.
        elevation = new google.maps.ElevationService();
        obtenerElevacion(googleLatAndLong);
    } else {
        // añadir marcador 
        var title = "Tu geolocalización:";
        var content = "Latitud: " + coords.latitude + ", Longitud: " 
            + coords.longitude +", altitud: " + coords.altitude;
        addMarker(map, googleLatAndLong, title, content);
    }
}

function centrarMapa(coords) {

	var latitud = coords.latitude;
	var longitud = coords.longitude;
	var latlong = new google.maps.LatLng(latitud, longitud);

	map.panTo(latlong);
    
    if(coords.altitude === 0 || coords.altitude === null || coords.altitude === NaN) { //si no nos devuelve la altitud la calculamos.
        //no es necesario volver a instanciar el 
        //elevation service, esta hecho de antes.
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

/**
    Este metodo crea un positional request a partir de una latitud y longitud
    para llamar al metodo de obtener las elevaciones. La llamada es asincrona
    por lo tanto uno de los parametros de la funcion es la referencia a otra
    funcion, que se llamara cuando se complete esa llamada.
*/
function obtenerElevacion(latLong) {
    
    var locations = [];
    locations.push(latLong);
    
    var positionalRequest = {
        'locations': locations
    }

    elevation.getElevationForLocations(positionalRequest, resultadoElevacion);
}

/**
    Este metodo se llama cuando termina de ejecutarse el getElevationForLocations
    del API de geolocalizacion. results es un array, y contiene la elevacion
    para cada una de las locations solicitadas. Y status contiene un codigo
    para determinar si se ha realizado la llamada correctamente o no.
*/
function resultadoElevacion(results, status) {
    if (status == google.maps.ElevationStatus.OK) {

        // Retrieve the first result
        if (results[0]) {
            var coords = results[0];
            //calculamos la elevacion redondeada a dos decimales.
            var elevacionMetros = Math.round(coords.elevation*decimals)/decimals;
            
            var latlong = 
                   new google.maps.LatLng(coords.location.k, coords.location.A);
            
            //miramos si es la primera vez que te localiza
            //para mostrar un texto u otro.
            if(firstTracking) {
                var title = "Tu geolocalización:";
                var content = "Latitud: " + latlong.k + ", Longitud: " + 
                        latlong.A + ", altitud: " + elevacionMetros;
                firstTracking = false;
            } else {
                var title = "Tu nueva localizacion:";
                var content = "Te has movido a: " + latlong.k + ", " + 
                        latlong.A + ", altitud: " + elevacionMetros;
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
	watchId = navigator.geolocation.watchPosition(mostrarLocalizacion,
            mostrarError,  
            {maximumAge:30000, timeout:5000, enableHighAccuracy:true});
}


function detenerMonitorizacion() {
	if (watchId) {
		navigator.geolocation.clearWatch(watchId);
		watchId = null;
        firstTracking = true;
	}
}

