//mi primer archivo js
/*let myName = 'Juan Carlos';
console.log(myName);
console.log(typeof(myName));
let edad= 7;
console.log(typeof(edad));
let strEdad = String(edad); // realizo la operacion de Cast
console.log("He cambiado el tipo de variable");
console.log(strEdad);
console.log(typeof(strEdad));
const PI = 3.1416;
function saludar(){
    console.log("Hola")
    //window.alert("Hola");
    //document.write("Hola");
}
saludar();*/

//Se usaron **template strings** en lugar de concatena

//FUNCIONES AUTOINVOCADAS
//Es una función que se ejecuta a sí misma, sin necesidad de ser llamada explícitamente. Se define y se invoca al mismo tiempo. Esto es útil para crear un ámbito local y evitar la contaminación del espacio global.

(function(a, b = 2, c){ //Definimos una función anónima que toma tres parámetros: a, b (con un valor predeterminado de 2) y c
    console.log(a + b + c); //Dentro de la función, sumamos los valores de a, b y c, y los imprimimos en la consola
})(11,undefined,15); //Invocamos la función inmediatamente con los argumentos 11, undefined (lo que hace que b tome el valor predeterminado de 2) y 15

//En este ejemplo, la función anónima se ejecuta inmediatamente después de su definición, sumando los valores de a, b y c, y mostrando el resultado en la consola. El valor de b se establece en 2 debido a que se pasa undefined como argumento.
