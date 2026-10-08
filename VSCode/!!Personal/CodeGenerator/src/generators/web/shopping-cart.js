const metadata = {

    id: "shopping-cart",

    name: "Carrito de la compra",

    description:
        "Genera un carrito completo con POO, DOM, eventos, API y cálculo automático del total.",

    supportedLanguages: [
        "html",
        "css",
        "js"
    ],

    requiredLanguages: [
        "html",
        "js"
    ],

    automaticClasses: [
        "Carrito"
    ],

    options: [

        {
            id: "title",
            label: "Nombre de la tienda",
            type: "text",
            default: "agoodshop"
        },

        {
            id: "currency",
            label: "Moneda",
            type: "select",
            default: "€",

            choices: [
                {
                    value: "€",
                    label: "Euro (€)"
                },
                {
                    value: "$",
                    label: "Dólar ($)"
                },
                {
                    value: "£",
                    label: "Libra (£)"
                }
            ]
        },

        {
            id: "apiMode",
            label: "Origen de los productos",
            type: "select",
            default: "local",

            choices: [
                {
                    value: "local",
                    label: "API local generada automáticamente"
                },
                {
                    value: "external",
                    label: "API externa / JSONBlob"
                }
            ]
        },

        {
            id: "apiUrl",
            label: "URL de API externa (solo se usa si eliges API externa)",
            type: "text",
            default: ""
        },

        {
            id: "serverPort",
            label: "Puerto del proyecto generado",
            type: "number",
            default: 3001
        },

        {
            id: "products",
            label: "Productos",
            type: "products",

            default: [

                {
                    sku: "0K3QOSOV4V",
                    title: "iFhone 13 Pro",
                    price: 938.99
                },

                {
                    sku: "TGD5XORY1L",
                    title: "Cargador",
                    price: 49.99
                },

                {
                    sku: "IOKW9BQ9F3",
                    title: "Funda de piel",
                    price: 79.99
                }

            ]
        },

        {
            id: "classes",
            label: "Clases adicionales",
            type: "classes",
            default: []
        }

    ]
};


const JAVASCRIPT_RESERVED_WORDS = new Set([
    "break",
    "case",
    "catch",
    "class",
    "const",
    "continue",
    "debugger",
    "default",
    "delete",
    "do",
    "else",
    "export",
    "extends",
    "finally",
    "for",
    "function",
    "if",
    "import",
    "in",
    "instanceof",
    "let",
    "new",
    "return",
    "super",
    "switch",
    "this",
    "throw",
    "try",
    "typeof",
    "var",
    "void",
    "while",
    "with",
    "yield",
    "await",
    "enum",
    "implements",
    "interface",
    "package",
    "private",
    "protected",
    "public",
    "static"
]);


/*
    ---------------------------
    FUNCIONES DE VALIDACIÓN
    ---------------------------
*/


function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function validateIdentifier(
    value,
    description
) {

    const identifier =
        String(value || "").trim();


    if (!identifier) {

        throw new Error(
            `${description} no puede estar vacío.`
        );
    }


    if (
        !/^[A-Za-z_$][A-Za-z0-9_$]*$/
            .test(identifier)
    ) {

        throw new Error(
            `${description} "${identifier}" no es un identificador JavaScript válido.`
        );
    }


    if (
        JAVASCRIPT_RESERVED_WORDS
            .has(identifier)
    ) {

        throw new Error(
            `${description} "${identifier}" es una palabra reservada de JavaScript.`
        );
    }


    return identifier;
}


function normalizeProducts(products) {

    if (
        !Array.isArray(products) ||
        products.length === 0
    ) {

        throw new Error(
            "Debes crear al menos un producto."
        );
    }


    const usedSkus =
        new Set();


    return products.map(
        (product, index) => {

            const sku =
                String(
                    product.sku ||
                    ""
                ).trim();


            const title =
                String(
                    product.title ||
                    ""
                ).trim();


            const price =
                Number(
                    product.price
                );


            if (!sku) {

                throw new Error(
                    `El producto ${index + 1} necesita un SKU.`
                );
            }


            if (
                usedSkus.has(sku)
            ) {

                throw new Error(
                    `El SKU "${sku}" está repetido.`
                );
            }


            usedSkus.add(sku);


            if (!title) {

                throw new Error(
                    `El producto ${index + 1} necesita un nombre.`
                );
            }


            if (
                !Number.isFinite(price) ||
                price < 0
            ) {

                throw new Error(
                    `El precio de "${title}" no es válido.`
                );
            }


            return {
                sku,
                title,
                price:
                    Number(
                        price.toFixed(2)
                    )
            };
        }
    );
}


