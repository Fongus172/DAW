<!DOCTYPE html>
<html>

<body>

    <?php

    // Ejercicio 1
    
    $nombre = "Iván";

    echo "Bienvenido, " . $nombre . "!<br><br>";

    // Ejercicio 2
    
    $nombre = "Iván";
    $edad = 21;
    $ciudad = "Astillero";

    echo "$nombre tiene $edad años y vive en $ciudad.<br><br>";

    // Ejercicio 3
    
    $a = 64;
    $b = 33;

    echo $a + $b . "<br>";
    echo $a - $b . "<br>";
    echo $a * $b . "<br>";
    echo $a / $b . "<br><br>";

    // Ejercicio 4
    
    $variableString = "Pizza";
    $variableInt = 87;
    $variableFloat = 19.83;
    $variableBool = True;

    echo gettype($variableString) . "<br>";
    echo gettype($variableInt) . "<br>";
    echo gettype($variableFloat) . "<br>";
    echo gettype($variableBool) . "<br><br>";

    // Ejercicio 5
    
    /*
    El código utiliza los dos tipos de comparadores ("==" y "===") para comparar las variables $a y $b.
    En el caso de "==", el restultado será True.
    En el caso de "===", el restultado será False.
    */

    $a = "8";
    $b = 8;
    echo var_dump($a == $b) . "<br>";
    echo var_dump($a === $b);

    ?>

</body>

</html>