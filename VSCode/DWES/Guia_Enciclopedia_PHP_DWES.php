<?php
declare(strict_types=1);

/*
===============================================================================
GUÍA-ENCICLOPEDIA PHP PARA EXAMEN DWES
===============================================================================

OBJETIVO
--------
Archivo de consulta rápida para examen. Está basado en los dos manuales de PHP
del curso y ampliado con variantes, casos límite y "recetas" frecuentes para que
puedas buscar rápidamente una duda y copiar/adaptar el patrón.

IMPORTANTE
----------
- El BLOQUE A contiene el núcleo directamente relacionado con el temario de tus
  manuales.
- El BLOQUE B añade sintaxis y utilidades de PHP que NO aparecen necesariamente
  en esos PDFs, pero que son muy útiles para resolver ejercicios.
- Los ejemplos que producirían errores intencionadamente se dejan comentados.
- Si el examen exige una solución concreta (por ejemplo, "usa dos for anidados"),
  respeta esa condición aunque exista una función de PHP que lo haga más fácil.

ÍNDICE RÁPIDO
-------------
A1. Sintaxis básica y comentarios
A2. declare(strict_types=1) y directivas
A3. Variables y tipos
A4. Ámbito: local, global y superglobales
A5. Salida: echo, print, cadenas y concatenación
A6. Operadores
A7. Condicionales: if / elseif / else / switch
A8. Bucles: while / do...while / for / foreach
A9. Arrays indexados, asociativos y multidimensionales
A10. Funciones
A11. Mezclar PHP y HTML
A12. Formularios: GET / POST / isset

B1. Constantes
B2. Conversión de tipos
B3. Operadores y expresiones adicionales
B4. Funciones útiles de cadenas
B5. Funciones útiles de números
B6. Funciones útiles de arrays
B7. Formularios completos y validación
B8. Recetas de examen
B9. Tablas HTML con PHP
B10. Errores típicos y cómo detectarlos
B11. Chuleta "si te piden X, usa Y"

===============================================================================
BLOQUE A. NÚCLEO DEL TEMARIO
===============================================================================
*/


// ============================================================================
// A1. SINTAXIS BÁSICA
// ============================================================================

// Un archivo PHP comienza con:
echo ""; // Línea inocua para que este archivo sea PHP válido.

// Sintaxis real:
// <?php
//     echo "Hola";
// ?>

// En archivos puramente PHP se recomienda NO cerrar con ?> al final del archivo.

// Cada instrucción suele terminar en punto y coma:
$numeroEjemplo = 5;
$textoEjemplo = "Hola";

// Comentario de una línea
# También existe este comentario de una línea en PHP.

/*
Comentario
de varias
líneas.
*/

// PHP distingue mayúsculas/minúsculas en VARIABLES:
$nombre = "Ana";
$Nombre = "Pedro"; // Variable distinta.

// En nombres de funciones, PHP no distingue normalmente mayúsculas/minúsculas,
// aunque conviene escribir siempre de forma consistente.


// ============================================================================
// A2. DIRECTIVAS: declare(strict_types=1) E ini_set()
// ============================================================================

// Esta guía ya tiene al principio:
// declare(strict_types=1);
//
// Con strict_types=1, los tipos declarados en parámetros/retornos se respetan
// estrictamente en llamadas realizadas desde este archivo.

function doblarEstricto(int $numero): int {
    return $numero * 2;
}

if (false) {
    echo doblarEstricto(4);    // 8

    // Con strict_types=1 esto da TypeError:
    // echo doblarEstricto("4");
}

// Algunas opciones de PHP se configuran en php.ini.
// Algunas pueden cambiarse durante la ejecución con ini_set():
if (false) {
    ini_set('display_errors', '1');
    ini_set('max_execution_time', '30');
}


// ============================================================================
// A3. VARIABLES Y TIPOS DE DATOS
// ============================================================================

if (false) {
    $nombre = "Ana";       // string
    $edad = 21;            // int
    $altura = 1.68;        // float
    $esAlumna = true;      // bool
    $sinValor = null;      // null
    $frutas = ["pera"];    // array

    echo $nombre;

    // Saber el tipo:
    echo gettype($edad);    // integer
    echo gettype($nombre);  // string

    // Ver tipo + valor:
    var_dump($altura);

    // Ver contenido de arrays de forma legible:
    print_r($frutas);
}

/*
TIPOS BÁSICOS IMPORTANTES
-------------------------
string  -> texto
int     -> entero
float   -> decimal
bool    -> true / false
array   -> colección
null    -> ausencia de valor
*/


// ============================================================================
// A4. ÁMBITO DE VARIABLES: LOCAL, GLOBAL Y SUPERGLOBALES
// ============================================================================

$mensajeGlobalEjemplo = "Fuera";

function ejemploAmbitoLocal(): void {
    $mensajeGlobalEjemplo = "Dentro"; // LOCAL, distinta de la exterior.
    if (false) {
        echo $mensajeGlobalEjemplo;
    }
}

// Para acceder/modificar una variable exterior:
$contadorGlobalEjemplo = 0;

function incrementarContadorGlobal(): void {
    global $contadorGlobalEjemplo;
    $contadorGlobalEjemplo++;
}

if (false) {
    incrementarContadorGlobal();
    incrementarContadorGlobal();
    echo $contadorGlobalEjemplo; // 2
}

/*
SUPERGLOBALES
-------------
Disponibles automáticamente en cualquier ámbito sin escribir global:
$_GET
$_POST
$_SERVER
$_COOKIE
$_SESSION
$_FILES
$_ENV
$_REQUEST
$GLOBALS

En tus manuales se trabajan especialmente $_GET y $_POST.
*/


