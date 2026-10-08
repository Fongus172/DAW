const form = document.getElementById("generator-form");
const basePathInput = document.getElementById("base-path");
const projectNameInput = document.getElementById("project-name");
const templateSelect = document.getElementById("template");
const templateInformation = document.getElementById("template-information");
const templateOptions = document.getElementById("template-options");
const overwriteCheckbox = document.getElementById("overwrite");
const result = document.getElementById("result");

const languageCheckboxes = [
    ...document.querySelectorAll(
        "#languages input[type='checkbox']"
    )
];

let templates = [];
let idCounter = 0;


// ============================================================
// UTILIDADES
// ============================================================

function nextId(prefix = "field") {
    idCounter += 1;
    return `${prefix}-${idCounter}`;
}


function splitCommaSeparatedValues(value) {
    return String(value || "")
        .split(",")
        .map(value => value.trim())
        .filter(Boolean);
}


function createButton(text, className, action) {
    const button = document.createElement("button");

    button.type = "button";
    button.textContent = text;
    button.className = className;

    button.addEventListener(
        "click",
        action
    );

    return button;
}


function createField(
    labelText,
    options = {}
) {
    const label =
        document.createElement(
            "label"
        );

    const title =
        document.createElement(
            "span"
        );

    const input =
        document.createElement(
            "input"
        );

    title.textContent =
        labelText;

    input.type =
        options.type ||
        "text";

    input.value =
        options.value ??
        "";

    if (
        options.placeholder
    ) {
        input.placeholder =
            options.placeholder;
    }

    if (
        options.step !==
        undefined
    ) {
        input.step =
            String(
                options.step
            );
    }

    if (
        options.min !==
        undefined
    ) {
        input.min =
            String(
                options.min
            );
    }

    if (
        options.data
    ) {
        Object.entries(
            options.data
        ).forEach(
            ([key, value]) => {
                input.dataset[key] =
                    value;
            }
        );
    }

    label.append(
        title,
        input
    );

    return {
        wrapper:
            label,

        input
    };
}


function createSelect(
    labelText,
    choices,
    selectedValue = ""
) {
    const label =
        document.createElement(
            "label"
        );

    const title =
        document.createElement(
            "span"
        );

    const select =
        document.createElement(
            "select"
        );

    title.textContent =
        labelText;

    choices.forEach(
        choice => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                choice.value;

            option.textContent =
                choice.label;

            option.selected =
                choice.value ===
                selectedValue;

            select.appendChild(
                option
            );
        }
    );

    label.append(
        title,
        select
    );

    return {
        wrapper:
            label,

        select
    };
}


function moveElement(
    element,
    direction
) {
    if (
        direction ===
        "up"
    ) {
        const previous =
            element
                .previousElementSibling;

        if (
            previous
        ) {
            element
                .parentElement
                .insertBefore(
                    element,
                    previous
                );
        }

        return;
    }

    const next =
        element
            .nextElementSibling;

    if (
        next
    ) {
        element
            .parentElement
            .insertBefore(
                next,
                element
            );
    }
}


function getSelectedLanguages() {
    return languageCheckboxes
        .filter(
            checkbox =>
                checkbox.checked
        )
        .map(
            checkbox =>
                checkbox.value
        );
}


// ============================================================
// PLANTILLAS
// ============================================================

async function loadTemplates() {
    try {
        const response =
            await fetch(
                "/api/templates"
            );

        if (
            !response.ok
        ) {
            throw new Error(
                "No se pudieron cargar las plantillas."
            );
        }

        templates =
            await response.json();

        populateTemplateSelect();

    } catch (error) {
        showError(
            error.message
        );
    }
}


function getCurrentTemplate() {
    return templates.find(
        template =>
            template.id ===
            templateSelect.value
    );
}


function releaseLanguageLocks() {
    languageCheckboxes.forEach(
        checkbox => {
            checkbox.disabled =
                false;
        }
    );
}


function enforceRequiredLanguages(
    template
) {
    releaseLanguageLocks();

    const requiredLanguages =
        Array.isArray(
            template
                .requiredLanguages
        )
            ? template
                .requiredLanguages
            : [];

    requiredLanguages.forEach(
        language => {

            const checkbox =
                languageCheckboxes
                    .find(
                        current =>
                            current.value ===
                            language
                    );

            if (
                checkbox
            ) {
                checkbox.checked =
                    true;

                checkbox.disabled =
                    true;
            }
        }
    );
}


function populateTemplateSelect() {
    releaseLanguageLocks();

    const previous =
        templateSelect.value;

    const selectedLanguages =
        getSelectedLanguages();

    const compatibleTemplates =
        templates.filter(
            template => {

                const supported =
                    Array.isArray(
                        template
                            .supportedLanguages
                    )
                        ? template
                            .supportedLanguages
                        : [];

                return selectedLanguages
                    .every(
                        language =>
                            supported
                                .includes(
                                    language
                                )
                    );
            }
        );

    templateSelect
        .replaceChildren();

    if (
        compatibleTemplates
            .length === 0
    ) {
        const option =
            document.createElement(
                "option"
            );

        option.value =
            "";

        option.textContent =
            "No existen plantillas compatibles";

        templateSelect
            .appendChild(
                option
            );

        templateSelect.disabled =
            true;

        templateInformation
            .textContent =
            "La combinación de lenguajes seleccionada todavía no tiene ninguna plantilla.";

        templateOptions
            .replaceChildren();

        return;
    }

    templateSelect.disabled =
        false;

    compatibleTemplates
        .forEach(
            template => {

                const option =
                    document
                        .createElement(
                            "option"
                        );

                option.value =
                    template.id;

                option.textContent =
                    template.name;

                templateSelect
                    .appendChild(
                        option
                    );
            }
        );

    if (
        compatibleTemplates
            .some(
                template =>
                    template.id ===
                    previous
            )
    ) {
        templateSelect.value =
            previous;
    }

    templateChanged();
}


function templateChanged() {
    const template =
        getCurrentTemplate();

    if (
        !template
    ) {
        templateInformation
            .textContent =
            "";

        templateOptions
            .replaceChildren();

        return;
    }

    enforceRequiredLanguages(
        template
    );

    const languages =
        (
            template
                .supportedLanguages ||
            []
        )
            .map(
                language =>
                    language
                        .toUpperCase()
            )
            .join(
                ", "
            );

    templateInformation
        .innerHTML = `
            <strong>
                ${template.name}
            </strong>

            <p>
                ${template.description}
            </p>

            <small>
                Lenguajes disponibles:
                ${languages}
            </small>
        `;

    renderTemplateOptions(
        template
    );
}


// ============================================================
// OPCIONES DE PLANTILLA
// ============================================================

