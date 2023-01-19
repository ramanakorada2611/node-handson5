const express = require('express');
const socket = require('socket.io');
const path = require('path');
const PORT = 5050;

const app = express();
app.use(express.static(path.join(__dirname, './public')));

app.get('/', function(req,res){
    res.sendFile(__dirname + './public/index.html');
})

const server = app.listen(PORT, function(){
    console.log(`Server is listening at http://localhost:${PORT}`)
});

const io = socket(server, {cors: {origin : "*"}});    

let name;
io.on("connection", (socket)=>{
    console.log("User is connected");
    socket.on("joining chat", (username)=>{
        name = username;
        io.emit("chat message", `~~~~${name} has joined the chat~~~~`);
    })
    socket.on("disconnect", ()=>{
        io.emit("chat message", `~~~~${name} has left the chat~~~~`);
    })
    socket.on("chat message", (message)=>{
        socket.broadcast.emit("chat message", message);
    })
})