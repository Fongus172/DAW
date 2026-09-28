let min = 0.9;

const arrayNums = [];

for (let i = 0; i < 100; i++) {
    arrayNums.push(Math.random());
}

function valoresArray(min, arrayNums) {
    console.log("Estos son todos los valores mayores que " + min + ":");

    for (let i = 0; i < arrayNums.length; i++) {
        if (arrayNums[i] >= min) {
            console.log(arrayNums[i]);
        }
    }
}

valoresArray(min, arrayNums);