function renderTemplateOptions(
    template
) {
    templateOptions
        .replaceChildren();

    if (
        !Array.isArray(
            template.options
        ) ||
        template.options.length === 0
    ) {
        templateOptions
            .textContent =
            "Esta plantilla no necesita configuración adicional.";

        return;
    }

    template.options
        .forEach(
            renderOption
        );
}


function renderOption(
    option
) {
    if (
        option.type ===
        "classes"
    ) {
        renderClassesOption(
            option
        );

        return;
    }

    if (
        option.type ===
        "products"
    ) {
        renderProductsOption(
            option
        );

        return;
    }

    const wrapper =
        document.createElement(
            "div"
        );

    wrapper.className =
        "option-group";

    let field;

    if (
        option.type ===
        "select"
    ) {
        field =
            createSelect(
                option.label,
                option.choices ||
                [],
                option.default
            );

        field.select
            .dataset.option =
            option.id;

        field.select
            .dataset.optionType =
            option.type;

    } else {
        field =
            createField(
                option.label,
                {
                    type:
                        option.type ||
                        "text",

                    value:
                        option.default ??
                        "",

                    step:
                        option.type ===
                            "number"
                            ? "any"
                            : undefined
                }
            );

        field.input
            .dataset.option =
            option.id;

        field.input
            .dataset.optionType =
            option.type ||
            "text";
    }

    wrapper.appendChild(
        field.wrapper
    );

    templateOptions
        .appendChild(
            wrapper
        );
}


// ============================================================
// PRODUCTOS
// ============================================================

function renderProductsOption(
    option
) {
    const wrapper =
        document.createElement(
            "section"
        );

    wrapper.className =
        "option-group";

    const title =
        document.createElement(
            "h3"
        );

    title.textContent =
        option.label;

    const editor =
        document.createElement(
            "div"
        );

    editor.className =
        "products-editor";

    editor.dataset
        .productsEditor =
        option.id;

    (
        option.default ||
        []
    ).forEach(
        product => {
            addProductRow(
                editor,
                product
            );
        }
    );

    wrapper.append(
        title,
        editor,
        createButton(
            "Añadir producto",
            "add-product-button",
            () =>
                addProductRow(
                    editor
                )
        )
    );

    templateOptions
        .appendChild(
            wrapper
        );
}


function addProductRow(
    editor,
    product = {}
) {
    const row =
        document.createElement(
            "div"
        );

    row.className =
        "product-row";

    const sku =
        createField(
            "SKU",
            {
                value:
                    product.sku ||
                    "",

                placeholder:
                    "PROD001"
            }
        );

    sku.input
        .dataset.product =
        "sku";

    const title =
        createField(
            "Nombre",
            {
                value:
                    product.title ||
                    "",

                placeholder:
                    "Producto"
            }
        );

    title.input
        .dataset.product =
        "title";

    const price =
        createField(
            "Precio",
            {
                type:
                    "number",

                value:
                    product.price ??
                    "",

                step:
                    0.01,

                min:
                    0
            }
        );

    price.input
        .dataset.product =
        "price";

    row.append(
        sku.wrapper,
        title.wrapper,
        price.wrapper,

        createButton(
            "Eliminar",
            "remove-product-button",
            () =>
                row.remove()
        )
    );

    editor.appendChild(
        row
    );
}


// ============================================================
// CLASES
// ============================================================

function renderClassesOption(
    option
) {
    const wrapper =
        document.createElement(
            "section"
        );

    wrapper.className =
        "option-group";

    const title =
        document.createElement(
            "h3"
        );

    title.textContent =
        option.label;

    const explanation =
        document.createElement(
            "p"
        );

    explanation.className =
        "help-text";

    explanation.textContent =
        "Crea clases, métodos y el comportamiento de cada método mediante acciones visuales.";

    const editor =
        document.createElement(
            "div"
        );

    editor.className =
        "classes-editor";

    editor.dataset
        .classesEditor =
        option.id;

    (
        option.default ||
        []
    ).forEach(
        classDefinition => {

            addClassEditor(
                editor,
                classDefinition
            );
        }
    );

    wrapper.append(
        title,
        explanation,
        editor,

        createButton(
            "Añadir clase",
            "add-class-button",
            () =>
                addClassEditor(
                    editor
                )
        )
    );

    templateOptions
        .appendChild(
            wrapper
        );
}


function addClassEditor(
    editor,
    classDefinition = {}
) {
    const classBox =
        document.createElement(
            "section"
        );

    classBox.className =
        "class-editor";

    const header =
        createEditorHeader(
            "Clase",
            classBox,
            "Eliminar clase"
        );

    const name =
        createField(
            "Nombre de la clase",
            {
                value:
                    classDefinition
                        .name ||
                    "",

                placeholder:
                    "Biblioteca"
            }
        );

    name.input
        .dataset.className =
        "";

    const attributes =
        createField(
            "Atributos",
            {
                value:
                    Array.isArray(
                        classDefinition
                            .attributes
                    )
                        ? classDefinition
                            .attributes
                            .join(", ")
                        : "",

                placeholder:
                    "libros, nombre, direccion"
            }
        );

    attributes.input
        .dataset.classAttributes =
        "";

    const accessorsLabel =
        document.createElement(
            "label"
        );

    accessorsLabel.className =
        "class-checkbox";

    const accessors =
        document.createElement(
            "input"
        );

    accessors.type =
        "checkbox";

    accessors.dataset
        .classAccessors =
        "";

    accessors.checked =
        classDefinition
            .generateAccessors ===
        true;

    accessorsLabel.append(
        accessors,

        document.createTextNode(
            "Generar getters y setters"
        )
    );

    const methodsEditor =
        document.createElement(
            "div"
        );

    methodsEditor.className =
        "methods-editor";

    const methodsTitle =
        document.createElement(
            "h4"
        );

    methodsTitle.textContent =
        "Métodos";

    const methodsContainer =
        document.createElement(
            "div"
        );

    methodsContainer.className =
        "methods-container";

    methodsContainer.dataset
        .methodsContainer =
        "";

    (
        classDefinition.methods ||
        []
    ).forEach(
        method => {

            addMethodEditor(
                methodsContainer,
                method
            );
        }
    );

    methodsEditor.append(
        methodsTitle,
        methodsContainer,

        createButton(
            "Añadir método",
            "add-method-button",
            () =>
                addMethodEditor(
                    methodsContainer
                )
        )
    );

    classBox.append(
        header,
        name.wrapper,
        attributes.wrapper,
        accessorsLabel,
        methodsEditor
    );

    editor.appendChild(
        classBox
    );
}


