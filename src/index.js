const express = require("express"),
      http = require('http')
const app = express();
const morgan = require('morgan')
const path = require("path")
const server = http.createServer(app)
const io = require('socket.io').listen(server);
const Rooms = require('./models/rooms')
const moment = require('moment')
const {uuid} = require("uuidv4")
const mongoose = require('mongoose');

//importar variables de entorno locales
require('dotenv').config({path: 'variables.env'})


//database
mongoose.connect(process.env.DB_URL)
    .then(db => console.log('DB is connected'))
    .catch(err => console.error(err));




//settings
app.set('port', process.env.PORT || 3000);
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});
//middlewares
app.use(morgan('dev'))
app.use(express.json());

//routes
app.use('/api/rooms',require("./routes/rooms.routes"))


//static files
app.use(express.static(path.join(__dirname, 'public')))


//starting server
const host = process.env.HOST || '0.0.0.0';
server.listen(app.get('port'),host, ()=>{
    console.log("server on port ",app.get('port'))

})
var users = []

//WEB SOCKETS
io.on('connection', async (socket)=>{
    var author = ''
    var receptor = ''
    var currentRoom = {}
    var roomID = ''
   

    socket.on("user_conectado", data => {
        
        
        
        socket.broadcast.emit('new_user',data)
        socket.emit('new_user',data)

       // console.log(data)
    })
    socket.on("typing", data => {
        //console.log(data, "is typing")
        socket.broadcast.emit("on_typing",data)
        socket.broadcast.emit("no_typing",data)

    })
    console.log('connected:', socket.client.id);
    /*socket.on('serverEvent', function (data) {
        console.log('new message from client:', data);
    });
    setInterval(function () {
        socket.emit('clientEvent', Math.random());
        console.log('message sent to the clients');
    }, 3000);*/
    socket.on('chatConnected', async data => {
        
        if(!users.includes(data))
            users = [...users, data]
       
       
    })
    socket.on('selectRoom', async data =>{
        var rooms = await Rooms.find()
        socket.emit('getRoom',rooms)
       // console.log('rooms',rooms)

    })
    

    socket.on('openRoom',async data => {

        author = {'id':data.participants[0].id,'name':data.participants[0].name}
        receptor = data.participants[1].id
        //si no existe en la BD crearla
        roomID = data.id
        socket.join(roomID);
       


        var room = await Rooms.findOne({'id':data.id})
       // console.log('rooms: ',socket.rooms)
        if(!room){
            const room = new Rooms({
                id : data.id,
                participants : data.participants,
                messages : data.messages
            })
            await room.save()
            socket.emit('openedRoom', room)
            currentRoom = room
            //console.log("room creada")
        }else{
            room.participants = data.participants
            room.save()
            currentRoom = room
            socket.emit('openedRoom', room)
            //console.log('current room: ',currentRoom)
        }

        //si existe en la BD obtener toda la info y enviarla al cliente

    })

    

    socket.on('newMsj', async (data) => {
        console.log('new mensaje from event', data.msj)
        

        data.msj.author = author.id
        data.msj.id = uuid()
        data.msj.data.meta = moment().format('h:mm:ss a')
        if(data.msj.type === 'file'){
            console.log(data.msj.data.files)
        }
        //data.receptor = receptor

        var currentRoom = await Rooms.findOne({"id":roomID})
      
        currentRoom.messages = [...currentRoom.messages , data.msj]
        currentRoom.save()
        //socket.broadcast.emit('newMsj', data);
        

        socket.broadcast.emit('newMsj', {msj: data.msj, roomid: roomID, author: author, receptor: receptor})

    }) 

    //data nueva se recibe cuando un usuario cambia de escena o evento
    socket.on('new_count', data => {
        socket.broadcast.emit('update_count',data)
       
    })

    
    
})