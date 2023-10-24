"use strict";
/// <reference path="ajax.ts" />
/// <reference path="autoBD.ts" />
window.addEventListener("load", () => {
    PrimerParcial.ManejadoraAutosFoto.MostrarAutos();
});
var PrimerParcial;
(function (PrimerParcial) {
    class ManejadoraAutosFoto {
        static Fail(retorno) {
            console.error(retorno);
            alert("Ha ocurrido un ERROR!!!");
        }
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
                ManejadoraAutosFoto.AJAX.Post("./backend/agregarAutoBD.php", ManejadoraAutosFoto.AgregarSuccess, form, ManejadoraAutosFoto.Fail);
            }
            else {
                let info = '{"marca":"' + marca + '","color":"' + color + '","precio":"' + precio + '","patente":"' + patente + '"}';
                form.append('auto_json', info);
                ManejadoraAutosFoto.AJAX.Post("./backend/agregarAutoSinFoto.php", ManejadoraAutosFoto.AgregarSuccess, form, ManejadoraAutosFoto.Fail);
            }
        }
        static AgregarSuccess(retorno) {
            let respuesta = JSON.parse(retorno);
            console.log("Agregar: ", respuesta.mensaje);
            ManejadoraAutosFoto.MostrarAutos();
            alert("Agregar:" + respuesta.mensaje);
        }
        static MostrarAutos() {
            ManejadoraAutosFoto.AJAX.Get("./backend/listadoAutosBD.php", ManejadoraAutosFoto.MostrarAutosSuccess, "tabla=mostrar", ManejadoraAutosFoto.Fail);
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
                    const previsualizacion = document.getElementById("imgFoto");
                    if (obj_dato.pathFoto !== "sin foto") {
                        previsualizacion.src = "./backend/autos/imagenes/" + obj_dato.pathFoto;
                    }
                    else {
                        previsualizacion.src = "";
                        previsualizacion.alt = "Sin foto";
                    }
                    btn.addEventListener("click", () => {
                        ManejadoraAutosFoto.ModificarAuto();
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
                            ManejadoraAutosFoto.AJAX.Post("./backend/eliminarAutoBD.php", ManejadoraAutosFoto.DeleteSuccess, form, ManejadoraAutosFoto.Fail);
                        }
                        else {
                            form.append('auto_json', JSON.stringify(obj_dato));
                            ManejadoraAutosFoto.AJAX.Post("./backend/eliminarAutoBDFoto.php", ManejadoraAutosFoto.DeleteSuccess, form, ManejadoraAutosFoto.Fail);
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
            ManejadoraAutosFoto.MostrarAutos();
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
                ManejadoraAutosFoto.AJAX.Post("./backend/modificarAutoBDFoto.php", ManejadoraAutosFoto.ModificarAutoSuccess, form, ManejadoraAutosFoto.Fail);
            }
            else {
                ManejadoraAutosFoto.AJAX.Post("./backend/modificarAutoBD.php", ManejadoraAutosFoto.ModificarAutoSuccess, form, ManejadoraAutosFoto.Fail);
            }
        }
        static ModificarAutoSuccess(retorno) {
            console.log(retorno);
            let respuesta = JSON.parse(retorno);
            console.log("Modificar: ", respuesta.mensaje);
            ManejadoraAutosFoto.MostrarAutos();
            alert("Modificar:" + respuesta.mensaje);
        }
        static VerificarAutoBD() {
            let patente = document.getElementById("patente").value;
            let form = new FormData();
            let info = '{"patente":"' + patente + '"}';
            form.append('obj_auto', info);
            ManejadoraAutosFoto.AJAX.Post("./backend/verificarAutoBD.php", ManejadoraAutosFoto.VerificarBDSuccess, form, ManejadoraAutosFoto.Fail);
        }
        static VerificarBDSuccess(retorno) {
            let respuesta = JSON.parse(retorno);
            if (retorno.trim() == "{}") {
                alert("No existe auto con esas caracteristicas");
                console.log("No existe auto con esas caracteristicas");
            }
            else {
                console.log("Verificar: existe");
                ManejadoraAutosFoto.MostrarAutos();
                alert("Verificar:existe ");
            }
        }
        static MostrarAutosPdf() {
            window.location.href = "./backend/listadoAutosPDF.php";
        }
    }
    ManejadoraAutosFoto.AJAX = new PrimerParcial.Ajax();
    PrimerParcial.ManejadoraAutosFoto = ManejadoraAutosFoto;
})(PrimerParcial || (PrimerParcial = {}));
//# sourceMappingURL=manejadoraAutosFoto.js.map