function normalizeClasses(classes) {

    if (!Array.isArray(classes)) {
        return [];
    }


    const normalized =
        [];


    const usedNames =
        new Set();


    for (
        const rawClass
        of classes
    ) {

        if (
            !rawClass ||
            typeof rawClass !== "object"
        ) {

            continue;
        }


        const rawName =
            String(
                rawClass.name || ""
            ).trim();


        const rawAttributes =
            Array.isArray(
                rawClass.attributes
            )
                ? rawClass.attributes
                : [];


        /*
            Si el usuario añadió una fila de clase
            pero no escribió absolutamente nada,
            simplemente la ignoramos.
        */
        if (
            !rawName &&
            rawAttributes.length === 0
        ) {

            continue;
        }


        const name =
            validateIdentifier(
                rawName,
                "El nombre de la clase"
            );


        /*
            Carrito está reservada porque esta
            plantilla necesita una implementación
            especial que satisfaga el ejercicio.
        */
        if (
            name.toLowerCase() ===
            "carrito"
        ) {

            throw new Error(
                'La clase "Carrito" se genera automáticamente porque es obligatoria para esta plantilla.'
            );
        }


        if (
            usedNames.has(name)
        ) {

            throw new Error(
                `La clase "${name}" aparece más de una vez.`
            );
        }


        usedNames.add(name);


        const usedAttributes =
            new Set();


        const attributes =
            [];


        for (
            const rawAttribute
            of rawAttributes
        ) {

            const trimmed =
                String(
                    rawAttribute || ""
                ).trim();


            if (!trimmed) {
                continue;
            }


            const attribute =
                validateIdentifier(
                    trimmed,
                    `Atributo de ${name}`
                );


            if (
                usedAttributes.has(
                    attribute
                )
            ) {

                continue;
            }


            usedAttributes.add(
                attribute
            );


            attributes.push(
                attribute
            );
        }


        normalized.push({

            name,

            attributes,

            generateAccessors:
                rawClass.generateAccessors === true

        });
    }


    return normalized;
}


function normalizePort(value) {

    const port =
        Number(value);


    if (
        !Number.isInteger(port) ||
        port < 1024 ||
        port > 65535
    ) {

        throw new Error(
            "El puerto debe ser un número entero entre 1024 y 65535."
        );
    }


    return port;
}


function createPackageName(
    projectName
) {

    const normalized =
        String(projectName)
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .toLowerCase()
            .replace(
                /[^a-z0-9-_]+/g,
                "-"
            )
            .replace(
                /^-+|-+$/g,
                ""
            );


    return (
        normalized ||
        "generated-shopping-cart"
    );
}


/*
    ---------------------------
    GENERACIÓN DE CLASES
    ---------------------------
*/


function capitalize(value) {

    if (!value) {
        return value;
    }


    return (
        value.charAt(0)
            .toUpperCase() +
        value.slice(1)
    );
}


function generateGenericClass(
    definition
) {

    const {
        name,
        attributes,
        generateAccessors
    } = definition;


    const parameters =
        attributes.join(", ");


    const assignments =
        attributes.length === 0

            ? "        // Sin atributos configurados."

            : attributes
                .map(
                    attribute =>
                        `        this.${attribute} = ${attribute};`
                )
                .join("\n");


    const jsonContent =
        attributes.length === 0

            ? "        return {};"

            : [
                "        return {",

                attributes
                    .map(
                        attribute =>
                            `            ${attribute}: this.${attribute}`
                    )
                    .join(",\n"),

                "        };"
            ]
                .join("\n");


    let accessors =
        "";


    if (
        generateAccessors &&
        attributes.length > 0
    ) {

        accessors =
            "\n\n" +

            attributes
                .map(
                    attribute => {

                        const suffix =
                            capitalize(
                                attribute
                            );


                        return [
                            `    get${suffix}() {`,
                            `        return this.${attribute};`,
                            "    }",
                            "",
                            `    set${suffix}(value) {`,
                            `        this.${attribute} = value;`,
                            "        return this;",
                            "    }"
                        ]
                            .join("\n");

                    }
                )
                .join("\n\n");
    }


    return [
        `export default class ${name} {`,
        "",
        `    constructor(${parameters}) {`,
        assignments,
        "    }",
        accessors,
        "",
        "    toJSON() {",
        jsonContent,
        "    }",
        "}",
        ""
    ]
        .join("\n");
}


