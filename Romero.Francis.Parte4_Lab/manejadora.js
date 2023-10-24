"use strict";
/// <reference path="ajax.ts" />
/// <reference path="autoBD.ts" />
var PrimerParcial;
(function (PrimerParcial) {
    class Manejadora {
        //#region PARTE 1 JSON
        static AgregarAutoJSON() {
            let patente = document.getElementById("patente").value;
            let marca = document.getElementById("marca").value;
            let color = document.getElementById("color").value;
            let precio = parseInt(document.getElementById("precio").value);
            let form = new FormData();
            form.append('patente', patente);
            form.append('marca', marca);
            form.append('color', color);
            form.append('precio', String(precio));
            Manejadora.AJAX.Post("./backend/altaAutoJSON.php", Manejadora.AgregarSuccessJSON, form, Manejadora.Fail);
        }
        static AgregarSuccessJSON(retorno) {
            console.log("Agregar: ", retorno);
            Manejadora.MostrarAutosJSON();
            alert("Agregar:" + retorno);
        }
        static Fail(retorno) {
            console.error(retorno);
            alert("Ha ocurrido un ERROR!!!");
        }
        static MostrarAutosJSON() {
            Manejadora.AJAX.Get("./backend/listadoAutosJSON.php", Manejadora.MostrarListadoSuccess, "", Manejadora.Fail);
        }
        static MostrarListadoSuccess(data) {
            let obj_array = JSON.parse(data);
            console.log("Mostrar: ", obj_array);
            let div = document.getElementById("divTabla");
            let tabla = `<table class="table table-hover">
                            <tr>
                                <th>Patente</th><th>Marca</th><th>Color</th><th>Precio</th>
                            </tr>`;
            if (obj_array.length < 1) {
                tabla += `<tr><td>---</td><td>---</td><td>---</td><td>---</td></tr>`;
            }
            else {
                for (let index = 0; index < obj_array.length; index++) {
                    const dato = obj_array[index];
                    tabla += `<tr><td>${dato.patente}</td><td>${dato.marca}</td><td>${dato.color}</td><td>${dato.precio}</td></tr>`;
                }
            }
            tabla += `</table>`;
            div.innerHTML = tabla;
        }
        static VerificarAutoJSON() {
            let patente = document.getElementById("patente").value;
            let form = new FormData();
            form.append('patente', patente);
            Manejadora.AJAX.Post("./backend/verificarAutoJSON.php", Manejadora.VerificarSuccess, form, Manejadora.Fail);
        }
        static VerificarSuccess(retorno) {
            let respuesta = JSON.parse(retorno);
            console.log("Verificar: ", respuesta.mensaje);
            Manejadora.MostrarAutosJSON();
            alert("Verificar:" + respuesta.mensaje);
        }
    }
    Manejadora.AJAX = new PrimerParcial.Ajax();
    PrimerParcial.Manejadora = Manejadora;
})(PrimerParcial || (PrimerParcial = {}));
//# sourceMappingURL=manejadora.js.map