// ============================================================================
// A5. SALIDA DE DATOS: echo, print, COMILLAS Y CONCATENACIÓN
// ============================================================================

if (false) {
    $nombre = "Ana";
    $edad = 21;

    // Concatenar con punto:
    echo "Hola " . $nombre . ", tienes " . $edad . " años.";

    // Interpolación con comillas dobles:
    echo "Hola $nombre, tienes $edad años.";

    // Comillas simples: NO interpolan variables.
    echo 'Hola $nombre'; // imprime literalmente: Hola $nombre

    // print es parecido a echo:
    print "Hola";

    // Varias salidas con echo:
    echo "Uno", "Dos", "Tres";

    // Salto HTML:
    echo "<br>";

    // Escapar comillas:
    echo "Él dijo: \"Hola\"";
    echo 'It\'s PHP';

    // Llaves para dejar claro dónde termina el nombre de la variable:
    $producto = "pan";
    echo "Compré {$producto}es"; // "panes" si eso es lo que se pretendía construir.
}

/*
REGLA RÁPIDA:
- Para unir cadenas: .
- "..." permite variables dentro.
- '...' trata $variables como texto normal.
*/


// ============================================================================
// A6. OPERADORES
// ============================================================================

if (false) {
    $a = 10;
    $b = 3;

    // ARITMÉTICOS
    echo $a + $b; // 13
    echo $a - $b; // 7
    echo $a * $b; // 30
    echo $a / $b; // 3.333...
    echo $a % $b; // 1 (resto)

    // ASIGNACIÓN
    $x = 5;
    $x += 2; // 7
    $x -= 1; // 6
    $x *= 3; // 18
    $x /= 2; // 9

    // COMPARACIÓN
    var_dump(5 == "5");   // true: mismo valor tras conversión
    var_dump(5 === "5");  // false: distinto tipo
    var_dump(5 != 6);     // true
    var_dump(5 < 6);      // true
    var_dump(5 > 6);      // false
    var_dump(5 <= 5);     // true
    var_dump(5 >= 5);     // true

    // LÓGICOS
    $edad = 20;
    $tieneEntrada = true;

    if ($edad >= 18 && $tieneEntrada) {
        echo "Puede entrar";
    }

    if ($edad < 18 || !$tieneEntrada) {
        echo "No cumple alguna condición";
    }

    // CONCATENACIÓN
    $nombre = "Ana";
    echo "Hola " . $nombre;
}

/*
&& -> Y lógico: deben cumplirse ambas.
|| -> O lógico: basta una.
!  -> negación.
*/


// ============================================================================
// A7. CONDICIONALES
// ============================================================================

if (false) {
    // IF SIMPLE
    $edad = 20;

    if ($edad >= 18) {
        echo "Mayor de edad";
    }

    // IF / ELSE
    if ($edad >= 18) {
        echo "Mayor";
    } else {
        echo "Menor";
    }

    // IF / ELSEIF / ELSE
    $nota = 7;

    if ($nota >= 9) {
        echo "Sobresaliente";
    } elseif ($nota >= 7) {
        echo "Notable";
    } elseif ($nota >= 5) {
        echo "Aprobado";
    } else {
        echo "Suspenso";
    }

    // CONDICIONES COMPUESTAS
    $usuario = "admin";
    $clave = "1234";

    if ($usuario === "admin" && $clave === "1234") {
        echo "Acceso correcto";
    }

    // IF ANIDADO
    $numero = 12;

    if ($numero > 0) {
        if ($numero % 2 === 0) {
            echo "Positivo y par";
        } else {
            echo "Positivo e impar";
        }
    }

    // SWITCH
    $dia = 2;

    switch ($dia) {
        case 1:
            echo "Lunes";
            break;

        case 2:
            echo "Martes";
            break;

        case 3:
        case 4:
        case 5:
            echo "Entre miércoles y viernes";
            break;

        default:
            echo "Otro valor";
            break;
    }
}

/*
MUY IMPORTANTE EN switch:
Si no pones break, PHP continúa ejecutando los siguientes case.
Eso se llama "fall-through" y a veces se usa a propósito.
*/


// ============================================================================
// A8. BUCLES
// ============================================================================

if (false) {
    // ------------------------------------------------------------------------
    // WHILE
    // Comprueba la condición ANTES de cada vuelta.
    // Puede ejecutarse 0 veces.
    // ------------------------------------------------------------------------
    $i = 1;

    while ($i <= 5) {
        echo $i . "<br>";
        $i++;
    }

    // ------------------------------------------------------------------------
    // DO...WHILE
    // Ejecuta primero y comprueba después.
    // Se ejecuta AL MENOS UNA VEZ.
    // ------------------------------------------------------------------------
    $i = 10;

    do {
        echo $i;
        $i++;
    } while ($i <= 5);

    // Aunque 10 <= 5 es falso, imprime 10 una vez.

    // ------------------------------------------------------------------------
    // FOR
    // for (inicialización; condición; modificación)
    // ------------------------------------------------------------------------
    for ($i = 1; $i <= 5; $i++) {
        echo "Número: $i<br>";
    }

    // Contar hacia atrás:
    for ($i = 10; $i >= 1; $i--) {
        echo $i . "<br>";
    }

    // De 2 en 2:
    for ($i = 0; $i <= 20; $i += 2) {
        echo $i . "<br>";
    }

    // ------------------------------------------------------------------------
    // FOR ANIDADO
    // El bucle interior se ejecuta COMPLETO por cada vuelta del exterior.
    // ------------------------------------------------------------------------
    for ($fila = 1; $fila <= 3; $fila++) {
        for ($columna = 1; $columna <= 4; $columna++) {
            echo "($fila,$columna) ";
        }
        echo "<br>";
    }

    // ------------------------------------------------------------------------
    // FOREACH: SOLO VALORES
    // ------------------------------------------------------------------------
    $frutas = ["manzana", "pera", "plátano"];

    foreach ($frutas as $fruta) {
        echo $fruta . "<br>";
    }

    // FOREACH: CLAVE + VALOR
    $alumno = [
        "nombre" => "Ana",
        "edad" => 21
    ];

    foreach ($alumno as $clave => $valor) {
        echo "$clave: $valor<br>";
    }
}


