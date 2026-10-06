const blankWeb =
    require(
        "../generators/web/blank-web"
    );


const customProject =
    require(
        "../generators/web/custom-project"
    );


const templates = [
    blankWeb,
    customProject
];


function getTemplatesMetadata() {

    return templates.map(
        template =>
            template.metadata
    );
}


function getTemplate(
    templateId
) {

    return templates.find(
        template =>
            template.metadata.id ===
            templateId
    );
}


module.exports = {
    getTemplatesMetadata,
    getTemplate
};