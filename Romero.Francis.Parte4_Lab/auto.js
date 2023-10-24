"use strict";
var Romero;
(function (Romero) {
    class Auto {
        // Constructor que recibe dos parámetros
        constructor(patente, precio) {
            this.patente = patente;
            this.precio = precio;
            // Inicializamos los otros atributos en blanco
            this.marca = "";
            this.color = "";
        }
        Patente() {
            return this.patente;
        }
        Marca() {
            return this.marca;
        }
        Color() {
            return this.color;
        }
        Precio() {
            return this.precio;
        }
        ToString() {
            return JSON.stringify({
                patente: this.patente,
                marca: this.marca,
                color: this.color,
                precio: this.precio,
            });
        }
    }
    Romero.Auto = Auto;
})(Romero || (Romero = {}));
//# sourceMappingURL=auto.js.map