// ============================================================================
// A9. ARRAYS
// ============================================================================

if (false) {
    // ------------------------------------------------------------------------
    // ARRAY INDEXADO
    // Índices automáticos: 0, 1, 2...
    // ------------------------------------------------------------------------
    $frutas = array("manzana", "pera", "plátano");
    $frutas2 = ["manzana", "pera", "plátano"]; // Sintaxis moderna equivalente.

    echo $frutas[0]; // manzana
    echo $frutas[2]; // plátano

    // Modificar:
    $frutas[1] = "naranja";

    // Añadir al final:
    $frutas[] = "kiwi";

    // ------------------------------------------------------------------------
    // ARRAY ASOCIATIVO
    // ------------------------------------------------------------------------
    $alumno = [
        "nombre" => "Ana",
        "edad" => 21,
        "aprobado" => true
    ];

    echo $alumno["nombre"];

    // Modificar:
    $alumno["edad"] = 22;

    // Añadir:
    $alumno["curso"] = "DAW";

    // ------------------------------------------------------------------------
    // CONTAR ELEMENTOS
    // ------------------------------------------------------------------------
    echo count($frutas);

    // ------------------------------------------------------------------------
    // DEPURAR
    // ------------------------------------------------------------------------
    print_r($alumno);
    var_dump($alumno);
}


// ============================================================================
// A10. FUNCIONES
// ============================================================================

function saludarGuia(string $nombre, bool $formal = false): string {
    if ($formal) {
        return "Estimado/a $nombre";
    }

    return "¡Hola $nombre!";
}

if (false) {
    echo saludarGuia("Ana");
    echo saludarGuia("Sr. Pérez", true);
}

/*
PARTES DE UNA FUNCIÓN
---------------------
function nombreFuncion(parametros) {
    instrucciones;
    return valor;
}

- Puede no recibir parámetros.
- Puede recibir uno o muchos.
- Un parámetro puede tener valor por defecto.
- return devuelve un valor y TERMINA la función.
- : int, : string, etc. indican tipo de retorno.
*/

function sumarGuia(int $a, int $b): int {
    return $a + $b;
}

function mostrarMensajeGuia(string $mensaje): void {
    if (false) {
        echo $mensaje;
    }
}

if (false) {
    $resultado = sumarGuia(3, 4);
    echo $resultado; // 7
}


// ============================================================================
// A11. MEZCLAR PHP Y HTML
// ============================================================================

/*
Puedes entrar y salir de PHP varias veces.

EJEMPLO:

<!DOCTYPE html>
<html>
<body>

<h1>Lista</h1>

<ul>
<?php
$productos = ["Leche", "Pan", "Huevos"];

foreach ($productos as $producto) {
    echo "<li>$producto</li>";
}
?>
</ul>

</body>
</html>

También puedes escribir HTML desde echo:

echo "<h1>Título</h1>";
echo "<p>Párrafo</p>";
*/


// ============================================================================
// A12. FORMULARIOS: $_GET, $_POST E isset()
// ============================================================================

/*
FORMULARIO GET:

<form method="get" action="">
    Nombre:
    <input type="text" name="nombre">
    <input type="submit" value="Enviar">
</form>

<?php
if (isset($_GET["nombre"])) {
    echo "Hola " . $_GET["nombre"];
}
?>

FORMULARIO POST:

<form method="post" action="">
    Nombre:
    <input type="text" name="nombre">
    <input type="submit" value="Enviar">
</form>

<?php
if (isset($_POST["nombre"])) {
    echo "Hola " . $_POST["nombre"];
}
?>

REGLA:
- method="get"  -> $_GET
- method="post" -> $_POST
- name="nombre" -> $_GET["nombre"] o $_POST["nombre"]
- isset(...) sirve para comprobar que existe antes de usarlo.
*/


/*
===============================================================================
BLOQUE B. AMPLIACIÓN ÚTIL PARA EXAMEN
===============================================================================
Todo lo siguiente amplía el material de los PDFs. No significa necesariamente
que vaya a entrar en el examen, pero son patrones muy útiles para resolver
variantes de ejercicios.
*/


// ============================================================================
// B1. CONSTANTES
// ============================================================================

if (false) {
    define("IVA", 0.21);
    echo IVA;

    const PI_APROX = 3.1416;
    echo PI_APROX;
}

/*
Variable: puede cambiar.
Constante: su valor no debería cambiar.
*/


// ============================================================================
// B2. CONVERSIÓN DE TIPOS (CASTING)
// ============================================================================

if (false) {
    $texto = "25";

    $entero = (int) $texto;       // 25
    $decimal = (float) "3.14";    // 3.14
    $cadena = (string) 123;       // "123"
    $booleano = (bool) 1;         // true

    var_dump($entero);
}


// ============================================================================
// B3. OPERADORES Y EXPRESIONES ADICIONALES
// ============================================================================