function createEditorHeader(
    titleText,
    element,
    removeText
) {
    const header =
        document.createElement(
            "div"
        );

    header.className =
        "editor-card-header";

    const title =
        document.createElement(
            "h4"
        );

    title.textContent =
        titleText;

    const actions =
        document.createElement(
            "div"
        );

    actions.className =
        "editor-card-actions";

    actions.append(
        createButton(
            "↑",
            "small-editor-button",
            () =>
                moveElement(
                    element,
                    "up"
                )
        ),

        createButton(
            "↓",
            "small-editor-button",
            () =>
                moveElement(
                    element,
                    "down"
                )
        ),

        createButton(
            removeText,
            "remove-small-button",
            () =>
                element.remove()
        )
    );

    header.append(
        title,
        actions
    );

    return header;
}


// ============================================================
// MÉTODOS
// ============================================================

function addMethodEditor(
    container,
    methodDefinition = {}
) {
    const methodBox =
        document.createElement(
            "section"
        );

    methodBox.className =
        "method-editor";

    const header =
        createEditorHeader(
            "Método",
            methodBox,
            "Eliminar método"
        );

    const mainFields =
        document.createElement(
            "div"
        );

    mainFields.className =
        "method-main-fields";

    const name =
        createField(
            "Nombre",
            {
                value:
                    methodDefinition
                        .name ||
                    "",

                placeholder:
                    "buscarLibro"
            }
        );

    name.input
        .dataset.methodName =
        "";

    const parameters =
        createField(
            "Parámetros",
            {
                value:
                    Array.isArray(
                        methodDefinition
                            .parameters
                    )
                        ? methodDefinition
                            .parameters
                            .join(", ")
                        : "",

                placeholder:
                    "isbn, usuario"
            }
        );

    parameters.input
        .dataset.methodParameters =
        "";

    mainFields.append(
        name.wrapper,
        parameters.wrapper
    );

    const asyncLabel =
        document.createElement(
            "label"
        );

    asyncLabel.className =
        "method-async-checkbox";

    const asyncCheckbox =
        document.createElement(
            "input"
        );

    asyncCheckbox.type =
        "checkbox";

    asyncCheckbox.dataset
        .methodAsync =
        "";

    asyncCheckbox.checked =
        methodDefinition
            .async ===
        true;

    asyncLabel.append(
        asyncCheckbox,

        document.createTextNode(
            "Método async"
        )
    );

    const actionsEditor =
        document.createElement(
            "div"
        );

    actionsEditor.className =
        "actions-editor";

    const actionsHeader =
        document.createElement(
            "div"
        );

    actionsHeader.className =
        "actions-header";

    const actionsTitle =
        document.createElement(
            "h5"
        );

    actionsTitle.textContent =
        "Acciones del método";

    const actionsHelp =
        document.createElement(
            "p"
        );

    actionsHelp.className =
        "help-text compact-help";

    actionsHelp.textContent =
        "Las acciones se ejecutan de arriba abajo. Puedes reordenarlas.";

    actionsHeader.append(
        actionsTitle,
        actionsHelp
    );

    const actionsContainer =
        document.createElement(
            "div"
        );

    actionsContainer.className =
        "actions-container";

    actionsContainer.dataset
        .actionsContainer =
        "";

    (
        methodDefinition.actions ||
        []
    ).forEach(
        action => {

            addActionEditor(
                actionsContainer,
                action
            );
        }
    );

    actionsEditor.append(
        actionsHeader,
        actionsContainer,

        createButton(
            "Añadir acción",
            "add-action-button",
            () =>
                addActionEditor(
                    actionsContainer
                )
        )
    );

    methodBox.append(
        header,
        mainFields,
        asyncLabel,
        actionsEditor
    );

    container.appendChild(
        methodBox
    );
}


// ============================================================
// ACCIONES
// ============================================================

const ACTION_TYPES = [
    {
        value:
            "declare",

        label:
            "Crear variable"
    },
    {
        value:
            "assign",

        label:
            "Asignar valor"
    },
    {
        value:
            "find",

        label:
            "Buscar elemento"
    },
    {
        value:
            "filter",

        label:
            "Filtrar colección"
    },
    {
        value:
            "sum",

        label:
            "Sumar colección"
    },
    {
        value:
            "push",

        label:
            "Añadir a array"
    },
    {
        value:
            "call",

        label:
            "Llamar función o método"
    },
    {
        value:
            "if",

        label:
            "Condición if / else"
    },
    {
        value:
            "return",

        label:
            "Devolver valor"
    }
];


function addActionEditor(
    container,
    definition = {}
) {
    const actionBox =
        document.createElement(
            "section"
        );

    actionBox.className =
        "action-editor";

    const top =
        document.createElement(
            "div"
        );

    top.className =
        "action-top-row";

    const typeField =
        createSelect(
            "Acción",
            ACTION_TYPES,
            definition.type ||
            "declare"
        );

    typeField.select.dataset
        .actionType =
        "";

    const actions =
        document.createElement(
            "div"
        );

    actions.className =
        "editor-card-actions";

    actions.append(
        createButton(
            "↑",
            "small-editor-button",
            () =>
                moveElement(
                    actionBox,
                    "up"
                )
        ),

        createButton(
            "↓",
            "small-editor-button",
            () =>
                moveElement(
                    actionBox,
                    "down"
                )
        ),

        createButton(
            "Eliminar",
            "remove-action-button",
            () =>
                actionBox.remove()
        )
    );

    top.append(
        typeField.wrapper,
        actions
    );

    const body =
        document.createElement(
            "div"
        );

    body.className =
        "action-body";

    body.dataset.actionBody =
        "";

    actionBox.append(
        top,
        body
    );

    container.appendChild(
        actionBox
    );

    const render =
        () => {

            renderActionBody(
                body,
                typeField
                    .select
                    .value,
                definition
            );
        };

    typeField.select
        .addEventListener(
            "change",
            () => {

                definition =
                    {};

                render();
            }
        );

    render();
}


function renderActionBody(
    body,
    type,
    definition = {}
) {
    body.replaceChildren();

    switch (
    type
    ) {
        case "declare":
            renderDeclareAction(
                body,
                definition
            );
            break;

        case "assign":
            renderAssignAction(
                body,
                definition
            );
            break;

        case "find":
        case "filter":
            renderSearchAction(
                body,
                type,
                definition
            );
            break;

        case "sum":
            renderSumAction(
                body,
                definition
            );
            break;

        case "push":
            renderPushAction(
                body,
                definition
            );
            break;

        case "call":
            renderCallAction(
                body,
                definition
            );
            break;

        case "if":
            renderIfAction(
                body,
                definition
            );
            break;

        case "return":
            renderReturnAction(
                body,
                definition
            );
            break;
    }
}


