require ("dotenv").config();
const clave = process.env.TEXTO_LIBRO;
const crypto = require("crypto");


const alfabeto = "abcdefghijklmnñopqrstuvwxyz";

// Función para generar la clave extendida
function generarClaveExtendida(texto, longitudClave) {
    const claveLimpia = texto.toLowerCase().replace(/[^a-zñ]/g, ""); 
    let claveExtendida = "";
    while (claveExtendida.length < longitudClave) {
        claveExtendida += claveLimpia;
    }
    return claveExtendida.slice(0, longitudClave); 
}

// Función para cifrar el texto 
function cifrarTextoPolialfabetico(texto, clave) {
    const claveExtendida = generarClaveExtendida(clave, texto.length);
    return texto
        .toLowerCase()
        .split("")
        .map((caracter, i) => {
            if (!alfabeto.includes(caracter)) return caracter; 
            const posicionTexto = alfabeto.indexOf(caracter);
            const posicionClave = alfabeto.indexOf(claveExtendida[i]);
            const nuevaPosicion = (posicionTexto + posicionClave) % alfabeto.length;
            return alfabeto[nuevaPosicion];
        })
        .join("");
}

// Función para descifrar el texto 
function descifrarTextoPolialfabetico(textoCifrado, clave) {
    const claveExtendida = generarClaveExtendida(clave, textoCifrado.length);
    return textoCifrado
        .toLowerCase()
        .split("")
        .map((caracter, i) => {
            if (!alfabeto.includes(caracter)) return caracter; 
            const posicionTexto = alfabeto.indexOf(caracter);
            const posicionClave = alfabeto.indexOf(claveExtendida[i]);
            const nuevaPosicion =
                (posicionTexto - posicionClave + alfabeto.length) % alfabeto.length;
            return alfabeto[nuevaPosicion];
        })
        .join("");
}

// Función para calcular el hash 
function calcularHash(texto) {
    return crypto.createHash("sha256").update(texto).digest("hex");
}

// Función para firmar el texto
function firmarTexto(textoCifrado,clave) { 
    const hash = calcularHash(textoCifrado);
    return cifrarTextoPolialfabetico(hash, clave);
}

// Función para verificar la firma
function verificarFirma(textoCifrado, firma, clave) {
    const hash = descifrarTextoPolialfabetico(firma, clave);
    return hash === calcularHash(textoCifrado);
}

// Texto que quieres cifrar
const textoOriginal = "shay que vernos el dia de mañana a las diez am en el parque";

// Cifrar el texto
const textoCifrado = cifrarTextoPolialfabetico(textoOriginal, clave);
console.log(`Texto original: ${textoOriginal}`);
console.log(`Texto cifrado: ${textoCifrado}`);

// Firmar el texto cifrado
const firma = firmarTexto(textoCifrado, clave);
const firmaIncorrecta = "firmaIncorrecta";
console.log(`Firma: ${firma}`);

// Verificar la firma
const esFirmaValida = verificarFirma(textoCifrado, firma, clave);
console.log(`La firma es válida: ${esFirmaValida}`);

// Descifrar el texto cifrado
const textoDescifrado = descifrarTextoPolialfabetico(textoCifrado, clave);
console.log(`Texto descifrado: ${textoDescifrado}`);

