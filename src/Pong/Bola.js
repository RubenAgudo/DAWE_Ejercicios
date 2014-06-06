function Bola(posicion, color, radio, velocidadInicial) {
    this.posicion = posicion;
    this.color = color;
    this.velocidad = velocidadInicial;
    this.aceleracion = 1.0;
    this.radio = radio;

    this.mover = function() {
        this.posicion[0] += this.aceleracion * this.velocidad[0];
        this.posicion[1] += this.aceleracion * this.velocidad[1];

    }

    this.cambiarVelocidad = function(velocidad) {
        this.velocidad = velocidad;
    }
}