function generateCarritoClass() {

    return `export default class Carrito {

    constructor(productos, currency = "€") {

        if (!Array.isArray(productos)) {
            throw new Error(
                "Carrito necesita un array de productos."
            );
        }


        this.currency = currency;


        this.productos =
            productos.map(
                producto => {

                    return {

                        sku:
                            String(
                                producto.SKU ??
                                producto.sku ??
                                ""
                            ),

                        title:
                            String(
                                producto.title ??
                                ""
                            ),

                        price:
                            Number(
                                producto.price
                            ),

                        quantity: 0

                    };

                }
            );
    }


    actualizarUnidades(
        sku,
        unidades
    ) {

        const producto =
            this.productos.find(
                producto =>
                    producto.sku === sku
            );


        if (!producto) {

            throw new Error(
                "No existe ningún producto con SKU " +
                sku
            );
        }


        const cantidad =
            Number(unidades);


        if (
            !Number.isInteger(cantidad) ||
            cantidad < 0
        ) {

            throw new Error(
                "Las unidades deben ser un número entero igual o mayor que 0."
            );
        }


        producto.quantity =
            cantidad;


        return (
            this.obtenerInformacionProducto(
                sku
            )
        );
    }


    obtenerInformacionProducto(
        sku
    ) {

        const producto =
            this.productos.find(
                producto =>
                    producto.sku === sku
            );


        if (!producto) {
            return null;
        }


        return {
            sku:
                producto.sku,

            title:
                producto.title,

            price:
                producto.price,

            quantity:
                producto.quantity
        };
    }


    obtenerProductos() {

        return this.productos.map(
            producto => {

                return {
                    sku:
                        producto.sku,

                    title:
                        producto.title,

                    price:
                        producto.price,

                    quantity:
                        producto.quantity
                };

            }
        );
    }


    obtenerCarrito() {

        const products =
            this.productos

                .filter(
                    producto =>
                        producto.quantity > 0
                )

                .map(
                    producto => {

                        return {

                            sku:
                                producto.sku,

                            title:
                                producto.title,

                            price:
                                producto.price,

                            quantity:
                                producto.quantity,

                            subtotal:
                                Number(
                                    (
                                        producto.price *
                                        producto.quantity
                                    )
                                    .toFixed(2)
                                )

                        };

                    }
                );


        const total =
            products.reduce(
                (
                    acumulado,
                    producto
                ) => {

                    return (
                        acumulado +
                        producto.subtotal
                    );

                },
                0
            );


        return {

            total:
                total.toFixed(2),

            currency:
                this.currency,

            products

        };
    }

}
`;
}


/*
    ---------------------------
    API DEL CLIENTE
    ---------------------------
*/


function generateApiClient(
    apiUrl
) {

    return `const API_URL =
    ${JSON.stringify(apiUrl)};


export async function cargarCatalogo() {

    const response =
        await fetch(
            API_URL
        );


    if (!response.ok) {

        throw new Error(
            "La API ha respondido con el estado " +
            response.status
        );
    }


    const data =
        await response.json();


    if (
        !data ||
        !Array.isArray(
            data.products
        )
    ) {

        throw new Error(
            "La respuesta de la API no tiene el formato esperado."
        );
    }


    return data;
}
`;
}


/*
    ---------------------------
    APLICACIÓN DEL CARRITO
    ---------------------------
*/