if (false) {
    // Incremento/decremento:
    $i = 5;
    $i++; // 6
    $i--; // 5

    // Potencia:
    echo 2 ** 3; // 8

    // Asignación con concatenación:
    $texto = "Hola";
    $texto .= " mundo"; // "Hola mundo"

    // Diferente estricto:
    var_dump(5 !== "5"); // true

    // Ternario:
    $edad = 20;
    $resultado = ($edad >= 18) ? "Mayor" : "Menor";

    // Null coalescing:
    $nombre = $_GET["nombre"] ?? "Invitado";

    // Operador spaceship:
    // -1 si izquierda < derecha
    //  0 si iguales
    //  1 si izquierda > derecha
    echo 3 <=> 5;
}


// ============================================================================
// B4. FUNCIONES ÚTILES DE CADENAS
// ============================================================================

if (false) {
    $texto = "  Hola Mundo  ";

    echo strlen($texto);               // longitud
    echo trim($texto);                 // quita espacios extremos
    echo strtoupper($texto);           // mayúsculas
    echo strtolower($texto);           // minúsculas
    echo ucfirst("hola");              // Hola
    echo str_replace("Mundo", "PHP", $texto);
    echo substr("abcdef", 1, 3);        // bcd

    // Buscar posición:
    $pos = strpos("Hola mundo", "mundo"); // 5
    var_dump($pos);

    // Dividir una cadena:
    $partes = explode(",", "rojo,verde,azul");

    // Unir array en cadena:
    echo implode(" - ", ["A", "B", "C"]); // A - B - C
}


// ============================================================================
// B5. FUNCIONES ÚTILES DE NÚMEROS
// ============================================================================

if (false) {
    echo abs(-8);          // 8
    echo round(3.14159, 2);// 3.14
    echo floor(3.9);       // 3
    echo ceil(3.1);        // 4
    echo min(5, 2, 8);     // 2
    echo max(5, 2, 8);     // 8
    echo sqrt(25);         // 5
    echo pow(2, 3);        // 8

    // Aleatorio entero:
    echo random_int(1, 10);
}


// ============================================================================
// B6. FUNCIONES ÚTILES DE ARRAYS
// ============================================================================

if (false) {
    $numeros = [5, 2, 8, 1];

    echo count($numeros);
    echo array_sum($numeros); // 16
    echo min($numeros);       // 1
    echo max($numeros);       // 8

    // Buscar si existe un valor:
    if (in_array(8, $numeros, true)) {
        echo "Existe";
    }

    // Añadir al final:
    array_push($numeros, 10);
    // Equivalente y más simple:
    $numeros[] = 11;

    // Quitar último:
    $ultimo = array_pop($numeros);

    // Quitar por índice/clave:
    unset($numeros[1]);

    // Reindexar tras unset si hace falta:
    $numeros = array_values($numeros);

    // Ordenar por VALORES, rehaciendo índices:
    sort($numeros);   // ascendente
    rsort($numeros);  // descendente

    // Asociativos:
    $precios = ["pan" => 1.2, "leche" => 1.0, "queso" => 4.5];

    asort($precios);  // por valor ascendente conservando claves
    arsort($precios); // por valor descendente conservando claves
    ksort($precios);  // por clave ascendente
    krsort($precios); // por clave descendente

    // Saber si existe una CLAVE:
    if (array_key_exists("pan", $precios)) {
        echo $precios["pan"];
    }

    // Fusionar:
    $a = [1, 2];
    $b = [3, 4];
    $c = array_merge($a, $b);

    // Eliminar duplicados:
    $sinDuplicados = array_unique([1, 1, 2, 3, 3]);
}


// ============================================================================
// B6.1 ARRAYS MULTIDIMENSIONALES
// ============================================================================

if (false) {
    $alumnos = [
        ["nombre" => "Ana", "nota" => 8],
        ["nombre" => "Luis", "nota" => 5],
        ["nombre" => "Marta", "nota" => 9]
    ];

    // Acceso:
    echo $alumnos[0]["nombre"]; // Ana
    echo $alumnos[2]["nota"];   // 9

    // Recorrer:
    foreach ($alumnos as $alumno) {
        echo $alumno["nombre"] . ": " . $alumno["nota"] . "<br>";
    }

    // Recorrido doble genérico:
    foreach ($alumnos as $fila) {
        foreach ($fila as $clave => $valor) {
            echo "$clave = $valor ";
        }
        echo "<br>";
    }
}


// ============================================================================
// B7. FUNCIONES: MÁS POSIBILIDADES
// ============================================================================

// Sin parámetros y sin retorno:
function holaSimpleGuia(): void {
    if (false) {
        echo "Hola";
    }
}

// Con retorno:
function cuadradoGuia(int $n): int {
    return $n * $n;
}

// Parámetro opcional:
function potenciaGuia(int $base, int $exponente = 2): int {
    return $base ** $exponente;
}

// Paso por referencia: MODIFICA la variable original.
function duplicarPorReferenciaGuia(int &$numero): void {
    $numero *= 2;
}

// Número variable de argumentos:
function sumarMuchosGuia(int ...$numeros): int {
    return array_sum($numeros);
}

if (false) {
    echo cuadradoGuia(5);       // 25
    echo potenciaGuia(3);       // 9
    echo potenciaGuia(3, 3);    // 27

    $n = 4;
    duplicarPorReferenciaGuia($n);
    echo $n;                    // 8

    echo sumarMuchosGuia(1, 2, 3, 4); // 10
}


// ============================================================================
// B7.1 RETURN TERMINA LA FUNCIÓN
// ============================================================================

