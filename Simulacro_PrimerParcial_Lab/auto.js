"use strict";
var Entidades;
(function (Entidades) {
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
    Entidades.Auto = Auto;
})(Entidades || (Entidades = {}));
//# sourceMappingURL=auto.js.map