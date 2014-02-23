function inicializarGestores()
{
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
    
    var reloj = setInterval(cambiarFondo, 5000);
    
    function cambiarFondo() {
        var imagen2 = document.getElementById('imagen');
        imagen2.style.backgroundImage = "url(imagenesCarrusel/fresas.jpg)";
        
    }
}

window.onload = inicializarGestores;
