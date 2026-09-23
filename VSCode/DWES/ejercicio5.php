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
    


    ?>

</body>

</html>