function clasificarNumeroGuia(int $n): string {
    if ($n < 0) {
        return "Negativo";
    }

    if ($n === 0) {
        return "Cero";
    }

    return "Positivo";
}


// ============================================================================
// B7.2 STATIC LOCAL: CONSERVA SU VALOR ENTRE LLAMADAS
// ============================================================================

function contadorStaticGuia(): int {
    static $contador = 0;
    $contador++;
    return $contador;
}

if (false) {
    echo contadorStaticGuia(); // 1
    echo contadorStaticGuia(); // 2
}


// ============================================================================
// B8. FORMULARIOS COMPLETOS Y VALIDACIÓN
// ============================================================================

/*
-------------------------------------------------------------------------------
B8.1 SABER SI EL FORMULARIO SE ENVIÓ
-------------------------------------------------------------------------------

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // El formulario POST se ha enviado.
}

-------------------------------------------------------------------------------
B8.2 LEER UN CAMPO CON VALOR POR DEFECTO
-------------------------------------------------------------------------------

$nombre = $_POST["nombre"] ?? "";

-------------------------------------------------------------------------------
B8.3 isset() vs empty()
-------------------------------------------------------------------------------

isset($x)
- true si existe y NO es null.

empty($x)
- true si no existe o si PHP lo considera "vacío":
  "", "0", 0, 0.0, false, null, []

Ejemplo:
if (isset($_POST["nombre"]) && $_POST["nombre"] !== "") {
    ...
}

-------------------------------------------------------------------------------
B8.4 LIMPIAR TEXTO PARA MOSTRARLO EN HTML
-------------------------------------------------------------------------------

$nombre = htmlspecialchars($_POST["nombre"] ?? "", ENT_QUOTES, "UTF-8");

Esto evita que texto introducido por el usuario se interprete como HTML.

-------------------------------------------------------------------------------
B8.5 INPUT NUMBER
-------------------------------------------------------------------------------

<form method="post">
    <input type="number" name="edad">
    <button type="submit">Enviar</button>
</form>

<?php
if (isset($_POST["edad"]) && $_POST["edad"] !== "") {
    $edad = (int) $_POST["edad"];
    echo $edad;
}
?>

-------------------------------------------------------------------------------
B8.6 RADIO
-------------------------------------------------------------------------------

<form method="post">
    <label><input type="radio" name="sexo" value="H"> Hombre</label>
    <label><input type="radio" name="sexo" value="M"> Mujer</label>
    <button type="submit">Enviar</button>
</form>

<?php
$sexo = $_POST["sexo"] ?? null;

if ($sexo !== null) {
    echo $sexo;
}
?>

-------------------------------------------------------------------------------
B8.7 CHECKBOX ÚNICO
-------------------------------------------------------------------------------

<form method="post">
    <label>
        <input type="checkbox" name="acepta" value="si">
        Acepto
    </label>
    <button type="submit">Enviar</button>
</form>

<?php
if (isset($_POST["acepta"])) {
    echo "Marcado";
} else {
    echo "No marcado";
}
?>

OJO: un checkbox NO marcado normalmente no se envía.

-------------------------------------------------------------------------------
B8.8 VARIOS CHECKBOX -> ARRAY
-------------------------------------------------------------------------------

<form method="post">
    <input type="checkbox" name="aficiones[]" value="cine"> Cine
    <input type="checkbox" name="aficiones[]" value="juegos"> Juegos
    <input type="checkbox" name="aficiones[]" value="musica"> Música
    <button type="submit">Enviar</button>
</form>

<?php
$aficiones = $_POST["aficiones"] ?? [];

foreach ($aficiones as $aficion) {
    echo htmlspecialchars($aficion) . "<br>";
}
?>

-------------------------------------------------------------------------------
B8.9 SELECT
-------------------------------------------------------------------------------

<form method="post">
    <select name="ciudad">
        <option value="santander">Santander</option>
        <option value="bilbao">Bilbao</option>
    </select>
    <button type="submit">Enviar</button>
</form>

<?php
$ciudad = $_POST["ciudad"] ?? "";
echo $ciudad;
?>

-------------------------------------------------------------------------------
B8.10 VALIDAR QUE SEA NUMÉRICO
-------------------------------------------------------------------------------

$valor = $_POST["numero"] ?? "";

if (is_numeric($valor)) {
    $numero = (float) $valor;
} else {
    echo "Introduce un número";
}
*/


// ============================================================================
// B9. RECETAS DE EXAMEN
// ============================================================================


// -----------------------------------------------------------------------------
// B9.1 PAR O IMPAR
// -----------------------------------------------------------------------------

function esParGuia(int $n): bool {
    return $n % 2 === 0;
}

if (false) {
    $n = 7;

    if ($n % 2 === 0) {
        echo "Par";
    } else {
        echo "Impar";
    }
}


// -----------------------------------------------------------------------------
// B9.2 POSITIVO, NEGATIVO O CERO
// -----------------------------------------------------------------------------

if (false) {
    $n = -3;

    if ($n > 0) {
        echo "Positivo";
    } elseif ($n < 0) {
        echo "Negativo";
    } else {
        echo "Cero";
    }
}


// -----------------------------------------------------------------------------
// B9.3 MAYOR DE DOS NÚMEROS
// -----------------------------------------------------------------------------

if (false) {
    $a = 8;
    $b = 5;

    if ($a > $b) {
        echo $a;
    } elseif ($b > $a) {
        echo $b;
    } else {
        echo "Son iguales";
    }
}


