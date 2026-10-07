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


// ============================================================
// PLANTILLAS Y LENGUAJES
// ============================================================

async function loadTemplates() {
    try {
        const response = await fetch("/api/templates");

        if (!response.ok) {
            throw new Error(
                "No se pudieron cargar las plantillas."
            );
        }

        templates = await response.json();
        populateTemplateSelect();

    } catch (error) {
        showError(error.message);
    }
}


function getSelectedLanguages() {
    return languageCheckboxes
        .filter(
            checkbox => checkbox.checked
        )
        .map(
            checkbox => checkbox.value
        );
}


function releaseLanguageLocks() {
    languageCheckboxes.forEach(
        checkbox => {
            checkbox.disabled = false;
        }
    );
}


function getCurrentTemplate() {
    return templates.find(
        template =>
            template.id ===
            templateSelect.value
    );
}


function populateTemplateSelect() {
    releaseLanguageLocks();

    const previousValue =
        templateSelect.value;

    const selectedLanguages =
        getSelectedLanguages();

    const compatibleTemplates =
        templates.filter(
            template => {

                const supportedLanguages =
                    Array.isArray(
                        template.supportedLanguages
                    )
                        ? template.supportedLanguages
                        : [];

                return selectedLanguages.every(
                    language =>
                        supportedLanguages.includes(
                            language
                        )
                );
            }
        );

    templateSelect.innerHTML = "";

    if (
        compatibleTemplates.length === 0
    ) {
        const option =
            document.createElement(
                "option"
            );

        option.value = "";

        option.textContent =
            "No existen plantillas compatibles";

        templateSelect.appendChild(
            option
        );

        templateSelect.disabled = true;

        templateInformation.textContent =
            "La combinación de lenguajes seleccionada todavía no tiene ninguna plantilla.";

        templateOptions.innerHTML = "";

        return;
    }

    templateSelect.disabled = false;

    compatibleTemplates.forEach(
        template => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                template.id;

            option.textContent =
                template.name;

            templateSelect.appendChild(
                option
            );
        }
    );

    if (
        compatibleTemplates.some(
            template =>
                template.id ===
                previousValue
        )
    ) {
        templateSelect.value =
            previousValue;
    }

    templateChanged();
}


function enforceRequiredLanguages(
    template
) {
    releaseLanguageLocks();

    const requiredLanguages =
        Array.isArray(
            template.requiredLanguages
        )
            ? template.requiredLanguages
            : [];

    requiredLanguages.forEach(
        requiredLanguage => {

            const checkbox =
                languageCheckboxes.find(
                    current =>
                        current.value ===
                        requiredLanguage
                );

            if (!checkbox) {
                return;
            }

            checkbox.checked = true;
            checkbox.disabled = true;
        }
    );
}


