const chatForm=document.getElementById("chat-form");
const chatMessages=document.querySelector('.chat-messages')
const roomName=document.getElementById("room-name");
const roomUsers=document.getElementById("users");

// username and room
const {username,room}=Qs.parse(location.search,{
    ignoreQueryPrefix:true
});


const socket=io();
document.getElementById("msg").focus();

//User join
socket.emit('joinRoom',{username,room})

//Get room info
socket.on('roomUsers',({room,users})=>{
    outputRoomName(room);
    outputUsers(users);
})

//Messages from the server
socket.on('message',(message)=>{
    outputMessage(message);

    // scroll down
    chatMessages.scrollTop=chatMessages.scrollHeight;
    
})

chatForm.addEventListener('submit',(e)=>{

    e.preventDefault();

    const msg=document.getElementById("msg").value;

    // Sending typed message to server
    socket.emit('chatMessage',msg)

    //clear message from input
    document.getElementById("msg").value="";
    document.getElementById("msg").focus();

})

function outputMessage(message) {

    const div=document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`<p class="meta">${message.username} <small>${message.time}</small></p>
    <p class="text">${message.text}</p>`;

    document.querySelector('.chat-messages').appendChild(div);
}

//To add room name
function outputRoomName(room) {
    roomName.innerText=room;
}

//To add or update users in a room
function outputUsers(users) {
    roomUsers.innerHTML=`
    ${users.map((user)=>{
        return `<li>${user.username}</li>`
    }).join('')}`
}