// -----------------------------------------------------------------------------
// B9.4 MAYOR DE TRES SIN max()
// -----------------------------------------------------------------------------

if (false) {
    $a = 4;
    $b = 10;
    $c = 7;

    $mayor = $a;

    if ($b > $mayor) {
        $mayor = $b;
    }

    if ($c > $mayor) {
        $mayor = $c;
    }

    echo $mayor;
}


// -----------------------------------------------------------------------------
// B9.5 SUMA DEL 1 AL N
// -----------------------------------------------------------------------------

if (false) {
    $n = 100;
    $suma = 0;

    for ($i = 1; $i <= $n; $i++) {
        $suma += $i;
    }

    echo $suma;
}


// -----------------------------------------------------------------------------
// B9.6 FACTORIAL
// 5! = 5*4*3*2*1 = 120
// -----------------------------------------------------------------------------

function factorialGuia(int $n): int {
    $resultado = 1;

    for ($i = 2; $i <= $n; $i++) {
        $resultado *= $i;
    }

    return $resultado;
}


// -----------------------------------------------------------------------------
// B9.7 TABLA DE MULTIPLICAR DE UN NÚMERO
// -----------------------------------------------------------------------------

if (false) {
    $numero = 7;

    for ($i = 1; $i <= 10; $i++) {
        echo "$numero x $i = " . ($numero * $i) . "<br>";
    }
}


// -----------------------------------------------------------------------------
// B9.8 TABLAS DE MULTIPLICAR 1 A 5 CON DOS FOR ANIDADOS
// -----------------------------------------------------------------------------

if (false) {
    for ($i = 1; $i <= 5; $i++) {
        echo "<h3>Tabla del $i</h3>";

        for ($j = 1; $j <= 10; $j++) {
            echo "$i x $j = " . ($i * $j) . "<br>";
        }
    }
}


// -----------------------------------------------------------------------------
// B9.9 TABLA HTML DE MULTIPLICAR 1 A 5
// -----------------------------------------------------------------------------

if (false) {
    echo "<table border='1'>";

    // Cabecera
    echo "<tr><th>x</th>";

    for ($columna = 1; $columna <= 5; $columna++) {
        echo "<th>$columna</th>";
    }

    echo "</tr>";

    // Filas
    for ($fila = 1; $fila <= 5; $fila++) {
        echo "<tr>";
        echo "<th>$fila</th>";

        for ($columna = 1; $columna <= 5; $columna++) {
            echo "<td>" . ($fila * $columna) . "</td>";
        }

        echo "</tr>";
    }

    echo "</table>";
}


// -----------------------------------------------------------------------------
// B9.10 CONTAR CUÁNTOS PARES HAY EN UN ARRAY
// -----------------------------------------------------------------------------

if (false) {
    $numeros = [2, 7, 8, 11, 14];
    $contador = 0;

    foreach ($numeros as $numero) {
        if ($numero % 2 === 0) {
            $contador++;
        }
    }

    echo $contador; // 3
}


// -----------------------------------------------------------------------------
// B9.11 SUMA Y MEDIA DE UN ARRAY
// -----------------------------------------------------------------------------

if (false) {
    $notas = [7, 8, 5, 10];
    $suma = 0;

    foreach ($notas as $nota) {
        $suma += $nota;
    }

    $media = $suma / count($notas);

    echo "Suma: $suma";
    echo "Media: $media";
}


// -----------------------------------------------------------------------------
// B9.12 MÁXIMO DE UN ARRAY SIN max()
// -----------------------------------------------------------------------------

if (false) {
    $numeros = [4, 9, 2, 15, 3];

    $mayor = $numeros[0];

    foreach ($numeros as $numero) {
        if ($numero > $mayor) {
            $mayor = $numero;
        }
    }

    echo $mayor; // 15
}


// -----------------------------------------------------------------------------
// B9.13 MÍNIMO DE UN ARRAY SIN min()
// -----------------------------------------------------------------------------

if (false) {
    $numeros = [4, 9, 2, 15, 3];

    $menor = $numeros[0];

    foreach ($numeros as $numero) {
        if ($numero < $menor) {
            $menor = $numero;
        }
    }

    echo $menor; // 2
}


// -----------------------------------------------------------------------------
// B9.14 BUSCAR UN VALOR SIN in_array()
// -----------------------------------------------------------------------------

if (false) {
    $numeros = [10, 20, 30, 40];
    $buscado = 30;
    $encontrado = false;

    foreach ($numeros as $numero) {
        if ($numero === $buscado) {
            $encontrado = true;
            break;
        }
    }

    echo $encontrado ? "Encontrado" : "No encontrado";
}


// -----------------------------------------------------------------------------
// B9.15 CONTAR APARICIONES
// -----------------------------------------------------------------------------

if (false) {
    $numeros = [1, 2, 2, 3, 2, 4];
    $buscado = 2;
    $veces = 0;

    foreach ($numeros as $numero) {
        if ($numero === $buscado) {
            $veces++;
        }
    }

    echo $veces; // 3
}


// -----------------------------------------------------------------------------
// B9.16 NÚMERO PRIMO
// Un primo es > 1 y solo divisible entre 1 y él mismo.
// -----------------------------------------------------------------------------

function esPrimoGuia(int $n): bool {
    if ($n <= 1) {
        return false;
    }

    for ($i = 2; $i * $i <= $n; $i++) {
        if ($n % $i === 0) {
            return false;
        }
    }

    return true;
}

if (false) {
    echo esPrimoGuia(17) ? "Primo" : "No primo";
}


