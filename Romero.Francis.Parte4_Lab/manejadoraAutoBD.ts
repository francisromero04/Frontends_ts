/// <reference path="ajax.ts" />
/// <reference path="autoBD.ts" />

namespace PrimerParcial{
    export class  ManejadoraAutoBD{
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
            let form: FormData = new FormData();

            form.append('patente', patente);
            form.append('marca', marca);
            form.append('color', color);
            form.append('precio', precio);                     
            let info: string = '{"marca":"' + marca + '","color":"' + color + '","precio":"' + precio + '","patente":"' + patente + '"}';
            form.append('auto_json', info);
            ManejadoraAutoBD.AJAX.Post("./backend/agregarAutoSinFoto.php",ManejadoraAutoBD.AgregarSuccess,form,ManejadoraAutoBD.Fail);       
        }

        public static AgregarSuccess(retorno:string):void{
            let respuesta = JSON.parse(retorno);
            console.log("Agregar: ", respuesta.mensaje);        
            ManejadoraAutoBD.MostrarAutos();
            alert("Agregar:"+respuesta.mensaje);
        }      

        public static MostrarAutos(){
            ManejadoraAutoBD.AJAX.Get("./backend/listadoAutosBD.php",ManejadoraAutoBD.MostrarAutosSuccess,"tabla=mostrar",ManejadoraAutoBD.Fail);         
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
                    btn.addEventListener("click", ():void=>{
                        ManejadoraAutoBD.ModificarAuto();      
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
                            ManejadoraAutoBD.AJAX.Post("backend/eliminarAutoBD.php",ManejadoraAutoBD.DeleteSuccess,form,ManejadoraAutoBD.Fail);
                        }else{
                            form.append('auto_json', JSON.stringify(obj_dato));ManejadoraAutoBD.AJAX.Post("backend/eliminarAutoBDFoto.php",ManejadoraAutoBD.DeleteSuccess,form,ManejadoraAutoBD.Fail);
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
            ManejadoraAutoBD.MostrarAutos();
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
            if(foto != null){
                if(foto.files && foto.files[0]){
                    form.append('foto', foto.files[0]);
                    ManejadoraAutoBD.AJAX.Post("./backend/modificarAutoBDFoto.php", 
                    ManejadoraAutoBD.ModificarAutoSuccess, 
                                form, 
                                ManejadoraAutoBD.Fail); 
                }
            }
            else{
                ManejadoraAutoBD.AJAX.Post("./backend/modificarAutoBD.php", 
                ManejadoraAutoBD.ModificarAutoSuccess, 
                            form, 
                            ManejadoraAutoBD.Fail); 
            }
        }
        
        public static ModificarAutoSuccess(retorno:string):void {
            console.log(retorno);
            let respuesta = JSON.parse(retorno);
            console.log("Modificar: ", respuesta.mensaje);        
            ManejadoraAutoBD.MostrarAutos();
            alert("Modificar:"+respuesta.mensaje);
        }
    }
}