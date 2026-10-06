const {
    generateClass
} = require(
    "../javascript/class-generator"
);


const metadata = {

    id:
        "custom-project",

    name:
        "Proyecto personalizado",

    description:
        "Construye un proyecto desde cero eligiendo su estructura y sus clases.",

    supportedLanguages: [
        "html",
        "css",
        "js"
    ],

    requiredLanguages: [],

    options: [

        {
            id:
                "pageTitle",

            label:
                "Título de la página",

            type:
                "text",

            default:
                "Mi proyecto"
        },

        {
            id:
                "classes",

            label:
                "Clases JavaScript",

            type:
                "classes",

            default:
                []
        }

    ]

};


function escapeHtml(value) {

    return String(value)
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );
}


function normalizeClasses(
    classes
) {

    if (
        !Array.isArray(classes)
    ) {

        return [];
    }


    return classes.filter(
        definition => {

            return (
                definition &&
                typeof definition ===
                "object" &&
                String(
                    definition.name || ""
                ).trim() !== ""
            );

        }
    );
}


function generate({
    projectName,
    languages,
    options
}) {

    const files = {};


    const title =
        escapeHtml(
            options.pageTitle ||
            projectName
        );


    const classes =
        normalizeClasses(
            options.classes
        );


    if (
        classes.length > 0 &&
        !languages.includes("js")
    ) {

        throw new Error(
            "Has creado clases JavaScript, pero JavaScript no está seleccionado."
        );
    }


    if (
        languages.includes(
            "html"
        )
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

    <main class="container">

        <h1>${title}</h1>

        <div id="app"></div>

    </main>

${languages.includes("js")
                ? `    <script
        type="module"
        src="js/app.js"
    ></script>`
                : ""}

</body>

</html>
`;
    }


    if (
        languages.includes(
            "css"
        )
    ) {

        files["styles.css"] =
            `* {
    box-sizing: border-box;
}

body {
    margin: 0;

    font-family:
        Arial,
        Helvetica,
        sans-serif;

    background: #f3f4f6;
    color: #1f2937;
}

.container {
    width: min(1100px, 92%);
    margin: 0 auto;
    padding: 40px 0;
}
`;
    }


    if (
        languages.includes(
            "js"
        )
    ) {

        files["js/app.js"] =
            `/*
    Punto de entrada del proyecto.

    Las clases creadas desde Code Generator
    se encuentran en:

    js/classes/
*/

console.log(
    "Proyecto ${projectName} iniciado."
);
`;
    }


    for (
        const classDefinition
        of classes
    ) {

        const code =
            generateClass(
                classDefinition
            );


        files[
            `js/classes/${classDefinition.name}.js`
        ] = code;
    }


    return files;
}


module.exports = {
    metadata,
    generate
};