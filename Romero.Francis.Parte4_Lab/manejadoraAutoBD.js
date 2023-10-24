"use strict";
/// <reference path="ajax.ts" />
/// <reference path="autoBD.ts" />
var PrimerParcial;
(function (PrimerParcial) {
    class ManejadoraAutoBD {
        static Fail(retorno) {
            console.error(retorno);
            alert("Ha ocurrido un ERROR!!!");
        }
        static AgregarAuto() {
            let patente = document.getElementById("patente").value;
            let marca = document.getElementById("marca").value;
            let color = document.getElementById("color").value;
            let precio = document.getElementById("precio").value;
            let form = new FormData();
            form.append('patente', patente);
            form.append('marca', marca);
            form.append('color', color);
            form.append('precio', precio);
            let info = '{"marca":"' + marca + '","color":"' + color + '","precio":"' + precio + '","patente":"' + patente + '"}';
            form.append('auto_json', info);
            ManejadoraAutoBD.AJAX.Post("./backend/agregarAutoSinFoto.php", ManejadoraAutoBD.AgregarSuccess, form, ManejadoraAutoBD.Fail);
        }
        static AgregarSuccess(retorno) {
            let respuesta = JSON.parse(retorno);
            console.log("Agregar: ", respuesta.mensaje);
            ManejadoraAutoBD.MostrarAutos();
            alert("Agregar:" + respuesta.mensaje);
        }
        static MostrarAutos() {
            ManejadoraAutoBD.AJAX.Get("./backend/listadoAutosBD.php", ManejadoraAutoBD.MostrarAutosSuccess, "tabla=mostrar", ManejadoraAutoBD.Fail);
        }
        static MostrarAutosSuccess(retorno) {
            const input = document.getElementById('patente');
            input === null || input === void 0 ? void 0 : input.removeAttribute('disabled');
            let div = document.getElementById("divTabla");
            div.innerHTML = retorno;
            document.getElementsByName("btnModificar").forEach((boton) => {
                boton.addEventListener("click", () => {
                    input === null || input === void 0 ? void 0 : input.setAttribute('disabled', '');
                    let obj = boton.getAttribute("data-obj");
                    let obj_dato = JSON.parse(obj);
                    console.log(obj_dato);
                    document.getElementById("patente").value = obj_dato.patente;
                    document.getElementById("marca").value = obj_dato.marca;
                    document.getElementById("color").value = obj_dato.color;
                    document.getElementById("precio").value = obj_dato.precio;
                    let btn = document.getElementById("btn-modificar");
                    btn.addEventListener("click", () => {
                        ManejadoraAutoBD.ModificarAuto();
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
                            ManejadoraAutoBD.AJAX.Post("backend/eliminarAutoBD.php", ManejadoraAutoBD.DeleteSuccess, form, ManejadoraAutoBD.Fail);
                        }
                        else {
                            form.append('auto_json', JSON.stringify(obj_dato));
                            ManejadoraAutoBD.AJAX.Post("backend/eliminarAutoBDFoto.php", ManejadoraAutoBD.DeleteSuccess, form, ManejadoraAutoBD.Fail);
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
            ManejadoraAutoBD.MostrarAutos();
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
            if (foto != null) {
                if (foto.files && foto.files[0]) {
                    form.append('foto', foto.files[0]);
                    ManejadoraAutoBD.AJAX.Post("./backend/modificarAutoBDFoto.php", ManejadoraAutoBD.ModificarAutoSuccess, form, ManejadoraAutoBD.Fail);
                }
            }
            else {
                ManejadoraAutoBD.AJAX.Post("./backend/modificarAutoBD.php", ManejadoraAutoBD.ModificarAutoSuccess, form, ManejadoraAutoBD.Fail);
            }
        }
        static ModificarAutoSuccess(retorno) {
            console.log(retorno);
            let respuesta = JSON.parse(retorno);
            console.log("Modificar: ", respuesta.mensaje);
            ManejadoraAutoBD.MostrarAutos();
            alert("Modificar:" + respuesta.mensaje);
        }
    }
    ManejadoraAutoBD.AJAX = new PrimerParcial.Ajax();
    PrimerParcial.ManejadoraAutoBD = ManejadoraAutoBD;
})(PrimerParcial || (PrimerParcial = {}));
//# sourceMappingURL=manejadoraAutoBD.js.map