function generateApplication() {

    return `import Carrito
    from "./classes/carrito.js";

import {
    cargarCatalogo
} from "./api.js";


const productsElement =
    document.getElementById(
        "products"
    );


const cartProductsElement =
    document.getElementById(
        "cart-products"
    );


const totalElement =
    document.getElementById(
        "total"
    );


const statusElement =
    document.getElementById(
        "status"
    );


let carrito = null;


function formatPrice(
    price,
    currency
) {

    return (
        Number(price)
            .toFixed(2) +
        " " +
        currency
    );
}


function createButton(
    text,
    className,
    action
) {

    const button =
        document.createElement(
            "button"
        );


    button.type =
        "button";


    button.textContent =
        text;


    button.className =
        className;


    button.addEventListener(
        "click",
        action
    );


    return button;
}


function cambiarCantidad(
    sku,
    quantity
) {

    try {

        const normalizedQuantity =
            Math.max(
                0,
                Number(quantity)
            );


        carrito.actualizarUnidades(
            sku,
            normalizedQuantity
        );


        render();

    } catch (error) {

        mostrarError(
            error.message
        );
    }
}


function renderProductos() {

    productsElement.replaceChildren();


    const products =
        carrito.obtenerProductos();


    for (
        const product
        of products
    ) {

        const article =
            document.createElement(
                "article"
            );


        article.className =
            "product";


        const information =
            document.createElement(
                "div"
            );


        information.className =
            "product-information";


        const title =
            document.createElement(
                "h3"
            );


        title.textContent =
            product.title;


        const sku =
            document.createElement(
                "p"
            );


        sku.className =
            "sku";


        sku.textContent =
            "SKU: " +
            product.sku;


        const price =
            document.createElement(
                "p"
            );


        price.className =
            "price";


        price.textContent =
            formatPrice(
                product.price,
                carrito.currency
            );


        information.append(
            title,
            sku,
            price
        );


        const controls =
            document.createElement(
                "div"
            );


        controls.className =
            "quantity-controls";


        const decreaseButton =
            createButton(
                "-",
                "quantity-button",
                () => {

                    cambiarCantidad(
                        product.sku,
                        product.quantity - 1
                    );

                }
            );


        const input =
            document.createElement(
                "input"
            );


        input.type =
            "number";


        input.min =
            "0";


        input.step =
            "1";


        input.value =
            product.quantity;


        input.setAttribute(
            "aria-label",
            "Unidades de " +
            product.title
        );


        input.addEventListener(
            "change",
            () => {

                cambiarCantidad(
                    product.sku,
                    input.value
                );

            }
        );


        const increaseButton =
            createButton(
                "+",
                "quantity-button",
                () => {

                    cambiarCantidad(
                        product.sku,
                        product.quantity + 1
                    );

                }
            );


        controls.append(
            decreaseButton,
            input,
            increaseButton
        );


        article.append(
            information,
            controls
        );


        productsElement.appendChild(
            article
        );
    }
}


function renderCarrito() {

    const information =
        carrito.obtenerCarrito();


    cartProductsElement
        .replaceChildren();


    if (
        information.products
            .length === 0
    ) {

        const empty =
            document.createElement(
                "p"
            );


        empty.className =
            "empty-cart";


        empty.textContent =
            "Todavía no has añadido productos.";


        cartProductsElement
            .appendChild(
                empty
            );

    } else {

        for (
            const product
            of information.products
        ) {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "cart-product";


            const description =
                document.createElement(
                    "span"
                );


            description.textContent =
                product.title +
                " × " +
                product.quantity;


            const subtotal =
                document.createElement(
                    "strong"
                );


            subtotal.textContent =
                formatPrice(
                    product.subtotal,
                    information.currency
                );


            row.append(
                description,
                subtotal
            );


            cartProductsElement
                .appendChild(
                    row
                );
        }
    }


    totalElement.textContent =
        formatPrice(
            information.total,
            information.currency
        );
}


function render() {

    renderProductos();

    renderCarrito();
}


function mostrarError(
    message
) {

    statusElement.hidden =
        false;


    statusElement.className =
        "status error";


    statusElement.textContent =
        message;
}


async function iniciar() {

    try {

        statusElement.hidden =
            false;


        statusElement.className =
            "status";


        statusElement.textContent =
            "Cargando productos desde la API...";


        const data =
            await cargarCatalogo();


        carrito =
            new Carrito(
                data.products,
                data.currency
            );


        statusElement.hidden =
            true;


        render();

    } catch (error) {

        mostrarError(
            "No se pudo iniciar la tienda: " +
            error.message
        );

        console.error(error);
    }
}


iniciar();
`;
}