function appendDeclarationFields(
    body,
    definition = {}
) {
    const kind =
        createSelect(
            "Declaración",
            [
                {
                    value:
                        "const",

                    label:
                        "const"
                },
                {
                    value:
                        "let",

                    label:
                        "let"
                }
            ],
            definition.kind ||
            "const"
        );

    kind.select.dataset
        .actionKind =
        "";

    body.appendChild(
        kind.wrapper
    );

    return kind.select;
}


function renderDeclareAction(
    body,
    definition
) {
    appendDeclarationFields(
        body,
        definition
    );

    const name =
        createField(
            "Nombre de variable",
            {
                value:
                    definition.name ||
                    "",

                placeholder:
                    "resultado"
            }
        );

    name.input.dataset
        .actionName =
        "";

    body.append(
        name.wrapper,

        createExpressionEditor(
            "Valor inicial",
            definition.value
        )
    );
}


function renderAssignAction(
    body,
    definition
) {
    const target =
        createReferenceField(
            "Destino",
            definition.target ||
            "",
            "producto.quantity"
        );

    target.input.dataset
        .actionTarget =
        "";

    body.append(
        target.wrapper,

        createExpressionEditor(
            "Valor",
            definition.value
        )
    );
}


function renderSearchAction(
    body,
    type,
    definition
) {
    appendDeclarationFields(
        body,
        definition
    );

    const saveAs =
        createField(
            "Guardar resultado como",
            {
                value:
                    definition.saveAs ||
                    "",

                placeholder:
                    type === "find"
                        ? "producto"
                        : "resultados"
            }
        );

    saveAs.input.dataset
        .actionSaveAs =
        "";

    const itemName =
        createField(
            "Nombre de cada elemento",
            {
                value:
                    definition.itemName ||
                    "item",

                placeholder:
                    "item"
            }
        );

    itemName.input.dataset
        .actionItemName =
        "";

    body.append(
        saveAs.wrapper,

        createExpressionEditor(
            "Colección",
            definition.collection ||
            {
                type:
                    "reference",

                value:
                    ""
            }
        ),

        itemName.wrapper,

        createExpressionEditor(
            "Condición",
            definition.condition ||
            {
                type:
                    "binary",

                operator:
                    "===",

                left: {
                    type:
                        "reference",

                    value:
                        `${itemName.input.value}.id`
                },

                right: {
                    type:
                        "reference",

                    value:
                        ""
                }
            }
        )
    );
}


function renderSumAction(
    body,
    definition
) {
    appendDeclarationFields(
        body,
        definition
    );

    const saveAs =
        createField(
            "Guardar total como",
            {
                value:
                    definition.saveAs ||
                    "total",

                placeholder:
                    "total"
            }
        );

    saveAs.input.dataset
        .actionSaveAs =
        "";

    const accumulator =
        createField(
            "Acumulador",
            {
                value:
                    definition
                        .accumulatorName ||
                    "total",

                placeholder:
                    "total"
            }
        );

    accumulator.input.dataset
        .actionAccumulator =
        "";

    const item =
        createField(
            "Elemento",
            {
                value:
                    definition.itemName ||
                    "item",

                placeholder:
                    "item"
            }
        );

    item.input.dataset
        .actionItemName =
        "";

    body.append(
        saveAs.wrapper,

        createExpressionEditor(
            "Colección",
            definition.collection ||
            {
                type:
                    "reference",

                value:
                    ""
            }
        ),

        accumulator.wrapper,
        item.wrapper,

        createExpressionEditor(
            "Valor que aporta cada elemento",
            definition.value ||
            {
                type:
                    "reference",

                value:
                    item.input.value
            }
        ),

        createExpressionEditor(
            "Valor inicial",
            definition.initialValue ||
            {
                type:
                    "literal",

                value:
                    0
            }
        )
    );
}


function renderPushAction(
    body,
    definition
) {
    const collection =
        createReferenceField(
            "Array destino",
            definition.collection ||
            "",
            "this.elementos"
        );

    collection.input.dataset
        .actionCollection =
        "";

    body.append(
        collection.wrapper,

        createExpressionEditor(
            "Valor a añadir",
            definition.value
        )
    );
}


function renderCallAction(
    body,
    definition
) {
    const callee =
        createReferenceField(
            "Función o método",
            definition.callee ||
            "",
            "this.actualizar"
        );

    callee.input.dataset
        .actionCallee =
        "";

    const argumentsEditor =
        createExpressionListEditor(
            "Argumentos",
            definition.arguments ||
            []
        );

    argumentsEditor.dataset
        .actionArguments =
        "";

    const resultLabel =
        document.createElement(
            "label"
        );

    resultLabel.className =
        "class-checkbox";

    const saveResult =
        document.createElement(
            "input"
        );

    saveResult.type =
        "checkbox";

    saveResult.dataset
        .actionSaveResult =
        "";

    saveResult.checked =
        Boolean(
            definition.saveAs
        );

    resultLabel.append(
        saveResult,

        document.createTextNode(
            "Guardar el resultado en una variable"
        )
    );

    const resultDetails =
        document.createElement(
            "div"
        );

    resultDetails.className =
        "optional-result-details";

    const kind =
        createSelect(
            "Declaración",
            [
                {
                    value:
                        "const",

                    label:
                        "const"
                },
                {
                    value:
                        "let",

                    label:
                        "let"
                }
            ],
            definition.kind ||
            "const"
        );

    kind.select.dataset
        .actionKind =
        "";

    const saveAs =
        createField(
            "Variable",
            {
                value:
                    definition.saveAs ||
                    "",

                placeholder:
                    "resultado"
            }
        );

    saveAs.input.dataset
        .actionSaveAs =
        "";

    resultDetails.append(
        kind.wrapper,
        saveAs.wrapper
    );

    resultDetails.hidden =
        !saveResult.checked;

    saveResult
        .addEventListener(
            "change",
            () => {
                resultDetails.hidden =
                    !saveResult.checked;
            }
        );

    body.append(
        callee.wrapper,
        argumentsEditor,
        resultLabel,
        resultDetails
    );
}


function renderIfAction(
    body,
    definition
) {
    body.appendChild(
        createExpressionEditor(
            "Condición",
            definition.condition ||
            {
                type:
                    "binary",

                operator:
                    "===",

                left: {
                    type:
                        "reference",

                    value:
                        ""
                },

                right: {
                    type:
                        "literal",

                    value:
                        true
                }
            },
            "condition"
        )
    );

    body.appendChild(
        createNestedActionsEditor(
            "Si se cumple",
            "then",
            definition.then ||
            []
        )
    );

    const elseLabel =
        document.createElement(
            "label"
        );

    elseLabel.className =
        "class-checkbox";

    const elseEnabled =
        document.createElement(
            "input"
        );

    elseEnabled.type =
        "checkbox";

    elseEnabled.dataset
        .actionElseEnabled =
        "";

    elseEnabled.checked =
        Array.isArray(
            definition.else
        );

    elseLabel.append(
        elseEnabled,

        document.createTextNode(
            "Añadir bloque else"
        )
    );

    const elseBlock =
        createNestedActionsEditor(
            "Si no se cumple",
            "else",
            definition.else ||
            []
        );

    elseBlock.hidden =
        !elseEnabled.checked;

    elseEnabled
        .addEventListener(
            "change",
            () => {
                elseBlock.hidden =
                    !elseEnabled.checked;
            }
        );

    body.append(
        elseLabel,
        elseBlock
    );
}


