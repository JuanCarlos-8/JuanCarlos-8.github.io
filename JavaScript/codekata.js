//kata code js
//Kata code es una plataforma de entrenamiento para programadores que ofrece ejercicios de codificación en varios lenguajes de programación. Los usuarios pueden practicar sus habilidades de programación resolviendo problemas y desafíos, y también pueden comparar sus soluciones con las de otros usuarios. La plataforma es popular entre los desarrolladores que buscan mejorar sus habilidades de codificación y prepararse para entrevistas técnicas.

/*function getCopyright(nombre, ano) { //Definimos la función getCopyright que toma dos parámetros: nombre y ano
    let copyright = nombre + " " + ano; //Creamos una variable copyright que concatena el nombre y el año con un espacio entre ellos
    return copyright; //Devolvemos el valor de copyright
}

let resultado = getCopyright("KataCode", 2026); //Llamamos a la función getCopyright con los argumentos "KataCode" y 2026, y almacenamos el resultado en la variable resultado
console.log(resultado); */ //Imprimimos el valor de resultado en la consola

//En este ejemplo, la función getCopyright toma dos parámetros, nombre y ano, y devuelve una cadena que combina ambos valores. Luego, se llama a la función con los argumentos "KataCode" y 2026, y el resultado se imprime en la consola.

//OPEN KATA

/*let hasPizza = true;

if (hasPizza == false) {
    console.log("No tengo pizza");
} else if (hasPizza == true) {
    console.log("Tengo pizza");
} else {
    console.log(hasPizza);
}*/
/*let year = false;

if (year != true) {
    console.log("Ok");
}*/
/*let year = 2023;

if (year == 2023) {
    console.log("Ok");
}*/

/*let company = "OpenWebinars";
const year = 2023;

function getAcademyInfo() {
    let format = "from " + company;

    if (!year) {
        let format = "Make in " + company;
        return format;
    }
    
    return format + " in " + year;
} */


//Code Kata: Practica los ambitos
function printName() {
    let name = "Juan Carlos";
    console.log(name);
    
    if (name === "Juan Carlos") {
        let surname = "Gómez";
        console.log(surname);
    }
}

printName();