/*
    ---------------------------
    SERVIDOR / API
    ---------------------------
*/


function generateServer(
    port,
    localApi
) {

    const apiRoute =
        localApi

            ? `
        /*
            API de productos generada
            automáticamente por Code Generator.
        */
        if (
            req.method === "GET" &&
            url.pathname === "/api/products"
        ) {

            try {

                const productsPath =
                    path.join(
                        ROOT,
                        "data",
                        "products.json"
                    );


                const products =
                    await fs.readFile(
                        productsPath
                    );


                res.writeHead(
                    200,
                    {
                        "Content-Type":
                            "application/json; charset=utf-8",

                        "Cache-Control":
                            "no-store"
                    }
                );


                res.end(
                    products
                );

            } catch (error) {

                sendJson(
                    res,
                    500,
                    {
                        error:
                            "No se pudieron cargar los productos."
                    }
                );
            }


            return;
        }
`

            : "";


    return `const http =
    require("http");

const fs =
    require("fs/promises");

const path =
    require("path");

const {
    URL
} = require("url");


const HOST =
    "127.0.0.1";

const PORT =
    ${port};

const ROOT =
    __dirname;


function sendJson(
    res,
    statusCode,
    data
) {

    const body =
        JSON.stringify(
            data,
            null,
            2
        );


    res.writeHead(
        statusCode,
        {
            "Content-Type":
                "application/json; charset=utf-8"
        }
    );


    res.end(
        body
    );
}


function getMimeType(
    filePath
) {

    const extension =
        path.extname(
            filePath
        )
        .toLowerCase();


    const types = {

        ".html":
            "text/html; charset=utf-8",

        ".css":
            "text/css; charset=utf-8",

        ".js":
            "text/javascript; charset=utf-8",

        ".json":
            "application/json; charset=utf-8"

    };


    return (
        types[extension] ||
        "application/octet-stream"
    );
}


async function serveFile(
    pathname,
    res
) {

    let requested =
        decodeURIComponent(
            pathname
        );


    if (
        requested === "/"
    ) {

        requested =
            "/index.html";
    }


    const filePath =
        path.resolve(
            ROOT,
            "." + requested
        );


    if (
        filePath !== ROOT &&
        !filePath.startsWith(
            ROOT + path.sep
        )
    ) {

        sendJson(
            res,
            403,
            {
                error:
                    "Acceso denegado."
            }
        );

        return;
    }


    try {

        const content =
            await fs.readFile(
                filePath
            );


        res.writeHead(
            200,
            {
                "Content-Type":
                    getMimeType(
                        filePath
                    )
            }
        );


        res.end(
            content
        );

    } catch (error) {

        if (
            error.code ===
            "ENOENT"
        ) {

            sendJson(
                res,
                404,
                {
                    error:
                        "Archivo no encontrado."
                }
            );

            return;
        }


        throw error;
    }
}


const server =
    http.createServer(
        async (
            req,
            res
        ) => {

            try {

                const url =
                    new URL(
                        req.url,
                        "http://" +
                        req.headers.host
                    );

${apiRoute}

                if (
                    req.method === "GET"
                ) {

                    await serveFile(
                        url.pathname,
                        res
                    );

                    return;
                }


                sendJson(
                    res,
                    405,
                    {
                        error:
                            "Método no permitido."
                    }
                );

            } catch (error) {

                console.error(
                    error
                );


                sendJson(
                    res,
                    500,
                    {
                        error:
                            "Error interno del servidor."
                    }
                );
            }

        }
    );


server.listen(
    PORT,
    HOST,
    () => {

        console.log("");
        console.log(
            "Proyecto iniciado correctamente."
        );

        console.log(
            "http://" +
            HOST +
            ":" +
            PORT
        );

        console.log("");
    }
);
`;
}


/*
    ---------------------------
    HTML
    ---------------------------
*/


