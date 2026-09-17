<!DOCTYPE html>
<html>

<body>

    <?php

    // Ejercicio 1
    
    $a = 16;
    $b = 64;

    echo $a + $b . "<br>";
    echo $a - $b . "<br>";
    echo $a * $b . "<br>";
    echo $a / $b . "<br><br>";

    // Ejercicio 2
    
    $edad = 21;
    $tieneCarnet = True;

    if ($edad >= 18 && $tieneCarnet) {
        echo "Puede conducir.<br><br>";
    } else {
        echo "No puede conducir.<br><br>";
    }

    // Ejercicio 3
    
    $nota1 = 7;
    $nota2 = 10;
    $nota3 = 4.5;

    $media = ($nota1 + $nota2 + $nota3) / 3;
    echo "La media de las 3 notas es $media.<br>";

    if ($media >= 5) {
        if ($nota1 < 5 || $nota2 < 5 || $nota3 < 5) {
            echo "Ha aprobado con alguna nota suspensa.";
        } else {
            echo "Ha aprobado sin ningún suspenso.";
        }
    } else {
        echo "Ha suspendido.";
    }
    ?>

</body>

</html>