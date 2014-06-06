function Raqueta(posX, posY) {
    this.posX = posX;
    this.posY = posY;
    this.velocidad = 1;
    
    this.mover = function(direccion) {
        this.posY += this.velocidad * direccion;
    }

    this.incVelocidad = function(vel) {
        this.velocidad = vel;
    } 

    this.pintar = function(contexto) {
        contexto.lineWidth = 8;
        contexto.beginPath();
        contexto.moveTo(this.posX, this.posY -24);
        contexto.lineTo(this.posX, this.posY -24 + 48);
        contexto.closePath();
        contexto.stroke();
        contexto.fill();
    }
}
