<?php

require_once("./clases/autoBD.php");
use RomeroFrancis\AutoBD;

$obj_auto = isset($_POST["obj_auto"]) ? $_POST["obj_auto"] : "sin obj_auto";
$auto_bd = json_decode($obj_auto);
$auto = new AutoBD($auto_bd->patente);


$array_auto = AutoBD::Traer();
$retorno = "{}";

if($auto->Existe($array_auto)){
    $item = $auto->traerUno();
    if($item != null){        
        $retorno = $item->ToJSON();
    }
}

echo $retorno;