function renderReturnAction(
    body,
    definition
) {
    const emptyLabel =
        document.createElement(
            "label"
        );

    emptyLabel.className =
        "class-checkbox";

    const empty =
        document.createElement(
            "input"
        );

    empty.type =
        "checkbox";

    empty.dataset
        .actionEmptyReturn =
        "";

    empty.checked =
        definition.value ===
        undefined &&
        definition.type ===
        "return";

    emptyLabel.append(
        empty,

        document.createTextNode(
            "return sin valor"
        )
    );

    const expression =
        createExpressionEditor(
            "Valor",
            definition.value
        );

    expression.hidden =
        empty.checked;

    empty.addEventListener(
        "change",
        () => {

            expression.hidden =
                empty.checked;
        }
    );

    body.append(
        emptyLabel,
        expression
    );
}


function createNestedActionsEditor(
    titleText,
    name,
    definitions
) {
    const block =
        document.createElement(
            "div"
        );

    block.className =
        "nested-actions-block";

    const title =
        document.createElement(
            "strong"
        );

    title.textContent =
        titleText;

    const container =
        document.createElement(
            "div"
        );

    container.className =
        "actions-container nested-actions-container";

    container.dataset[
        `action${capitalize(
            name
        )}`
    ] = "";

    definitions.forEach(
        action => {

            addActionEditor(
                container,
                action
            );
        }
    );

    block.append(
        title,
        container,

        createButton(
            "Añadir acción",
            "add-action-button",
            () =>
                addActionEditor(
                    container
                )
        )
    );

    return block;
}


function capitalize(
    value
) {
    return (
        value
            .charAt(0)
            .toUpperCase() +
        value.slice(1)
    );
}


// ============================================================
// EXPRESIONES
// ============================================================

const EXPRESSION_TYPES = [
    {
        value:
            "reference",

        label:
            "Referencia / variable"
    },
    {
        value:
            "string",

        label:
            "Texto"
    },
    {
        value:
            "number",

        label:
            "Número"
    },
    {
        value:
            "boolean",

        label:
            "Booleano"
    },
    {
        value:
            "null",

        label:
            "null"
    },
    {
        value:
            "binary",

        label:
            "Operación / comparación"
    },
    {
        value:
            "call",

        label:
            "Llamada a función"
    },
    {
        value:
            "object",

        label:
            "Objeto"
    },
    {
        value:
            "array",

        label:
            "Array"
    }
];


function normalizeExpressionForEditor(
    expression
) {
    if (
        expression ===
        undefined
    ) {
        return {
            type:
                "reference",

            value:
                ""
        };
    }

    if (
        expression ===
        null
    ) {
        return {
            type:
                "null"
        };
    }

    if (
        typeof expression ===
        "string"
    ) {
        return {
            type:
                "string",

            value:
                expression
        };
    }

    if (
        typeof expression ===
        "number"
    ) {
        return {
            type:
                "number",

            value:
                expression
        };
    }

    if (
        typeof expression ===
        "boolean"
    ) {
        return {
            type:
                "boolean",

            value:
                expression
        };
    }

    if (
        expression.type ===
        "literal"
    ) {
        if (
            expression.value ===
            null
        ) {
            return {
                type:
                    "null"
            };
        }

        return {
            type:
                typeof expression
                    .value,

            value:
                expression.value
        };
    }

    return expression;
}


function createExpressionEditor(
    labelText,
    initialExpression,
    role = ""
) {
    const editor =
        document.createElement(
            "div"
        );

    editor.className =
        "expression-editor";

    editor.dataset
        .expressionEditor =
        "";

    if (
        role
    ) {
        editor.dataset
            .expressionRole =
            role;
    }

    let expression =
        normalizeExpressionForEditor(
            initialExpression
        );

    const typeField =
        createSelect(
            labelText,
            EXPRESSION_TYPES,
            expression.type ||
            "reference"
        );

    typeField.select.dataset
        .expressionType =
        "";

    const body =
        document.createElement(
            "div"
        );

    body.className =
        "expression-body";

    body.dataset
        .expressionBody =
        "";

    editor.append(
        typeField.wrapper,
        body
    );

    const render =
        () => {

            renderExpressionBody(
                body,
                typeField
                    .select
                    .value,
                expression
            );
        };

    typeField.select
        .addEventListener(
            "change",
            () => {

                expression = {
                    type:
                        typeField
                            .select
                            .value
                };

                render();
            }
        );

    render();

    return editor;
}


function renderExpressionBody(
    body,
    type,
    expression = {}
) {
    body.replaceChildren();

    if (
        type ===
        "reference"
    ) {
        const field =
            createReferenceField(
                "Referencia",
                expression.value ||
                "",
                "this.productos"
            );

        field.input.dataset
            .expressionValue =
            "";

        body.appendChild(
            field.wrapper
        );

        return;
    }

    if (
        type ===
        "string"
    ) {
        const field =
            createField(
                "Texto",
                {
                    value:
                        expression.value ??
                        ""
                }
            );

        field.input.dataset
            .expressionValue =
            "";

        body.appendChild(
            field.wrapper
        );

        return;
    }

    if (
        type ===
        "number"
    ) {
        const field =
            createField(
                "Número",
                {
                    type:
                        "number",

                    value:
                        expression.value ??
                        0,

                    step:
                        "any"
                }
            );

        field.input.dataset
            .expressionValue =
            "";

        body.appendChild(
            field.wrapper
        );

        return;
    }

    if (
        type ===
        "boolean"
    ) {
        const field =
            createSelect(
                "Valor",
                [
                    {
                        value:
                            "true",

                        label:
                            "true"
                    },
                    {
                        value:
                            "false",

                        label:
                            "false"
                    }
                ],
                String(
                    expression.value ??
                    true
                )
            );

        field.select.dataset
            .expressionValue =
            "";

        body.appendChild(
            field.wrapper
        );

        return;
    }

    if (
        type ===
        "null"
    ) {
        const value =
            document.createElement(
                "p"
            );

        value.className =
            "expression-static-value";

        value.textContent =
            "null";

        body.appendChild(
            value
        );

        return;
    }

    if (
        type ===
        "binary"
    ) {
        const operator =
            createSelect(
                "Operador",
                [
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
                ].map(
                    value => ({
                        value,
                        label:
                            value
                    })
                ),
                expression.operator ||
                "==="
            );

        operator.select.dataset
            .expressionOperator =
            "";

        body.append(
            createExpressionEditor(
                "Izquierda",
                expression.left,
                "left"
            ),

            operator.wrapper,

            createExpressionEditor(
                "Derecha",
                expression.right,
                "right"
            )
        );

        return;
    }

    if (
        type ===
        "call"
    ) {
        const callee =
            createReferenceField(
                "Función o método",
                expression.callee ||
                "",
                "this.metodo"
            );

        callee.input.dataset
            .expressionCallee =
            "";

        body.append(
            callee.wrapper,

            createExpressionListEditor(
                "Argumentos",
                expression.arguments ||
                []
            )
        );

        return;
    }

    if (
        type ===
        "object"
    ) {
        body.appendChild(
            createObjectEditor(
                expression.properties ||
                []
            )
        );

        return;
    }

    if (
        type ===
        "array"
    ) {
        body.appendChild(
            createExpressionListEditor(
                "Elementos",
                expression.items ||
                []
            )
        );
    }
}


