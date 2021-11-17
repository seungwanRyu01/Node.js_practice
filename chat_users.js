const users = [];


// 채팅방에 사용자가 들어갈 때 작동
function userJoin( id, username, room ) {

    const user = { id, username, room };

    users.push(user);

    return user;
};


// 현재의 이용자를 받을 때 작동
function getCurrentUser( id ) {
    return users.find( user => user.id === id );
};


// 이용자가 채팅을 나갔을 때
function userLeave( id ) {
    const index = users.findIndex( user => user.id === id );

    if( index !== -1 ) {
        return users.splice( index, 1 )[0];
    }
};


// 채팅방의 이용자들 체크
function getRoomUsers( room ) {
    return users.filter( user => user.room === room );
};



module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
}