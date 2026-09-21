<!DOCTYPE html>
<html>

<body>

    <?php

    // Ejercicio 1
    
    $numero = 64;

    if ($numero % 2 == 0) {
        echo "Es par";
    } else {
        echo "Es impar";
    }

    echo "<br><br>";

    // Ejercicio 2
    
    $diaSemana = 6;

    switch ($diaSemana) {
        case 1:
            echo "Lunes";
            break;
        case 2:
            echo "Martes";
            break;
        case 3:
            echo "Miércoles";
            break;
        case 4:
            echo "Jueves";
            break;
        case 5:
            echo "Viernes";
            break;
        case 6:
            echo "Sábado";
            break;
        case 7:
            echo "Domingo";
            break;
        default:
            echo "Valor inválido";
            break;
    }

    echo "<br><br>";

    // Ejercicio 3
    
    $nota = 8;

    switch ($nota) {
        case 10:
        case 9:
            echo "Sobresaliente";
            break;
        case 8:
        case 7:
            echo "Notable";
            break;
        case 6:
            echo "Bien";
            break;
        case 5:
            echo "Suficiente";
            break;
        case 4:
        case 3:
        case 2:
        case 1:
        case 0:
            echo "Insuficiente";
            break;
        default:
            echo "Valor inválido";
            break;
    }

    echo "<br><br>";

    // Ejercicio 4
    
    $usuario = "Ghostface";
    $contrasena = "woodsboro1996";
    $activo = True;

    if ($usuario == "Ghostface") {
        if ($contrasena == "woodsboro1996") {
            if ($activo) {
                echo "Inicio de sesión correcto.";
            } else {
                echo "Error. Usuario inactivo.";
            }
        } else {
            echo "Error. Contraseña incorrecta";
        }
    } else {
        echo "Error. Nombre de usuario incorrecto.";
    }

    echo "<br><br>";

    ?>

</body>

</html>