function createReferenceField(
    labelText,
    value,
    placeholder
) {
    const field =
        createField(
            labelText,
            {
                value,
                placeholder
            }
        );

    field.input.classList
        .add(
            "reference-input"
        );

    const listId =
        nextId(
            "references"
        );

    const list =
        document.createElement(
            "datalist"
        );

    list.id =
        listId;

    field.input
        .setAttribute(
            "list",
            listId
        );

    const refresh =
        () => {

            list.replaceChildren();

            getReferenceSuggestions(
                field.input
            ).forEach(
                reference => {

                    const option =
                        document
                            .createElement(
                                "option"
                            );

                    option.value =
                        reference;

                    list.appendChild(
                        option
                    );
                }
            );
        };

    field.input
        .addEventListener(
            "focus",
            refresh
        );

    field.input
        .addEventListener(
            "input",
            refresh
        );

    field.wrapper
        .appendChild(
            list
        );

    return field;
}


function getReferenceSuggestions(
    element
) {
    const references =
        new Set();

    const classBox =
        element.closest(
            ".class-editor"
        );

    const methodBox =
        element.closest(
            ".method-editor"
        );

    if (
        classBox
    ) {
        const attributes =
            splitCommaSeparatedValues(
                classBox.querySelector(
                    "[data-class-attributes]"
                )?.value
            );

        attributes.forEach(
            attribute => {

                references.add(
                    `this.${attribute}`
                );
            }
        );
    }

    if (
        methodBox
    ) {
        const parameters =
            splitCommaSeparatedValues(
                methodBox.querySelector(
                    "[data-method-parameters]"
                )?.value
            );

        parameters.forEach(
            parameter => {

                references.add(
                    parameter
                );
            }
        );

        methodBox
            .querySelectorAll(
                "[data-action-save-as], [data-action-name]"
            )
            .forEach(
                input => {

                    const value =
                        input
                            .value
                            .trim();

                    if (
                        value
                    ) {
                        references.add(
                            value
                        );
                    }
                }
            );

        methodBox
            .querySelectorAll(
                "[data-action-item-name]"
            )
            .forEach(
                input => {

                    const value =
                        input
                            .value
                            .trim();

                    if (
                        value
                    ) {
                        references.add(
                            value
                        );
                    }
                }
            );
    }

    return [
        ...references
    ];
}


function createExpressionListEditor(
    titleText,
    expressions = []
) {
    const wrapper =
        document.createElement(
            "div"
        );

    wrapper.className =
        "expression-list";

    wrapper.dataset
        .expressionList =
        "";

    const title =
        document.createElement(
            "strong"
        );

    title.textContent =
        titleText;

    const items =
        document.createElement(
            "div"
        );

    items.className =
        "expression-list-items";

    items.dataset
        .expressionItems =
        "";

    expressions.forEach(
        expression => {

            addExpressionListItem(
                items,
                expression
            );
        }
    );

    wrapper.append(
        title,
        items,

        createButton(
            "Añadir",
            "small-editor-button",
            () =>
                addExpressionListItem(
                    items
                )
        )
    );

    return wrapper;
}


function addExpressionListItem(
    container,
    expression
) {
    const row =
        document.createElement(
            "div"
        );

    row.className =
        "expression-list-item";

    row.append(
        createExpressionEditor(
            "Valor",
            expression
        ),

        createButton(
            "Eliminar",
            "remove-small-button",
            () =>
                row.remove()
        )
    );

    container.appendChild(
        row
    );
}


function createObjectEditor(
    properties = []
) {
    const wrapper =
        document.createElement(
            "div"
        );

    wrapper.className =
        "object-properties-editor";

    wrapper.dataset
        .objectEditor =
        "";

    const title =
        document.createElement(
            "strong"
        );

    title.textContent =
        "Propiedades del objeto";

    const rows =
        document.createElement(
            "div"
        );

    rows.dataset
        .objectRows =
        "";

    properties.forEach(
        property => {

            addObjectPropertyRow(
                rows,
                property
            );
        }
    );

    wrapper.append(
        title,
        rows,

        createButton(
            "Añadir propiedad",
            "small-editor-button",
            () =>
                addObjectPropertyRow(
                    rows
                )
        )
    );

    return wrapper;
}


function addObjectPropertyRow(
    container,
    property = {}
) {
    const row =
        document.createElement(
            "div"
        );

    row.className =
        "object-property-row";

    const key =
        createField(
            "Propiedad",
            {
                value:
                    property.key ||
                    "",

                placeholder:
                    "total"
            }
        );

    key.input.dataset
        .objectKey =
        "";

    row.append(
        key.wrapper,

        createExpressionEditor(
            "Valor",
            property.value
        ),

        createButton(
            "Eliminar",
            "remove-small-button",
            () =>
                row.remove()
        )
    );

    container.appendChild(
        row
    );
}


// ============================================================
// RECOGIDA DE EXPRESIONES Y ACCIONES
// ============================================================

function directChild(
    parent,
    selector
) {
    return [
        ...parent.children
    ].find(
        child =>
            child.matches(
                selector
            )
    ) || null;
}


function getExpressionByRole(
    body,
    role
) {
    return [
        ...body.children
    ].find(
        child =>
            child.classList
                .contains(
                    "expression-editor"
                ) &&
            child.dataset
                .expressionRole ===
            role
    );
}


function getUnroledExpressions(
    body
) {
    return [
        ...body.children
    ].filter(
        child =>
            child.classList
                .contains(
                    "expression-editor"
                ) &&
            !child.dataset
                .expressionRole
    );
}


