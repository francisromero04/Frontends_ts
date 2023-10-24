<?php
require_once("./clases/autoBD.php");
use RomeroFrancis\AutoBD;

require_once(__DIR__ . '/vendor/autoload.php');
header('content-type:application/pdf');

$mpdf = new Mpdf\Mpdf([
    'orientation' => 'P',
    'pagenumPrefix' => 'Pagina nro. ',
    'pagenumSuffrix' => ' - ',
    'nbpgPrefix' => ' de ',
    'nbpgSuffix' => ' páginas'
]);

$mpdf->SetHeader('Romero Francis||{PAGENO}{nbpg}');
$mpdf->SetFooter('|{DATE j-m-Y}|');

$arrayAutos = AutoBD::Traer();
$grilla = '<table class="table" border="1" align="center">
            <thead>
                <tr>
                    <th> Patente   </th>
                    <th> Marca     </th>
                    <th> Color     </th>
                    <th> Precio    </th>
                    <th> Foto      </th>
                </tr>
            </thead>';

foreach ($arrayAutos as $auto) {
    $grilla .= "<tr>
                    <td>".$auto->Patente()."</td>
                    <td>".$auto->Marca()."</td>
                    <td>".$auto->Color()."</td>
                    <td>".$auto->Precio()."</td>
                    <td><img src='./autos/imagenes/{$auto->PathFoto()}' width='100px' height='100px'/></td>
                    </tr>";
}

$grilla .= '</table>';
$mpdf->WriteHTML("<h3>Lista de vehiculos</h3>");
$mpdf->WriteHTML("<br>");
$mpdf->WriteHTML($grilla);
$mpdf->Output("mi_pdf.pdf", "I");
?>