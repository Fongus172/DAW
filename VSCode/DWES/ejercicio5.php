<!DOCTYPE html>
<html>

<body>

    <?php

    // Ejercicio 1
    
    $listaCompra = array("Máscara", "Guantes", "Botas", "Túnica", "Móvil");

    foreach ($listaCompra as $producto) {
        echo $producto . "<br>";
    }

    echo "<br>";

    array_push($listaCompra, "Cinturón");

    foreach ($listaCompra as $producto) {
        echo $producto . "<br>";
    }

    echo "<br><br>";

    // Ejercicio 2
    
    $producto1 = array("Nombre" => "Grabadora", "Precio" => 25, "Stock" => 96);

    echo "=== FICHA DEL PRODUCTO ===<br>";
    foreach ($producto1 as $clave => $valor) {
        echo "$clave: $valor <br>";
    }
    echo "==========================";

    echo "<br><br>";

    // Ejercicio 3
    
    $producto2 = array("Nombre" => "Cuchillo", "Precio" => 18, "Stock" => 26);

    echo "Si compramos todo el stock de ambos productos, el precio total sería de " .
        ($producto1["Precio"] * $producto1["Stock"] + $producto2["Precio"] * $producto2["Stock"]) . " €.";

    echo "<br><br>";

    // Ejercicio 4
    
    $productos = array(
        array("Nombre" => "Micrófono", "Precio" => 115, "Categoría" => "Música"),
        array("Nombre" => "Guitarra", "Precio" => 159, "Categoría" => "Música"),
        array("Nombre" => "Cupcake", "Precio" => 10, "Categoría" => "Comida"),
        array("Nombre" => "Garfio", "Precio" => 20, "Categoría" => "Accesorios")
    );

    $sumaPrecios = 0;
    echo "========= PRODUCTOS DE MÚSICA =========<br>";
    for ($i = 0; $i < count($productos); $i++) {
        if ($productos[$i]["Categoría"] === "Música") {
            echo " Nombre: " . $productos[$i]["Nombre"] . ", precio: " . $productos[$i]["Precio"] .
                " €, categoría: " . $productos[$i]["Categoría"] . "<br>";
            $sumaPrecios += $productos[$i]["Precio"];
        }
    }
    echo "=======================================<br>";
    echo " El precio total de ambos productos es de " . $sumaPrecios . " €.<br>";
    echo "=======================================<br>";

    ?>

</body>

</html>