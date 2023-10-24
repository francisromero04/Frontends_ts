/// <reference path="auto.ts" />
namespace Romero{
    export class AutoBD extends Auto{

        private pathFoto: string;   

        constructor(patente: string, precio: number, pathFoto: string) {
            super(patente, precio);
            this.pathFoto = pathFoto;
        }

        ToJSON(): any {
            // Reutiliza el método ToString de la clase base para obtener los atributos de Auto
            const autoData = JSON.parse(super.ToString());
            autoData.pathFoto = this.pathFoto; // Agrega el atributo adicional
            return autoData;
          }
    }
}