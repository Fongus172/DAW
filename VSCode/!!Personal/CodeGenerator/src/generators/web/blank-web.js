function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


const metadata = {

    id: "blank-web",

    name: "Proyecto web básico",

    description:
        "Genera una estructura web sencilla con los lenguajes seleccionados.",

    supportedLanguages: [
        "html",
        "css",
        "js",
        "php"
    ],

    requiredLanguages: [],

    options: [

        {
            id: "title",
            label: "Título de la página",
            type: "text",
            default: "Mi proyecto"
        },

        {
            id: "heading",
            label: "Encabezado principal",
            type: "text",
            default: "Hola mundo"
        },

        {
            id: "backgroundColor",
            label: "Color de fondo",
            type: "text",
            default: "#f4f4f4"
        }

    ]
};


function generate({
    projectName,
    languages,
    options
}) {

    const files = {};


    const title =
        escapeHtml(
            options.title ||
            projectName
        );


    const heading =
        escapeHtml(
            options.heading ||
            "Hola mundo"
        );


    const backgroundColor =
        options.backgroundColor ||
        "#f4f4f4";


    if (
        languages.includes("html")
    ) {

        files["index.html"] =
            `<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>${title}</title>
${languages.includes("css")
                ? '    <link rel="stylesheet" href="styles.css">'
                : ""}
</head>

<body>

    <main>
        <h1>${heading}</h1>

        <p>
            Proyecto generado automáticamente.
        </p>
    </main>

${languages.includes("js")
                ? '    <script src="app.js"></script>'
                : ""}

</body>

</html>
`;
    }


    if (
        languages.includes("css")
    ) {

        files["styles.css"] =
            `* {
    box-sizing: border-box;
}

body {
    margin: 0;
    padding: 40px;

    font-family:
        Arial,
        Helvetica,
        sans-serif;

    background-color: ${backgroundColor};
    color: #222;
}

main {
    max-width: 900px;
    margin: 0 auto;
}
`;
    }


    if (
        languages.includes("js")
    ) {

        files["app.js"] =
            `document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "Proyecto '${projectName}' cargado correctamente."
        );

    }
);
`;
    }


    if (
        languages.includes("php")
    ) {

        files["index.php"] =
            `<?php

$projectName = ${JSON.stringify(projectName)};

?>
<!DOCTYPE html>

<html lang="es">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>${title}</title>

</head>

<body>

    <h1>${heading}</h1>

    <p>
        Proyecto PHP generado automáticamente.
    </p>

    <p>
        Proyecto:
        <?php echo htmlspecialchars($projectName); ?>
    </p>

</body>

</html>
`;
    }


    return files;
}


module.exports = {
    metadata,
    generate
};