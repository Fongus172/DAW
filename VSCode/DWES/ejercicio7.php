<!DOCTYPE html>
<html>

<body>

    <form method="post" action="ejercicio7.php">
        Nombre: <input type="text" name="nombre">
        <input type="submit" value="Enviar">
    </form>

    <?php

    // Ejercicio 1
    
    if (isset($_POST["nombre"])) {
        echo "Bienvenido, " . $_POST["nombre"];
    }

    ?>

    <form method="get" action="ejercicio7.php">
        Nombre: <input type="text" name="nombre">
        Edad: <input type="text" name="edad">
        Ciudad: <input type="text" name="ciudad">
        <input type="submit" value="Enviar">
    </form>

    <?php

    // Ejercicio 2
    
    if (isset($_GET["nombre"])) {
        echo "Bienvenido, " . $_GET["nombre"];
    }

    ?>

</body>

</html>