<?php
require_once("./clases/autoBD.php");
use RomeroFrancis\AutoBD;

$auto_json = isset($_POST["auto_json"]) ? $_POST["auto_json"] : "no hay json";
$auto_decode = json_decode($auto_json);
$auto  = new AutoBD($auto_decode->patente,$auto_decode->marca,$auto_decode->color,(float)$auto_decode->precio);

if($auto->Modificar()){     
    echo '{"exito" : true,"mensaje": "modificado "}';

}else{echo '{"exito" : false,"mensaje": "NO modificado"}';}