// ==UserScript==
// @name         Lab4
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Lucas Ibarra
// @match        https://cripto.tiiny.site/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js#sha512-a+SUDuwNzXDvz4XrIcXHuCf089/iJAoN4lmrXJg18XnduKK6YlDHNRalv4yd1N40OKI80tFidF+rqTFKGPoWFQ==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function Key(texto) {
        const key = texto.match(/[A-Z]/g);

        if (key) {
            const keyString = key.join('');
            console.log('key: ' + keyString);
            return keyString;
        } else {
            console.log('No se encontraron letras mayúsculas en el texto.');
            return null;
        }
    }

    function obtenerIDsDeDivs() {
        const divs = document.querySelectorAll('div');
        const divIDs = Array.from(divs).map(div => div.id);
        if (divIDs.length > 0) {
            console.log('los mensajes cifrados son: ' + divIDs.length);
            console.log(divIDs.join('\n'));
            return divIDs;
        }else {
            console.log('No se encontraron elementos <div> con IDs.');
            return null;
        }
    }

    function decrypt3DES(ciphertext, key) {
        const keyBytes = CryptoJS.enc.Utf8.parse(key);
        const ciphertextBytes = CryptoJS.enc.Base64.parse(ciphertext);
        const decipher = CryptoJS.TripleDES.decrypt({
            ciphertext: ciphertextBytes
        }, keyBytes, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });

        const plaintext = decipher.toString(CryptoJS.enc.Utf8);

        return plaintext;
    }

    // Selecciona el elemento en el que deseas aplicar la función de almacenar mayúsculas
    // Puedes modificar el selector según tus necesidades
    const elemento = document.querySelector('p'); // Cambia 'p' por el selector adecuado

    if (elemento) {
        // Aplica la función de almacenar mayúsculas al contenido del elemento

        const llave = Key(elemento.textContent);
        const ids = obtenerIDsDeDivs();
        for(let i=0; i < ids.length; i++) {
            console.log('Mensaje descifrado ' +i+ ' : ' + decrypt3DES(ids[i], llave));
        }
        var mensajeContainer = document.getElementById("mensaje-container");

        if (!mensajeContainer) {
            // Si el elemento no existe, créalo dinámicamente
            mensajeContainer = document.createElement("div");
            mensajeContainer.id = "mensaje-container";

            // Agrega el contenedor al cuerpo del documento (o a cualquier otro elemento donde desees agregarlo)
            document.body.appendChild(mensajeContainer);
        }

        // Ahora puedes utilizar el mensajeContainer para mostrar tus mensajes
        for (let i = 0; i < ids.length; i++) {
            var mensajeDescifrado = decrypt3DES(ids[i], llave);
            var mensajeElement = document.createElement("p");
            mensajeElement.textContent = 'Mensaje descifrado ' + i + ' : ' + mensajeDescifrado;
            mensajeContainer.appendChild(mensajeElement);
        }
    }

    // Llama a la función para obtener y mostrar los IDs de los elementos <div> y contarlos
})();