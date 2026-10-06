const RESERVED_WORDS = new Set([
    "await",
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
    "enum",
    "export",
    "extends",
    "false",
    "finally",
    "for",
    "function",
    "if",
    "implements",
    "import",
    "in",
    "instanceof",
    "interface",
    "let",
    "new",
    "null",
    "package",
    "private",
    "protected",
    "public",
    "return",
    "static",
    "super",
    "switch",
    "this",
    "throw",
    "true",
    "try",
    "typeof",
    "var",
    "void",
    "while",
    "with",
    "yield"
]);


function validateIdentifier(
    value,
    description = "Identificador"
) {

    const identifier =
        String(value || "")
            .trim();


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
            `${description} "${identifier}" no es válido en JavaScript.`
        );
    }


    if (
        RESERVED_WORDS.has(
            identifier
        )
    ) {

        throw new Error(
            `${description} "${identifier}" es una palabra reservada.`
        );
    }


    return identifier;
}


function parseAttributes(
    attributes
) {

    if (!Array.isArray(attributes)) {
        return [];
    }


    const result = [];

    const used =
        new Set();


    for (
        const rawAttribute
        of attributes
    ) {

        const name =
            validateIdentifier(
                rawAttribute,
                "Atributo"
            );


        if (
            used.has(name)
        ) {

            continue;
        }


        used.add(name);

        result.push(name);
    }


    return result;
}


function parseMethods(
    methods
) {

    if (!Array.isArray(methods)) {
        return [];
    }


    return methods.map(
        method => {

            const name =
                validateIdentifier(
                    method.name,
                    "Método"
                );


            const parameters =
                Array.isArray(
                    method.parameters
                )
                    ? method.parameters.map(
                        parameter =>
                            validateIdentifier(
                                parameter,
                                `Parámetro de ${name}`
                            )
                    )
                    : [];


            return {
                name,
                parameters
            };
        }
    );
}


function capitalize(value) {

    return (
        value.charAt(0)
            .toUpperCase() +
        value.slice(1)
    );
}


function generateClass(
    specification
) {

    if (
        !specification ||
        typeof specification !==
        "object"
    ) {

        throw new Error(
            "La especificación de la clase no es válida."
        );
    }


    const className =
        validateIdentifier(
            specification.name,
            "Nombre de clase"
        );


    const attributes =
        parseAttributes(
            specification.attributes
        );


    const methods =
        parseMethods(
            specification.methods
        );


    const constructorParameters =
        attributes.join(", ");


    const constructorBody =
        attributes.length > 0

            ? attributes
                .map(
                    attribute =>
                        `        this.${attribute} = ${attribute};`
                )
                .join("\n")

            : "        // Esta clase no tiene atributos iniciales.";


    const methodBlocks =
        methods.map(
            method => {

                const parameters =
                    method.parameters.join(
                        ", "
                    );


                return `

    ${method.name}(${parameters}) {

        /*
            TODO:
            El comportamiento de este método
            será generado por el motor de acciones.
        */

    }`;

            }
        )
            .join("\n");


    let accessorBlocks = "";


    if (
        specification.generateAccessors ===
        true
    ) {

        accessorBlocks =
            attributes.map(
                attribute => {

                    const suffix =
                        capitalize(
                            attribute
                        );


                    return `

    get${suffix}() {

        return this.${attribute};

    }


    set${suffix}(value) {

        this.${attribute} = value;

        return this;

    }`;

                }
            )
                .join("\n");
    }


    return `export default class ${className} {

    constructor(${constructorParameters}) {

${constructorBody}

    }
${methodBlocks}
${accessorBlocks}

}
`;
}


module.exports = {
    generateClass,
    validateIdentifier
};