function collectExpression(
    editor
) {
    const type =
        editor.querySelector(
            ":scope > label select[data-expression-type]"
        )?.value;

    const body =
        directChild(
            editor,
            ".expression-body"
        );

    if (
        !type ||
        !body
    ) {
        throw new Error(
            "Hay una expresión incompleta."
        );
    }

    if (
        type ===
        "reference"
    ) {
        return {
            type:
                "reference",

            value:
                body.querySelector(
                    "[data-expression-value]"
                )?.value
                    .trim() ||
                ""
        };
    }

    if (
        type ===
        "string"
    ) {
        return {
            type:
                "literal",

            value:
                body.querySelector(
                    "[data-expression-value]"
                )?.value ??
                ""
        };
    }

    if (
        type ===
        "number"
    ) {
        return {
            type:
                "literal",

            value:
                Number(
                    body.querySelector(
                        "[data-expression-value]"
                    )?.value ||
                    0
                )
        };
    }

    if (
        type ===
        "boolean"
    ) {
        return {
            type:
                "literal",

            value:
                body.querySelector(
                    "[data-expression-value]"
                )?.value ===
                "true"
        };
    }

    if (
        type ===
        "null"
    ) {
        return {
            type:
                "literal",

            value:
                null
        };
    }

    if (
        type ===
        "binary"
    ) {
        return {
            type:
                "binary",

            operator:
                body.querySelector(
                    "[data-expression-operator]"
                )?.value,

            left:
                collectExpression(
                    getExpressionByRole(
                        body,
                        "left"
                    )
                ),

            right:
                collectExpression(
                    getExpressionByRole(
                        body,
                        "right"
                    )
                )
        };
    }

    if (
        type ===
        "call"
    ) {
        const list =
            directChild(
                body,
                ".expression-list"
            );

        return {
            type:
                "call",

            callee:
                body.querySelector(
                    "[data-expression-callee]"
                )?.value
                    .trim() ||
                "",

            arguments:
                collectExpressionList(
                    list
                )
        };
    }

    if (
        type ===
        "object"
    ) {
        const objectEditor =
            directChild(
                body,
                ".object-properties-editor"
            );

        const rows =
            objectEditor
                ?.querySelector(
                    "[data-object-rows]"
                );

        return {
            type:
                "object",

            properties:
                rows
                    ? [
                        ...rows.children
                    ].map(
                        row => ({
                            key:
                                row.querySelector(
                                    "[data-object-key]"
                                )?.value
                                    .trim() ||
                                "",

                            value:
                                collectExpression(
                                    directChild(
                                        row,
                                        ".expression-editor"
                                    )
                                )
                        })
                    )
                    : []
        };
    }

    if (
        type ===
        "array"
    ) {
        const list =
            directChild(
                body,
                ".expression-list"
            );

        return {
            type:
                "array",

            items:
                collectExpressionList(
                    list
                )
        };
    }

    throw new Error(
        `Tipo de expresión no reconocido: ${type}`
    );
}


function collectExpressionList(
    list
) {
    const items =
        list?.querySelector(
            "[data-expression-items]"
        );

    if (
        !items
    ) {
        return [];
    }

    return [
        ...items.children
    ].map(
        row =>
            collectExpression(
                directChild(
                    row,
                    ".expression-editor"
                )
            )
    );
}


function collectActions(
    container
) {
    return [
        ...container.children
    ]
        .filter(
            child =>
                child.classList
                    .contains(
                        "action-editor"
                    )
        )
        .map(
            collectAction
        );
}


function collectAction(
    actionBox
) {
    const type =
        actionBox
            .querySelector(
                "[data-action-type]"
            )
            .value;

    const body =
        actionBox
            .querySelector(
                ":scope > .action-body"
            );

    const expressions =
        getUnroledExpressions(
            body
        );

    if (
        type ===
        "declare"
    ) {
        return {
            type,

            kind:
                body.querySelector(
                    "[data-action-kind]"
                ).value,

            name:
                body.querySelector(
                    "[data-action-name]"
                ).value
                    .trim(),

            value:
                collectExpression(
                    expressions[0]
                )
        };
    }

    if (
        type ===
        "assign"
    ) {
        return {
            type,

            target:
                body.querySelector(
                    "[data-action-target]"
                ).value
                    .trim(),

            value:
                collectExpression(
                    expressions[0]
                )
        };
    }

    if (
        type ===
        "find" ||
        type ===
        "filter"
    ) {
        return {
            type,

            kind:
                body.querySelector(
                    "[data-action-kind]"
                ).value,

            saveAs:
                body.querySelector(
                    "[data-action-save-as]"
                ).value
                    .trim(),

            collection:
                collectExpression(
                    expressions[0]
                ),

            itemName:
                body.querySelector(
                    "[data-action-item-name]"
                ).value
                    .trim(),

            condition:
                collectExpression(
                    expressions[1]
                )
        };
    }

    if (
        type ===
        "sum"
    ) {
        return {
            type,

            kind:
                body.querySelector(
                    "[data-action-kind]"
                ).value,

            saveAs:
                body.querySelector(
                    "[data-action-save-as]"
                ).value
                    .trim(),

            collection:
                collectExpression(
                    expressions[0]
                ),

            accumulatorName:
                body.querySelector(
                    "[data-action-accumulator]"
                ).value
                    .trim(),

            itemName:
                body.querySelector(
                    "[data-action-item-name]"
                ).value
                    .trim(),

            value:
                collectExpression(
                    expressions[1]
                ),

            initialValue:
                collectExpression(
                    expressions[2]
                )
        };
    }

    if (
        type ===
        "push"
    ) {
        return {
            type,

            collection:
                body.querySelector(
                    "[data-action-collection]"
                ).value
                    .trim(),

            value:
                collectExpression(
                    expressions[0]
                )
        };
    }

    if (
        type ===
        "call"
    ) {
        const list =
            directChild(
                body,
                ".expression-list"
            );

        const saveResult =
            body.querySelector(
                "[data-action-save-result]"
            ).checked;

        const action = {
            type,

            callee:
                body.querySelector(
                    "[data-action-callee]"
                ).value
                    .trim(),

            arguments:
                collectExpressionList(
                    list
                )
        };

        if (
            saveResult
        ) {
            action.kind =
                body.querySelector(
                    "[data-action-kind]"
                ).value;

            action.saveAs =
                body.querySelector(
                    "[data-action-save-as]"
                ).value
                    .trim();
        }

        return action;
    }

    if (
        type ===
        "if"
    ) {
        const elseEnabled =
            body.querySelector(
                "[data-action-else-enabled]"
            ).checked;

        const action = {
            type,

            condition:
                collectExpression(
                    getExpressionByRole(
                        body,
                        "condition"
                    )
                ),

            then:
                collectActions(
                    body.querySelector(
                        "[data-action-then]"
                    )
                )
        };

        if (
            elseEnabled
        ) {
            action.else =
                collectActions(
                    body.querySelector(
                        "[data-action-else]"
                    )
                );
        }

        return action;
    }

    if (
        type ===
        "return"
    ) {
        const empty =
            body.querySelector(
                "[data-action-empty-return]"
            ).checked;

        if (
            empty
        ) {
            return {
                type
            };
        }

        return {
            type,

            value:
                collectExpression(
                    expressions[0]
                )
        };
    }

    throw new Error(
        `Acción no reconocida: ${type}`
    );
}