// -----------------------------------------------------------------------------
// B9.17 MOSTRAR PRIMOS DE 1 A N
// -----------------------------------------------------------------------------

if (false) {
    $limite = 50;

    for ($n = 2; $n <= $limite; $n++) {
        if (esPrimoGuia($n)) {
            echo "$n ";
        }
    }
}


// -----------------------------------------------------------------------------
// B9.18 FIBONACCI
// 0, 1, 1, 2, 3, 5, 8...
// -----------------------------------------------------------------------------

if (false) {
    $cantidad = 10;

    $a = 0;
    $b = 1;

    for ($i = 1; $i <= $cantidad; $i++) {
        echo "$a ";

        $siguiente = $a + $b;
        $a = $b;
        $b = $siguiente;
    }
}


// -----------------------------------------------------------------------------
// B9.19 INVERTIR UNA CADENA SIN strrev()
// -----------------------------------------------------------------------------

if (false) {
    $texto = "PHP";
    $invertido = "";

    for ($i = strlen($texto) - 1; $i >= 0; $i--) {
        $invertido .= $texto[$i];
    }

    echo $invertido; // PHP -> PHP; con "hola" -> "aloh"
}


// -----------------------------------------------------------------------------
// B9.20 CONTAR VOCALES
// -----------------------------------------------------------------------------

if (false) {
    $texto = strtolower("Hola Mundo");
    $contador = 0;

    for ($i = 0; $i < strlen($texto); $i++) {
        $letra = $texto[$i];

        if (
            $letra === "a" ||
            $letra === "e" ||
            $letra === "i" ||
            $letra === "o" ||
            $letra === "u"
        ) {
            $contador++;
        }
    }

    echo $contador;
}


// -----------------------------------------------------------------------------
// B9.21 FIZZBUZZ
// Múltiplos de 3 -> Fizz
// Múltiplos de 5 -> Buzz
// Múltiplos de ambos -> FizzBuzz
// -----------------------------------------------------------------------------

if (false) {
    for ($i = 1; $i <= 100; $i++) {
        if ($i % 15 === 0) {
            echo "FizzBuzz";
        } elseif ($i % 3 === 0) {
            echo "Fizz";
        } elseif ($i % 5 === 0) {
            echo "Buzz";
        } else {
            echo $i;
        }

        echo "<br>";
    }
}


// ============================================================================
// B10. TABLAS HTML CON PHP
// ============================================================================

if (false) {
    $alumnos = [
        ["nombre" => "Ana", "nota" => 8],
        ["nombre" => "Luis", "nota" => 5],
        ["nombre" => "Marta", "nota" => 9]
    ];

    echo "<table border='1'>";
    echo "<tr><th>Nombre</th><th>Nota</th><th>Estado</th></tr>";

    foreach ($alumnos as $alumno) {
        $estado = $alumno["nota"] >= 5 ? "Aprobado" : "Suspenso";

        echo "<tr>";
        echo "<td>" . $alumno["nombre"] . "</td>";
        echo "<td>" . $alumno["nota"] . "</td>";
        echo "<td>$estado</td>";
        echo "</tr>";
    }

    echo "</table>";
}

/*
PATRÓN GENERAL DE TABLA:

echo "<table border='1'>";

echo "<tr>";
echo "<th>Cabecera 1</th>";
echo "<th>Cabecera 2</th>";
echo "</tr>";

foreach (...) {
    echo "<tr>";
    echo "<td>Dato 1</td>";
    echo "<td>Dato 2</td>";
    echo "</tr>";
}

echo "</table>";

ERRORES MUY TÍPICOS:
- Escribir <td>dato<td> en vez de <td>dato</td>.
- Olvidar cerrar </tr>.
- Poner el <tr> fuera del bucle cuando necesitas una fila por elemento.
*/


// ============================================================================
// B11. break Y continue
// ============================================================================

if (false) {
    // break: rompe el bucle completamente.
    for ($i = 1; $i <= 10; $i++) {
        if ($i === 5) {
            break;
        }

        echo $i;
    }
    // 1234

    // continue: salta SOLO la iteración actual.
    for ($i = 1; $i <= 5; $i++) {
        if ($i === 3) {
            continue;
        }

        echo $i;
    }
    // 1245
}


// ============================================================================
// B12. VALIDACIONES Y FUNCIONES DE COMPROBACIÓN
// ============================================================================

if (false) {
    $x = 10;

    var_dump(isset($x));       // existe y no es null
    var_dump(empty($x));       // ¿vacío?
    var_dump(is_int($x));      // ¿int?
    var_dump(is_float($x));    // ¿float?
    var_dump(is_string($x));   // ¿string?
    var_dump(is_bool($x));     // ¿bool?
    var_dump(is_array($x));    // ¿array?
    var_dump(is_null($x));     // ¿null?
    var_dump(is_numeric("25"));// true
}


// ============================================================================
// B13. FECHAS BÁSICAS
// ============================================================================

if (false) {
    echo date("Y-m-d");       // 2026-10-19
    echo date("d/m/Y");       // 19/10/2026
    echo date("H:i:s");       // hora
}


// ============================================================================
// B14. ERRORES TÍPICOS DE EXAMEN
// ============================================================================

