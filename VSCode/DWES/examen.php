<!DOCTYPE html>
<html>

<body>

    <?php

    $productos = [

        ["nombre" => "Teclado", "precio" => 25.50, "stock" => 12],

        ["nombre" => "Ratón", "precio" => 15.00, "stock" => 3],

        ["nombre" => "Monitor", "precio" => 120.00, "stock" => 7],

        ["nombre" => "Webcam", "precio" => 45.90, "stock" => 0],

    ];

    // 1. Mostrar un listado de todos los productos con su nombre, precio y stock.
    
    function mostrarProductos($productos)
    {
        echo "<br><br>";

        echo "Listado de productos:<br><br>";

        foreach ($productos as $producto) {
            echo "Nombre: " . $producto["nombre"] . "; Precio: " . $producto["precio"] . "; Stock: " . $producto["stock"] . "<br>";
        }
    }

    // 2. Calcular y mostrar el valor total del inventario (suma de precio × stock de todos los productos).
    
    function calcularInventario($productos)
    {
        echo "<br><br>";

        $suma = 0;

        echo "Valor total del inventario: ";

        foreach ($productos as $producto) {
            $suma += ($producto["precio"] * $producto["stock"]);
        }

        return "$suma €";
    }

    // 3. Mostrar qué productos tienen stock bajo (menos de 5 unidades), distinguiendo el caso de stock igual a 0 como "agotado".
    
    function productosBajoStock($productos)
    {
        echo "<br><br>";
        $suma = 0;

        echo "Número de productos con stock bajo: ";

        foreach ($productos as $producto) {
            if ($producto["stock"] < 5 &&
            $producto["stock"] > 0) {       // para no contar productos agotados
                $suma++;
            }
        }

        return $suma;
    }

    // 4. Indicar cuál es el producto más caro y cuál tiene más stock.
    
    function productoMasCaro($productos)
    {
        echo "<br><br>";

        $precioMasCaro = 0;
        $productoMasCaro = "";
        $stockMasAlto = 0;
        $productoMasStock = "";

        echo "Producto más caro de la lista: ";

        foreach ($productos as $producto) {
            if ($producto["precio"] > $precioMasCaro) {
                $precioMasCaro = $producto["precio"];
                $productoMasCaro = $producto["nombre"];
            }
        }

        echo "$productoMasCaro ($precioMasCaro €)<br>";

        echo "Producto con más stock de la lista: ";

        foreach ($productos as $producto) {
            if ($producto["stock"] > $stockMasAlto) {
                $stockMasAlto = $producto["stock"];
                $productoMasStock = $producto["nombre"];
            }
        }

        echo "$productoMasStock ($stockMasAlto unidades)<br>";
    }

    // 5. Mostrar cuántos productos en total están agotados.
    
    function productosAgotados($productos)
    {
        echo "<br><br>";

        $agotados = 0;

        echo "Número de productos agotados: ";

        foreach ($productos as $producto) {
            if ($producto["stock"] == 0) {
                $agotados++;
            }
        }

        return $agotados;
    }

    // Llamadas a funciones
    
    mostrarProductos($productos);
    echo calcularInventario($productos);
    echo productosBajoStock($productos);
    productoMasCaro($productos);
    echo productosAgotados($productos);

    ?>

</body>

</html>