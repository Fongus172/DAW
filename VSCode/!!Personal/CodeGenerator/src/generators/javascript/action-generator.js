const {
    validateIdentifier,
    validateReferencePath,
    indent,
    literalToCode
} = require(
    "./syntax-utils"
);


const BINARY_OPERATORS =
    new Set([
        "+",
        "-",
        "*",
        "/",
        "%",
        "===",
        "!==",
        "==",
        "!=",
        ">",
        ">=",
        "<",
        "<=",
        "&&",
        "||",
        "??"
    ]);


const UNARY_OPERATORS =
    new Set([
        "!",
        "-",
        "+",
        "typeof"
    ]);


const DECLARATION_KINDS =
    new Set([
        "const",
        "let"
    ]);


// ============================================================
// EXPRESIONES
// ============================================================

function generateExpression(
    expression
) {
    if (
        expression === undefined
    ) {
        return "undefined";
    }

    /*
        Si recibimos directamente un valor
        primitivo, se interpreta como literal.
    */
    if (
        expression === null ||
        typeof expression === "string" ||
        typeof expression === "number" ||
        typeof expression === "boolean"
    ) {
        return literalToCode(
            expression
        );
    }

    if (
        typeof expression !==
        "object"
    ) {
        throw new Error(
            "La expresión indicada no es válida."
        );
    }


    switch (
    expression.type
    ) {
        case "literal":
            return literalToCode(
                expression.value
            );


        case "reference":
            return validateReferencePath(
                expression.value,
                "Referencia"
            );


        case "binary":
            return generateBinaryExpression(
                expression
            );


        case "unary":
            return generateUnaryExpression(
                expression
            );


        case "object":
            return generateObjectExpression(
                expression
            );


        case "array":
            return generateArrayExpression(
                expression
            );


        case "call":
            return generateCallExpression(
                expression
            );


        default:
            throw new Error(
                `Tipo de expresión no compatible: ${expression.type ||
                "desconocido"
                }`
            );
    }
}


function generateBinaryExpression(
    expression
) {
    if (
        !BINARY_OPERATORS.has(
            expression.operator
        )
    ) {
        throw new Error(
            `Operador binario no permitido: ${expression.operator}`
        );
    }

    const left =
        generateExpression(
            expression.left
        );

    const right =
        generateExpression(
            expression.right
        );

    return (
        `(${left} ` +
        `${expression.operator} ` +
        `${right})`
    );
}


function generateUnaryExpression(
    expression
) {
    if (
        !UNARY_OPERATORS.has(
            expression.operator
        )
    ) {
        throw new Error(
            `Operador unario no permitido: ${expression.operator}`
        );
    }

    const value =
        generateExpression(
            expression.value
        );

    const separator =
        expression.operator ===
            "typeof"
            ? " "
            : "";

    return (
        `(${expression.operator}` +
        `${separator}` +
        `${value})`
    );
}


function generateObjectExpression(
    expression
) {
    const properties =
        Array.isArray(
            expression.properties
        )
            ? expression.properties
            : [];

    if (
        properties.length === 0
    ) {
        return "{}";
    }

    const generated =
        properties.map(
            property => {

                const key =
                    validateIdentifier(
                        property.key,
                        "Propiedad del objeto"
                    );

                const value =
                    generateExpression(
                        property.value
                    );

                return (
                    `${key}: ${value}`
                );
            }
        );

    return (
        `{ ${generated.join(", ")} }`
    );
}


function generateArrayExpression(
    expression
) {
    const items =
        Array.isArray(
            expression.items
        )
            ? expression.items
            : [];

    return (
        "[" +
        items
            .map(
                generateExpression
            )
            .join(", ") +
        "]"
    );
}


function generateCallExpression(
    expression
) {
    const callee =
        validateReferencePath(
            expression.callee,
            "Función o método"
        );

    const args =
        Array.isArray(
            expression.arguments
        )
            ? expression.arguments
            : [];

    return (
        `${callee}(` +
        args
            .map(
                generateExpression
            )
            .join(", ") +
        ")"
    );
}


// ============================================================
// ACCIONES
// ============================================================

