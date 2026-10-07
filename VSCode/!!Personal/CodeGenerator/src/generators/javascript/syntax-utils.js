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
        String(value ?? "")
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


function validateReferencePath(
    value,
    description = "Referencia"
) {
    const reference =
        String(value ?? "")
            .trim();

    if (!reference) {
        throw new Error(
            `${description} no puede estar vacía.`
        );
    }

    const parts =
        reference.split(".");

    if (
        parts[0] === "this"
    ) {
        if (
            parts.length === 1
        ) {
            return "this";
        }

        for (
            let i = 1;
            i < parts.length;
            i += 1
        ) {
            validateIdentifier(
                parts[i],
                description
            );
        }

        return reference;
    }

    for (
        const part
        of parts
    ) {
        validateIdentifier(
            part,
            description
        );
    }

    return reference;
}


function indent(level) {
    return "    ".repeat(level);
}


function literalToCode(value) {
    if (
        value === undefined
    ) {
        return "undefined";
    }

    if (
        typeof value === "number"
    ) {
        if (
            !Number.isFinite(value)
        ) {
            throw new Error(
                "No se pueden generar números no finitos."
            );
        }

        return String(value);
    }

    if (
        typeof value === "boolean" ||
        value === null ||
        typeof value === "string"
    ) {
        return JSON.stringify(
            value
        );
    }

    throw new Error(
        "El valor literal indicado no es compatible todavía."
    );
}


module.exports = {
    validateIdentifier,
    validateReferencePath,
    indent,
    literalToCode
};