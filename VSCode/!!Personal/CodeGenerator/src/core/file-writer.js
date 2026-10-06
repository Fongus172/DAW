const fs = require("fs/promises");
const path = require("path");


async function exists(filePath) {

    try {

        await fs.access(filePath);

        return true;

    } catch {

        return false;
    }
}


function resolveSafePath(
    projectDirectory,
    relativeFilePath
) {

    const projectRoot =
        path.resolve(projectDirectory);

    const resolvedPath =
        path.resolve(
            projectRoot,
            relativeFilePath
        );


    if (
        resolvedPath !== projectRoot &&
        !resolvedPath.startsWith(
            projectRoot + path.sep
        )
    ) {

        throw new Error(
            `Ruta de archivo no permitida: ${relativeFilePath}`
        );
    }


    return resolvedPath;
}


async function writeProjectFiles(
    projectDirectory,
    files,
    overwrite = false
) {

    const entries = Object.entries(files);

    if (entries.length === 0) {

        throw new Error(
            "La plantilla no ha generado ningún archivo."
        );
    }


    /*
        Primero comprobamos conflictos.

        Así evitamos escribir medio proyecto
        y descubrir después que otro archivo
        ya existía.
    */
    for (const [relativePath] of entries) {

        const destination =
            resolveSafePath(
                projectDirectory,
                relativePath
            );

        if (
            !overwrite &&
            await exists(destination)
        ) {

            throw new Error(
                `El archivo "${relativePath}" ya existe. ` +
                `Activa la opción de sobrescritura para reemplazarlo.`
            );
        }
    }


    await fs.mkdir(
        projectDirectory,
        {
            recursive: true
        }
    );


    const writtenFiles = [];


    for (
        const [relativePath, content]
        of entries
    ) {

        const destination =
            resolveSafePath(
                projectDirectory,
                relativePath
            );


        await fs.mkdir(
            path.dirname(destination),
            {
                recursive: true
            }
        );


        await fs.writeFile(
            destination,
            content,
            "utf8"
        );


        writtenFiles.push(destination);
    }


    return writtenFiles;
}


module.exports = {
    writeProjectFiles
};