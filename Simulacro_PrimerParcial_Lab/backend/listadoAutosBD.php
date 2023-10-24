<?php
require_once "./clases/autoBD.php";
use RomeroFrancis\AutoBD;

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $autos = AutoBD::Traer();

    echo "<table border=1>
        <tr>
            <th>Patente</th>
            <th>Marca</th>
            <th>Color</th>
            <th>Precio</th>
            <th>Foto</th>
            <th>Acciones</th>
        </tr>";

    foreach ($autos as $auto) {
        $pathFoto = $auto->PathFoto();
        
        echo "
            <tr>
                <td>{$auto->Patente()}</td>
                <td>{$auto->Marca()}</td>
                <td>{$auto->Color()}</td>
                <td>{$auto->Precio()}</td>
                

                <td>";        
                if ($pathFoto === 'sin foto') {
                    echo "sin foto";
                } else {
                    echo "<img src='./backend/autos/imagenes/{$pathFoto}' alt='{$pathFoto}' width='100px' height='100px'/>";
                }
                echo "</td>

                <td>
                    <button type='button' class='btn btn-info' id='btnModificar' data-obj='{$auto->toJson()}' name='btnModificar'>
                        Modificar <span class='bi bi-pencil'></span>
                    </button>
                    <button type='button' class='btn btn-danger' id='btnEliminar' data-obj='{$auto->toJson()}' name='btnEliminar'>
                        Eliminar <span class='bi bi-x-circle'></span>
                    </button>
                </td>
            </tr>";
    }
    echo "</table>";
} else {
    echo "Método no permitido";
}
?>