<?php
require_once "./clases/auto.php";
use RomeroFrancis\Auto;

$patente = isset($_POST["patente"]) ? $_POST["patente"] : "sin marca"; 
$marca = isset($_POST["marca"]) ? $_POST["marca"] : "sin marca"; 
$color = isset($_POST["color"]) ? $_POST["color"] : "sin color"; 
$precio = isset($_POST["precio"]) ? $_POST["precio"] : 0; 

$auto = new Auto($patente,$marca,$color,$precio);

$retorno = $auto->guardarJSON("./archivos/autos.json");
echo $retorno;
