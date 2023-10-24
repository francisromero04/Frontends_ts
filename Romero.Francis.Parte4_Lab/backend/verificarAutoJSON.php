<?php
require_once "./clases/auto.php";
use RomeroFrancis\Auto;

$patente = isset($_POST["patente"]) ? $_POST["patente"] : "sin patente"; 

$auto = new Auto($patente, "", "",0);

$retorno = Auto::verificarAutoJSON($auto,"./archivos/autos.json");
echo $retorno;