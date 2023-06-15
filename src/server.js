const express=require("express");
const http=require("http");
const path=require("path");
const socketio=require("socket.io");
const formateMessage=require('../util/messages');
const {userJoin,getCurrentUser,userLeave,getRoomUsers} = require("../util/users");

const app=express();
const server=http.createServer(app);
const io=socketio(server);

const staticPath=path.join(__dirname,"../public");
const botName="ChatBot";

app.use(express.static(path.join(staticPath)));


// Run when client connects
io.on('connection',(socket)=>{

    socket.on('joinRoom',({username,room})=>{   

        const user=userJoin(socket.id,username,room);
            socket.join(user.room)

        // welcome
        socket.emit('message',formateMessage(botName,"Welcome to Chat Room!"));
    
        // client joins
        socket.broadcast.to(user.room).emit('message',formateMessage(botName,`<b>${user.username}</b> has joined the chat. Say "HI"`));

        //Send useer and room info
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getRoomUsers(user.room)
        });
    
    });
    //message sent by client
    socket.on('chatMessage',(msg)=>{
        const user=getCurrentUser(socket.id)

        io.to(user.room).emit('message',formateMessage(user.username,msg));
    });

    // client disconnects
    socket.on('disconnect',()=>{
        const user=userLeave(socket.id);

        io.to(user.room).emit('message',formateMessage(botName,`<b>${user.username}</b> has left the chat`));

        //Send useer and room info
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getRoomUsers(user.room)
        });
    })
});

const PORT=process.env.PORT || 3000

server.listen(PORT,(err)=>{
    if(err)throw err;
    console.log(`Server running on port ${PORT}`);
})