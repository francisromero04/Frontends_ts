/// <reference path="ajax.ts" />
/// <reference path="autoBD.ts" />

namespace PrimerParcial{

    export class  Manejadora{
        static AJAX : Ajax = new Ajax();
        
        //#region PARTE 1 JSON
        public static AgregarAutoJSON() {
            let patente :string = (<HTMLInputElement>document.getElementById("patente")).value;
            let marca :string = (<HTMLInputElement>document.getElementById("marca")).value;
            let color :string = (<HTMLInputElement>document.getElementById("color")).value;      
            let precio:number = parseInt((<HTMLInputElement>document.getElementById("precio")).value);
  
            let form : FormData = new FormData()
            form.append('patente', patente);
            form.append('marca', marca);
            form.append('color', color);
            form.append('precio', String(precio));
            Manejadora.AJAX.Post("./backend/altaAutoJSON.php", Manejadora.AgregarSuccessJSON,form,Manejadora.Fail); 
        }

        public static AgregarSuccessJSON(retorno:string):void {
            console.log("Agregar: ", retorno);        
            Manejadora.MostrarAutosJSON();
            alert("Agregar:"+ retorno);
        }

        public static Fail(retorno:string):void {
            console.error(retorno);
            alert("Ha ocurrido un ERROR!!!");
        }

        public static MostrarAutosJSON() {       
            Manejadora.AJAX.Get("./backend/listadoAutosJSON.php",Manejadora.MostrarListadoSuccess,"",Manejadora.Fail); 
        }
       
        public static MostrarListadoSuccess(data: string): void {
            let obj_array: any[] = JSON.parse(data);
            console.log("Mostrar: ", obj_array);
            let div = <HTMLDivElement>document.getElementById("divTabla");
            let tabla = `<table class="table table-hover">
                            <tr>
                                <th>Patente</th><th>Marca</th><th>Color</th><th>Precio</th>
                            </tr>`;
            if (obj_array.length < 1) {
                tabla += `<tr><td>---</td><td>---</td><td>---</td><td>---</td></tr>`;
            } else {
                for (let index = 0; index < obj_array.length; index++) {
                    const dato = obj_array[index];
                    tabla += `<tr><td>${dato.patente}</td><td>${dato.marca}</td><td>${dato.color}</td><td>${dato.precio}</td></tr>`;
                }
            }
            tabla += `</table>`;
            div.innerHTML = tabla;
        }

        public static VerificarAutoJSON(){
            let patente:string = (<HTMLInputElement>document.getElementById("patente")).value;
            let form : FormData = new FormData()
            form.append('patente', patente);
            Manejadora.AJAX.Post("./backend/verificarAutoJSON.php",Manejadora.VerificarSuccess,form,Manejadora.Fail); 
        }

        public static VerificarSuccess(retorno:string):void {
            let respuesta = JSON.parse(retorno);
            console.log("Verificar: ", respuesta.mensaje);        
            Manejadora.MostrarAutosJSON();
            alert("Verificar:"+ respuesta.mensaje);
        }
        
        //#endregion
    }
}