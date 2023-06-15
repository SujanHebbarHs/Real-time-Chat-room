const users=[];

// user joins
function userJoin(id,username,room) {
    const user={id,username,room};

    users.push(user);

    return user;
}

// current user

function getCurrentUser(id) {
    return users.find((user)=>{
        return user.id===id
    });
}

//user leaves
function userLeave(id) {
    const index=users.findIndex((user)=>{
        return user.id===id;
    })

    if(index!=-1){
        return users.splice(index,1)[0]
    }
}

//get all users in room
function getRoomUsers(room) {
    return users.filter((user)=>{
        return user.room===room
    })
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
}