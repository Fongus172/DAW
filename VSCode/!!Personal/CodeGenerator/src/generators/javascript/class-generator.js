const {
    validateIdentifier
} = require(
    "./syntax-utils"
);


const {
    generateActions
} = require(
    "./action-generator"
);


// ============================================================
// ATRIBUTOS
// ============================================================

function parseAttributes(
    attributes
) {
    if (
        !Array.isArray(
            attributes
        )
    ) {
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


// ============================================================
// PARÁMETROS
// ============================================================

function parseParameters(
    parameters,
    description
) {
    if (
        !Array.isArray(
            parameters
        )
    ) {
        return [];
    }

    const result = [];

    const used =
        new Set();

    for (
        const rawParameter
        of parameters
    ) {
        const parameter =
            validateIdentifier(
                rawParameter,
                description
            );

        if (
            used.has(parameter)
        ) {
            throw new Error(
                `${description} "${parameter}" está repetido.`
            );
        }

        used.add(
            parameter
        );

        result.push(
            parameter
        );
    }

    return result;
}


// ============================================================
// MÉTODOS
// ============================================================

function parseMethods(
    methods
) {
    if (
        !Array.isArray(
            methods
        )
    ) {
        return [];
    }

    const usedNames =
        new Set();

    return methods.map(
        method => {

            if (
                !method ||
                typeof method !==
                "object"
            ) {
                throw new Error(
                    "Se ha encontrado un método no válido."
                );
            }

            const name =
                validateIdentifier(
                    method.name,
                    "Método"
                );

            if (
                usedNames.has(name)
            ) {
                throw new Error(
                    `El método "${name}" aparece más de una vez en la misma clase.`
                );
            }

            usedNames.add(
                name
            );

            return {
                name,

                parameters:
                    parseParameters(
                        method.parameters,
                        `Parámetro de ${name}`
                    ),

                actions:
                    Array.isArray(
                        method.actions
                    )
                        ? method.actions
                        : [],

                async:
                    method.async ===
                    true
            };
        }
    );
}


// ============================================================
// UTILIDADES
// ============================================================

function capitalize(
    value
) {
    return (
        value.charAt(0)
            .toUpperCase() +
        value.slice(1)
    );
}


// ============================================================
// CONSTRUCTOR
// ============================================================

function generateConstructor(
    specification,
    attributes
) {
    const hasCustomConstructor =
        specification.constructor &&
        typeof specification.constructor ===
        "object";

    const parameters =
        hasCustomConstructor

            ? parseParameters(
                specification
                    .constructor
                    .parameters,
                "Parámetro del constructor"
            )

            : attributes;


    const customActions =
        hasCustomConstructor &&
            Array.isArray(
                specification
                    .constructor
                    .actions
            )

            ? specification
                .constructor
                .actions

            : [];


    let body;


    /*
        Si el usuario ha configurado acciones
        específicas para el constructor,
        usamos el motor de acciones.
    */
    if (
        customActions.length > 0
    ) {
        body =
            generateActions(
                customActions,
                {
                    indentLevel: 2
                }
            );

        /*
            Comportamiento por defecto:
            cada atributo se recibe como parámetro
            y se asigna a this.
        */
    } else if (
        attributes.length > 0
    ) {
        body =
            attributes
                .map(
                    attribute =>
                        `        this.${attribute} = ${attribute};`
                )
                .join("\n");

    } else {
        body =
            "        // Esta clase no tiene atributos iniciales.";
    }


    return (
        `    constructor(` +
        `${parameters.join(", ")}) {\n\n` +
        `${body}\n\n` +
        `    }`
    );
}


// ============================================================
// GENERACIÓN DE MÉTODOS
// ============================================================

function generateMethod(
    method
) {
    const asyncPrefix =
        method.async
            ? "async "
            : "";

    let body;


    /*
        Aquí está el cambio importante.

        Antes todos los métodos acababan
        inevitablemente en TODO.

        Ahora, si tienen acciones, se genera
        automáticamente su implementación.
    */
    if (
        method.actions.length > 0
    ) {
        body =
            generateActions(
                method.actions,
                {
                    indentLevel: 2
                }
            );

    } else {
        body =
            [
                "        /*",
                "            TODO:",
                "            Añade acciones a este método desde Code Generator.",
                "        */"
            ]
                .join("\n");
    }


    return (
        `    ${asyncPrefix}` +
        `${method.name}(` +
        `${method.parameters.join(", ")}) {\n\n` +
        `${body}\n\n` +
        `    }`
    );
}


// ============================================================
// GETTERS Y SETTERS
// ============================================================

function generateAccessors(
    attributes
) {
    return attributes.flatMap(
        attribute => {

            const suffix =
                capitalize(
                    attribute
                );

            return [

                `    get${suffix}() {

        return this.${attribute};

    }`,

                `    set${suffix}(value) {

        this.${attribute} = value;

        return this;

    }`

            ];
        }
    );
}


// ============================================================
// CLASE COMPLETA
// ============================================================

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


    const blocks = [
        generateConstructor(
            specification,
            attributes
        )
    ];


    for (
        const method
        of methods
    ) {
        blocks.push(
            generateMethod(
                method
            )
        );
    }


    if (
        specification
            .generateAccessors ===
        true
    ) {
        blocks.push(
            ...generateAccessors(
                attributes
            )
        );
    }


    return (
        `export default class ${className} {\n\n` +
        `${blocks.join("\n\n\n")}\n\n` +
        `}\n`
    );
}


module.exports = {
    generateClass,
    validateIdentifier
};