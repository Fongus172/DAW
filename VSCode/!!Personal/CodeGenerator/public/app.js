const form =
    document.getElementById(
        "generator-form"
    );


const basePathInput =
    document.getElementById(
        "base-path"
    );


const projectNameInput =
    document.getElementById(
        "project-name"
    );


const templateSelect =
    document.getElementById(
        "template"
    );


const templateInformation =
    document.getElementById(
        "template-information"
    );


const templateOptions =
    document.getElementById(
        "template-options"
    );


const overwriteCheckbox =
    document.getElementById(
        "overwrite"
    );


const result =
    document.getElementById(
        "result"
    );


const languageCheckboxes =
    [
        ...document.querySelectorAll(
            "#languages input[type='checkbox']"
        )
    ];


let templates = [];


async function loadTemplates() {

    try {

        const response =
            await fetch(
                "/api/templates"
            );


        if (!response.ok) {

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

                return selectedLanguages.every(
                    language =>

                        template
                            .supportedLanguages
                            .includes(language)

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


    const previousStillExists =
        compatibleTemplates.some(
            template =>
                template.id ===
                previousValue
        );


    if (previousStillExists) {

        templateSelect.value =
            previousValue;
    }


    templateChanged();
}


function enforceRequiredLanguages(
    template
) {

    releaseLanguageLocks();


    template.requiredLanguages.forEach(
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

        templateOptions.innerHTML = "";

        return;
    }


    enforceRequiredLanguages(
        template
    );


    const languages =
        template
            .supportedLanguages
            .map(
                language =>
                    language.toUpperCase()
            )
            .join(", ");


    const automaticClasses =
        template.automaticClasses ||
        [];


    const automaticClassesHtml =
        automaticClasses.length > 0

            ? `
            <p>
                <strong>
                    Clases que la plantilla generará automáticamente:
                </strong>

                ${automaticClasses.join(", ")}
            </p>
        `

            : "";


    templateInformation.innerHTML =
        `
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


function renderTemplateOptions(
    template
) {

    templateOptions.innerHTML = "";


    if (
        !template.options ||
        template.options.length === 0
    ) {

        templateOptions.textContent =
            "Esta plantilla no necesita configuración adicional.";

        return;
    }


    template.options.forEach(
        option => {

            renderOption(option);

        }
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


        option.choices.forEach(
            choice => {

                const selectOption =
                    document.createElement(
                        "option"
                    );


                selectOption.value =
                    choice.value;


                selectOption.textContent =
                    choice.label;


                if (
                    choice.value ===
                    option.default
                ) {

                    selectOption.selected = true;
                }


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
            option.type;


        input.value =
            option.default ?? "";


        if (
            option.type === "number"
        ) {

            input.step = "any";
        }
    }


    input.dataset.option =
        option.id;


    input.dataset.optionType =
        option.type;


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
        option.default || [];


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


    row.innerHTML =
        `
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
        "Crea cualquier clase JavaScript. Puedes definir sus atributos y métodos independientemente del tipo de proyecto.";


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
    editor
) {

    const classBox =
        document.createElement(
            "div"
        );


    classBox.className =
        "class-editor";


    classBox.innerHTML =
        `
    <label>
        Nombre de la clase

        <input
            type="text"
            data-class-name
            placeholder="Biblioteca"
        >
    </label>


    <label>
        Atributos

        <input
            type="text"
            data-class-attributes
            placeholder="libros, nombre, direccion"
        >
    </label>


    <label class="class-checkbox">

        <input
            type="checkbox"
            data-class-accessors
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
    container
) {

    const row =
        document.createElement(
            "div"
        );


    row.className =
        "method-row";


    row.innerHTML =
        `
    <label>
        Método

        <input
            type="text"
            data-method-name
            placeholder="buscarLibro"
        >
    </label>


    <label>
        Parámetros

        <input
            type="text"
            data-method-parameters
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


    const description =
        document.createElement(
            "p"
        );


    description.className =
        "help-text";


    description.textContent =
        "La clase Carrito se generará automáticamente. Aquí puedes crear todas las clases adicionales que necesite tu proyecto.";


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
        description,
        editor
    );


    const defaultClasses =
        option.default ||
        [];


    defaultClasses.forEach(
        classDefinition => {

            addClassRow(
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

            addClassRow(
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


function addClassRow(
    editor,
    classDefinition = {}
) {

    const row =
        document.createElement(
            "div"
        );


    row.className =
        "class-row";


    const attributes =
        Array.isArray(
            classDefinition.attributes
        )

            ? classDefinition
                .attributes
                .join(", ")

            : "";


    row.innerHTML =
        `
            <label>
                Nombre de la clase

                <input
                    type="text"
                    data-class="name"
                    value="${escapeAttribute(
            classDefinition.name || ""
        )}"
                    placeholder="Cliente"
                >
            </label>

            <label>
                Atributos

                <input
                    type="text"
                    data-class="attributes"
                    value="${escapeAttribute(
            attributes
        )}"
                    placeholder="nombre, email, edad"
                >
            </label>

            <label class="class-checkbox">

                <input
                    type="checkbox"
                    data-class="accessors"
                    ${classDefinition
            .generateAccessors

            ? "checked"
            : ""
        }
                >

                Generar getters y setters

            </label>
        `;


    const removeButton =
        document.createElement(
            "button"
        );


    removeButton.type =
        "button";


    removeButton.className =
        "remove-class-button";


    removeButton.textContent =
        "Eliminar clase";


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


function escapeAttribute(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll('"', "&quot;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}


function collectOptions() {

    const options = {};


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

                        const sku =
                            row.querySelector(
                                "[data-product='sku']"
                            ).value;


                        const title =
                            row.querySelector(
                                "[data-product='title']"
                            ).value;


                        const price =
                            Number(
                                row.querySelector(
                                    "[data-product='price']"
                                ).value
                            );


                        return {
                            sku,
                            title,
                            price
                        };

                    }
                );


            options[
                editor.dataset.productsEditor
            ] = products;

        }
    );

    const classEditors =
        templateOptions.querySelectorAll(
            "[data-classes-editor]"
        );


    classEditors.forEach(
        editor => {

            const rows =
                editor.querySelectorAll(
                    ".class-row"
                );


            const classes =
                [...rows]

                    .map(
                        row => {

                            const name =
                                row.querySelector(
                                    "[data-class='name']"
                                )
                                    .value
                                    .trim();


                            const attributesText =
                                row.querySelector(
                                    "[data-class='attributes']"
                                )
                                    .value
                                    .trim();


                            const attributes =
                                attributesText

                                    ? attributesText
                                        .split(",")
                                        .map(
                                            attribute =>
                                                attribute.trim()
                                        )
                                        .filter(Boolean)

                                    : [];


                            const generateAccessors =
                                row.querySelector(
                                    "[data-class='accessors']"
                                )
                                    .checked;


                            return {

                                name,

                                attributes,

                                generateAccessors

                            };

                        }
                    )

                    .filter(
                        classDefinition => {

                            return (
                                classDefinition.name ||
                                classDefinition
                                    .attributes
                                    .length > 0
                            );

                        }
                    );


            options[
                editor.dataset
                    .classesEditor
            ] = classes;

        }
    );

    return options;
}


function showError(message) {

    result.className =
        "error";


    result.textContent =
        "ERROR\n\n" +
        message;
}


function showSuccess(data) {

    result.className =
        "success";


    const fileList =
        data.files
            .map(
                file =>
                    "  " + file
            )
            .join("\n");


    result.textContent =
        `PROYECTO GENERADO CORRECTAMENTE

Proyecto:
${data.projectName}

Plantilla:
${data.template}

Ruta:
${data.projectDirectory}

Lenguajes:
${data.languages
            .map(language =>
                language.toUpperCase()
            )
            .join(", ")}

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
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

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


            showSuccess(data);

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