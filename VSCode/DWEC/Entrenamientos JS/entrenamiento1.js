const calificacion = 6.4;

if (calificacion < 4) {
    console.log("Muy deficiente.");
} else if (calificacion < 6) {
    console.log("Insuficiente.");
} else if (calificacion < 7) {
    console.log("Bien.");
} else if (calificacion < 9) {
    console.log("Notable.");
} else if (calificacion <= 10) {
    console.log("Sobresaliente!");
} else {
    console.log("Nota inválida.");
}