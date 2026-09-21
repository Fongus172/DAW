<!DOCTYPE html>
<html>

<body>

    <?php

    // Ejercicio 1
    
    $numero = 7;

    for ($i = 1; $i <= 10; $i++) {
        echo "$numero x $i = " . ($numero * $i) . "<br>";
    }

    echo "<br><br>";

    // Ejercicio 2
    
    $suma = 0;
    $i = 0;

    while ($i <= 50) {
        if ($i % 2 == 0) {
            $suma += $i;
        }
        $i++;
    }

    echo "La suma de todos los números pares del 1 al 50 es $suma.";

    echo "<br><br>";

    // Ejercicio 3
    
    $i = 10;

    do {
        echo "$i<br>";
        $i--;
    } while ($i >= 0);

    echo "<br><br>";

    // Ejercicio 4
    
    $precios = array(12.5, 8, 25.3, 4.99, 15);

    foreach ($precios as $precio) {
        echo ($precio * 1.21) . " €<br>";
    }

    echo "<br><br>";

    echo "<table border>";
    echo "<tr><th>Factor 1</th><th>Factor 2</th><th>Producto</th></tr>";

    for ($i = 1; $i <= 10; $i++){
        foreach ($precios as $row){
            echo "<td></td>";
        }
    }

    ?>

</body>

</html>