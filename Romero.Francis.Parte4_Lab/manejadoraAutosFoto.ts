/// <reference path="ajax.ts" />
/// <reference path="autoBD.ts" />

window.addEventListener("load", ():void => 
{
    PrimerParcial.ManejadoraAutosFoto.MostrarAutos();
}); 

namespace PrimerParcial{
    export class  ManejadoraAutosFoto{
        static AJAX : Ajax = new Ajax();
        
        public static Fail(retorno:string):void {
            console.error(retorno);
            alert("Ha ocurrido un ERROR!!!");
        }

        public static AgregarAuto() {
            let patente: string = (<HTMLInputElement>document.getElementById("patente")).value;
            let marca: string = (<HTMLInputElement>document.getElementById("marca")).value;
            let color: string = (<HTMLInputElement>document.getElementById("color")).value;
            let precio:string = (<HTMLInputElement>document.getElementById("precio")).value;  
            let foto: any = (<HTMLInputElement>document.getElementById("foto"));
            let form: FormData = new FormData();

            if (foto.files && foto.files[0]) {
                form.append('foto', foto.files[0]);
                form.append('marca', marca);
                form.append('color', color);
                form.append('precio', precio);
                form.append('patente', patente);
                ManejadoraAutosFoto.AJAX.Post("./backend/agregarAutoBD.php",ManejadoraAutosFoto.AgregarSuccess,form,ManejadoraAutosFoto.Fail);
            } else {
                let info: string = '{"marca":"' + marca + '","color":"' + color + '","precio":"' + precio + '","patente":"' + patente + '"}';
                form.append('auto_json', info);
                ManejadoraAutosFoto.AJAX.Post("./backend/agregarAutoSinFoto.php",ManejadoraAutosFoto.AgregarSuccess,form,ManejadoraAutosFoto.Fail);
            }
        }

        public static AgregarSuccess(retorno:string):void{
            let respuesta = JSON.parse(retorno);
            console.log("Agregar: ", respuesta.mensaje);        
            ManejadoraAutosFoto.MostrarAutos();
            alert("Agregar:"+respuesta.mensaje);
        }      

        public static MostrarAutos(){
            ManejadoraAutosFoto.AJAX.Get("./backend/listadoAutosBD.php",ManejadoraAutosFoto.MostrarAutosSuccess,"tabla=mostrar",ManejadoraAutosFoto.Fail);         
        }

        public static MostrarAutosSuccess(retorno:string):void {        
            const input = document.getElementById('patente') as HTMLInputElement | null;
            input?.removeAttribute('disabled')
            let div = <HTMLDivElement>document.getElementById("divTabla");        
            div.innerHTML = retorno;  
            document.getElementsByName("btnModificar").forEach((boton)=>{
                boton.addEventListener("click", ()=>{ 
                    input?.setAttribute('disabled', '');
                    let obj : any = boton.getAttribute("data-obj");                
                    let obj_dato = JSON.parse(obj);
                    console.log(obj_dato);
                    (<HTMLInputElement>document.getElementById("patente")).value = obj_dato.patente;
                    (<HTMLInputElement>document.getElementById("marca")).value = obj_dato.marca;
                    (<HTMLInputElement>document.getElementById("color")).value = obj_dato.color;   
                    (<HTMLInputElement>document.getElementById("precio")).value = obj_dato.precio;                  
                    let btn = (<HTMLInputElement>document.getElementById("btn-modificar"));
                    const previsualizacion = document.getElementById("imgFoto") as HTMLImageElement;

                    if(obj_dato.pathFoto!=="sin foto"){
                        previsualizacion.src ="./backend/autos/imagenes/"+obj_dato.pathFoto;                 
                    }else{
                        previsualizacion.src = "";
                        previsualizacion.alt = "Sin foto";
                    }
                    btn.addEventListener("click", ():void=>{
                    ManejadoraAutosFoto.ModificarAuto();      
                    });
                });
            });
            document.getElementsByName("btnEliminar").forEach((boton)=>{
                boton.addEventListener("click", ()=>{ 
                    let obj : any = boton.getAttribute("data-obj");                
                    let obj_dato = JSON.parse(obj);
                    let patente : any = obj_dato.patente;          
                    if(confirm(`Se necesita confirmacion antes de eliminar el vehiculo cuya patente es ${patente}. De lo contrario cancele.`)){                  
                        let form : FormData = new FormData()

                        if(obj_dato.pathFoto=="sin foto"){                        
                            form.append('auto_json', JSON.stringify(obj_dato));             
                            ManejadoraAutosFoto.AJAX.Post("./backend/eliminarAutoBD.php",ManejadoraAutosFoto.DeleteSuccess,form,ManejadoraAutosFoto.Fail);
                        }else{
                            form.append('auto_json', JSON.stringify(obj_dato));ManejadoraAutosFoto.AJAX.Post("./backend/eliminarAutoBDFoto.php",ManejadoraAutosFoto.DeleteSuccess,form,ManejadoraAutosFoto.Fail);
                        }
                    }                
                });
            }); 
            console.log(retorno);        
            alert(retorno);
        }  
        
        public static DeleteSuccess(retorno:string):void {
            let respuesta = JSON.parse(retorno);
            console.log("Eliminar: ", respuesta.mensaje);        
            ManejadoraAutosFoto.MostrarAutos();
            alert("Eliminar:"+respuesta.mensaje);
        }

        public static ModificarAuto(){
            let patente:string = (<HTMLInputElement>document.getElementById("patente")).value;               
            let marca:string = (<HTMLInputElement>document.getElementById("marca")).value;
            let color:string = (<HTMLInputElement>document.getElementById("color")).value;
            let precio:string = (<HTMLInputElement>document.getElementById("precio")).value;                    
            let foto : any = (<HTMLInputElement> document.getElementById("foto"));    
            let form : FormData = new FormData()
            let auto_json :string = '{"patente":"'+patente+'","marca":"'+marca+'","color":"'+color+'","precio":"'+precio+'"}';
            form.append('auto_json', auto_json);
            if(foto.files && foto.files[0]){
                form.append('foto', foto.files[0]);
                ManejadoraAutosFoto.AJAX.Post("./backend/modificarAutoBDFoto.php",ManejadoraAutosFoto.ModificarAutoSuccess,form,ManejadoraAutosFoto.Fail); 
            }else{
                ManejadoraAutosFoto.AJAX.Post("./backend/modificarAutoBD.php",ManejadoraAutosFoto.ModificarAutoSuccess,form,ManejadoraAutosFoto.Fail); 
            }
        }

        public static ModificarAutoSuccess(retorno:string):void {
            console.log(retorno);
            let respuesta = JSON.parse(retorno);
            console.log("Modificar: ", respuesta.mensaje);        
            ManejadoraAutosFoto.MostrarAutos();
            alert("Modificar:"+respuesta.mensaje);
        }

        public static MostrarAutosPdf() {
            window.location.href = "./backend/listadoAutosPDF.php";
        }
    }
}