function generateHtml(
    title,
    useCss
) {

    const safeTitle =
        escapeHtml(title);


    return `<!DOCTYPE html>
<html lang="es">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>${safeTitle}</title>

${useCss
            ? '    <link rel="stylesheet" href="styles.css">'
            : ""}

</head>

<body>

    <header class="main-header">

        <div class="container">

            <h1>
                ${safeTitle}
            </h1>

            <p>
                Carrito de la compra
            </p>

        </div>

    </header>


    <main class="container layout">

        <section>

            <h2>
                Productos
            </h2>


            <div
                id="status"
                class="status"
            >
                Cargando...
            </div>


            <div
                id="products"
                class="products"
            ></div>

        </section>


        <aside class="cart">

            <h2>
                Tu carrito
            </h2>


            <div
                id="cart-products"
            ></div>


            <div class="total-row">

                <span>
                    TOTAL
                </span>

                <strong id="total">
                    0.00
                </strong>

            </div>

        </aside>

    </main>


    <script
        type="module"
        src="js/app.js"
    ></script>

</body>

</html>
`;
}


/*
    ---------------------------
    CSS
    ---------------------------
*/


function generateCss() {

    return `* {
    box-sizing: border-box;
}


body {
    margin: 0;

    font-family:
        Arial,
        Helvetica,
        sans-serif;

    background:
        #f4f6f8;

    color:
        #20242a;
}


.container {
    width:
        min(
            1100px,
            92%
        );

    margin:
        0 auto;
}


.main-header {
    padding:
        28px 0;

    background:
        #1f2937;

    color:
        white;
}


.main-header h1 {
    margin:
        0 0 5px;
}


.main-header p {
    margin:
        0;

    color:
        #d1d5db;
}


.layout {
    display:
        grid;

    grid-template-columns:
        minmax(0, 2fr)
        minmax(280px, 1fr);

    gap:
        35px;

    padding-top:
        35px;

    padding-bottom:
        35px;
}


.products {
    display:
        grid;

    gap:
        15px;
}


.product {
    display:
        flex;

    justify-content:
        space-between;

    gap:
        20px;

    align-items:
        center;

    padding:
        20px;

    border-radius:
        10px;

    background:
        white;

    box-shadow:
        0 3px 12px
        rgba(
            0,
            0,
            0,
            0.08
        );
}


.product h3 {
    margin:
        0 0 8px;
}


.sku {
    margin:
        0 0 8px;

    color:
        #6b7280;

    font-size:
        0.9rem;
}


.price {
    margin:
        0;

    font-weight:
        bold;
}


.quantity-controls {
    display:
        flex;

    align-items:
        center;

    gap:
        8px;
}


.quantity-controls input {
    width:
        65px;

    padding:
        8px;

    text-align:
        center;

    border:
        1px solid #cbd5e1;

    border-radius:
        6px;
}


.quantity-button {
    width:
        38px;

    height:
        38px;

    border:
        none;

    border-radius:
        6px;

    cursor:
        pointer;

    background:
        #2563eb;

    color:
        white;

    font-size:
        1.2rem;
}


.quantity-button:hover {
    background:
        #1d4ed8;
}


.cart {
    align-self:
        start;

    position:
        sticky;

    top:
        20px;

    padding:
        22px;

    border-radius:
        10px;

    background:
        white;

    box-shadow:
        0 3px 12px
        rgba(
            0,
            0,
            0,
            0.08
        );
}


.cart h2 {
    margin-top:
        0;
}


.cart-product {
    display:
        flex;

    justify-content:
        space-between;

    gap:
        15px;

    padding:
        12px 0;

    border-bottom:
        1px solid #e5e7eb;
}


.empty-cart {
    color:
        #6b7280;
}


.total-row {
    display:
        flex;

    justify-content:
        space-between;

    margin-top:
        20px;

    padding-top:
        18px;

    border-top:
        2px solid #d1d5db;

    font-size:
        1.25rem;
}


.status {
    margin-bottom:
        15px;

    padding:
        12px;

    border-radius:
        7px;

    background:
        #e0e7ff;
}


.status.error {
    background:
        #fee2e2;

    color:
        #991b1b;
}


@media (
    max-width: 750px
) {

    .layout {
        grid-template-columns:
            1fr;
    }


    .product {
        align-items:
            flex-start;

        flex-direction:
            column;
    }


    .cart {
        position:
            static;
    }

}
`;
}


