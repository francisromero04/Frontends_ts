namespace Romero {
    export class Auto {     
      protected patente: string;
      protected marca: string;
      protected color: string;
      protected precio: number;
  
        // Constructor que recibe dos parámetros
        constructor(patente: string, precio: number) {
            this.patente = patente;
            this.precio = precio;
            // Inicializamos los otros atributos en blanco
            this.marca = "";
            this.color = "";
        }  
        Patente(): string {
        return this.patente;
        }
        Marca(): string {
            return this.marca;
        }
        Color(): string {
            return this.color;
        }
        Precio(): number {
            return this.precio;
        }

        ToString(): string {
            return JSON.stringify({
            patente: this.patente,
            marca: this.marca,
            color: this.color,
            precio: this.precio,
            });
        }
    }
  }