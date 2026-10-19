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


/* ============================================================================================== */
/* SECCIÓN ULTRA: ÍNDICE DE BÚSQUEDA POR ACCIÓN / VERBO / SINÓNIMO */
/* ============================================================================================== */

/*
BUSCA CON Ctrl+F POR ESTAS PALABRAS SEGÚN LO QUE TE PIDAN:
Crear / Declarar / Asignar | Añadir / Insertar / Agregar | Modificar / Cambiar / Actualizar
Eliminar / Borrar / Quitar | Buscar / Encontrar / Localizar | Contar / Calcular / Acumular
Recorrer / Iterar | Ordenar / Clasificar | Filtrar / Seleccionar | Validar / Comprobar
Mostrar / Imprimir / Generar | Convertir / Castear | Comparar | Concatenar / Unir
Formulario GET | Formulario POST | Checkbox | Radio | Select | Tabla HTML | For anidado
Array indexado | Array asociativo | Array multidimensional | Función | Return | Global
Primo | Factorial | Fibonacci | Media | Máximo | Mínimo | Buscar valor | Frecuencia
*/


/* ============================================================================================== */
/* SECCIÓN ULTRA: SINTAXIS, VARIABLES, TIPOS, CONVERSIÓN Y ÁMBITO */
/* ============================================================================================== */

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 001: Crear / Declarar / Asignar variable string / texto
// BUSCAR TAMBIÉN: cadena, texto, string
// ----------------------------------------------------------------------------------------------
if (false) {
    $nombreCliente = "Lucía";
    echo $nombreCliente;
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 002: Crear / Declarar / Asignar variable int / entero
// BUSCAR TAMBIÉN: entero, int, número
// ----------------------------------------------------------------------------------------------
if (false) {
    $numeroPedidos = 7;
    echo $numeroPedidos;
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 003: Crear / Declarar / Asignar variable float / decimal
// BUSCAR TAMBIÉN: float, decimal
// ----------------------------------------------------------------------------------------------
if (false) {
    $precioEntrada = 12.50;
    echo $precioEntrada;
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 004: Crear / Declarar / Asignar variable bool verdadera
// BUSCAR TAMBIÉN: booleano true
// ----------------------------------------------------------------------------------------------
if (false) {
    $sesionActiva = true;
    var_dump($sesionActiva);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 005: Crear / Declarar / Asignar variable bool falsa
// BUSCAR TAMBIÉN: booleano false
// ----------------------------------------------------------------------------------------------
if (false) {
    $estaBloqueado = false;
    var_dump($estaBloqueado);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 006: Crear / Declarar / Asignar variable null / sin valor
// BUSCAR TAMBIÉN: nulo, null
// ----------------------------------------------------------------------------------------------
if (false) {
    $segundoTelefono = null;
    var_dump($segundoTelefono);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 007: Reasignar / Cambiar / Sobrescribir valor de variable
// BUSCAR TAMBIÉN: modificar variable
// ----------------------------------------------------------------------------------------------
if (false) {
    $puntuacion = 10;
    $puntuacion = 25;
    echo $puntuacion;
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 008: Copiar / Duplicar valor de una variable en otra
// BUSCAR TAMBIÉN: asignar desde variable
// ----------------------------------------------------------------------------------------------
if (false) {
    $original = 99;
    $copia = $original;
    echo $copia;
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 009: Intercambiar / Permutar valores de dos variables
// BUSCAR TAMBIÉN: swap, cambiar valores
// ----------------------------------------------------------------------------------------------
if (false) {
    $a = 3;
    $b = 8;
    $temporal = $a;
    $a = $b;
    $b = $temporal;
    echo "$a - $b";
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 010: Comprobar / Saber tipo con gettype()
// BUSCAR TAMBIÉN: tipo variable
// ----------------------------------------------------------------------------------------------
if (false) {
    $dato = 15.7;
    echo gettype($dato);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 011: Mostrar / Inspeccionar tipo y valor con var_dump()
// BUSCAR TAMBIÉN: depurar tipo
// ----------------------------------------------------------------------------------------------
if (false) {
    $dato = "15";
    var_dump($dato);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 012: Comprobar / Validar si es int con is_int()
// BUSCAR TAMBIÉN: entero
// ----------------------------------------------------------------------------------------------
if (false) {
    $x = 4;
    var_dump(is_int($x));
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 013: Comprobar / Validar si es float con is_float()
// BUSCAR TAMBIÉN: decimal
// ----------------------------------------------------------------------------------------------
if (false) {
    $x = 4.2;
    var_dump(is_float($x));
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 014: Comprobar / Validar si es string con is_string()
// BUSCAR TAMBIÉN: texto
// ----------------------------------------------------------------------------------------------
if (false) {
    $x = "PHP";
    var_dump(is_string($x));
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 015: Comprobar / Validar si es bool con is_bool()
// BUSCAR TAMBIÉN: booleano
// ----------------------------------------------------------------------------------------------
if (false) {
    $x = true;
    var_dump(is_bool($x));
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 016: Comprobar / Validar si es array con is_array()
// BUSCAR TAMBIÉN: colección
// ----------------------------------------------------------------------------------------------
if (false) {
    $x = [1,2,3];
    var_dump(is_array($x));
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 017: Comprobar / Validar si es null con is_null()
// BUSCAR TAMBIÉN: nulo
// ----------------------------------------------------------------------------------------------
if (false) {
    $x = null;
    var_dump(is_null($x));
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 018: Comprobar / Validar si valor es numérico con is_numeric()
// BUSCAR TAMBIÉN: número en string
// ----------------------------------------------------------------------------------------------
if (false) {
    $entrada = "42.5";
    var_dump(is_numeric($entrada));
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 019: Convertir / Castear string a int
// BUSCAR TAMBIÉN: casting entero
// ----------------------------------------------------------------------------------------------
if (false) {
    $texto = "25";
    $numero = (int) $texto;
    var_dump($numero);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 020: Convertir / Castear string a float
// BUSCAR TAMBIÉN: casting decimal
// ----------------------------------------------------------------------------------------------
if (false) {
    $texto = "25.75";
    $numero = (float) $texto;
    var_dump($numero);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 021: Convertir / Castear número a string
// BUSCAR TAMBIÉN: casting texto
// ----------------------------------------------------------------------------------------------
if (false) {
    $numero = 404;
    $texto = (string) $numero;
    var_dump($texto);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 022: Convertir / Castear valor a bool
// BUSCAR TAMBIÉN: casting booleano
// ----------------------------------------------------------------------------------------------
if (false) {
    $numero = 1;
    $bool = (bool) $numero;
    var_dump($bool);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 023: Crear / Usar variable local dentro de función
// BUSCAR TAMBIÉN: ámbito local, scope
// ----------------------------------------------------------------------------------------------
if (false) {
    function ultraEjemploLocal(): void {
        $mensajeLocal = "Solo existe dentro";
        echo $mensajeLocal;
    }
    ultraEjemploLocal();
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 024: Usar / Leer / Modificar variable global dentro de función con global
// BUSCAR TAMBIÉN: global, ámbito
// ----------------------------------------------------------------------------------------------
if (false) {
    $contadorExterior = 0;
    function ultraIncrementarGlobal(): void {
        global $contadorExterior;
        $contadorExterior++;
    }
    ultraIncrementarGlobal();
    echo $contadorExterior;
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 025: Conservar / Mantener variable local entre llamadas con static
// BUSCAR TAMBIÉN: static local
// ----------------------------------------------------------------------------------------------
if (false) {
    function ultraContadorStatic(): int {
        static $contador = 0;
        $contador++;
        return $contador;
    }
    echo ultraContadorStatic();
    echo ultraContadorStatic();
}


/* ============================================================================================== */
/* SECCIÓN ULTRA: SALIDA, STRINGS, CONCATENACIÓN Y TEXTO */
/* ============================================================================================== */

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 026: Mostrar / Imprimir texto con echo
// BUSCAR TAMBIÉN: salida, print
// ----------------------------------------------------------------------------------------------
if (false) {
    echo "Hola mundo";
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 027: Mostrar / Imprimir texto con print
// BUSCAR TAMBIÉN: salida, echo
// ----------------------------------------------------------------------------------------------
if (false) {
    print "Hola mundo";
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 028: Concatenar / Unir texto y variable con punto .
// BUSCAR TAMBIÉN: concatenación
// ----------------------------------------------------------------------------------------------
if (false) {
    $nombre = "Eva";
    echo "Hola " . $nombre;
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 029: Concatenar / Acumular texto en variable con .=
// BUSCAR TAMBIÉN: añadir texto
// ----------------------------------------------------------------------------------------------
if (false) {
    $frase = "Hola";
    $frase .= " mundo";
    echo $frase;
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 030: Interpolar / Insertar variable en comillas dobles
// BUSCAR TAMBIÉN: string interpolation
// ----------------------------------------------------------------------------------------------
if (false) {
    $nombre = "Eva";
    echo "Hola $nombre";
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 031: Insertar variable con llaves {} dentro de string
// BUSCAR TAMBIÉN: interpolación clara
// ----------------------------------------------------------------------------------------------
if (false) {
    $animal = "gat";
    echo "{$animal}os";
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 032: Usar comillas simples sin interpolar variable
// BUSCAR TAMBIÉN: literal
// ----------------------------------------------------------------------------------------------
if (false) {
    $nombre = "Eva";
    echo 'Hola $nombre';
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 033: Crear / Mostrar salto HTML con <br>
// BUSCAR TAMBIÉN: salto línea
// ----------------------------------------------------------------------------------------------
if (false) {
    echo "Línea 1<br>";
    echo "Línea 2";
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 034: Calcular / Saber longitud de string con strlen()
// BUSCAR TAMBIÉN: longitud cadena
// ----------------------------------------------------------------------------------------------
if (false) {
    $palabra = "servidor";
    echo strlen($palabra);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 035: Quitar / Eliminar espacios extremos con trim()
// BUSCAR TAMBIÉN: limpiar texto
// ----------------------------------------------------------------------------------------------
if (false) {
    $texto = "   hola   ";
    echo trim($texto);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 036: Convertir / Pasar a mayúsculas con strtoupper()
// BUSCAR TAMBIÉN: uppercase
// ----------------------------------------------------------------------------------------------
if (false) {
    $texto = "php";
    echo strtoupper($texto);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 037: Convertir / Pasar a minúsculas con strtolower()
// BUSCAR TAMBIÉN: lowercase
// ----------------------------------------------------------------------------------------------
if (false) {
    $texto = "PHP";
    echo strtolower($texto);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 038: Poner / Convertir primera letra a mayúscula con ucfirst()
// BUSCAR TAMBIÉN: capitalizar
// ----------------------------------------------------------------------------------------------
if (false) {
    $texto = "hola";
    echo ucfirst($texto);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 039: Reemplazar / Sustituir texto con str_replace()
// BUSCAR TAMBIÉN: sustituir cadena
// ----------------------------------------------------------------------------------------------
if (false) {
    $frase = "Hola Java";
    echo str_replace("Java", "PHP", $frase);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 040: Extraer / Recortar subcadena con substr()
// BUSCAR TAMBIÉN: subcadena
// ----------------------------------------------------------------------------------------------
if (false) {
    $texto = "ABCDEFGHIJ";
    echo substr($texto, 2, 4);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 041: Buscar / Encontrar posición de texto con strpos()
// BUSCAR TAMBIÉN: localizar substring
// ----------------------------------------------------------------------------------------------
if (false) {
    $frase = "Aprender PHP";
    $pos = strpos($frase, "PHP");
    var_dump($pos);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 042: Dividir / Separar string en array con explode()
// BUSCAR TAMBIÉN: split
// ----------------------------------------------------------------------------------------------
if (false) {
    $csv = "rojo,verde,azul";
    $colores = explode(",", $csv);
    print_r($colores);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 043: Unir / Juntar array en string con implode()
// BUSCAR TAMBIÉN: join
// ----------------------------------------------------------------------------------------------
if (false) {
    $partes = ["A","B","C"];
    echo implode(" - ", $partes);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 044: Invertir / Dar vuelta a cadena con strrev()
// BUSCAR TAMBIÉN: reverse string
// ----------------------------------------------------------------------------------------------
if (false) {
    $texto = "hola";
    echo strrev($texto);
}


/* ============================================================================================== */
/* SECCIÓN ULTRA: OPERADORES, COMPARACIONES Y EXPRESIONES */
/* ============================================================================================== */

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 045: Sumar / Añadir números con +
// BUSCAR TAMBIÉN: suma
// ----------------------------------------------------------------------------------------------
if (false) {
    $a=8; $b=5; echo $a+$b;
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 046: Restar / Sustraer números con -
// BUSCAR TAMBIÉN: resta
// ----------------------------------------------------------------------------------------------
if (false) {
    $a=8; $b=5; echo $a-$b;
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 047: Multiplicar números con *
// BUSCAR TAMBIÉN: producto
// ----------------------------------------------------------------------------------------------
if (false) {
    $a=8; $b=5; echo $a*$b;
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 048: Dividir números con /
// BUSCAR TAMBIÉN: cociente
// ----------------------------------------------------------------------------------------------
if (false) {
    $a=20; $b=4; echo $a/$b;
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 049: Calcular resto / módulo con %
// BUSCAR TAMBIÉN: par impar múltiplo
// ----------------------------------------------------------------------------------------------
if (false) {
    $a=17; $b=5; echo $a%$b;
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 050: Calcular potencia con **
// BUSCAR TAMBIÉN: exponente
// ----------------------------------------------------------------------------------------------
if (false) {
    echo 2 ** 8;
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 051: Incrementar / Aumentar en 1 con ++
// BUSCAR TAMBIÉN: contador
// ----------------------------------------------------------------------------------------------
if (false) {
    $x=7; $x++; echo $x;
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 052: Decrementar / Reducir en 1 con --
// BUSCAR TAMBIÉN: contador
// ----------------------------------------------------------------------------------------------
if (false) {
    $x=7; $x--; echo $x;
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 053: Sumar y asignar con +=
// BUSCAR TAMBIÉN: acumulador
// ----------------------------------------------------------------------------------------------
if (false) {
    $total=10; $total+=5; echo $total;
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 054: Restar y asignar con -=
// BUSCAR TAMBIÉN: acumulador
// ----------------------------------------------------------------------------------------------
if (false) {
    $total=10; $total-=3; echo $total;
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 055: Multiplicar y asignar con *=
// BUSCAR TAMBIÉN: asignación
// ----------------------------------------------------------------------------------------------
if (false) {
    $x=4; $x*=3; echo $x;
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 056: Dividir y asignar con /=
// BUSCAR TAMBIÉN: asignación
// ----------------------------------------------------------------------------------------------
if (false) {
    $x=20; $x/=4; echo $x;
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 057: Comparar mismo valor con ==
// BUSCAR TAMBIÉN: igualdad laxa
// ----------------------------------------------------------------------------------------------
if (false) {
    $a=5; $b="5"; var_dump($a==$b);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 058: Comparar mismo valor y tipo con ===
// BUSCAR TAMBIÉN: igualdad estricta
// ----------------------------------------------------------------------------------------------
if (false) {
    $a=5; $b="5"; var_dump($a===$b);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 059: Comparar distinto valor con !=
// BUSCAR TAMBIÉN: desigualdad
// ----------------------------------------------------------------------------------------------
if (false) {
    var_dump(5 != 8);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 060: Comparar distinto valor o tipo con !==
// BUSCAR TAMBIÉN: desigualdad estricta
// ----------------------------------------------------------------------------------------------
if (false) {
    var_dump(5 !== "5");
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 061: Comparar mayor que con >
// BUSCAR TAMBIÉN: superior
// ----------------------------------------------------------------------------------------------
if (false) {
    $x=9; if($x>5){echo "Mayor";}
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 062: Comparar menor que con <
// BUSCAR TAMBIÉN: inferior
// ----------------------------------------------------------------------------------------------
if (false) {
    $x=2; if($x<5){echo "Menor";}
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 063: Comparar mayor o igual con >=
// BUSCAR TAMBIÉN: mínimo
// ----------------------------------------------------------------------------------------------
if (false) {
    $edad=18; if($edad>=18){echo "OK";}
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 064: Comparar menor o igual con <=
// BUSCAR TAMBIÉN: máximo
// ----------------------------------------------------------------------------------------------
if (false) {
    $intentos=3; if($intentos<=3){echo "OK";}
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 065: Combinar condiciones Y / AND con &&
// BUSCAR TAMBIÉN: and, todas
// ----------------------------------------------------------------------------------------------
if (false) {
    $a=true; $b=true; if($a && $b){echo "Ambas";}
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 066: Combinar condiciones O / OR con ||
// BUSCAR TAMBIÉN: or, alguna
// ----------------------------------------------------------------------------------------------
if (false) {
    $a=false; $b=true; if($a || $b){echo "Alguna";}
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 067: Negar / Invertir booleano con !
// BUSCAR TAMBIÉN: not
// ----------------------------------------------------------------------------------------------
if (false) {
    $bloqueado=false; if(!$bloqueado){echo "Libre";}
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 068: Elegir valor con operador ternario
// BUSCAR TAMBIÉN: ?:, condicional corto
// ----------------------------------------------------------------------------------------------
if (false) {
    $nota=6; $r=($nota>=5)?"Aprobado":"Suspenso"; echo $r;
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 069: Asignar valor por defecto con ??
// BUSCAR TAMBIÉN: null coalescing
// ----------------------------------------------------------------------------------------------
if (false) {
    $nombre=$_GET["nombre"] ?? "Invitado"; echo $nombre;
}


/* ============================================================================================== */
/* SECCIÓN ULTRA: CONDICIONALES: IF, ELSEIF, ELSE, SWITCH */
/* ============================================================================================== */

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 070: Comprobar / Evaluar condición simple con if
// BUSCAR TAMBIÉN: si
// ----------------------------------------------------------------------------------------------
if (false) {
    $edad=20; if($edad>=18){echo "Mayor";}
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 071: Elegir entre dos casos con if / else
// BUSCAR TAMBIÉN: dos alternativas
// ----------------------------------------------------------------------------------------------
if (false) {
    $n=7; if($n%2===0){echo "Par";} else {echo "Impar";}
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 072: Elegir entre varios rangos con if / elseif / else
// BUSCAR TAMBIÉN: rangos
// ----------------------------------------------------------------------------------------------
if (false) {
    $nota=8;
    if($nota>=9){echo "Sobresaliente";}
    elseif($nota>=7){echo "Notable";}
    elseif($nota>=5){echo "Aprobado";}
    else{echo "Suspenso";}
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 073: Crear / Usar if anidado / condición dentro de otra
// BUSCAR TAMBIÉN: if dentro de if
// ----------------------------------------------------------------------------------------------
if (false) {
    $n=12;
    if($n>0){
        if($n%2===0){echo "Positivo y par";}
    }
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 074: Comparar muchos valores exactos con switch
// BUSCAR TAMBIÉN: case, menú
// ----------------------------------------------------------------------------------------------
if (false) {
    $opcion=2;
    switch($opcion){
        case 1: echo "Alta"; break;
        case 2: echo "Media"; break;
        case 3: echo "Baja"; break;
        default: echo "Otra";
    }
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 075: Agrupar varios valores case en switch
// BUSCAR TAMBIÉN: varios case mismo resultado
// ----------------------------------------------------------------------------------------------
if (false) {
    $dia=6;
    switch($dia){
        case 1:
        case 2:
        case 3:
        case 4:
        case 5: echo "Laborable"; break;
        case 6:
        case 7: echo "Fin de semana"; break;
        default: echo "Inválido";
    }
}


/* ============================================================================================== */
/* SECCIÓN ULTRA: BUCLES: WHILE, DO...WHILE, FOR, FOREACH, BREAK, CONTINUE */
/* ============================================================================================== */

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 076: Repetir mientras se cumpla condición con while
// BUSCAR TAMBIÉN: bucle while
// ----------------------------------------------------------------------------------------------
if (false) {
    $i=1; while($i<=5){echo "$i<br>"; $i++;}
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 077: Repetir al menos una vez con do...while
// BUSCAR TAMBIÉN: do while
// ----------------------------------------------------------------------------------------------
if (false) {
    $i=10; do{echo $i; $i++;}while($i<3);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 078: Repetir cantidad conocida de veces con for
// BUSCAR TAMBIÉN: bucle for
// ----------------------------------------------------------------------------------------------
if (false) {
    for($i=1;$i<=10;$i++){echo "$i<br>";}
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 079: Contar / Recorrer hacia atrás con for
// BUSCAR TAMBIÉN: for descendente
// ----------------------------------------------------------------------------------------------
if (false) {
    for($i=10;$i>=1;$i--){echo "$i<br>";}
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 080: Recorrer de 2 en 2 con for
// BUSCAR TAMBIÉN: incremento 2
// ----------------------------------------------------------------------------------------------
if (false) {
    for($i=0;$i<=20;$i+=2){echo "$i ";}
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 081: Recorrer solo impares con for
// BUSCAR TAMBIÉN: impares
// ----------------------------------------------------------------------------------------------
if (false) {
    for($i=1;$i<=19;$i+=2){echo "$i ";}
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 082: Crear / Usar dos for anidados
// BUSCAR TAMBIÉN: doble for filas columnas
// ----------------------------------------------------------------------------------------------
if (false) {
    for($f=1;$f<=3;$f++){for($c=1;$c<=4;$c++){echo "($f,$c) ";} echo "<br>";}
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 083: Crear / Usar tres for anidados
// BUSCAR TAMBIÉN: triple for
// ----------------------------------------------------------------------------------------------
if (false) {
    for($a=1;$a<=2;$a++){for($b=1;$b<=2;$b++){for($c=1;$c<=2;$c++){echo "$a-$b-$c<br>";}}}
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 084: Salir / Romper bucle con break
// BUSCAR TAMBIÉN: detener bucle
// ----------------------------------------------------------------------------------------------
if (false) {
    for($i=1;$i<=10;$i++){if($i===6){break;} echo $i;}
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 085: Saltar / Omitir vuelta con continue
// BUSCAR TAMBIÉN: siguiente iteración
// ----------------------------------------------------------------------------------------------
if (false) {
    for($i=1;$i<=5;$i++){if($i===3){continue;} echo $i;}
}


/* ============================================================================================== */
/* SECCIÓN ULTRA: ARRAYS INDEXADOS: CREAR, LEER, AÑADIR, MODIFICAR, BORRAR, BUSCAR, ORDENAR */
/* ============================================================================================== */

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 086: Crear / Declarar array indexado con []
// BUSCAR TAMBIÉN: lista, vector
// ----------------------------------------------------------------------------------------------
if (false) {
    $frutas=["manzana","pera","plátano"]; print_r($frutas);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 087: Crear / Declarar array indexado con array()
// BUSCAR TAMBIÉN: sintaxis clásica
// ----------------------------------------------------------------------------------------------
if (false) {
    $numeros=array(10,20,30); print_r($numeros);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 088: Leer / Obtener / Acceder valor por posición de array
// BUSCAR TAMBIÉN: índice
// ----------------------------------------------------------------------------------------------
if (false) {
    $colores=["rojo","verde","azul"]; echo $colores[1];
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 089: Modificar / Cambiar / Asignar valor en posición concreta de array
// BUSCAR TAMBIÉN: actualizar índice
// ----------------------------------------------------------------------------------------------
if (false) {
    $animales=["perro","gato","pez"]; $animales[1]="conejo"; print_r($animales);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 090: Añadir / Insertar / Agregar valor al final con []
// BUSCAR TAMBIÉN: append
// ----------------------------------------------------------------------------------------------
if (false) {
    $ciudades=["Santander","Bilbao"]; $ciudades[]="Oviedo"; print_r($ciudades);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 091: Añadir / Insertar / Agregar valor al final con array_push()
// BUSCAR TAMBIÉN: push
// ----------------------------------------------------------------------------------------------
if (false) {
    $marcas=["A","B"]; array_push($marcas,"C"); print_r($marcas);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 092: Añadir / Insertar varios valores al final con array_push()
// BUSCAR TAMBIÉN: push varios
// ----------------------------------------------------------------------------------------------
if (false) {
    $letras=["A"]; array_push($letras,"B","C","D"); print_r($letras);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 093: Eliminar / Borrar valor por índice con unset()
// BUSCAR TAMBIÉN: quitar índice
// ----------------------------------------------------------------------------------------------
if (false) {
    $equipos=["A","B","C"]; unset($equipos[1]); print_r($equipos);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 094: Eliminar / Quitar último elemento con array_pop()
// BUSCAR TAMBIÉN: pop final
// ----------------------------------------------------------------------------------------------
if (false) {
    $cola=["A","B","C"]; $ultimo=array_pop($cola); echo $ultimo; print_r($cola);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 095: Eliminar / Quitar primer elemento con array_shift()
// BUSCAR TAMBIÉN: shift inicio
// ----------------------------------------------------------------------------------------------
if (false) {
    $cola=["A","B","C"]; $primero=array_shift($cola); echo $primero; print_r($cola);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 096: Añadir / Insertar elemento al principio con array_unshift()
// BUSCAR TAMBIÉN: unshift inicio
// ----------------------------------------------------------------------------------------------
if (false) {
    $cola=["B","C"]; array_unshift($cola,"A"); print_r($cola);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 097: Contar / Saber número de elementos con count()
// BUSCAR TAMBIÉN: longitud array
// ----------------------------------------------------------------------------------------------
if (false) {
    $productos=["a","b","c","d"]; echo count($productos);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 098: Recorrer / Iterar array indexado con foreach
// BUSCAR TAMBIÉN: foreach
// ----------------------------------------------------------------------------------------------
if (false) {
    $planetas=["Mercurio","Venus","Tierra"]; foreach($planetas as $p){echo "$p<br>";}
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 099: Recorrer / Iterar array indexado con for e índice
// BUSCAR TAMBIÉN: for array
// ----------------------------------------------------------------------------------------------
if (false) {
    $notas=[5,7,9]; for($i=0;$i<count($notas);$i++){echo $notas[$i]."<br>";}
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 100: Obtener índice y valor con foreach
// BUSCAR TAMBIÉN: clave valor
// ----------------------------------------------------------------------------------------------
if (false) {
    $lenguajes=["PHP","Java","JS"]; foreach($lenguajes as $i=>$l){echo "$i => $l<br>";}
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 101: Reindexar / Normalizar índices con array_values()
// BUSCAR TAMBIÉN: reordenar índices
// ----------------------------------------------------------------------------------------------
if (false) {
    $datos=["A","B","C"]; unset($datos[1]); $datos=array_values($datos); print_r($datos);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 102: Buscar / Encontrar / Comprobar valor con in_array()
// BUSCAR TAMBIÉN: contiene valor
// ----------------------------------------------------------------------------------------------
if (false) {
    $roles=["admin","editor","usuario"]; var_dump(in_array("editor",$roles,true));
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 103: Buscar / Localizar índice de valor con array_search()
// BUSCAR TAMBIÉN: posición
// ----------------------------------------------------------------------------------------------
if (false) {
    $frutas=["pera","kiwi","uva"]; $i=array_search("kiwi",$frutas,true); var_dump($i);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 104: Sumar / Acumular array con array_sum()
// BUSCAR TAMBIÉN: suma array
// ----------------------------------------------------------------------------------------------
if (false) {
    $precios=[2.5,1.2,4.8]; echo array_sum($precios);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 105: Obtener / Buscar máximo con max()
// BUSCAR TAMBIÉN: mayor
// ----------------------------------------------------------------------------------------------
if (false) {
    $temperaturas=[12,20,18,25]; echo max($temperaturas);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 106: Obtener / Buscar mínimo con min()
// BUSCAR TAMBIÉN: menor
// ----------------------------------------------------------------------------------------------
if (false) {
    $temperaturas=[12,20,18,25]; echo min($temperaturas);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 107: Ordenar / Clasificar ascendente con sort()
// BUSCAR TAMBIÉN: orden creciente
// ----------------------------------------------------------------------------------------------
if (false) {
    $nums=[8,3,10,1]; sort($nums); print_r($nums);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 108: Ordenar / Clasificar descendente con rsort()
// BUSCAR TAMBIÉN: orden decreciente
// ----------------------------------------------------------------------------------------------
if (false) {
    $nums=[8,3,10,1]; rsort($nums); print_r($nums);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 109: Eliminar / Quitar duplicados con array_unique()
// BUSCAR TAMBIÉN: sin repetidos
// ----------------------------------------------------------------------------------------------
if (false) {
    $ids=[1,1,2,3,3,4]; $u=array_unique($ids); print_r($u);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 110: Combinar / Unir arrays con array_merge()
// BUSCAR TAMBIÉN: fusionar arrays
// ----------------------------------------------------------------------------------------------
if (false) {
    $a=[1,2]; $b=[3,4]; $c=array_merge($a,$b); print_r($c);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 111: Crear / Añadir / Insertar / Asignar valor explícito en posición 0 de array
// BUSCAR TAMBIÉN: posición 0, índice 0
// ----------------------------------------------------------------------------------------------
if (false) {
    $datos=["A","B","C","D","E"];
    $datos[0]="cero";
    print_r($datos);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 112: Crear / Añadir / Insertar / Asignar valor explícito en posición 1 de array
// BUSCAR TAMBIÉN: posición 1, índice 1
// ----------------------------------------------------------------------------------------------
if (false) {
    $datos=["A","B","C","D","E"];
    $datos[1]="uno";
    print_r($datos);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 113: Crear / Añadir / Insertar / Asignar valor explícito en posición 2 de array
// BUSCAR TAMBIÉN: posición 2, índice 2
// ----------------------------------------------------------------------------------------------
if (false) {
    $datos=["A","B","C","D","E"];
    $datos[2]="dos";
    print_r($datos);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 114: Crear / Añadir / Insertar / Asignar valor explícito en posición 3 de array
// BUSCAR TAMBIÉN: posición 3, índice 3
// ----------------------------------------------------------------------------------------------
if (false) {
    $datos=["A","B","C","D","E"];
    $datos[3]="tres";
    print_r($datos);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 115: Crear / Añadir / Insertar / Asignar valor explícito en posición 4 de array
// BUSCAR TAMBIÉN: posición 4, índice 4
// ----------------------------------------------------------------------------------------------
if (false) {
    $datos=["A","B","C","D","E"];
    $datos[4]="cuatro";
    print_r($datos);
}


/* ============================================================================================== */
/* SECCIÓN ULTRA: ARRAYS ASOCIATIVOS: CLAVES, VALORES, ALTAS, CAMBIOS, BORRADOS Y ORDENACIÓN */
/* ============================================================================================== */

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 116: Crear / Declarar array asociativo
// BUSCAR TAMBIÉN: mapa, diccionario
// ----------------------------------------------------------------------------------------------
if (false) {
    $persona=["nombre"=>"Lucía","edad"=>24,"ciudad"=>"Santander"]; print_r($persona);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 117: Leer / Obtener valor por clave de array asociativo
// BUSCAR TAMBIÉN: acceder clave
// ----------------------------------------------------------------------------------------------
if (false) {
    $producto=["nombre"=>"Ratón","precio"=>19.99]; echo $producto["precio"];
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 118: Crear / Añadir / Insertar nueva clave y valor en array asociativo
// BUSCAR TAMBIÉN: agregar propiedad
// ----------------------------------------------------------------------------------------------
if (false) {
    $usuario=["nombre"=>"Pablo"]; $usuario["email"]="pablo@example.com"; print_r($usuario);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 119: Modificar / Cambiar / Actualizar valor de clave existente
// BUSCAR TAMBIÉN: actualizar propiedad
// ----------------------------------------------------------------------------------------------
if (false) {
    $libro=["titulo"=>"1984","stock"=>5]; $libro["stock"]=4; print_r($libro);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 120: Eliminar / Borrar / Quitar clave con unset()
// BUSCAR TAMBIÉN: borrar propiedad
// ----------------------------------------------------------------------------------------------
if (false) {
    $cuenta=["usuario"=>"ana","temporal"=>true]; unset($cuenta["temporal"]); print_r($cuenta);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 121: Comprobar / Saber si existe clave con array_key_exists()
// BUSCAR TAMBIÉN: buscar clave
// ----------------------------------------------------------------------------------------------
if (false) {
    $config=["tema"=>"oscuro","idioma"=>"es"]; var_dump(array_key_exists("tema",$config));
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 122: Comprobar / Saber si clave existe y no es null con isset()
// BUSCAR TAMBIÉN: isset clave
// ----------------------------------------------------------------------------------------------
if (false) {
    $perfil=["nombre"=>"Eva","telefono"=>null]; var_dump(isset($perfil["nombre"])); var_dump(isset($perfil["telefono"]));
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 123: Recorrer / Iterar asociativo clave y valor con foreach
// BUSCAR TAMBIÉN: foreach mapa
// ----------------------------------------------------------------------------------------------
if (false) {
    $precios=["pan"=>1.1,"leche"=>1.3,"queso"=>4.8]; foreach($precios as $p=>$precio){echo "$p: $precio<br>";}
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 124: Ordenar asociativo por valor ascendente con asort()
// BUSCAR TAMBIÉN: ordenar valores
// ----------------------------------------------------------------------------------------------
if (false) {
    $p=["Ana"=>50,"Luis"=>20,"Eva"=>40]; asort($p); print_r($p);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 125: Ordenar asociativo por valor descendente con arsort()
// BUSCAR TAMBIÉN: ordenar valores desc
// ----------------------------------------------------------------------------------------------
if (false) {
    $p=["Ana"=>50,"Luis"=>20,"Eva"=>40]; arsort($p); print_r($p);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 126: Ordenar asociativo por clave ascendente con ksort()
// BUSCAR TAMBIÉN: ordenar claves
// ----------------------------------------------------------------------------------------------
if (false) {
    $d=["z"=>1,"a"=>2,"m"=>3]; ksort($d); print_r($d);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 127: Ordenar asociativo por clave descendente con krsort()
// BUSCAR TAMBIÉN: ordenar claves desc
// ----------------------------------------------------------------------------------------------
if (false) {
    $d=["z"=>1,"a"=>2,"m"=>3]; krsort($d); print_r($d);
}


/* ============================================================================================== */
/* SECCIÓN ULTRA: ARRAYS MULTIDIMENSIONALES / MATRICES / LISTAS DE REGISTROS */
/* ============================================================================================== */

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 128: Crear / Declarar array multidimensional de registros
// BUSCAR TAMBIÉN: array de arrays
// ----------------------------------------------------------------------------------------------
if (false) {
    $alumnos=[["nombre"=>"Ana","nota"=>8],["nombre"=>"Luis","nota"=>6],["nombre"=>"Marta","nota"=>9]]; print_r($alumnos);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 129: Leer / Acceder valor concreto de array multidimensional
// BUSCAR TAMBIÉN: fila campo
// ----------------------------------------------------------------------------------------------
if (false) {
    $alumnos=[["nombre"=>"Ana","nota"=>8],["nombre"=>"Luis","nota"=>6]]; echo $alumnos[1]["nombre"];
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 130: Modificar / Cambiar valor en array multidimensional
// BUSCAR TAMBIÉN: actualizar registro
// ----------------------------------------------------------------------------------------------
if (false) {
    $inv=[["producto"=>"Teclado","stock"=>5],["producto"=>"Ratón","stock"=>8]]; $inv[0]["stock"]=4; print_r($inv);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 131: Añadir / Insertar nueva fila / registro al multidimensional
// BUSCAR TAMBIÉN: append registro
// ----------------------------------------------------------------------------------------------
if (false) {
    $personas=[["nombre"=>"Ana","edad"=>20]]; $personas[]=["nombre"=>"Luis","edad"=>25]; print_r($personas);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 132: Recorrer / Iterar multidimensional con foreach
// BUSCAR TAMBIÉN: recorrer registros
// ----------------------------------------------------------------------------------------------
if (false) {
    $productos=[["nombre"=>"Monitor","precio"=>200],["nombre"=>"Ratón","precio"=>20]]; foreach($productos as $p){echo $p["nombre"]." - ".$p["precio"]."<br>";}
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 133: Recorrer / Iterar matriz con dos foreach anidados
// BUSCAR TAMBIÉN: doble foreach
// ----------------------------------------------------------------------------------------------
if (false) {
    $filas=[["A","B","C"],["D","E","F"]]; foreach($filas as $fila){foreach($fila as $v){echo "$v ";} echo "<br>";}
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 134: Buscar / Encontrar registro por campo / id
// BUSCAR TAMBIÉN: buscar registro
// ----------------------------------------------------------------------------------------------
if (false) {
    $usuarios=[["id"=>1,"nombre"=>"Ana"],["id"=>2,"nombre"=>"Luis"]]; $buscado=2; $encontrado=null; foreach($usuarios as $u){if($u["id"]===$buscado){$encontrado=$u; break;}} print_r($encontrado);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 135: Sumar / Totalizar campo de registros
// BUSCAR TAMBIÉN: sumar campo
// ----------------------------------------------------------------------------------------------
if (false) {
    $p=[["precio"=>10],["precio"=>15],["precio"=>8]]; $total=0; foreach($p as $x){$total+=$x["precio"];} echo $total;
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 136: Calcular / Obtener media de campo de registros
// BUSCAR TAMBIÉN: media notas
// ----------------------------------------------------------------------------------------------
if (false) {
    $a=[["nota"=>8],["nota"=>6],["nota"=>10]]; $s=0; foreach($a as $x){$s+=$x["nota"];} echo $s/count($a);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 137: Buscar / Obtener registro con mayor valor de campo
// BUSCAR TAMBIÉN: máximo registro
// ----------------------------------------------------------------------------------------------
if (false) {
    $a=[["nombre"=>"Ana","nota"=>8],["nombre"=>"Luis","nota"=>6],["nombre"=>"Eva","nota"=>10]]; $mejor=$a[0]; foreach($a as $x){if($x["nota"]>$mejor["nota"]){$mejor=$x;}} echo $mejor["nombre"];
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 138: Contar / Calcular registros que cumplen condición
// BUSCAR TAMBIÉN: contar aprobados
// ----------------------------------------------------------------------------------------------
if (false) {
    $a=[["nota"=>8],["nota"=>4],["nota"=>6]]; $ap=0; foreach($a as $x){if($x["nota"]>=5){$ap++;}} echo $ap;
}


/* ============================================================================================== */
/* SECCIÓN ULTRA: FUNCIONES: PARÁMETROS, OPCIONALES, RETORNOS, REFERENCIA, VARIÁDICAS */
/* ============================================================================================== */

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 139: Crear / Declarar función sin parámetros ni retorno
// BUSCAR TAMBIÉN: function void
// ----------------------------------------------------------------------------------------------
if (false) {
    function ultraHola(): void { echo "Hola"; }
    ultraHola();
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 140: Crear / Declarar función con un parámetro
// BUSCAR TAMBIÉN: argumento
// ----------------------------------------------------------------------------------------------
if (false) {
    function ultraSaludar(string $nombre): void { echo "Hola $nombre"; }
    ultraSaludar("María");
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 141: Crear / Declarar función con varios parámetros
// BUSCAR TAMBIÉN: varios argumentos
// ----------------------------------------------------------------------------------------------
if (false) {
    function ultraFicha(string $nombre,int $edad,string $ciudad): void { echo "$nombre - $edad - $ciudad"; }
    ultraFicha("Mario",30,"Santander");
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 142: Crear / Declarar función que devuelve valor con return
// BUSCAR TAMBIÉN: retornar
// ----------------------------------------------------------------------------------------------
if (false) {
    function ultraSumar(int $a,int $b): int { return $a+$b; }
    $r=ultraSumar(4,6); echo $r;
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 143: Crear / Usar parámetro opcional con valor por defecto
// BUSCAR TAMBIÉN: default parameter
// ----------------------------------------------------------------------------------------------
if (false) {
    function ultraSaludo(string $nombre,string $saludo="Hola"): string { return "$saludo $nombre"; }
    echo ultraSaludo("Ana");
    echo ultraSaludo("Ana","Buenos días");
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 144: Terminar / Salir antes de función con return temprano
// BUSCAR TAMBIÉN: early return
// ----------------------------------------------------------------------------------------------
if (false) {
    function ultraClasificar(int $n): string { if($n<0){return "Negativo";} if($n===0){return "Cero";} return "Positivo"; }
    echo ultraClasificar(-2);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 145: Pasar / Modificar argumento por referencia con &
// BUSCAR TAMBIÉN: referencia
// ----------------------------------------------------------------------------------------------
if (false) {
    function ultraDuplicar(int &$n): void { $n*=2; }
    $v=7; ultraDuplicar($v); echo $v;
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 146: Recibir cantidad variable de argumentos con ...
// BUSCAR TAMBIÉN: variadic
// ----------------------------------------------------------------------------------------------
if (false) {
    function ultraSumarTodos(int ...$nums): int { return array_sum($nums); }
    echo ultraSumarTodos(1,2,3,4,5);
}


/* ============================================================================================== */
/* SECCIÓN ULTRA: GENERAR HTML, LISTAS, TABLAS, FILAS Y COLUMNAS */
/* ============================================================================================== */

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 147: Generar / Crear etiqueta HTML con echo
// BUSCAR TAMBIÉN: HTML dinámico
// ----------------------------------------------------------------------------------------------
if (false) {
    echo "<h1>Título</h1>";
    echo "<p>Párrafo</p>";
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 148: Generar / Crear lista ul/li desde array
// BUSCAR TAMBIÉN: lista HTML
// ----------------------------------------------------------------------------------------------
if (false) {
    $cats=["Noticias","Juegos","Tecnología"]; echo "<ul>"; foreach($cats as $c){echo "<li>$c</li>";} echo "</ul>";
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 149: Generar / Crear tabla HTML desde asociativo
// BUSCAR TAMBIÉN: tabla clave valor
// ----------------------------------------------------------------------------------------------
if (false) {
    $p=["Nombre"=>"Ana","Edad"=>22,"Ciudad"=>"Santander"]; echo "<table border='1'>"; foreach($p as $k=>$v){echo "<tr><th>$k</th><td>$v</td></tr>";} echo "</table>";
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 150: Generar / Crear tabla HTML desde multidimensional
// BUSCAR TAMBIÉN: tabla registros
// ----------------------------------------------------------------------------------------------
if (false) {
    $p=[["nombre"=>"Ratón","precio"=>20],["nombre"=>"Teclado","precio"=>50]]; echo "<table border='1'><tr><th>Nombre</th><th>Precio</th></tr>"; foreach($p as $x){echo "<tr><td>".$x["nombre"]."</td><td>".$x["precio"]."</td></tr>";} echo "</table>";
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 151: Generar / Crear tabla de N filas y M columnas
// BUSCAR TAMBIÉN: rejilla
// ----------------------------------------------------------------------------------------------
if (false) {
    $filas=4; $cols=3; echo "<table border='1'>"; for($f=1;$f<=$filas;$f++){echo "<tr>"; for($c=1;$c<=$cols;$c++){echo "<td>$f,$c</td>";} echo "</tr>";} echo "</table>";
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 152: Generar / Crear cabecera automática 1..N en tabla
// BUSCAR TAMBIÉN: th dinámicos
// ----------------------------------------------------------------------------------------------
if (false) {
    $n=5; echo "<table border='1'><tr>"; for($c=1;$c<=$n;$c++){echo "<th>$c</th>";} echo "</tr></table>";
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 153: Generar / Crear tabla de multiplicar 1 a 5 con dos for
// BUSCAR TAMBIÉN: for anidado tabla multiplicar
// ----------------------------------------------------------------------------------------------
if (false) {
    echo "<table border='1'><tr><th>x</th>"; for($c=1;$c<=5;$c++){echo "<th>$c</th>";} echo "</tr>"; for($f=1;$f<=5;$f++){echo "<tr><th>$f</th>"; for($c=1;$c<=5;$c++){echo "<td>".($f*$c)."</td>";} echo "</tr>";} echo "</table>";
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 154: Generar / Dibujar triángulo de asteriscos con for anidados
// BUSCAR TAMBIÉN: patrón
// ----------------------------------------------------------------------------------------------
if (false) {
    $filas=5; for($i=1;$i<=$filas;$i++){for($j=1;$j<=$i;$j++){echo "*";} echo "<br>";}
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 155: Generar / Dibujar triángulo invertido de asteriscos
// BUSCAR TAMBIÉN: patrón invertido
// ----------------------------------------------------------------------------------------------
if (false) {
    $filas=5; for($i=$filas;$i>=1;$i--){for($j=1;$j<=$i;$j++){echo "*";} echo "<br>";}
}


/* ============================================================================================== */
/* SECCIÓN ULTRA: FORMULARIOS: GET, POST, TEXT, NUMBER, EMAIL, RADIO, CHECKBOX, SELECT, TEXTAREA */
/* ============================================================================================== */

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 156: Crear / Leer formulario GET de texto
// BUSCAR TAMBIÉN: GET input text
// ----------------------------------------------------------------------------------------------
// <form method="get" action="">
//     <input type="text" name="nombre">
//     <button type="submit">Enviar</button>
// </form>
// <?php
// if (isset($_GET["nombre"])) {
//     echo $_GET["nombre"];
// }
// ?>

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 157: Crear / Leer formulario POST de texto
// BUSCAR TAMBIÉN: POST input text
// ----------------------------------------------------------------------------------------------
// <form method="post" action="">
//     <input type="text" name="usuario">
//     <button type="submit">Enviar</button>
// </form>
// <?php
// if (isset($_POST["usuario"])) {
//     echo $_POST["usuario"];
// }
// ?>

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 158: Detectar / Comprobar si formulario POST fue enviado
// BUSCAR TAMBIÉN: REQUEST_METHOD
// ----------------------------------------------------------------------------------------------
if (false) {
    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        echo "Formulario enviado";
    }
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 159: Leer / Obtener campo con valor por defecto usando ??
// BUSCAR TAMBIÉN: campo opcional
// ----------------------------------------------------------------------------------------------
if (false) {
    $nombre = $_POST["nombre"] ?? "";
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 160: Comprobar / Validar que campo existe con isset()
// BUSCAR TAMBIÉN: campo existe
// ----------------------------------------------------------------------------------------------
if (false) {
    if (isset($_POST["email"])) { echo $_POST["email"]; }
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 161: Comprobar / Validar que campo no está vacío con empty()
// BUSCAR TAMBIÉN: campo obligatorio
// ----------------------------------------------------------------------------------------------
if (false) {
    $nombre=$_POST["nombre"] ?? ""; if(empty($nombre)){echo "Vacío";} else {echo "Relleno";}
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 162: Crear / Leer input type=number
// BUSCAR TAMBIÉN: número formulario
// ----------------------------------------------------------------------------------------------
// <form method="post"><input type="number" name="edad"><button>Enviar</button></form>
// <?php $edad = isset($_POST["edad"]) ? (int)$_POST["edad"] : null; ?>

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 163: Crear / Leer input type=email
// BUSCAR TAMBIÉN: correo
// ----------------------------------------------------------------------------------------------
// <form method="post"><input type="email" name="correo"><button>Enviar</button></form>
// <?php $correo = $_POST["correo"] ?? ""; ?>

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 164: Crear / Leer input type=password
// BUSCAR TAMBIÉN: contraseña
// ----------------------------------------------------------------------------------------------
// <form method="post"><input type="password" name="clave"><button>Enviar</button></form>
// <?php $clave = $_POST["clave"] ?? ""; ?>

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 165: Crear / Leer input type=date
// BUSCAR TAMBIÉN: fecha
// ----------------------------------------------------------------------------------------------
// <form method="post"><input type="date" name="fecha"><button>Enviar</button></form>
// <?php $fecha = $_POST["fecha"] ?? ""; ?>

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 166: Crear / Leer textarea
// BUSCAR TAMBIÉN: texto largo
// ----------------------------------------------------------------------------------------------
// <form method="post"><textarea name="comentario"></textarea><button>Enviar</button></form>
// <?php $comentario = $_POST["comentario"] ?? ""; ?>

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 167: Crear / Leer radio buttons / opción única
// BUSCAR TAMBIÉN: radio
// ----------------------------------------------------------------------------------------------
// <form method="post">
// <input type="radio" name="turno" value="manana"> Mañana
// <input type="radio" name="turno" value="tarde"> Tarde
// <button>Enviar</button>
// </form>
// <?php $turno = $_POST["turno"] ?? null; ?>

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 168: Crear / Leer checkbox único / casilla marcada
// BUSCAR TAMBIÉN: checkbox
// ----------------------------------------------------------------------------------------------
// <form method="post"><input type="checkbox" name="acepta" value="si"> Acepto<button>Enviar</button></form>
// <?php if(isset($_POST["acepta"])){echo "Marcado";} ?>

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 169: Crear / Leer varios checkbox como array
// BUSCAR TAMBIÉN: checkbox[], múltiple
// ----------------------------------------------------------------------------------------------
// <form method="post">
// <input type="checkbox" name="lenguajes[]" value="php"> PHP
// <input type="checkbox" name="lenguajes[]" value="java"> Java
// <input type="checkbox" name="lenguajes[]" value="js"> JS
// <button>Enviar</button>
// </form>
// <?php $lenguajes=$_POST["lenguajes"] ?? []; foreach($lenguajes as $l){echo "$l<br>";} ?>

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 170: Crear / Leer select de una opción
// BUSCAR TAMBIÉN: desplegable
// ----------------------------------------------------------------------------------------------
// <form method="post"><select name="pais"><option value="es">España</option><option value="fr">Francia</option></select><button>Enviar</button></form>
// <?php $pais=$_POST["pais"] ?? ""; ?>

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 171: Crear / Leer select multiple como array
// BUSCAR TAMBIÉN: select multiple
// ----------------------------------------------------------------------------------------------
// <form method="post"><select name="colores[]" multiple><option value="rojo">Rojo</option><option value="azul">Azul</option></select><button>Enviar</button></form>
// <?php $colores=$_POST["colores"] ?? []; foreach($colores as $c){echo "$c<br>";} ?>

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 172: Mantener / Conservar valor escrito tras enviar formulario
// BUSCAR TAMBIÉN: sticky form
// ----------------------------------------------------------------------------------------------
// <?php $nombre=$_POST["nombre"] ?? ""; ?>
// <form method="post"><input name="nombre" value="<?php echo htmlspecialchars($nombre, ENT_QUOTES, 'UTF-8'); ?>"><button>Enviar</button></form>

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 173: Escapar / Sanear salida de formulario con htmlspecialchars()
// BUSCAR TAMBIÉN: seguridad salida
// ----------------------------------------------------------------------------------------------
if (false) {
    $nombre=$_POST["nombre"] ?? ""; echo htmlspecialchars($nombre, ENT_QUOTES, "UTF-8");
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 174: Validar / Comprobar email con filter_var()
// BUSCAR TAMBIÉN: email válido
// ----------------------------------------------------------------------------------------------
if (false) {
    $correo=$_POST["correo"] ?? ""; if(filter_var($correo,FILTER_VALIDATE_EMAIL)){echo "Válido";} else {echo "Inválido";}
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 175: Crear / Leer campo Nombre (text) por POST
// BUSCAR TAMBIÉN: POST nombre, input text
// ----------------------------------------------------------------------------------------------
// <form method="post">
// <label>Nombre: <input type="text" name="nombre"></label>
// <button type="submit">Enviar</button>
// </form>
// <?php
// $nombre = $_POST["nombre"] ?? "";
// echo $nombre;
// ?>

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 176: Crear / Leer campo Apellidos (text) por POST
// BUSCAR TAMBIÉN: POST apellidos, input text
// ----------------------------------------------------------------------------------------------
// <form method="post">
// <label>Apellidos: <input type="text" name="apellidos"></label>
// <button type="submit">Enviar</button>
// </form>
// <?php
// $apellidos = $_POST["apellidos"] ?? "";
// echo $apellidos;
// ?>

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 177: Crear / Leer campo Edad (number) por POST
// BUSCAR TAMBIÉN: POST edad, input number
// ----------------------------------------------------------------------------------------------
// <form method="post">
// <label>Edad: <input type="number" name="edad"></label>
// <button type="submit">Enviar</button>
// </form>
// <?php
// $edad = $_POST["edad"] ?? "";
// echo $edad;
// ?>

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 178: Crear / Leer campo Correo (email) por POST
// BUSCAR TAMBIÉN: POST correo, input email
// ----------------------------------------------------------------------------------------------
// <form method="post">
// <label>Correo: <input type="email" name="correo"></label>
// <button type="submit">Enviar</button>
// </form>
// <?php
// $correo = $_POST["correo"] ?? "";
// echo $correo;
// ?>

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 179: Crear / Leer campo Teléfono (text) por POST
// BUSCAR TAMBIÉN: POST telefono, input text
// ----------------------------------------------------------------------------------------------
// <form method="post">
// <label>Teléfono: <input type="text" name="telefono"></label>
// <button type="submit">Enviar</button>
// </form>
// <?php
// $telefono = $_POST["telefono"] ?? "";
// echo $telefono;
// ?>

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 180: Crear / Leer campo Fecha de nacimiento (date) por POST
// BUSCAR TAMBIÉN: POST fechaNacimiento, input date
// ----------------------------------------------------------------------------------------------
// <form method="post">
// <label>Fecha de nacimiento: <input type="date" name="fechaNacimiento"></label>
// <button type="submit">Enviar</button>
// </form>
// <?php
// $fechaNacimiento = $_POST["fechaNacimiento"] ?? "";
// echo $fechaNacimiento;
// ?>


/* ============================================================================================== */
/* SECCIÓN ULTRA: RECETAS / ALGORITMOS TÍPICOS DE EXAMEN */
/* ============================================================================================== */

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 181: Comprobar / Saber si número es par
// BUSCAR TAMBIÉN: par impar
// ----------------------------------------------------------------------------------------------
if (false) {
    $n=14; echo ($n%2===0)?"Par":"Impar";
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 182: Comprobar / Saber si número es múltiplo de otro
// BUSCAR TAMBIÉN: divisible
// ----------------------------------------------------------------------------------------------
if (false) {
    $n=21; $d=7; echo ($n%$d===0)?"Múltiplo":"No múltiplo";
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 183: Clasificar / Saber si número es positivo negativo o cero
// BUSCAR TAMBIÉN: signo
// ----------------------------------------------------------------------------------------------
if (false) {
    $n=-8; if($n>0){echo "Positivo";} elseif($n<0){echo "Negativo";} else{echo "Cero";}
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 184: Calcular / Obtener mayor de dos números
// BUSCAR TAMBIÉN: máximo dos
// ----------------------------------------------------------------------------------------------
if (false) {
    $a=12;$b=9; if($a>$b){echo $a;} elseif($b>$a){echo $b;} else{echo "Iguales";}
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 185: Calcular / Obtener mayor de tres sin max()
// BUSCAR TAMBIÉN: máximo tres
// ----------------------------------------------------------------------------------------------
if (false) {
    $a=5;$b=14;$c=9;$mayor=$a;if($b>$mayor){$mayor=$b;}if($c>$mayor){$mayor=$c;}echo $mayor;
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 186: Calcular / Obtener menor de tres sin min()
// BUSCAR TAMBIÉN: mínimo tres
// ----------------------------------------------------------------------------------------------
if (false) {
    $a=5;$b=14;$c=9;$menor=$a;if($b<$menor){$menor=$b;}if($c<$menor){$menor=$c;}echo $menor;
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 187: Acumular / Sumar números del 1 al N
// BUSCAR TAMBIÉN: sumatorio
// ----------------------------------------------------------------------------------------------
if (false) {
    $n=100;$s=0;for($i=1;$i<=$n;$i++){$s+=$i;}echo $s;
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 188: Calcular / Obtener factorial de N
// BUSCAR TAMBIÉN: n!, factorial
// ----------------------------------------------------------------------------------------------
if (false) {
    $n=5;$f=1;for($i=2;$i<=$n;$i++){$f*=$i;}echo $f;
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 189: Generar / Mostrar tabla de multiplicar de un número
// BUSCAR TAMBIÉN: tabla multiplicar
// ----------------------------------------------------------------------------------------------
if (false) {
    $n=7;for($i=1;$i<=10;$i++){echo "$n x $i = ".($n*$i)."<br>";}
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 190: Generar / Mostrar todas las tablas con dos for
// BUSCAR TAMBIÉN: for anidado multiplicar
// ----------------------------------------------------------------------------------------------
if (false) {
    for($t=1;$t<=5;$t++){for($m=1;$m<=10;$m++){echo "$t x $m = ".($t*$m)."<br>";}}
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 191: Contar / Calcular cuántos pares hay en array
// BUSCAR TAMBIÉN: contador pares
// ----------------------------------------------------------------------------------------------
if (false) {
    $nums=[2,7,8,11,14];$c=0;foreach($nums as $n){if($n%2===0){$c++;}}echo $c;
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 192: Sumar / Acumular valores de array manualmente
// BUSCAR TAMBIÉN: sumar array manual
// ----------------------------------------------------------------------------------------------
if (false) {
    $nums=[3,6,9];$s=0;foreach($nums as $n){$s+=$n;}echo $s;
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 193: Calcular / Obtener media de array
// BUSCAR TAMBIÉN: promedio
// ----------------------------------------------------------------------------------------------
if (false) {
    $notas=[7,8,5,10];$s=0;foreach($notas as $n){$s+=$n;}if(count($notas)>0){echo $s/count($notas);}
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 194: Buscar / Encontrar valor en array manualmente
// BUSCAR TAMBIÉN: búsqueda secuencial
// ----------------------------------------------------------------------------------------------
if (false) {
    $nums=[4,8,15,16,23,42];$bus=15;$ok=false;foreach($nums as $n){if($n===$bus){$ok=true;break;}}echo $ok?"Encontrado":"No";
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 195: Contar / Calcular apariciones de un valor
// BUSCAR TAMBIÉN: frecuencia
// ----------------------------------------------------------------------------------------------
if (false) {
    $nums=[2,5,2,8,2,9];$bus=2;$veces=0;foreach($nums as $n){if($n===$bus){$veces++;}}echo $veces;
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 196: Obtener / Calcular máximo de array sin max()
// BUSCAR TAMBIÉN: mayor manual
// ----------------------------------------------------------------------------------------------
if (false) {
    $nums=[6,2,19,4,11];$m=$nums[0];foreach($nums as $n){if($n>$m){$m=$n;}}echo $m;
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 197: Obtener / Calcular mínimo de array sin min()
// BUSCAR TAMBIÉN: menor manual
// ----------------------------------------------------------------------------------------------
if (false) {
    $nums=[6,2,19,4,11];$m=$nums[0];foreach($nums as $n){if($n<$m){$m=$n;}}echo $m;
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 198: Comprobar / Saber si número es primo
// BUSCAR TAMBIÉN: primalidad
// ----------------------------------------------------------------------------------------------
if (false) {
    $n=29;$primo=$n>1;for($i=2;$i*$i<=$n && $primo;$i++){if($n%$i===0){$primo=false;}}echo $primo?"Primo":"No primo";
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 199: Generar / Mostrar números primos hasta N
// BUSCAR TAMBIÉN: lista primos
// ----------------------------------------------------------------------------------------------
if (false) {
    $lim=30;for($n=2;$n<=$lim;$n++){$p=true;for($d=2;$d*$d<=$n;$d++){if($n%$d===0){$p=false;break;}}if($p){echo "$n ";}}
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 200: Generar / Mostrar serie Fibonacci
// BUSCAR TAMBIÉN: 0 1 1 2 3
// ----------------------------------------------------------------------------------------------
if (false) {
    $cant=10;$a=0;$b=1;for($i=1;$i<=$cant;$i++){echo "$a ";$sig=$a+$b;$a=$b;$b=$sig;}
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 201: Invertir / Dar vuelta a string manualmente
// BUSCAR TAMBIÉN: reverse manual
// ----------------------------------------------------------------------------------------------
if (false) {
    $txt="servidor";$inv="";for($i=strlen($txt)-1;$i>=0;$i--){$inv.=$txt[$i];}echo $inv;
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 202: Contar / Calcular vocales de una cadena
// BUSCAR TAMBIÉN: vocales
// ----------------------------------------------------------------------------------------------
if (false) {
    $txt=strtolower("Desarrollo Web");$c=0;for($i=0;$i<strlen($txt);$i++){if(in_array($txt[$i],["a","e","i","o","u"],true)){$c++;}}echo $c;
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 203: Comprobar / Saber si palabra es palíndromo
// BUSCAR TAMBIÉN: capicúa string
// ----------------------------------------------------------------------------------------------
if (false) {
    $p="reconocer";echo ($p===strrev($p))?"Palíndromo":"No";
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 204: Generar / Resolver FizzBuzz
// BUSCAR TAMBIÉN: múltiplos 3 5
// ----------------------------------------------------------------------------------------------
if (false) {
    for($i=1;$i<=100;$i++){if($i%15===0){echo "FizzBuzz";}elseif($i%3===0){echo "Fizz";}elseif($i%5===0){echo "Buzz";}else{echo $i;}echo "<br>";}
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 205: Filtrar / Mostrar solo pares de array
// BUSCAR TAMBIÉN: seleccionar pares
// ----------------------------------------------------------------------------------------------
if (false) {
    $nums=[1,2,3,4,5,6];foreach($nums as $n){if($n%2===0){echo "$n ";}}
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 206: Filtrar / Crear nuevo array solo con pares
// BUSCAR TAMBIÉN: array filtrado
// ----------------------------------------------------------------------------------------------
if (false) {
    $nums=[1,2,3,4,5,6];$pares=[];foreach($nums as $n){if($n%2===0){$pares[]=$n;}}print_r($pares);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 207: Transformar / Crear nuevo array duplicando valores
// BUSCAR TAMBIÉN: map manual
// ----------------------------------------------------------------------------------------------
if (false) {
    $nums=[1,2,3,4];$dobles=[];foreach($nums as $n){$dobles[]=$n*2;}print_r($dobles);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 208: Separar / Clasificar valores en pares e impares
// BUSCAR TAMBIÉN: clasificar arrays
// ----------------------------------------------------------------------------------------------
if (false) {
    $nums=[1,2,3,4,5,6];$pares=[];$impares=[];foreach($nums as $n){if($n%2===0){$pares[]=$n;}else{$impares[]=$n;}}print_r($pares);print_r($impares);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 209: Contar / Agrupar frecuencia de valores en array
// BUSCAR TAMBIÉN: histograma frecuencia
// ----------------------------------------------------------------------------------------------
if (false) {
    $frutas=["pera","manzana","pera","uva","pera"];$c=[];foreach($frutas as $f){if(isset($c[$f])){$c[$f]++;}else{$c[$f]=1;}}print_r($c);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 210: Contar / Calcular cantidad de positivos en un array
// BUSCAR TAMBIÉN: contador positivos
// ----------------------------------------------------------------------------------------------
if (false) {
    $numeros=[-5,0,2,7,12,21,-3,10];
    $contador=0;
    foreach($numeros as $n){
        if($n > 0){$contador++;}
    }
    echo $contador;
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 211: Sumar / Acumular solamente los valores positivos de un array
// BUSCAR TAMBIÉN: acumulador positivos
// ----------------------------------------------------------------------------------------------
if (false) {
    $numeros=[-5,0,2,7,12,21,-3,10];
    $suma=0;
    foreach($numeros as $n){
        if($n > 0){$suma+=$n;}
    }
    echo $suma;
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 212: Contar / Calcular cantidad de negativos en un array
// BUSCAR TAMBIÉN: contador negativos
// ----------------------------------------------------------------------------------------------
if (false) {
    $numeros=[-5,0,2,7,12,21,-3,10];
    $contador=0;
    foreach($numeros as $n){
        if($n < 0){$contador++;}
    }
    echo $contador;
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 213: Sumar / Acumular solamente los valores negativos de un array
// BUSCAR TAMBIÉN: acumulador negativos
// ----------------------------------------------------------------------------------------------
if (false) {
    $numeros=[-5,0,2,7,12,21,-3,10];
    $suma=0;
    foreach($numeros as $n){
        if($n < 0){$suma+=$n;}
    }
    echo $suma;
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 214: Contar / Calcular cantidad de ceros en un array
// BUSCAR TAMBIÉN: contador ceros
// ----------------------------------------------------------------------------------------------
if (false) {
    $numeros=[-5,0,2,7,12,21,-3,10];
    $contador=0;
    foreach($numeros as $n){
        if($n === 0){$contador++;}
    }
    echo $contador;
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 215: Sumar / Acumular solamente los valores ceros de un array
// BUSCAR TAMBIÉN: acumulador ceros
// ----------------------------------------------------------------------------------------------
if (false) {
    $numeros=[-5,0,2,7,12,21,-3,10];
    $suma=0;
    foreach($numeros as $n){
        if($n === 0){$suma+=$n;}
    }
    echo $suma;
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 216: Contar / Calcular cantidad de pares en un array
// BUSCAR TAMBIÉN: contador pares
// ----------------------------------------------------------------------------------------------
if (false) {
    $numeros=[-5,0,2,7,12,21,-3,10];
    $contador=0;
    foreach($numeros as $n){
        if($n % 2 === 0){$contador++;}
    }
    echo $contador;
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 217: Sumar / Acumular solamente los valores pares de un array
// BUSCAR TAMBIÉN: acumulador pares
// ----------------------------------------------------------------------------------------------
if (false) {
    $numeros=[-5,0,2,7,12,21,-3,10];
    $suma=0;
    foreach($numeros as $n){
        if($n % 2 === 0){$suma+=$n;}
    }
    echo $suma;
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 218: Contar / Calcular cantidad de impares en un array
// BUSCAR TAMBIÉN: contador impares
// ----------------------------------------------------------------------------------------------
if (false) {
    $numeros=[-5,0,2,7,12,21,-3,10];
    $contador=0;
    foreach($numeros as $n){
        if($n % 2 !== 0){$contador++;}
    }
    echo $contador;
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 219: Sumar / Acumular solamente los valores impares de un array
// BUSCAR TAMBIÉN: acumulador impares
// ----------------------------------------------------------------------------------------------
if (false) {
    $numeros=[-5,0,2,7,12,21,-3,10];
    $suma=0;
    foreach($numeros as $n){
        if($n % 2 !== 0){$suma+=$n;}
    }
    echo $suma;
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 220: Contar / Calcular cantidad de mayores que 10 en un array
// BUSCAR TAMBIÉN: contador mayores que 10
// ----------------------------------------------------------------------------------------------
if (false) {
    $numeros=[-5,0,2,7,12,21,-3,10];
    $contador=0;
    foreach($numeros as $n){
        if($n > 10){$contador++;}
    }
    echo $contador;
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 221: Sumar / Acumular solamente los valores mayores que 10 de un array
// BUSCAR TAMBIÉN: acumulador mayores que 10
// ----------------------------------------------------------------------------------------------
if (false) {
    $numeros=[-5,0,2,7,12,21,-3,10];
    $suma=0;
    foreach($numeros as $n){
        if($n > 10){$suma+=$n;}
    }
    echo $suma;
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 222: Contar / Calcular cantidad de entre 5 y 20 en un array
// BUSCAR TAMBIÉN: contador entre 5 y 20
// ----------------------------------------------------------------------------------------------
if (false) {
    $numeros=[-5,0,2,7,12,21,-3,10];
    $contador=0;
    foreach($numeros as $n){
        if($n >= 5 && $n <= 20){$contador++;}
    }
    echo $contador;
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 223: Sumar / Acumular solamente los valores entre 5 y 20 de un array
// BUSCAR TAMBIÉN: acumulador entre 5 y 20
// ----------------------------------------------------------------------------------------------
if (false) {
    $numeros=[-5,0,2,7,12,21,-3,10];
    $suma=0;
    foreach($numeros as $n){
        if($n >= 5 && $n <= 20){$suma+=$n;}
    }
    echo $suma;
}


/* ============================================================================================== */
/* SECCIÓN ULTRA: VALIDACIONES, NÚMEROS, REDONDEO, FECHAS Y UTILIDADES */
/* ============================================================================================== */

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 224: Validar / Comprobar número dentro de rango
// BUSCAR TAMBIÉN: mínimo máximo
// ----------------------------------------------------------------------------------------------
if (false) {
    $edad=25;if($edad>=18 && $edad<=65){echo "Dentro";}else{echo "Fuera";}
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 225: Validar / Comprobar texto no vacío después de trim()
// BUSCAR TAMBIÉN: campo obligatorio
// ----------------------------------------------------------------------------------------------
if (false) {
    $nombre=trim("   Ana   ");if($nombre===""){echo "Vacío";}else{echo "Correcto";}
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 226: Validar / Comprobar longitud mínima de string
// BUSCAR TAMBIÉN: mínimo caracteres
// ----------------------------------------------------------------------------------------------
if (false) {
    $clave="abcdef";if(strlen($clave)>=6){echo "Válida";}
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 227: Validar / Comprobar dos valores iguales estrictamente
// BUSCAR TAMBIÉN: confirmar contraseña
// ----------------------------------------------------------------------------------------------
if (false) {
    $a="1234";$b="1234";echo ($a===$b)?"Coinciden":"No";
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 228: Evitar / Prevenir división entre cero
// BUSCAR TAMBIÉN: divisor cero
// ----------------------------------------------------------------------------------------------
if (false) {
    $a=10;$b=0;if($b!==0){echo $a/$b;}else{echo "No se puede";}
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 229: Evitar / Prevenir media de array vacío
// BUSCAR TAMBIÉN: array vacío
// ----------------------------------------------------------------------------------------------
if (false) {
    $nums=[];if(count($nums)>0){echo array_sum($nums)/count($nums);}else{echo "Sin datos";}
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 230: Redondear / Aproximar decimal con round()
// BUSCAR TAMBIÉN: redondeo
// ----------------------------------------------------------------------------------------------
if (false) {
    $x=3.14159;echo round($x,2);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 231: Redondear hacia abajo con floor()
// BUSCAR TAMBIÉN: suelo
// ----------------------------------------------------------------------------------------------
if (false) {
    echo floor(3.9);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 232: Redondear hacia arriba con ceil()
// BUSCAR TAMBIÉN: techo
// ----------------------------------------------------------------------------------------------
if (false) {
    echo ceil(3.1);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 233: Obtener valor absoluto con abs()
// BUSCAR TAMBIÉN: quitar signo
// ----------------------------------------------------------------------------------------------
if (false) {
    echo abs(-25);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 234: Calcular raíz cuadrada con sqrt()
// BUSCAR TAMBIÉN: raíz
// ----------------------------------------------------------------------------------------------
if (false) {
    echo sqrt(81);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 235: Generar / Obtener entero aleatorio con random_int()
// BUSCAR TAMBIÉN: random
// ----------------------------------------------------------------------------------------------
if (false) {
    echo random_int(1,100);
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 236: Obtener / Mostrar fecha actual con date()
// BUSCAR TAMBIÉN: fecha
// ----------------------------------------------------------------------------------------------
if (false) {
    echo date("d/m/Y");
}

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 237: Obtener / Mostrar hora actual con date()
// BUSCAR TAMBIÉN: hora
// ----------------------------------------------------------------------------------------------
if (false) {
    echo date("H:i:s");
}


/* ============================================================================================== */
/* SECCIÓN ULTRA: ERRORES TÍPICOS / TRAMPAS / DIFERENCIAS QUE DAN FALLOS */
/* ============================================================================================== */

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 238: Error típico: usar = al querer comparar
// BUSCAR TAMBIÉN: fallo, trampa, examen
// ----------------------------------------------------------------------------------------------
// MAL: if ($x = 5)  asigna 5.
// BIEN: if ($x == 5) compara valor.
// MEJOR si procede: if ($x === 5) compara valor y tipo.

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 239: Error típico: usar + para concatenar
// BUSCAR TAMBIÉN: fallo, trampa, examen
// ----------------------------------------------------------------------------------------------
// MAL: "Hola " + $nombre
// BIEN: "Hola " . $nombre

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 240: Error típico: < frente a <= en for
// BUSCAR TAMBIÉN: fallo, trampa, examen
// ----------------------------------------------------------------------------------------------
// for($i=1;$i<5;$i++) -> 1,2,3,4
// for($i=1;$i<=5;$i++) -> 1,2,3,4,5

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 241: Error típico: arrays indexados empiezan en 0
// BUSCAR TAMBIÉN: fallo, trampa, examen
// ----------------------------------------------------------------------------------------------
// $a=["A","B","C"]; $a[0] es A, $a[1] es B, $a[2] es C.

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 242: Error típico: olvidar break en switch
// BUSCAR TAMBIÉN: fallo, trampa, examen
// ----------------------------------------------------------------------------------------------
// Sin break puede seguir ejecutando los siguientes case.

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 243: Error típico: confundir GET y POST
// BUSCAR TAMBIÉN: fallo, trampa, examen
// ----------------------------------------------------------------------------------------------
// <form method="get"> usa $_GET. <form method="post"> usa $_POST.

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 244: Error típico: input sin name no llega a PHP
// BUSCAR TAMBIÉN: fallo, trampa, examen
// ----------------------------------------------------------------------------------------------
// <input type="text" name="usuario"> produce $_POST["usuario"] o $_GET["usuario"].

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 245: Error típico: checkbox no marcado no se envía
// BUSCAR TAMBIÉN: fallo, trampa, examen
// ----------------------------------------------------------------------------------------------
// Comprueba isset($_POST["acepta"]).

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 246: Error típico: cerrar mal una celda HTML
// BUSCAR TAMBIÉN: fallo, trampa, examen
// ----------------------------------------------------------------------------------------------
// BIEN: <td>dato</td>. MAL: <td>dato<td>.

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 247: Error típico: olvidar incrementar while
// BUSCAR TAMBIÉN: fallo, trampa, examen
// ----------------------------------------------------------------------------------------------
// Si $i nunca cambia y la condición sigue siendo true, creas un bucle infinito.

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 248: Error típico: dividir entre cero
// BUSCAR TAMBIÉN: fallo, trampa, examen
// ----------------------------------------------------------------------------------------------
// Comprueba el divisor antes de usar /.

// ----------------------------------------------------------------------------------------------
// CASO ULTRA 249: Error típico: calcular media de array vacío
// BUSCAR TAMBIÉN: fallo, trampa, examen
// ----------------------------------------------------------------------------------------------
// Comprueba count($array) > 0 antes de dividir por count($array).


/* ============================================================================================== */
/* SECCIÓN ULTRA: CHULETA FINAL: SI TE PIDEN X, BUSCA / USA Y */
/* ============================================================================================== */

/*
Repetir N veces                      -> for
Repetir mientras                     -> while
Ejecutar al menos una vez            -> do...while
Recorrer array                       -> foreach
Recorrer índice y valor              -> foreach ($a as $i => $v)
Dos dimensiones                      -> dos for / dos foreach anidados
Comparar rangos                      -> if / elseif / else
Comparar valores exactos             -> switch
Par / impar                          -> % 2
Múltiplo                             -> % divisor === 0
Acumular                             -> variable suma +=
Contar casos                         -> contador++
Buscar valor                         -> foreach + if + break
Máximo manual                        -> variable mayor
Mínimo manual                        -> variable menor
Media                                -> suma / count
Añadir array                         -> [] o array_push
Borrar array                         -> unset / array_pop / array_shift
Asociativo                           -> clave => valor
Multidimensional                     -> array de arrays
Formulario GET                       -> $_GET
Formulario POST                      -> $_POST
Comprobar existencia                 -> isset
Valor por defecto                    -> ??
Concatenar                           -> .
Igual valor y tipo                   -> ===
Tabla HTML                           -> table + tr + td + bucles
Tabla multiplicar                    -> dos for anidados
*/

/* TOTAL DE CASOS ULTRA AÑADIDOS: 249 */

