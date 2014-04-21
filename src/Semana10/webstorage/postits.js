/* postits.js
 *
 */
var keys = []; //we save the keys of the postits to track them
window.onload = init;

function init() {
	var button = document.getElementById("add_button");
	button.onclick = createSticky;

    var buttonRemove = document.getElementById("remove_button");
    buttonRemove.onclick = clearStickyNotes;
	// EJERCICIO A
	// cargar las notas postit de localStorage  
	// cada nota se guarda como un par así: postit_X = texto_de_la_nota
	// donde X es el número de la nota
	// por cada una de ellas, llamar al método
	// addStickyToDOM(texto_de_la_nota);
    var postitText;
    for(var i = 0; i < localStorage.length; i++) {
       var key = localStorage.key(i);
       if(key.contains("postit_")) {
           keys.push(key);
           postitText = localStorage.getItem(key);
           addStickyToDOM(postitText);
       }
    }
}

function createSticky() {
	var value = document.getElementById("note_text").value;
	
	// EJERCICIO B
    // crear la nota con nombre postit_X, donde X es un número entero
	// (postit_1, postit_2, ...)  y guardarla en el localStorage
    // 
    // keys.length > postit number, so we use it to
    // create the new key, and then we update
    // keys
    localStorage["postit_" + keys.length] = value;	
    keys.push("postit_" + keys.length);
	addStickyToDOM(value);
}


function addStickyToDOM(value) {
	var stickies = document.getElementById("stickies");
	var postit = document.createElement("li");
	var span = document.createElement("span");
	span.setAttribute("class", "postit");
	span.innerHTML = value;
	postit.appendChild(span);
	stickies.appendChild(postit);
}

function clearStickyNotes() {
	// EJERCICIO C
	// Crear un nuevo botón en la ventana de postit notes que al pulsarlo,
	// elimine las notas de pantalla y de localStorage
	// Algoritmo:	
	// obtener una referencia a la capa "stickies"
	// recorrer los hijos (childNodes) de esa referencia,
	// eliminándolos uno a uno (removeChild)
    //
    // Created two functions, one to remove the postits in the screen,
    // and another one to delete the localStorage and the keys array
    clearVisualNotes();
    clearLocalStorageNotes();
}

function clearVisualNotes() {
    
    var stickies = document.getElementById("stickies");
    var stickyQuantity = stickies.childNodes.length;
    //Always remove the first element because
    //the length changes dinamically
    for(var i = 0; i < stickyQuantity; i++) {
        var sticky = stickies.childNodes[0];
        stickies.removeChild(sticky);
    }
}

function clearLocalStorageNotes() {
    for(var key in keys) {
        localStorage.removeItem(keys[key]);
    }
    keys = [];
}
