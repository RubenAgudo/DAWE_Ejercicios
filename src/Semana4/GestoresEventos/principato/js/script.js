function inicializarGestores()
{
    
    var imagenes = ["imagenesCarrusel/fresas.jpg",
                    "imagenesCarrusel/limon.jpg",
                    "imagenesCarrusel/mandarinas.jpg",
                    "imagenesCarrusel/manzanas.jpg",
                    "imagenesCarrusel/melon.jpg",
                    "imagenesCarrusel/sesamo.jpg",
                    "images/heade_ft.jpg"];
    var index = 0;
    
    var reloj = setInterval(cambiarFondo, 5000);

	var imagen = document.getElementById("imagen");
	imagen.onclick = function()
	{
		//alert("Has pulsado la imagen");
        clearInterval(reloj);
	}

	var usuario = document.getElementById("usuario");
	usuario.value = 'tu@email';

	usuario.onblur = function(){
		if (usuario.value == ''){
			usuario.value = "tu@email";
		}
	}

	usuario.onfocus = function(){
		if (usuario.value == 'tu@email'){
			usuario.value = '';
		}
	}

	var item = document.getElementById("combobox");
	item.addEventListener("change",gestorCombo);

	function gestorCombo(){
		console.log(item.value);
		console.log(item.options[item.selectedIndex].text);
		console.log(item.selectedIndex);
	} 

	var formulario = document.getElementById('formulario');
	formulario.onsubmit = function(){
		console.log("click en submit");
		return false;
	}

    /*
        A partir de aqui hasta el final programado por Rubén Agudo, es decir el
        ejercicio practico de la semana 4
    */
    
    
    
    function cambiarFondo() {
        var postre = document.getElementById('imagen');
        postre.style.backgroundImage = "url(" + imagenes[index] + ")";
        
        if(index < imagenes.length - 1) {
            index++;
        } else {
            index = 0;
        }
        
    }
}

window.onload = inicializarGestores;
