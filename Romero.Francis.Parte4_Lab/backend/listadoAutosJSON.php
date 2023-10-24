<?php
require_once "./clases/auto.php";
use RomeroFrancis\Auto;

$retorno = Auto::traerJSON("./archivos/autos.json");

$autos = array(); 

foreach($retorno as $auto) {
    $auto_data = array(
        "patente" => $auto->Patente(),
        "marca" => $auto->Marca(),
        "color" => $auto->Color(),
        "precio" => $auto->Precio()
    );
    $autos[] = $auto_data;
}
echo(json_encode($autos));

