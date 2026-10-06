const path = require("path");

const {
    getTemplate
} = require("./registry");

const {
    writeProjectFiles
} = require("./file-writer");


const VALID_LANGUAGES = [
    "html",
    "css",
    "js",
    "php"
];


function validateProjectName(projectName) {

    if (
        typeof projectName !== "string" ||
        projectName.trim() === ""
    ) {

        throw new Error(
            "Debes indicar un nombre para el proyecto."
        );
    }


    const trimmed =
        projectName.trim();


    /*
        Caracteres problemáticos especialmente
        en Windows.
    */
    const invalidCharacters =
        /[<>:"/\\|?*\u0000-\u001F]/;


    if (
        invalidCharacters.test(trimmed)
    ) {

        throw new Error(
            "El nombre del proyecto contiene caracteres no permitidos."
        );
    }


    if (
        trimmed.endsWith(".") ||
        trimmed.endsWith(" ")
    ) {

        throw new Error(
            "El nombre del proyecto no puede terminar en punto o espacio."
        );
    }


    if (
        trimmed === "." ||
        trimmed === ".."
    ) {

        throw new Error(
            "Nombre de proyecto no permitido."
        );
    }


    return trimmed;
}


function normalizeLanguages(languages) {

    if (!Array.isArray(languages)) {

        throw new Error(
            "La lista de lenguajes no es válida."
        );
    }


    const normalized = [
        ...new Set(
            languages.map(
                language =>
                    String(language)
                        .toLowerCase()
                        .trim()
            )
        )
    ];


    for (const language of normalized) {

        if (
            !VALID_LANGUAGES.includes(language)
        ) {

            throw new Error(
                `Lenguaje no reconocido: ${language}`
            );
        }
    }


    if (normalized.length === 0) {

        throw new Error(
            "Selecciona al menos un lenguaje."
        );
    }


    return normalized;
}


async function generateProject(configuration) {

    if (
        !configuration ||
        typeof configuration !== "object"
    ) {

        throw new Error(
            "Configuración incorrecta."
        );
    }


    const projectName =
        validateProjectName(
            configuration.projectName
        );


    if (
        typeof configuration.basePath !== "string" ||
        configuration.basePath.trim() === ""
    ) {

        throw new Error(
            "Debes indicar una ruta de destino."
        );
    }


    const basePath =
        path.resolve(
            configuration.basePath.trim()
        );


    const languages =
        normalizeLanguages(
            configuration.languages
        );


    const template =
        getTemplate(
            configuration.templateId
        );


    if (!template) {

        throw new Error(
            "La plantilla seleccionada no existe."
        );
    }


    const metadata =
        template.metadata;


    for (const language of languages) {

        if (
            !metadata.supportedLanguages
                .includes(language)
        ) {

            throw new Error(
                `La plantilla "${metadata.name}" ` +
                `no admite ${language.toUpperCase()}.`
            );
        }
    }


    for (
        const requiredLanguage
        of metadata.requiredLanguages
    ) {

        if (
            !languages.includes(
                requiredLanguage
            )
        ) {

            throw new Error(
                `La plantilla requiere ` +
                `${requiredLanguage.toUpperCase()}.`
            );
        }
    }


    const projectDirectory =
        path.join(
            basePath,
            projectName
        );


    const generatedFiles =
        template.generate({
            projectName,
            languages,
            options:
                configuration.options || {}
        });


    const writtenFiles =
        await writeProjectFiles(
            projectDirectory,
            generatedFiles,
            configuration.overwrite === true
        );


    return {
        projectName,
        projectDirectory,
        template:
            metadata.name,
        languages,
        files:
            writtenFiles
    };
}


module.exports = {
    generateProject
};