/*
1) OLVIDAR $
   edad = 20;      // MAL
   $edad = 20;     // BIEN

2) OLVIDAR ;
   $x = 5          // MAL
   $x = 5;         // BIEN

3) USAR = EN UNA COMPARACIÓN
   if ($x = 5)     // ASIGNA 5
   if ($x == 5)    // compara valor
   if ($x === 5)   // compara valor + tipo

4) CONFUNDIR . CON +
   "Hola " . $nombre  // concatenación
   2 + 3              // suma

5) OFF-BY-ONE EN FOR
   for ($i = 1; $i < 5; $i++)  -> 1,2,3,4
   for ($i = 1; $i <= 5; $i++) -> 1,2,3,4,5

6) ARRAYS EMPIEZAN EN 0
   $a = ["A", "B"];
   $a[0] -> A
   $a[1] -> B

7) foreach CON ASOCIATIVO
   foreach ($array as $clave => $valor) { ... }

8) OLVIDAR break EN switch
   Puede ejecutar también los casos siguientes.

9) do...while LLEVA ; AL FINAL
   do {
       ...
   } while ($condicion);

10) CERRAR MAL HTML
    <td>dato</td>
    <tr>...</tr>

11) USAR $_GET CON UN FORM method="post"
    Deben coincidir.

12) INPUT SIN name
    PHP NO recibirá ese dato.

13) USAR $_POST["campo"] SIN COMPROBAR
    Mejor:
    if (isset($_POST["campo"])) { ... }

14) DIVIDIR ENTRE CERO
    Comprueba el divisor antes:
    if ($b != 0) { echo $a / $b; }

15) MEDIA DE ARRAY VACÍO
    if (count($array) > 0) {
        $media = array_sum($array) / count($array);
    }
*/


// ============================================================================
// B15. CHULETA: "SI TE PIDEN X, USA Y"
// ============================================================================

/*
SI TE PIDEN...                         USA...
-----------------------------------    -----------------------------------------
Repetir N veces                        for
Repetir mientras se cumpla algo       while
Ejecutar al menos una vez              do...while
Recorrer array                         foreach
Recorrer clave + valor                 foreach ($a as $k => $v)
Comparar muchos valores de 1 variable switch
Comparar rangos/condiciones complejas  if / elseif / else
Saber si número es par                 $n % 2 === 0
Saber si es múltiplo de 3              $n % 3 === 0
Acumular valores                       $suma += $valor
Contar casos                           $contador++
Buscar un valor                        foreach + if + break
Mayor sin max()                        variable $mayor + foreach
Menor sin min()                        variable $menor + foreach
Tabla HTML                             <table> + bucle de <tr>/<td>
Tabla de multiplicar completa          dos for anidados
Datos de formulario GET               $_GET
Datos de formulario POST              $_POST
Comprobar si llegó un campo            isset(...)
Valor por defecto                      $_POST["x"] ?? "defecto"
Concatenar texto                       .
Comparar valor + tipo                  ===
Saber el tipo                          gettype() / var_dump()
Mostrar array                          print_r() / var_dump()
Longitud de array                      count()
Longitud de string                     strlen()
Retornar resultado función             return
Usar variable exterior en función      global (aunque mejor pasar parámetros)
*/


// ============================================================================
// B16. MINI PLANTILLAS LISTAS PARA ADAPTAR
// ============================================================================

/*
-------------------------------------------------------------------------------
PLANTILLA 1: PROCESAR FORMULARIO POST
-------------------------------------------------------------------------------

<form method="post">
    <input type="text" name="dato">
    <button type="submit">Enviar</button>
</form>

<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $dato = $_POST["dato"] ?? "";

    if ($dato === "") {
        echo "Campo obligatorio";
    } else {
        echo htmlspecialchars($dato, ENT_QUOTES, "UTF-8");
    }
}
?>

-------------------------------------------------------------------------------
PLANTILLA 2: ARRAY + TABLA
-------------------------------------------------------------------------------

$datos = [
    ["nombre" => "A", "valor" => 10],
    ["nombre" => "B", "valor" => 20]
];

echo "<table border='1'>";
echo "<tr><th>Nombre</th><th>Valor</th></tr>";

foreach ($datos as $fila) {
    echo "<tr>";
    echo "<td>" . $fila["nombre"] . "</td>";
    echo "<td>" . $fila["valor"] . "</td>";
    echo "</tr>";
}

echo "</table>";

-------------------------------------------------------------------------------
PLANTILLA 3: DOBLE BUCLE
-------------------------------------------------------------------------------

for ($i = 1; $i <= $filas; $i++) {
    for ($j = 1; $j <= $columnas; $j++) {
        // Aquí tienes una combinación ($i, $j)
    }
}

-------------------------------------------------------------------------------
PLANTILLA 4: ACUMULADOR + CONTADOR + MEDIA
-------------------------------------------------------------------------------

$suma = 0;
$contador = 0;

foreach ($valores as $valor) {
    if (CONDICION) {
        $suma += $valor;
        $contador++;
    }
}

if ($contador > 0) {
    $media = $suma / $contador;
}

-------------------------------------------------------------------------------
PLANTILLA 5: BÚSQUEDA
-------------------------------------------------------------------------------

$encontrado = false;

foreach ($array as $elemento) {
    if ($elemento === $buscado) {
        $encontrado = true;
        break;
    }
}

if ($encontrado) {
    echo "Sí";
} else {
    echo "No";
}
*/


// ============================================================================
// FIN DE LA GUÍA
// ============================================================================

/*
CONSEJO DE USO EN EXAMEN
------------------------
Usa Ctrl+F y busca palabras como:

"for anidado"
"tabla HTML"
"primo"
"factorial"
"foreach"
"asociativo"
"POST"
"checkbox"
"función"
"return"
"scope"
"global"
"strict_types"
"isset"
"array multidimensional"
"media"
"máximo"
"buscar"
"switch"

La prioridad es entender el patrón, copiarlo y adaptar nombres, límites y
condiciones al enunciado.
*/
