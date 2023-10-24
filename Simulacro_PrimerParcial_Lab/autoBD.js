"use strict";
/// <reference path="auto.ts" />
var Entidades;
(function (Entidades) {
    class AutoBD extends Entidades.Auto {
        constructor(patente, precio, pathFoto) {
            super(patente, precio);
            this.pathFoto = pathFoto;
        }
        ToJSON() {
            // Reutiliza el método ToString de la clase base para obtener los atributos de Auto
            const autoData = JSON.parse(super.ToString());
            autoData.pathFoto = this.pathFoto; // Agrega el atributo adicional
            return autoData;
        }
    }
    Entidades.AutoBD = AutoBD;
})(Entidades || (Entidades = {}));
//# sourceMappingURL=autoBD.js.map