import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const rl = readline.createInterface({ input, output });

console.log("====== PIEDRA, PAPEL, TIJERA ======")
console.log("");
console.log("Debes elegir una de las tres jugadas posibles: piedra (P), papel (L) o tijera (T). El resto dependerá de tu suerte ;)");
console.log("");

let op = await rl.question("Elige tu jugada: ");

while (op !== "P" && op !== "L" && op !== "T" &&
    op !== "p" && op !== "l" && op !== "t") {
    op = await rl.question("Opcion inválida. Escript 'P', 'L' o 'T': ");
}

switch (op) {
    case "p":
        op = "P";
        break;
    case "l":
        op = "L";
        break;
    case "t":
        op = "T";
        break;
    default:
        break;
}

rl.close();

let opCPU = jugadaCPU();

console.log(obtenerResultado(op, opCPU));

function jugadaCPU() {
    let num = Math.floor(Math.random() * 3);

    switch (num) {
        case 0:
            return "P";
        case 1:
            return "L";
        case 2:
            return "T";
    }
}

function obtenerResultado(op, opCPU) {
    let mov;
    let movCPU;

    switch (op) {
        case "P":
            mov = "Piedra";
            break;
        case "L":
            mov = "Papel";
            break;
        case "T":
            mov = "Tijera";
            break;
    }

    switch (opCPU) {
        case "P":
            movCPU = "Piedra";
            break;
        case "L":
            movCPU = "Papel";
            break;
        case "T":
            movCPU = "Tijera";
            break;
    }

    console.log("Sacas " + mov);

    if (op === opCPU) {
        return "Tu oponente también ha sacado " + movCPU + ". Empate";
    }

    if ((op === "P" && opCPU === "T") ||
        (op === "L" && opCPU === "P") ||
        (op === "T" && opCPU === "L")) {
        return "Tu oponente ha sacado " + movCPU + ", ¡has ganado!";
    } else {
        return "Tu oponente ha sacado " + movCPU + ". Has perdido...";
    }
}