function templateChanged() {
    const template =
        getCurrentTemplate();

    if (!template) {
        templateInformation.textContent = "";
        templateOptions.innerHTML = "";
        return;
    }

    enforceRequiredLanguages(
        template
    );

    const supportedLanguages =
        Array.isArray(
            template.supportedLanguages
        )
            ? template.supportedLanguages
            : [];

    const languages =
        supportedLanguages
            .map(
                language =>
                    language.toUpperCase()
            )
            .join(", ");

    const automaticClasses =
        Array.isArray(
            template.automaticClasses
        )
            ? template.automaticClasses
            : [];

    const automaticClassesHtml =
        automaticClasses.length > 0
            ? `
                <p>
                    <strong>
                        Clases generadas automáticamente:
                    </strong>

                    ${automaticClasses.join(", ")}
                </p>
            `
            : "";

    templateInformation.innerHTML = `
        <strong>
            ${template.name}
        </strong>

        <p>
            ${template.description}
        </p>

        ${automaticClassesHtml}

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
// OPCIONES DE LAS PLANTILLAS
// ============================================================

function renderTemplateOptions(
    template
) {
    templateOptions.innerHTML = "";

    if (
        !Array.isArray(
            template.options
        ) ||
        template.options.length === 0
    ) {
        templateOptions.textContent =
            "Esta plantilla no necesita configuración adicional.";

        return;
    }

    template.options.forEach(
        renderOption
    );
}


function renderOption(option) {

    if (
        option.type === "products"
    ) {
        renderProductsOption(
            option
        );

        return;
    }

    if (
        option.type === "classes"
    ) {
        renderClassesOption(
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

    const label =
        document.createElement(
            "label"
        );

    label.textContent =
        option.label;

    let input;

    if (
        option.type === "select"
    ) {
        input =
            document.createElement(
                "select"
            );

        const choices =
            Array.isArray(
                option.choices
            )
                ? option.choices
                : [];

        choices.forEach(
            choice => {

                const selectOption =
                    document.createElement(
                        "option"
                    );

                selectOption.value =
                    choice.value;

                selectOption.textContent =
                    choice.label;

                selectOption.selected =
                    choice.value ===
                    option.default;

                input.appendChild(
                    selectOption
                );
            }
        );

    } else {
        input =
            document.createElement(
                "input"
            );

        input.type =
            option.type ||
            "text";

        input.value =
            option.default ??
            "";

        if (
            option.type === "number"
        ) {
            input.step = "any";
        }
    }

    input.dataset.option =
        option.id;

    input.dataset.optionType =
        option.type ||
        "text";

    label.appendChild(
        input
    );

    wrapper.appendChild(
        label
    );

    templateOptions.appendChild(
        wrapper
    );
}


// ============================================================
// EDITOR DE PRODUCTOS
// Se conserva como capacidad genérica para futuras plantillas.
// ============================================================

function renderProductsOption(
    option
) {
    const wrapper =
        document.createElement(
            "div"
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

    editor.dataset.productsEditor =
        option.id;

    wrapper.append(
        title,
        editor
    );

    const defaultProducts =
        Array.isArray(
            option.default
        )
            ? option.default
            : [];

    defaultProducts.forEach(
        product => {
            addProductRow(
                editor,
                product
            );
        }
    );

    const addButton =
        document.createElement(
            "button"
        );

    addButton.type =
        "button";

    addButton.className =
        "add-product-button";

    addButton.textContent =
        "Añadir producto";

    addButton.addEventListener(
        "click",
        () => {
            addProductRow(
                editor
            );
        }
    );

    wrapper.appendChild(
        addButton
    );

    templateOptions.appendChild(
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

    row.innerHTML = `
        <label>
            SKU

            <input
                type="text"
                data-product="sku"
                value="${escapeAttribute(
        product.sku || ""
    )}"
                placeholder="PROD001"
            >
        </label>

        <label>
            Nombre

            <input
                type="text"
                data-product="title"
                value="${escapeAttribute(
        product.title || ""
    )}"
                placeholder="Producto"
            >
        </label>

        <label>
            Precio

            <input
                type="number"
                step="0.01"
                min="0"
                data-product="price"
                value="${escapeAttribute(
        product.price ?? ""
    )}"
            >
        </label>
    `;

    const removeButton =
        document.createElement(
            "button"
        );

    removeButton.type =
        "button";

    removeButton.className =
        "remove-product-button";

    removeButton.textContent =
        "Eliminar";

    removeButton.addEventListener(
        "click",
        () => {
            row.remove();
        }
    );

    row.appendChild(
        removeButton
    );

    editor.appendChild(
        row
    );
}


// ============================================================
// EDITOR UNIVERSAL DE CLASES JAVASCRIPT
// ============================================================

function renderClassesOption(
    option
) {
    const wrapper =
        document.createElement(
            "div"
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
        "Crea cualquier clase JavaScript. Puedes definir sus atributos, métodos, parámetros y getters/setters.";

    const editor =
        document.createElement(
            "div"
        );

    editor.className =
        "classes-editor";

    editor.dataset.classesEditor =
        option.id;

    wrapper.append(
        title,
        explanation,
        editor
    );

    const defaultClasses =
        Array.isArray(
            option.default
        )
            ? option.default
            : [];

    defaultClasses.forEach(
        classDefinition => {

            addClassEditor(
                editor,
                classDefinition
            );
        }
    );

    const addButton =
        document.createElement(
            "button"
        );

    addButton.type =
        "button";

    addButton.className =
        "add-class-button";

    addButton.textContent =
        "Añadir clase";

    addButton.addEventListener(
        "click",
        () => {

            addClassEditor(
                editor
            );
        }
    );

    wrapper.appendChild(
        addButton
    );

    templateOptions.appendChild(
        wrapper
    );
}


function addClassEditor(
    editor,
    classDefinition = {}
) {
    const classBox =
        document.createElement(
            "div"
        );

    classBox.className =
        "class-editor";

    const attributes =
        Array.isArray(
            classDefinition.attributes
        )
            ? classDefinition.attributes.join(
                ", "
            )
            : "";

    classBox.innerHTML = `
        <label>
            Nombre de la clase

            <input
                type="text"
                data-class-name
                value="${escapeAttribute(
        classDefinition.name || ""
    )}"
                placeholder="Biblioteca"
            >
        </label>

        <label>
            Atributos

            <input
                type="text"
                data-class-attributes
                value="${escapeAttribute(
        attributes
    )}"
                placeholder="libros, nombre, direccion"
            >
        </label>

        <label class="class-checkbox">

            <input
                type="checkbox"
                data-class-accessors
                ${classDefinition
            .generateAccessors ===
            true
            ? "checked"
            : ""
        }
            >

            Generar getters y setters

        </label>

        <div class="methods-editor">

            <h4>
                Métodos
            </h4>

            <div
                data-methods-container
            ></div>

            <button
                type="button"
                class="add-method-button"
            >
                Añadir método
            </button>

        </div>
    `;

    const methodsContainer =
        classBox.querySelector(
            "[data-methods-container]"
        );

    const defaultMethods =
        Array.isArray(
            classDefinition.methods
        )
            ? classDefinition.methods
            : [];

    defaultMethods.forEach(
        method => {

            addMethodEditor(
                methodsContainer,
                method
            );
        }
    );

    const addMethodButton =
        classBox.querySelector(
            ".add-method-button"
        );

    addMethodButton.addEventListener(
        "click",
        () => {

            addMethodEditor(
                methodsContainer
            );
        }
    );

    const removeClassButton =
        document.createElement(
            "button"
        );

    removeClassButton.type =
        "button";

    removeClassButton.className =
        "remove-class-button";

    removeClassButton.textContent =
        "Eliminar clase";

    removeClassButton.addEventListener(
        "click",
        () => {
            classBox.remove();
        }
    );

    classBox.appendChild(
        removeClassButton
    );

    editor.appendChild(
        classBox
    );
}


function addMethodEditor(
    container,
    methodDefinition = {}
) {
    const row =
        document.createElement(
            "div"
        );

    row.className =
        "method-row";

    const parameters =
        Array.isArray(
            methodDefinition.parameters
        )
            ? methodDefinition.parameters.join(
                ", "
            )
            : "";

    row.innerHTML = `
        <label>
            Método

            <input
                type="text"
                data-method-name
                value="${escapeAttribute(
        methodDefinition.name || ""
    )}"
                placeholder="buscarLibro"
            >
        </label>

        <label>
            Parámetros

            <input
                type="text"
                data-method-parameters
                value="${escapeAttribute(
        parameters
    )}"
                placeholder="isbn, usuario"
            >
        </label>
    `;

    const removeButton =
        document.createElement(
            "button"
        );

    removeButton.type =
        "button";

    removeButton.className =
        "remove-method-button";

    removeButton.textContent =
        "Eliminar";

    removeButton.addEventListener(
        "click",
        () => {
            row.remove();
        }
    );

    row.appendChild(
        removeButton
    );

    container.appendChild(
        row
    );
}


// ============================================================
// RECOGIDA DE LA CONFIGURACIÓN
// ============================================================

function escapeAttribute(value) {
    return String(value)
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        );
}


function splitCommaSeparatedValues(
    value
) {
    const text =
        String(value || "")
            .trim();

    if (!text) {
        return [];
    }

    return text
        .split(",")
        .map(
            item => item.trim()
        )
        .filter(Boolean);
}


function collectOptions() {
    const options = {};

    collectNormalOptions(
        options
    );

    collectProductOptions(
        options
    );

    collectClassOptions(
        options
    );

    return options;
}


function collectNormalOptions(
    options
) {
    const normalInputs =
        templateOptions.querySelectorAll(
            "[data-option]"
        );

    normalInputs.forEach(
        input => {

            let value =
                input.value;

            if (
                input.dataset.optionType ===
                "number"
            ) {
                value =
                    Number(value);
            }

            options[
                input.dataset.option
            ] = value;
        }
    );
}


function collectProductOptions(
    options
) {
    const productEditors =
        templateOptions.querySelectorAll(
            "[data-products-editor]"
        );

    productEditors.forEach(
        editor => {

            const rows =
                editor.querySelectorAll(
                    ".product-row"
                );

            const products =
                [...rows].map(
                    row => {

                        const skuInput =
                            row.querySelector(
                                "[data-product='sku']"
                            );

                        const titleInput =
                            row.querySelector(
                                "[data-product='title']"
                            );

                        const priceInput =
                            row.querySelector(
                                "[data-product='price']"
                            );

                        return {
                            sku:
                                skuInput
                                    ? skuInput.value.trim()
                                    : "",

                            title:
                                titleInput
                                    ? titleInput.value.trim()
                                    : "",

                            price:
                                priceInput
                                    ? Number(
                                        priceInput.value
                                    )
                                    : 0
                        };
                    }
                );

            options[
                editor.dataset.productsEditor
            ] = products;
        }
    );
}


function collectClassOptions(
    options
) {
    const classEditors =
        templateOptions.querySelectorAll(
            "[data-classes-editor]"
        );

    classEditors.forEach(
        editor => {

            const classBoxes =
                editor.querySelectorAll(
                    ".class-editor"
                );

            const classes =
                [...classBoxes]
                    .map(
                        classBox => {

                            const nameInput =
                                classBox.querySelector(
                                    "[data-class-name]"
                                );

                            const attributesInput =
                                classBox.querySelector(
                                    "[data-class-attributes]"
                                );

                            const accessorsInput =
                                classBox.querySelector(
                                    "[data-class-accessors]"
                                );

                            const methodRows =
                                classBox.querySelectorAll(
                                    ".method-row"
                                );

                            const methods =
                                [...methodRows]
                                    .map(
                                        row => {

                                            const methodNameInput =
                                                row.querySelector(
                                                    "[data-method-name]"
                                                );

                                            const parametersInput =
                                                row.querySelector(
                                                    "[data-method-parameters]"
                                                );

                                            return {
                                                name:
                                                    methodNameInput
                                                        ? methodNameInput
                                                            .value
                                                            .trim()
                                                        : "",

                                                parameters:
                                                    splitCommaSeparatedValues(
                                                        parametersInput
                                                            ? parametersInput.value
                                                            : ""
                                                    )
                                            };
                                        }
                                    )
                                    .filter(
                                        method =>
                                            method.name !==
                                            ""
                                    );

                            return {
                                name:
                                    nameInput
                                        ? nameInput
                                            .value
                                            .trim()
                                        : "",

                                attributes:
                                    splitCommaSeparatedValues(
                                        attributesInput
                                            ? attributesInput.value
                                            : ""
                                    ),

                                methods,

                                generateAccessors:
                                    accessorsInput
                                        ? accessorsInput.checked
                                        : false
                            };
                        }
                    )
                    .filter(
                        classDefinition =>
                            classDefinition.name !==
                            ""
                    );

            options[
                editor.dataset.classesEditor
            ] = classes;
        }
    );
}


// ============================================================
// RESULTADO Y GENERACIÓN
// ============================================================

function showError(message) {
    result.className =
        "error";

    result.textContent =
        `ERROR\n\n${message}`;
}


function showSuccess(data) {
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
                .join("\n")
            : "";

    const languages =
        Array.isArray(
            data.languages
        )
            ? data.languages
                .map(
                    language =>
                        language.toUpperCase()
                )
                .join(", ")
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
            selectedLanguages.length === 0
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

        submitButton.disabled = true;

        submitButton.textContent =
            "Generando...";

        result.className = "";

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
                            JSON.stringify({
                                basePath:
                                    basePathInput.value,

                                projectName:
                                    projectNameInput.value,

                                languages:
                                    selectedLanguages,

                                templateId:
                                    templateSelect.value,

                                overwrite:
                                    overwriteCheckbox.checked,

                                options:
                                    collectOptions()
                            })
                    }
                );

            const data =
                await response.json();

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
            submitButton.disabled = false;

            submitButton.textContent =
                "Generar proyecto";
        }
    }
);


languageCheckboxes.forEach(
    checkbox => {

        checkbox.addEventListener(
            "change",
            populateTemplateSelect
        );
    }
);


templateSelect.addEventListener(
    "change",
    templateChanged
);


loadTemplates();