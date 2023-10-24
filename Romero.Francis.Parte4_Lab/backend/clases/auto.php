<?php
namespace RomeroFrancis;
class Auto   
{
    protected string $patente;
    protected string $marca;
    protected string $color;
    protected float $precio;


    public function Patente():string{
		return $this->patente;
	}
    public function Marca():string{
		return $this->marca;
	}
	public function Color():string{
		return $this->color;
	}
    public function Precio():float{
		return $this->precio;
	}
    public function __construct(string $patente, string $marca, string $color,float $precio)
    {
        $this->patente = $patente;
        $this->marca = $marca;
        $this->color = $color;
        $this->precio = $precio;
    }

    public function toJson(){		
        $json = array("patente" => $this->patente,
            "marca" => $this->marca,
            "color" => $this->color,
            "precio" => $this->precio);
        return json_encode($json);
    }

	public function guardarJSON($path){
        $autos = json_decode(file_get_contents($path, true));
        $autos[] = json_decode($this->ToJSON(), true);
        $resultado = file_put_contents($path,json_encode($autos));

        if($resultado === false)
        {          
            return json_encode(array("exito" =>false, "mensaje"=>"Error al agregar el auto"));
        }
        else{
            return json_encode(array("exito" => true, "mensaje" => "se agrego el auto correctamente"));
        }
    }
	
	public static function traerJSON(string $path) {
		$autos = [];
	
		$jsonContent = file_get_contents($path);
	
		if ($jsonContent === false) {
			echo("Error al leer el archivo JSON: $path");
			return [];
		}
	
		// Decodificar el JSON en un array de objetos
		$autosData = json_decode($jsonContent);
	
		if ($autosData === null) {
			echo("Error al decodificar el JSON en el archivo: $path");
			return [];
		}
	
		foreach ($autosData as $autoData) {
			if (isset($autoData->patente, $autoData->marca, $autoData->color, $autoData->precio)) {
				// Crear un objeto Auto y agregarlo al array de autos
				$auto = new Auto($autoData->patente, $autoData->marca, $autoData->color, $autoData->precio);
				$autos[] = $auto;
			} else {
				echo("Faltan propiedades en el JSON en el archivo: $path");
			}
		}
	
		return $autos;
	}

	public static function verificarAutoJSON(Auto $auto,string $path){

        $autos=Auto::traerJSON(($path));
        $retorno = '{"exito" : false,"mensaje": "el auto no existe en el json"}';

        foreach($autos as $item){
                if($item->patente == $auto->patente){
                    $retorno  = '{"exito" : true,"mensaje": "Existe"}'; 
                }
        }
        return $retorno;
    }
   
}
