<!DOCTYPE html>
<html>

<body>

    <?php

    // Ejercicio 1
    
    $nombre = "Billy";

    function saludar($nombre = "Desconocido")
    {
        echo "Hola, $nombre!";
    }

    saludar($nombre);

    echo "<br><br>";

    // Ejercicio 2
    
    $a = 21;
    $b = 36;

    function sumar($a, $b)
    {
        return $a + $b;
    }

    echo sumar($a, $b);

    echo "<br><br>";

    // Ejercicio 3
    
    $precio = 19.95;
    $iva = 33;

    function calcularPrecioFinal($precio, $iva = 21)
    {
        return $precio * ((100 + $iva) / 100);
    }

    echo "IVA 21%: " . calcularPrecioFinal($precio) . " €<br>";
    echo "IVA " . $iva . "%: " . calcularPrecioFinal($precio, $iva) . " €";

    echo "<br><br>";

    // Ejercicio 4
    
    $edad = 21;

    function esMayorDeEdad($edad)
    {
        if ($edad >= 18) {
            return True;
        } else {
            return False;
        }
    }

    echo esMayorDeEdad($edad);

    echo "<br><br>";

    // Ejercicio 5
    
    $n = 6;

    function factorial($n)
    {
        if ($n <= 1) {
            return 1;
        }
        return $n * factorial($n - 1);
    }

    echo "El factorial de $n es " . factorial($n) . ".";

    echo "<br><br>";

    // Ejercicio 6
    
    $contador = 0;

    function incrementar()
    {
        global $contador;
        $contador++;
        echo $contador . "<br>";
    }

    incrementar();
    incrementar();
    incrementar();

    /*
    La función incrementar() no funcionaría sin poner "global" antes de la declaración de la variable $contador,
    ya que entonces el programa interpretaría la variable $contador como una variable nueva creada dentro de la
    propia función, y por tanto, el programa interpretaría que la variable se crea desde cero (inicializada con
    valor 0) cada vez que se llame a la función, y no se vería un aumento progresivo del valor de la variable,
    sino el mismo resultado constantemente.
    */

    ?>

</body>

</html>