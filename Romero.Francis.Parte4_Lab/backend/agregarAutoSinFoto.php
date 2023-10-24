<?php
require_once "clases/autoBD.php";
use RomeroFrancis\AutoBD;

$auto_json = isset($_POST["auto_json"]) ? $_POST["auto_json"] : "sin auto"; 
$auto_decode = json_decode($auto_json);

//var_dump($auto_decode);
$auto  = new AutoBD($auto_decode->patente,$auto_decode->marca,$auto_decode->color,(float)$auto_decode->precio);

if($auto->agregar()){
    echo '{"exito" : true,"mensaje": "auto sin foto agregado"}';
}else{echo '{"exito" : false,"mensaje": "auto sin foto NO agregado"}'; }