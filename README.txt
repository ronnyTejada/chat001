aplicacion chat para integrar en el servidor principal de level-tech
funciona como una app independiente con sus propios modulos que se comunica atraves
de socket.io para enviar y recibir datos.

una vez clonado el repositorio 

hacer npm install para instalar las dependencias

luego npm run dev.

copiar la ruta generada ej http://localhost:3030/

y pegarla en el archivos involucrados en level-tech/src

level-tech/src/visit/store.js

const io = require("socket.io-client");
const socket = io("tu-ruta");

y agregarla al estado del stora

state = {
	ruta_socket: 'tu-ruta'
}


const io = require("socket.io-client");
const socket = io("tu-ruta");

agregue lineas de codigo al node_modules/level-engine/src/multiplayer