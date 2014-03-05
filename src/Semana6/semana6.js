function obtenerDatos() {
    var capital = document.getElementById('capital');
    var direccion = "http://api.openweathermap.org/data/2.5/forecast/daily?q=" + capital.value + "&cnt=3&mode=json&units=metric&lang=sp";
    
    $.ajax({
            url:direccion,
            
            success:function(result){
                $("#info").html("");
                for(var x = 0; x < result.list.length; x++) {
                    var day = result.list[x];
                    $("#info").append("Descripción: " + day.weather[0].description + "<br>");
                    $("#info").append("Nubes (%): " + day.clouds + "<br>");
                    $("#info").append("Temperatura (C) max y min: " + day.temp.max + ", " + day.temp.min + "<br>");
                    $("#info").append("Humedad (%): " + day.humidity + "<br>");
                    $("#info").append("Velocidad del viento (m/s): " + day.speed + "<br>");
                    $("#info").append("Presion (hPa=milibares): " + day.pressure + "<br><br>");
                }
                //$("#info").html("Consulta ejecutada con éxito"+ JSON.stringify(result));
            },
            
            error:function(request, error) {
                alert(error);
            }
     }
    );
}