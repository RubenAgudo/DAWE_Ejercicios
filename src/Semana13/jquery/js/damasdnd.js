$(document).ready(function() {

    var kBoardWidth = 8;
    var kBoardHeight= 8;
    var kPieceWidth = 64;
    var kPieceHeight= 64;
    var kPixelWidth = 1 + (kBoardWidth * kPieceWidth);
    var kPixelHeight= 1 + (kBoardHeight * kPieceHeight);

    var gCanvasElement = document.getElementById("lienzo");
    var gDrawingContext = gCanvasElement.getContext("2d");
     
    function drawBoard() {
       
        gDrawingContext.clearRect(0, 0, kPixelWidth, kPixelHeight);

        gDrawingContext.beginPath();
       
        /* vertical lines */
        for (var x = 0; x <= kPixelWidth; x += kPieceWidth) {
            gDrawingContext.moveTo(0.5 + x, 0);
            gDrawingContext.lineTo(0.5 + x, kPixelHeight);
        }
        
        /* horizontal lines */
        for (var y = 0; y <= kPixelHeight; y += kPieceHeight) {
            gDrawingContext.moveTo(0, 0.5 + y);
            gDrawingContext.lineTo(kPixelWidth, 0.5 +  y);
        }
        
        /* draw it! */
        gDrawingContext.strokeStyle = "#ccc";
        gDrawingContext.stroke();
        
    }
    // --------------------------------------------- AQUÍ DEBE IR TU CÓDIGO ------------------------
    // hacer que las imágenes sean arrastrables
    // (pista: "helper: clone" es una opción que te ayudará...)
    // el lienzo tiene que ser un destino de una pieza arrastrable
    // tendrás que obtener la posición donde ha caído la ficha
    // y ajustar la posición al borde de la casilla (evitando que las piezas queden descolocadas)
    // una vez que sepas la posición y la ficha, pinta la imagen en el canvas
    // accede al ID de la ficha que el usuario acaba de soltar
    // y escribe en pantalla, en la capa #ui, el ID de la ficha y su posición en el tablero
    $('img').draggable({
        helper: 'clone'
    }); 
    
    
    $('#lienzo').droppable({
        drop: function(event, ui) {
            $('#lienzo').append($(ui.helper).clone());
        }
        
    });



      // -------------- AQUÍ FINALIZA TU CÓDIGO (no deberías necesitar más de 20 líneas)--------------------

       
    drawBoard();

});

