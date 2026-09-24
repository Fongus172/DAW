let horas = 17;
let minutos = 12;
let segundos = 16;

segundos += 1;

if (segundos >= 60) {
    segundos -= 60;
    minutos += 1;
}
if (minutos >= 60) {
    minutos -= 60;
    horas += 1;
}

console.log("La hora, pasado un segundo, es " + horas + ":" + minutos + ":" + segundos);