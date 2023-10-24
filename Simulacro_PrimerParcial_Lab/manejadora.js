"use strict";
/// <reference path="ajax.ts" />
/// <reference path="autoBD.ts" />
var ParcialLabo;
(function (ParcialLabo) {
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
                                <th>Patente</th><th>Marca</th><th>Color</th>
                            </tr>`;
            if (obj_array.length < 1) {
                tabla += `<tr><td>---</td><td>---</td><td>---</td><td>---</td>
                                <td>---</td></tr>`;
            }
            else {
                for (let index = 0; index < obj_array.length; index++) {
                    const dato = obj_array[index];
                    tabla += `<tr><td>${dato.patente}</td><td>${dato.marca}</td><td>${dato.color}</td></tr>`;
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
        //#endregion
        //#region PARTE 1 BASE DE DATOS
        static AgregarAuto() {
            let patente = document.getElementById("patente").value;
            let marca = document.getElementById("marca").value;
            let color = document.getElementById("color").value;
            let precio = document.getElementById("precio").value;
            let foto = document.getElementById("foto");
            let form = new FormData();
            if (foto.files && foto.files[0]) {
                form.append('foto', foto.files[0]);
                form.append('marca', marca);
                form.append('color', color);
                form.append('precio', precio);
                form.append('patente', patente);
                Manejadora.AJAX.Post("./backend/agregarAutoBD.php", Manejadora.AgregarSuccess, form, Manejadora.Fail);
            }
            else {
                let info = '{"marca":"' + marca + '","color":"' + color + '","precio":"' + precio + '","patente":"' + patente + '"}';
                form.append('auto_json', info);
                Manejadora.AJAX.Post("./backend/agregarAutoSinFoto.php", Manejadora.AgregarSuccess, form, Manejadora.Fail);
            }
        }
        static AgregarSuccess(retorno) {
            let respuesta = JSON.parse(retorno);
            console.log("Agregar: ", respuesta.mensaje);
            Manejadora.MostrarAutos();
            alert("Agregar:" + respuesta.mensaje);
        }
        static MostrarAutos() {
            Manejadora.AJAX.Get("./backend/listadoAutosBD.php", Manejadora.MostrarAutosSuccess, "tabla=mostrar", Manejadora.Fail);
        }
        //#endregion
        //#region PARTE 2
        static MostrarAutosSuccess(retorno) {
            let div = document.getElementById("divTabla");
            div.innerHTML = retorno;
            document.getElementsByName("btnModificar").forEach((boton) => {
                boton.addEventListener("click", () => {
                    let obj = boton.getAttribute("data-obj");
                    let obj_dato = JSON.parse(obj);
                    console.log(obj_dato);
                    document.getElementById("patente").value = obj_dato.patente;
                    document.getElementById("marca").value = obj_dato.marca;
                    document.getElementById("color").value = obj_dato.color;
                    document.getElementById("precio").value = obj_dato.precio;
                    let btn = document.getElementById("btn-modificar");
                    if (obj_dato.pathFoto !== "sin foto") {
                        const previsualizacion = document.getElementById("imgFoto");
                        previsualizacion.src = "./backend/autos/imagenes/" + obj_dato.pathFoto;
                    }
                    btn.addEventListener("click", () => {
                        Manejadora.ModificarAuto();
                    });
                });
            });
            document.getElementsByName("btnEliminar").forEach((boton) => {
                boton.addEventListener("click", () => {
                    let obj = boton.getAttribute("data-obj");
                    let obj_dato = JSON.parse(obj);
                    let patente = obj_dato.patente;
                    if (confirm(`Se necesita confirmacion antes de eliminar el vehiculo cuya patente es ${patente}. De lo contrario cancele.`)) {
                        let form = new FormData();
                        if (obj_dato.pathFoto == "sin foto") {
                            form.append('auto_json', JSON.stringify(obj_dato));
                            Manejadora.AJAX.Post("backend/eliminarAutoBD.php", Manejadora.DeleteSuccess, form, Manejadora.Fail);
                        }
                        else {
                            form.append('auto_json', JSON.stringify(obj_dato));
                            Manejadora.AJAX.Post("backend/eliminarAutoBDFoto.php", Manejadora.DeleteSuccess, form, Manejadora.Fail);
                        }
                    }
                });
            });
            console.log(retorno);
            alert(retorno);
        }
        static DeleteSuccess(retorno) {
            let respuesta = JSON.parse(retorno);
            console.log("Eliminar: ", respuesta.mensaje);
            Manejadora.MostrarAutos();
            alert("Eliminar:" + respuesta.mensaje);
        }
        static ModificarAuto() {
            let patente = document.getElementById("patente").value;
            let marca = document.getElementById("marca").value;
            let color = document.getElementById("color").value;
            let precio = document.getElementById("precio").value;
            let foto = document.getElementById("foto");
            let form = new FormData();
            let auto_json = '{"patente":"' + patente + '","marca":"' + marca + '","color":"' + color + '","precio":"' + precio + '"}';
            form.append('auto_json', auto_json);
            if (foto.files && foto.files[0]) {
                form.append('foto', foto.files[0]);
                Manejadora.AJAX.Post("./backend/modificarAutoBDFoto.php", Manejadora.ModificarAutoSuccess, form, Manejadora.Fail);
            }
            else {
                Manejadora.AJAX.Post("./backend/modificarAutoBD.php", Manejadora.ModificarAutoSuccess, form, Manejadora.Fail);
            }
        }
        static ModificarAutoSuccess(retorno) {
            console.log(retorno);
            let respuesta = JSON.parse(retorno);
            console.log("Modificar: ", respuesta.mensaje);
            Manejadora.MostrarAutos();
            alert("Modificar:" + respuesta.mensaje);
        }
        //#endregion
        //#region PARTE 3
        static VerificarAutoBD() {
            let patente = document.getElementById("patente").value;
            let form = new FormData();
            let info = '{"patente":"' + patente + '"}';
            form.append('obj_auto', info);
            Manejadora.AJAX.Post("./backend/verificarAutoBD.php", Manejadora.VerificarBDSuccess, form, Manejadora.Fail);
        }
        static VerificarBDSuccess(retorno) {
            let respuesta = JSON.parse(retorno);
            if (retorno.trim() == "{}") {
                alert("No existe auto con esas caracteristicas");
                console.log("No existe auto con esas caracteristicas");
            }
            else {
                console.log("Verificar: existe");
                Manejadora.MostrarAutos();
                alert("Verificar:existe ");
            }
        }
        static MostrarAutosBorrados() {
            Manejadora.AJAX.Post("./backend/eliminarAutoBDFoto.php", Manejadora.MostrarAutosBorradosSuccess, '', Manejadora.Fail);
        }
        static MostrarAutosBorradosSuccess(retorno) {
            let div = document.getElementById("divTabla");
            div.innerHTML = retorno;
            console.log(retorno);
            alert(retorno);
        }
        static MostrarAutosModificados() {
            Manejadora.AJAX.Get("./backend/modificarAutoBDFoto.php", Manejadora.MostrarAutosModificadosSuccess, '', Manejadora.Fail);
        }
        static MostrarAutosModificadosSuccess(retorno) {
            let div = document.getElementById("divTabla");
            div.innerHTML = retorno;
            console.log(retorno);
            alert(retorno);
        }
        static MostrarAutosPdf() {
            window.location.href = "./backend/listadoAutosPDF.php";
        }
    }
    Manejadora.AJAX = new ParcialLabo.Ajax();
    ParcialLabo.Manejadora = Manejadora;
})(ParcialLabo || (ParcialLabo = {}));
//# sourceMappingURL=manejadora.js.map