<?php
require_once "./clases/autoBD.php";

use RomeroFrancis\AutoBD;


$auto_json = isset($_POST["auto_json"]) ? $_POST["auto_json"] : "sin json"; 
if(count($_POST) > 0 ){

    $autoObj = json_decode($auto_json);

    $autoViejo = new AutoBD($autoObj->patente,$autoObj->marca,$autoObj->color,$autoObj->precio,$autoObj->pathFoto);
    
    $pathAMover= "./autos/imagenes/" . ObtenerPathViejo($autoViejo);
    
    $destinoModificado = "./autosBorrados/" .$autoObj->patente.'.'. $autoObj->marca.".borrado.".date("His").".jpg";
    
    $new_foto_name = $autoObj->patente.'.'. $autoObj->marca.".borrado.".date("His").".jpg";
    
    $retorno ='{"exito" : false,"mensaje": "auto no borrado"}';
    
    if($autoViejo->eliminar($autoObj->patente)){    
        $auto = new AutoBD($autoObj->patente,$autoObj->marca,$autoObj->color,$autoObj->precio,$new_foto_name);
        if($auto->guardarEnArchivo()){
            rename($pathAMover,$destinoModificado);   
            $retorno ='{"exito" : true,"mensaje": "auto borrado"}';
        }
    }
    
    echo $retorno;
    
}
else{
    if(file_exists("./archivos/autosbd_borrados.txt")){
    echo "<style>
    table {
    border-collapse: collapse; 
    width: 80%; 
    padding: 10px;
    margin: 50px auto;
    text-align: center;
    }
    td, th {
    border: 1px solid black;
    padding: 8px; 
    text-align: center;
    }
    </style>";
    echo "
    <table >
        <thead>
            <tr>
                <th>PATENTE</th>
                <th>MARCA</th>
                <th>COLOR</th>
                <th>PRECIO</th>
                <th>PATH</th>
                <th>Foto</th>
            </tr>
        </thead>"; 
        $tabla = "";
        $contenido = file_get_contents('./archivos/autosbd_borrados.txt');
        $lineas = explode("\n", $contenido);
        foreach ($lineas as $linea) {
            $campos = explode(',', $linea); // Dividir la línea en campos usando la coma como separador
            echo '<tr>'; // Crear una fila de la tabla con los datos

            foreach ($campos as $campo) {
                if (count($campos) >= 2) {  
                    $datos = explode(':', $campo); // Dividir el campo en clave y valor usando el dos puntos como separador
                        $clave = trim($datos[0]);
                        $valor = trim($datos[1]);
                        if($clave == "foto"){
                            $valor .= '</td><td><img src=./backend/autosBorrados/'.urlencode($valor).' width="200" height="200"></td>';
                        }
                    echo '<td>' . $valor . '</td>'; // Mostrar el valor en la celda correspondiente
                }
            }
            echo '</tr>';
        }
        $tabla .= "</table>";
    
        echo $tabla;
    }
}


function ObtenerPathViejo (AutoBD $auto) : null | string{
    $retorno = null;
    $autos = AutoBD::Traer();
    foreach($autos as $item){
        if($auto->Patente() == $item->Patente()){
            $retorno = $item->Pathfoto();
        }
    }
    return $retorno;
}   

