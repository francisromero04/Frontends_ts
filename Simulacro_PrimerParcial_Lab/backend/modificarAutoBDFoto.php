<?php
require_once("./clases/autoBD.php");
use RomeroFrancis\AutoBD;

if(count($_POST) > 0 )
{
    $auto_json = isset($_POST["auto_json"]) ? $_POST["auto_json"] : "sin json"; 
    $autoObj = json_decode($auto_json);

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

    $autoViejo = new AutoBD($autoObj->patente,$autoObj->marca,$autoObj->color,$autoObj->precio);
    $pathAMover= "./autos/imagenes/".ObtenerPathViejo($autoViejo);
    $extencionM = pathinfo($pathAMover, PATHINFO_EXTENSION);

    $destinoModificado = "./autosModificados/" .$autoObj->patente.'.'. $autoObj->marca.".modificado.".date("His").".".$extencionM;

    $foto_name = $_FILES['foto']['name'];
    $foto_tmp_name = $_FILES['foto']['tmp_name'];
    $foto_extension = pathinfo($foto_name, PATHINFO_EXTENSION);
    $hora = date('His');
    $new_foto_name = $autoViejo->Patente().'.'.$hora . '.' . $foto_extension;

    $destinoFoto = "./autos/imagenes/" . $new_foto_name;

    $uploadOk = TRUE;
    if (file_exists($destinoFoto)) {
        echo "El archivo ya existe. Verifique!!!";
        $uploadOk = FALSE;
    }
    if ($_FILES["foto"]["size"] > 5000000 ) {
        echo "El archivo es demasiado grande. Verifique!!!";
        $uploadOk = FALSE;
    }
    $tipoArchivo = pathinfo($destinoFoto, PATHINFO_EXTENSION);
    if($tipoArchivo != "jpg" && $tipoArchivo != "jpeg" && $tipoArchivo != "gif"
        && $tipoArchivo != "png") {
        echo "Solo son permitidas imagenes con extension JPG, JPEG, PNG o GIF.";
        $uploadOk = FALSE;
    }

    $retorno ='{"exito" : false,"mensaje": "Auto no modificado"}';
    $auto = new AutoBD($autoObj->patente,$autoObj->marca,$autoObj->color,$autoObj->precio,$new_foto_name);

    if($auto->Modificar()){     
        move_uploaded_file($foto_tmp_name, $destinoFoto);
        rename($pathAMover,$destinoModificado);   
        $retorno ='{"exito" : true,"mensaje": "Auto modificado"}';    
    }

    echo $retorno;
}