function generateActions(
    actions,
    options = {}
) {
    if (
        !Array.isArray(actions)
    ) {
        return "";
    }

    const indentLevel =
        Number.isInteger(
            options.indentLevel
        )
            ? options.indentLevel
            : 2;

    return actions
        .map(
            action =>
                generateAction(
                    action,
                    indentLevel
                )
        )
        .filter(Boolean)
        .join("\n\n");
}


function generateAction(
    action,
    indentLevel
) {
    if (
        !action ||
        typeof action !==
        "object"
    ) {
        throw new Error(
            "Se ha encontrado una acción no válida."
        );
    }

    switch (
    action.type
    ) {
        case "declare":
            return generateDeclareAction(
                action,
                indentLevel
            );


        case "assign":
            return generateAssignAction(
                action,
                indentLevel
            );


        case "find":
            return generateFindAction(
                action,
                indentLevel
            );


        case "filter":
            return generateFilterAction(
                action,
                indentLevel
            );


        case "sum":
            return generateSumAction(
                action,
                indentLevel
            );


        case "push":
            return generatePushAction(
                action,
                indentLevel
            );


        case "call":
            return generateCallAction(
                action,
                indentLevel
            );


        case "if":
            return generateIfAction(
                action,
                indentLevel
            );


        case "return":
            return generateReturnAction(
                action,
                indentLevel
            );


        default:
            throw new Error(
                `Tipo de acción no compatible: ${action.type ||
                "desconocido"
                }`
            );
    }
}


// ============================================================
// DECLARACIONES
// ============================================================

function normalizeDeclarationKind(
    kind
) {
    const normalized =
        kind ||
        "const";

    if (
        !DECLARATION_KINDS.has(
            normalized
        )
    ) {
        throw new Error(
            `Tipo de declaración no permitido: ${normalized}`
        );
    }

    return normalized;
}


function generateDeclareAction(
    action,
    indentLevel
) {
    const kind =
        normalizeDeclarationKind(
            action.kind
        );

    const name =
        validateIdentifier(
            action.name,
            "Variable"
        );

    const value =
        generateExpression(
            action.value
        );

    return (
        `${indent(indentLevel)}` +
        `${kind} ${name} = ` +
        `${value};`
    );
}


// ============================================================
// ASIGNACIONES
// ============================================================

function generateAssignAction(
    action,
    indentLevel
) {
    const target =
        validateReferencePath(
            action.target,
            "Destino de la asignación"
        );

    const value =
        generateExpression(
            action.value
        );

    return (
        `${indent(indentLevel)}` +
        `${target} = ${value};`
    );
}


// ============================================================
// BÚSQUEDA
// ============================================================

function generateFindAction(
    action,
    indentLevel
) {
    const kind =
        normalizeDeclarationKind(
            action.kind
        );

    const saveAs =
        validateIdentifier(
            action.saveAs,
            "Variable de resultado"
        );

    const collection =
        generateExpression(
            action.collection
        );

    const itemName =
        validateIdentifier(
            action.itemName ||
            "item",
            "Variable del elemento"
        );

    const condition =
        generateExpression(
            action.condition
        );

    return (
        `${indent(indentLevel)}` +
        `${kind} ${saveAs} = ` +
        `${collection}.find(\n` +

        `${indent(indentLevel + 1)}` +
        `${itemName} => ${condition}\n` +

        `${indent(indentLevel)});`
    );
}


// ============================================================
// FILTRADO
// ============================================================

function generateFilterAction(
    action,
    indentLevel
) {
    const kind =
        normalizeDeclarationKind(
            action.kind
        );

    const saveAs =
        validateIdentifier(
            action.saveAs,
            "Variable de resultado"
        );

    const collection =
        generateExpression(
            action.collection
        );

    const itemName =
        validateIdentifier(
            action.itemName ||
            "item",
            "Variable del elemento"
        );

    const condition =
        generateExpression(
            action.condition
        );

    return (
        `${indent(indentLevel)}` +
        `${kind} ${saveAs} = ` +
        `${collection}.filter(\n` +

        `${indent(indentLevel + 1)}` +
        `${itemName} => ${condition}\n` +

        `${indent(indentLevel)});`
    );
}


