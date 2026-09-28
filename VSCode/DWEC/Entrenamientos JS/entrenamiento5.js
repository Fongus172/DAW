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



realizarCalculos(arrayNums);