// ============================================================
// RECOGIDA DE CONFIGURACIÓN
// ============================================================

function collectOptions() {
    const options = {};

    templateOptions
        .querySelectorAll(
            "[data-option]"
        )
        .forEach(
            input => {

                options[
                    input.dataset
                        .option
                ] =
                    input.dataset
                        .optionType ===
                        "number"
                        ? Number(
                            input.value
                        )
                        : input.value;
            }
        );

    templateOptions
        .querySelectorAll(
            "[data-products-editor]"
        )
        .forEach(
            editor => {

                options[
                    editor.dataset
                        .productsEditor
                ] = [
                    ...editor
                        .querySelectorAll(
                            ".product-row"
                        )
                ].map(
                    row => ({
                        sku:
                            row.querySelector(
                                "[data-product='sku']"
                            )?.value
                                .trim() ||
                            "",

                        title:
                            row.querySelector(
                                "[data-product='title']"
                            )?.value
                                .trim() ||
                            "",

                        price:
                            Number(
                                row.querySelector(
                                    "[data-product='price']"
                                )?.value ||
                                0
                            )
                    })
                );
            }
        );

    templateOptions
        .querySelectorAll(
            "[data-classes-editor]"
        )
        .forEach(
            editor => {

                const classes = [
                    ...editor.children
                ]
                    .filter(
                        child =>
                            child.classList
                                .contains(
                                    "class-editor"
                                )
                    )
                    .map(
                        classBox => {

                            const methodsContainer =
                                classBox
                                    .querySelector(
                                        "[data-methods-container]"
                                    );

                            const methods = [
                                ...methodsContainer
                                    .children
                            ]
                                .filter(
                                    child =>
                                        child.classList
                                            .contains(
                                                "method-editor"
                                            )
                                )
                                .map(
                                    methodBox => ({
                                        name:
                                            methodBox
                                                .querySelector(
                                                    "[data-method-name]"
                                                )
                                                ?.value
                                                .trim() ||
                                            "",

                                        parameters:
                                            splitCommaSeparatedValues(
                                                methodBox
                                                    .querySelector(
                                                        "[data-method-parameters]"
                                                    )
                                                    ?.value
                                            ),

                                        async:
                                            methodBox
                                                .querySelector(
                                                    "[data-method-async]"
                                                )
                                                ?.checked ===
                                            true,

                                        actions:
                                            collectActions(
                                                methodBox
                                                    .querySelector(
                                                        "[data-actions-container]"
                                                    )
                                            )
                                    })
                                )
                                .filter(
                                    method =>
                                        method.name
                                );

                            return {
                                name:
                                    classBox
                                        .querySelector(
                                            "[data-class-name]"
                                        )
                                        ?.value
                                        .trim() ||
                                    "",

                                attributes:
                                    splitCommaSeparatedValues(
                                        classBox
                                            .querySelector(
                                                "[data-class-attributes]"
                                            )
                                            ?.value
                                    ),

                                generateAccessors:
                                    classBox
                                        .querySelector(
                                            "[data-class-accessors]"
                                        )
                                        ?.checked ===
                                    true,

                                methods
                            };
                        }
                    )
                    .filter(
                        classDefinition =>
                            classDefinition
                                .name
                    );

                options[
                    editor.dataset
                        .classesEditor
                ] = classes;
            }
        );

    return options;
}


// ============================================================
// RESULTADO Y GENERACIÓN
// ============================================================

function showError(
    message
) {
    result.className =
        "error";

    result.textContent =
        `ERROR\n\n${message}`;
}


function showSuccess(
    data
) {
    result.className =
        "success";

    const fileList =
        Array.isArray(
            data.files
        )
            ? data.files
                .map(
                    file =>
                        `  ${file}`
                )
                .join(
                    "\n"
                )
            : "";

    const languages =
        Array.isArray(
            data.languages
        )
            ? data.languages
                .map(
                    language =>
                        language
                            .toUpperCase()
                )
                .join(
                    ", "
                )
            : "";

    result.textContent =
        `PROYECTO GENERADO CORRECTAMENTE

Proyecto:
${data.projectName}

Plantilla:
${data.template}

Ruta:
${data.projectDirectory}

Lenguajes:
${languages}

Archivos generados:
${fileList}`;
}


form.addEventListener(
    "submit",
    async event => {

        event.preventDefault();

        const selectedLanguages =
            getSelectedLanguages();

        if (
            selectedLanguages
                .length === 0
        ) {
            showError(
                "Selecciona al menos un lenguaje."
            );

            return;
        }

        if (
            !templateSelect.value
        ) {
            showError(
                "Selecciona una plantilla."
            );

            return;
        }

        const submitButton =
            form.querySelector(
                ".generate-button"
            );

        submitButton.disabled =
            true;

        submitButton.textContent =
            "Generando...";

        result.className =
            "";

        result.textContent =
            "Generando proyecto...";

        try {
            const response =
                await fetch(
                    "/api/generate",
                    {
                        method:
                            "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                {
                                    basePath:
                                        basePathInput
                                            .value,

                                    projectName:
                                        projectNameInput
                                            .value,

                                    languages:
                                        selectedLanguages,

                                    templateId:
                                        templateSelect
                                            .value,

                                    overwrite:
                                        overwriteCheckbox
                                            .checked,

                                    options:
                                        collectOptions()
                                }
                            )
                    }
                );

            const data =
                await response
                    .json();

            if (
                !response.ok ||
                !data.success
            ) {
                throw new Error(
                    data.error ||
                    "No se pudo generar el proyecto."
                );
            }

            showSuccess(
                data
            );

        } catch (error) {
            showError(
                error.message
            );

        } finally {
            submitButton.disabled =
                false;

            submitButton.textContent =
                "Generar proyecto";
        }
    }
);


languageCheckboxes
    .forEach(
        checkbox => {

            checkbox
                .addEventListener(
                    "change",
                    populateTemplateSelect
                );
        }
    );


templateSelect
    .addEventListener(
        "change",
        templateChanged
    );


loadTemplates();