// ============================================================
// SUMA DE COLECCIONES
// ============================================================

function generateSumAction(
    action,
    indentLevel
) {
    const kind =
        normalizeDeclarationKind(
            action.kind
        );

    const saveAs =
        validateIdentifier(
            action.saveAs,
            "Variable de resultado"
        );

    const collection =
        generateExpression(
            action.collection
        );

    const itemName =
        validateIdentifier(
            action.itemName ||
            "item",
            "Variable del elemento"
        );

    const accumulatorName =
        validateIdentifier(
            action.accumulatorName ||
            "total",
            "Variable acumuladora"
        );

    const value =
        generateExpression(
            action.value
        );

    const initialValue =
        generateExpression(
            action.initialValue ===
                undefined
                ? {
                    type:
                        "literal",

                    value:
                        0
                }
                : action.initialValue
        );

    return (
        `${indent(indentLevel)}` +
        `${kind} ${saveAs} = ` +
        `${collection}.reduce(\n` +

        `${indent(indentLevel + 1)}` +
        `(${accumulatorName}, ${itemName}) => ` +
        `${accumulatorName} + ${value},\n` +

        `${indent(indentLevel + 1)}` +
        `${initialValue}\n` +

        `${indent(indentLevel)});`
    );
}


// ============================================================
// AÑADIR A ARRAY
// ============================================================

function generatePushAction(
    action,
    indentLevel
) {
    const collection =
        validateReferencePath(
            action.collection,
            "Colección"
        );

    const value =
        generateExpression(
            action.value
        );

    return (
        `${indent(indentLevel)}` +
        `${collection}.push(${value});`
    );
}


// ============================================================
// LLAMADAS A FUNCIONES O MÉTODOS
// ============================================================

function generateCallAction(
    action,
    indentLevel
) {
    const callCode =
        generateCallExpression({
            type:
                "call",

            callee:
                action.callee,

            arguments:
                action.arguments
        });

    if (
        !action.saveAs
    ) {
        return (
            `${indent(indentLevel)}` +
            `${callCode};`
        );
    }

    const kind =
        normalizeDeclarationKind(
            action.kind
        );

    const saveAs =
        validateIdentifier(
            action.saveAs,
            "Variable de resultado"
        );

    return (
        `${indent(indentLevel)}` +
        `${kind} ${saveAs} = ` +
        `${callCode};`
    );
}


// ============================================================
// CONDICIONALES
// ============================================================

function generateIfAction(
    action,
    indentLevel
) {
    const condition =
        generateExpression(
            action.condition
        );

    const thenActions =
        Array.isArray(
            action.then
        )
            ? action.then
            : [];

    const elseActions =
        Array.isArray(
            action.else
        )
            ? action.else
            : [];

    const thenCode =
        generateActions(
            thenActions,
            {
                indentLevel:
                    indentLevel + 1
            }
        );

    let code =
        `${indent(indentLevel)}` +
        `if (${condition}) {`;

    if (
        thenCode
    ) {
        code +=
            `\n\n${thenCode}\n`;
    } else {
        code += "\n";
    }

    code +=
        `${indent(indentLevel)}}`;

    if (
        elseActions.length > 0
    ) {
        const elseCode =
            generateActions(
                elseActions,
                {
                    indentLevel:
                        indentLevel + 1
                }
            );

        code +=
            " else {";

        if (
            elseCode
        ) {
            code +=
                `\n\n${elseCode}\n`;
        } else {
            code +=
                "\n";
        }

        code +=
            `${indent(indentLevel)}}`;
    }

    return code;
}


// ============================================================
// RETURN
// ============================================================

function generateReturnAction(
    action,
    indentLevel
) {
    if (
        action.value ===
        undefined
    ) {
        return (
            `${indent(indentLevel)}` +
            "return;"
        );
    }

    return (
        `${indent(indentLevel)}` +
        `return ${generateExpression(
            action.value
        )};`
    );
}


module.exports = {
    generateActions,
    generateAction,
    generateExpression
};