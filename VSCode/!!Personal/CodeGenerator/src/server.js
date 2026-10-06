const http = require("http");
const fs = require("fs/promises");
const path = require("path");
const { URL } = require("url");

const {
    getTemplatesMetadata
} = require("./core/registry");

const {
    generateProject
} = require("./core/project-generator");


const HOST = "127.0.0.1";
const PORT = 3000;

const publicDirectory = path.join(__dirname, "..", "public");


function sendJson(res, statusCode, data) {

    const body = JSON.stringify(data, null, 2);

    res.writeHead(statusCode, {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Length": Buffer.byteLength(body)
    });

    res.end(body);
}


function getMimeType(filePath) {

    const extension = path.extname(filePath).toLowerCase();

    const mimeTypes = {
        ".html": "text/html; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".js": "text/javascript; charset=utf-8",
        ".json": "application/json; charset=utf-8",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".svg": "image/svg+xml",
        ".ico": "image/x-icon"
    };

    return mimeTypes[extension] || "application/octet-stream";
}


async function readJsonBody(req) {

    const chunks = [];

    let totalSize = 0;

    for await (const chunk of req) {

        totalSize += chunk.length;

        if (totalSize > 2 * 1024 * 1024) {
            throw new Error("La petición es demasiado grande.");
        }

        chunks.push(chunk);
    }

    const body = Buffer.concat(chunks).toString("utf8");

    if (!body) {
        return {};
    }

    try {

        return JSON.parse(body);

    } catch {

        throw new Error("El cuerpo de la petición no contiene JSON válido.");
    }
}


async function serveStaticFile(urlPath, res) {

    let requestedPath = decodeURIComponent(urlPath);

    if (requestedPath === "/") {
        requestedPath = "/index.html";
    }

    const filePath = path.resolve(
        publicDirectory,
        "." + requestedPath
    );

    const publicRoot = path.resolve(publicDirectory);

    if (
        filePath !== publicRoot &&
        !filePath.startsWith(publicRoot + path.sep)
    ) {

        sendJson(res, 403, {
            error: "Acceso denegado."
        });

        return;
    }

    try {

        const content = await fs.readFile(filePath);

        res.writeHead(200, {
            "Content-Type": getMimeType(filePath)
        });

        res.end(content);

    } catch (error) {

        if (error.code === "ENOENT") {

            sendJson(res, 404, {
                error: "Archivo no encontrado."
            });

            return;
        }

        throw error;
    }
}


const server = http.createServer(async (req, res) => {

    try {

        const url = new URL(
            req.url,
            `http://${req.headers.host}`
        );

        /*
            GET /api/templates

            Devuelve todas las plantillas registradas.
        */
        if (
            req.method === "GET" &&
            url.pathname === "/api/templates"
        ) {

            sendJson(
                res,
                200,
                getTemplatesMetadata()
            );

            return;
        }


        /*
            GET /api/health

            Útil simplemente para comprobar que el servidor funciona.
        */
        if (
            req.method === "GET" &&
            url.pathname === "/api/health"
        ) {

            sendJson(res, 200, {
                status: "ok"
            });

            return;
        }


        /*
            POST /api/generate

            Genera físicamente el proyecto.
        */
        if (
            req.method === "POST" &&
            url.pathname === "/api/generate"
        ) {

            try {

                const configuration =
                    await readJsonBody(req);

                const result =
                    await generateProject(configuration);

                sendJson(res, 200, {
                    success: true,
                    ...result
                });

            } catch (error) {

                sendJson(res, 400, {
                    success: false,
                    error: error.message
                });
            }

            return;
        }


        /*
            Cualquier otra URL corresponde a
            los archivos de la interfaz.
        */
        if (req.method === "GET") {

            await serveStaticFile(
                url.pathname,
                res
            );

            return;
        }


        sendJson(res, 405, {
            error: "Método no permitido."
        });

    } catch (error) {

        console.error(error);

        sendJson(res, 500, {
            error: "Error interno del servidor."
        });
    }
});


server.listen(PORT, HOST, () => {

    console.log("");
    console.log("======================================");
    console.log("       CODE GENERATOR LOCAL");
    console.log("======================================");
    console.log("");
    console.log(
        `Aplicación disponible en http://${HOST}:${PORT}`
    );
    console.log("");
    console.log("Pulsa Ctrl + C para cerrar.");
    console.log("");
});