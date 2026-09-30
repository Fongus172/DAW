const arrayNums = [];

for (let i = 0; i < 100; i++) {
    arrayNums.push(Math.trunc(Math.random() * 10) / 10);
}

function realizarCalculos(arrayNums) {
    console.log(mediaArray(arrayNums));
    console.log(medianaArray(arrayNums));
    console.log(sumaArray(arrayNums));
    console.log(maximoArray(arrayNums));
    console.log(minimoArray(arrayNums));
    console.log(masRepetidoArray(arrayNums));
}

function mediaArray(arrayNums) {
    let sumaMedia = 0;

    for (let i = 0; i < arrayNums.length; i++) {
        sumaMedia += arrayNums[i];
    }

    return "La media es de " + (sumaMedia / arrayNums.length);
}

function medianaArray(arrayNums) {
    arrayNums.sort();

    return "La mediana es de " + ((arrayNums[49] + arrayNums[50]) / 2);
}

function sumaArray(arrayNums) {
    let sumaIndices = 0;

    for (let i = 0; i < arrayNums.length; i++) {
        sumaIndices += arrayNums[i];
    }

    return "La suma es de " + sumaIndices;
}

function maximoArray(arrayNums) {
    arrayNums.sort();

    return "El máximo es " + arrayNums[99];
}

function minimoArray(arrayNums) {
    arrayNums.sort();

    return "El mínimo es " + arrayNums[0];
}

function masRepetidoArray(arrayNums) {
    let frecuencias = {};
    let maxFrequencia = 0;
    let masRep;

    for (let i = 0; i < arrayNums.length; i++) {

        //Si el numero ya esta registrado, aumentamos su frecuencia
        if (arrayNums[i] in frecuencias) {
            frecuencias[arrayNums[i]] += 1;
        } else {
            // Si aparece por primera vez, su frecuencia es 1
            frecuencias[arrayNums[i]] = 1;
        }

        if (frecuencias[arrayNums[i]] > maxFrequencia) {
            maxFrequencia = frecuencias[arrayNums[i]];
            masRep = arrayNums[i];
        }
    }

    return "El valor más repetido es " + masRep;
}

realizarCalculos(arrayNums);