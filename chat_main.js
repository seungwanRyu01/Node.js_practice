const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');


// 사용자와 채팅방을 URL에서 받아오기
const { username, room } = qs.parse( location.search, {
    ignoreQueryPrefix: true,
});


const socket = io();


// 채팅방에 입장하기
socket.emit( 'joinRoom', { username, room });


// 단톡방과 이용자들 정보 받아오기
socket.on( 'roomUsers', ({ room, users }) => {
    outputRoomName( room );
    outputUsers( users );
});



// 메시지를 서버에서 받았을 때
socket.on( 'message', message => {
    console.log( message );
    outputMessage(message);

    // 스크롤 다운
    chatMessages.scrollTop = chatMessages.scrollHeight;
});


// 메시지 전송
chatForm.addEventListener( 'submit', (e) => {
    // preventDefault : a태그를 눌렀을 때 href 링크로 이동하지 않게 막을려고 할 때, form을 submit할 때 새로 실행되지 않게 만들 때 사용
    e.preventDefault();

    const msg = e.target.elements.msg.value;

    msg = msg.trim();

    if ( !msg ) {
        return false;
    }

    // 서버로 메시지 전송
    socket.emit( 'chatMessage', msg );

    // Input창 초기화
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});


// DOM으로 메시지 출력
function outputMessage( message ) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${ message.username }<span>${ message.time }</span></p>
    <p class="text">
        ${ message.text }
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
};


// DOM에 채팅방 추가
function outputRoomName( room ) {
    roomName.innerText = room;
};


// DOM에 이용자들 추가
function outputUsers( users ) {
    userList.innerText = `${ users.map( user => `<li>${ user.username }</li>`).join('') }`;
};