/*
    ---------------------------
    GENERACIÓN FINAL
    ---------------------------
*/


function generate({
    projectName,
    languages,
    options
}) {

    const files =
        {};


    const title =
        String(
            options.title ||
            "agoodshop"
        ).trim();


    const currency =
        String(
            options.currency ||
            "€"
        );


    const apiMode =
        options.apiMode ===
            "external"

            ? "external"

            : "local";


    const serverPort =
        normalizePort(
            options.serverPort ??
            3001
        );


    const products =
        normalizeProducts(
            options.products
        );


    const customClasses =
        normalizeClasses(
            options.classes
        );


    let apiUrl;


    if (
        apiMode ===
        "external"
    ) {

        apiUrl =
            String(
                options.apiUrl ||
                ""
            )
                .trim();


        if (!apiUrl) {

            throw new Error(
                "Has seleccionado una API externa, pero no has indicado su URL."
            );
        }

    } else {

        apiUrl =
            "/api/products";
    }


    /*
        HTML
    */

    files["index.html"] =
        generateHtml(
            title,
            languages.includes(
                "css"
            )
        );


    /*
        CSS
    */

    if (
        languages.includes(
            "css"
        )
    ) {

        files["styles.css"] =
            generateCss();
    }


    /*
        Clase obligatoria del ejercicio.
        Se crea siempre automáticamente.
    */

    files[
        "js/classes/carrito.js"
    ] =
        generateCarritoClass();


    /*
        Clases creadas libremente
        por el usuario.
    */

    for (
        const definition
        of customClasses
    ) {

        files[
            `js/classes/${definition.name}.js`
        ] =
            generateGenericClass(
                definition
            );
    }


    /*
        Cliente de API
    */

    files["js/api.js"] =
        generateApiClient(
            apiUrl
        );


    /*
        Manipulación del DOM,
        eventos y representación.
    */

    files["js/app.js"] =
        generateApplication();


    /*
        Si se ha escogido API local,
        generamos también los datos
        utilizados por nuestro endpoint.
    */

    if (
        apiMode ===
        "local"
    ) {

        files[
            "data/products.json"
        ] =
            JSON.stringify(
                {

                    currency,

                    products:
                        products.map(
                            product => {

                                return {

                                    SKU:
                                        product.sku,

                                    title:
                                        product.title,

                                    price:
                                        product.price
                                            .toFixed(2)

                                };

                            }
                        )

                },
                null,
                4
            ) +
            "\n";
    }


    /*
        Servidor local.

        Además de servir la página,
        crea /api/products cuando
        utilizamos la API local.
    */

    files["server.js"] =
        generateServer(
            serverPort,
            apiMode ===
            "local"
        );


    /*
        package.json del proyecto
        generado.
    */

    files["package.json"] =
        JSON.stringify(
            {

                name:
                    createPackageName(
                        projectName
                    ),

                version:
                    "1.0.0",

                private:
                    true,

                scripts: {
                    start:
                        "node server.js"
                }

            },
            null,
            4
        ) +
        "\n";


    /*
        README del proyecto generado.
    */

    files["README.md"] =
        [
            `# ${title}`,
            "",
            "Proyecto de carrito de la compra generado automáticamente.",
            "",
            "Incluye:",
            "",
            "- Clase Carrito independiente del DOM.",
            "- Obtención de productos mediante API.",
            "- Creación dinámica del listado mediante DOM.",
            "- Eventos para modificar unidades.",
            "- Actualización automática del total.",
            "- Servidor local Node.js.",
            "",
            "Para ejecutarlo:",
            "",
            "    node server.js",
            "",
            "Después abre:",
            "",
            `    http://127.0.0.1:${serverPort}`,
            "",
            apiMode === "local"
                ? "Endpoint de la API:"
                : "API configurada:",
            "",
            apiMode === "local"
                ? `    http://127.0.0.1:${serverPort}/api/products`
                : `    ${apiUrl}`,
            ""
        ]
            .join("\n");


    return files;
}


module.exports = {
    metadata,
    generate
};