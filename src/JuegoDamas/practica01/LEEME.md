LEEME
============================
Para que funcione el localStorage en firefox debe ser ejecutado desde apache.

Las funcionalidades implementadas son:
 - Obtener los movimientos legales del turno actual
 - Mover las fichas del turno actual siempre y cuando sea un movimiento legal
    - Si se puede comer una ficha, se fuerza a comer
 - Comprobar si ha terminado, es decir, que la funcion de movimientos legales devuelva el array vacio
 - Activar el guardado de la partida en localstorage cada vez que se realiza un movimiento
 - Cargar los datos desde localStorage, si no hay nada en localStorage se inicia una nueva partida.
 - Mostrar los movimientos que se han ido realizando a la derecha del tablero.

 Y creo que no se me olvida nada, pero desde luego todo lo requerido esta implementado
