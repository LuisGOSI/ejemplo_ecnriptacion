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

// Arbol de Huffman para comprimir texto cifrado 
class Tree {
    constructor(character, frequency, left = null, right = null) {
        this.character = character;
        this.frequency = frequency;
        this.left = left;
        this.right = right;
    }
    compareTo(other) {
        return this.frequency - other.frequency;
    }
}

function buildTree(text) {
    const counter = new Map();
    for (const char of text) {
        counter.set(char, (counter.get(char) || 0) + 1);
    }

    let priorityQueue = Array.from(counter.entries()).map(([character, frequency]) => new Tree(character, frequency));
    priorityQueue.sort((a, b) => a.compareTo(b));

    while (priorityQueue.length > 1) {
        const left = priorityQueue.shift();
        const right = priorityQueue.shift();
        const parent = new Tree(null, left.frequency + right.frequency, left, right);
        priorityQueue.push(parent);
        priorityQueue.sort((a, b) => a.compareTo(b));
    }

    return priorityQueue[0];
}

function buildMap(root) {
    const encodingMap = {};

    function depthFirstSearch(node, code) {
        if (node.character !== null) {
            encodingMap[node.character] = code.join('');
        } else {
            if (node.left) {
                code.push('0');
                depthFirstSearch(node.left, code);
                code.pop();
            }
            if (node.right) {
                code.push('1');
                depthFirstSearch(node.right, code);
                code.pop();
            }
        }
    }

    depthFirstSearch(root, []);
    return encodingMap;
}

function encode(text) {
    const root = buildTree(text);
    const encodingMap = buildMap(root);
    return text.split('').map(character => encodingMap[character]).join('');
}

function decode(encoded, root) {
    let decoded = [];
    let node = root;

    for (const bit of encoded) {
        if (bit === '0') {
            node = node.left;
        } else {
            node = node.right;
        }

        if (node.character !== null) {
            decoded.push(node.character);
            node = root;
        }
    }

    return decoded.join('');
}

function textToBinary(text) {
    return text.split('').map(character => {
        return character.charCodeAt(0).toString(2).padStart(8, '0'); // Convierte cada carácter a binario (8 bits por carácter)
    }).join(''); // Une los binarios con un espacio entre cada uno
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

// Convertir el texto cifrado a binario
const textoPreComprimido = textToBinary(textoCifrado);
console.log(`Texto pre-comprimido: ${textoPreComprimido}`);

// Comprimir el texto cifrado 
const textoComprimido = encode(textoCifrado);
console.log(`Texto comprimido: ${textoComprimido}`);


// Descomprimir el texto comprimido
const textoDescomprimido = decode(textoComprimido, buildTree(textoCifrado));
console.log(`Texto descomprimido: ${textoDescomprimido}`);