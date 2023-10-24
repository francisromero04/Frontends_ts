<?php   
//prog_3
require_once("./clases/autoBD.php");
use RomeroFrancis\AutoBD;
$mostrar = isset($_GET["tabla"]) ? $_GET["tabla"] : "sin tabla"; 

$autos = AutoBD::Traer();

if ($mostrar == "mostrar") {

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

    echo "<table border='1'>
        <tr>
            <th> patente</th>
            <th> marca</th>
            <th> color</th>
            <th> precio</th>
            <th> foto</th>
            <th> acciones</th>
        </tr>";

        foreach ($autos as $auto) {
            $pathFoto = $auto->PathFoto() ?? ''; // Verifica si PathFoto() devuelve un valor válido
        
            echo "
            <tr>
                <td> {$auto->Patente()}</td>
                <td> {$auto->Marca()}</td>
                <td>
                    <input type='color' value='{$auto->Color()}' disabled>
                </td>
                <td> {$auto->Precio()}</td>
                <td>";
        
                if ($pathFoto === 'sin foto' || $pathFoto === null) {
                    echo "sin foto";
                } else {
                    echo "<img src='./backend/autos/imagenes/{$pathFoto}' alt='{$pathFoto}' width='100px' height='100px'/>";
                }
            echo "</td>
                <td>
                    <button type='button' class='btn btn-info' id='btnModificar' data-obj='" . $auto->ToJSON() . "' name='btnModificar'>
                        modificar<span class='bi bi-pencil'></span>
                    </button>
                    <button type='button' class='btn btn-danger' id='btnEliminar' data-obj='" . $auto->ToJSON() . "' name='btnEliminar'>
                        <span class='bi bi-x-circle'>eliminar</span>
                    </button>
                </td>
            </tr>";
    }
    echo "</table>";
} else {
    echo "<pre>";
    print_r($autos);
    echo "</pre>";
}
?>