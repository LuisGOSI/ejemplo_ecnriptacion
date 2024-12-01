require ("dotenv").config();
const clave = process.env.TEXTO_LIBRO; ;

// Alfabeto para la sustitución
const alfabeto = "abcdefghijklmnñopqrstuvwxyz";

// Función para generar la clave extendida
function generarClaveExtendida(texto, longitudClave) {
    const claveLimpia = texto.toLowerCase().replace(/[^a-zñ]/g, ""); // Limpia caracteres no alfabéticos
    let claveExtendida = "";
    while (claveExtendida.length < longitudClave) {
        claveExtendida += claveLimpia;
    }
    return claveExtendida.slice(0, longitudClave); // Recorta al tamaño necesario
}

// Función para cifrar el texto usando una clave polialfabética
function cifrarTextoPolialfabetico(texto, clave) {
    const claveExtendida = generarClaveExtendida(clave, texto.length);
    return texto
        .toLowerCase()
        .split("")
        .map((caracter, i) => {
            if (!alfabeto.includes(caracter)) return caracter; // Mantén caracteres no alfabéticos
            const posicionTexto = alfabeto.indexOf(caracter);
            const posicionClave = alfabeto.indexOf(claveExtendida[i]);
            const nuevaPosicion = (posicionTexto + posicionClave) % alfabeto.length;
            return alfabeto[nuevaPosicion];
        })
        .join("");
}

// Función para descifrar el texto usando una clave polialfabética
function descifrarTextoPolialfabetico(textoCifrado, clave) {
    const claveExtendida = generarClaveExtendida(clave, textoCifrado.length);
    return textoCifrado
        .toLowerCase()
        .split("")
        .map((caracter, i) => {
            if (!alfabeto.includes(caracter)) return caracter; // Mantén caracteres no alfabéticos
            const posicionTexto = alfabeto.indexOf(caracter);
            const posicionClave = alfabeto.indexOf(claveExtendida[i]);
            const nuevaPosicion =
                (posicionTexto - posicionClave + alfabeto.length) % alfabeto.length;
            return alfabeto[nuevaPosicion];
        })
        .join("");
}

// Texto que quieres cifrar
const textoOriginal = "hay que vernos el dia de mañana a las diez am en el parque";

// Cifrar el texto
const textoCifrado = cifrarTextoPolialfabetico(textoOriginal, clave);
console.log(`Texto original: ${textoOriginal}`);
console.log(`Texto cifrado: ${textoCifrado}`);

// Descifrar el texto cifrado
const textoDescifrado = descifrarTextoPolialfabetico(textoCifrado, clave);
console.log(`Texto descifrado: ${textoDescifrado}`);

