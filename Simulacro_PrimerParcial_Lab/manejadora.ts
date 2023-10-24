/// <reference path="ajax.ts" />
/// <reference path="autoBD.ts" />

namespace ParcialLabo{
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
       
        public static MostrarListadoSuccess(data:string):void {
            let obj_array: any[] = JSON.parse(data);    
            console.log("Mostrar: ", obj_array);
            let div = <HTMLDivElement>document.getElementById("divTabla");
            let tabla = `<table class="table table-hover">
                            <tr>
                                <th>Patente</th><th>Marca</th><th>Color</th>
                            </tr>`;
                        if(obj_array.length < 1){
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

        //#region PARTE 1 BASE DE DATOS
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
                Manejadora.AJAX.Post("./backend/agregarAutoBD.php",Manejadora.AgregarSuccess,form,Manejadora.Fail);
            } else {
                let info: string = '{"marca":"' + marca + '","color":"' + color + '","precio":"' + precio + '","patente":"' + patente + '"}';
                form.append('auto_json', info);
                Manejadora.AJAX.Post("./backend/agregarAutoSinFoto.php",Manejadora.AgregarSuccess,form,Manejadora.Fail);
            }
        }

        public static AgregarSuccess(retorno:string):void{
            let respuesta = JSON.parse(retorno);
            console.log("Agregar: ", respuesta.mensaje);        
            Manejadora.MostrarAutos();
            alert("Agregar:"+respuesta.mensaje);
        }      

        public static MostrarAutos(){
            Manejadora.AJAX.Get("./backend/listadoAutosBD.php",Manejadora.MostrarAutosSuccess,"tabla=mostrar",Manejadora.Fail);         
        }

        //#endregion

        //#region PARTE 2
        public static MostrarAutosSuccess(retorno:string):void {        
            let div = <HTMLDivElement>document.getElementById("divTabla");        
            div.innerHTML = retorno;  
            document.getElementsByName("btnModificar").forEach((boton)=>{
                boton.addEventListener("click", ()=>{ 
                    let obj : any = boton.getAttribute("data-obj");                
                    let obj_dato = JSON.parse(obj);
                    console.log(obj_dato);
                    (<HTMLInputElement>document.getElementById("patente")).value = obj_dato.patente;
                    (<HTMLInputElement>document.getElementById("marca")).value = obj_dato.marca;
                    (<HTMLInputElement>document.getElementById("color")).value = obj_dato.color;   
                    (<HTMLInputElement>document.getElementById("precio")).value = obj_dato.precio;                  
                    let btn = (<HTMLInputElement>document.getElementById("btn-modificar"));
                    if(obj_dato.pathFoto!=="sin foto"){
                        const previsualizacion = document.getElementById("imgFoto") as HTMLImageElement;
                        previsualizacion.src ="./backend/autos/imagenes/"+obj_dato.pathFoto;                 
                      }
                    btn.addEventListener("click", ():void=>{
                    Manejadora.ModificarAuto();      
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
                            Manejadora.AJAX.Post("backend/eliminarAutoBD.php",Manejadora.DeleteSuccess,form,Manejadora.Fail);
                        }else{
                            form.append('auto_json', JSON.stringify(obj_dato));Manejadora.AJAX.Post("backend/eliminarAutoBDFoto.php",Manejadora.DeleteSuccess,form,Manejadora.Fail);
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
            Manejadora.MostrarAutos();
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
                Manejadora.AJAX.Post("./backend/modificarAutoBDFoto.php", 
                            Manejadora.ModificarAutoSuccess, 
                            form, 
                            Manejadora.Fail); 
            }else{
                Manejadora.AJAX.Post("./backend/modificarAutoBD.php", 
                            Manejadora.ModificarAutoSuccess, 
                            form, 
                            Manejadora.Fail); 
            }
        }
        public static ModificarAutoSuccess(retorno:string):void {
            console.log(retorno);
            let respuesta = JSON.parse(retorno);
            console.log("Modificar: ", respuesta.mensaje);        
            Manejadora.MostrarAutos();
            alert("Modificar:"+respuesta.mensaje);
        }

        //#endregion

        //#region PARTE 3
        public static VerificarAutoBD(){
            let patente:string = (<HTMLInputElement>document.getElementById("patente")).value;
            let form : FormData = new FormData()                   
            let info :string = '{"patente":"'+patente+'"}';
            form.append('obj_auto', info);
            Manejadora.AJAX.Post("./backend/verificarAutoBD.php",Manejadora.VerificarBDSuccess,form,Manejadora.Fail); 
        }    
        public static VerificarBDSuccess(retorno:string):void{
            let respuesta = JSON.parse(retorno);
            if(retorno.trim()=="{}"){
                alert("No existe auto con esas caracteristicas");
                console.log("No existe auto con esas caracteristicas");   
            }else{            
                console.log("Verificar: existe");        
                Manejadora.MostrarAutos();
                alert("Verificar:existe ");
            }
        } 

        public static MostrarAutosBorrados(){
            Manejadora.AJAX.Post("./backend/eliminarAutoBDFoto.php", 
            Manejadora.MostrarAutosBorradosSuccess,'',Manejadora.Fail);
        }
        public static MostrarAutosBorradosSuccess(retorno:string):void {       
            let div = <HTMLDivElement>document.getElementById("divTabla");        
            div.innerHTML = retorno; 
            console.log(retorno);        
            alert(retorno);
        }   

        public static MostrarAutosModificados(){
            Manejadora.AJAX.Get("./backend/modificarAutoBDFoto.php",Manejadora.MostrarAutosModificadosSuccess,'',Manejadora.Fail);
        }
        public static MostrarAutosModificadosSuccess(retorno:string):void {       
            let div = <HTMLDivElement>document.getElementById("divTabla");        
            div.innerHTML = retorno; 
            console.log(retorno);        
            alert(retorno);
        } 

        public static MostrarAutosPdf() {
            window.location.href = "./backend/listadoAutosPDF.php";
        }

        //#endregion
    }
}