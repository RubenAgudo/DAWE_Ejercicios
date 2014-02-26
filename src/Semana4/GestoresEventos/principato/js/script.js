function inicializarGestores()
{
    /*
        Begin hecho por mi
    */
    /*Como no fui capaz de hacer funcionar lo de php al final guarde en un Array
    todas las rutas a las imagenes*/
    var imagenes = ["imagenesCarrusel/fresas.jpg",
                    "imagenesCarrusel/limon.jpg",
                    "imagenesCarrusel/mandarinas.jpg",
                    "imagenesCarrusel/manzanas.jpg",
                    "imagenesCarrusel/melon.jpg",
                    "imagenesCarrusel/sesamo.jpg",
                    "images/heade_ft.jpg"];
    //indice para saber que postre hay que mostrar
    var index = 0;
    
    //creamos el timer
    var reloj = setInterval(cambiarFondo, 5000);
    
    /**
        Funcion que cambia el fondo, y que ademas aumenta el indice, y lo resetea
        cuando ya se han mostrado todas las imagenes.
        Tambien podria hacerse imagenes[index % imagenes.lentgh] pero no se como
        de eficiente sera tener un contador que podria llegar a desbordarse, si lo
        tenemos suficiente tiempo
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

	var imagen = document.getElementById("imagen");
	imagen.onclick = function()
	{
        //He comentado el alert y he puesto la instruccion que borra el timer
		//alert("Has pulsado la imagen");
        clearInterval(reloj);
	}
    
    /*End hecho por mi*/

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

    
}

window.onload = inicializarGestores;
