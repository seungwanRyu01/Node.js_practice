const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./chat_messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./chat_users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const PORT = process.env.PORT || 8200;


app.use( express.static (  __dirname + '/public' ));

app.set( "view engine", "ejs" );
app.set( "views", __dirname + "/views" );

// form 전송을 원활하게 만들어 주는 것이 body-parser이다.
const body = require( 'body-parser' );
app.use(body.urlencoded( { extended:false } ));
app.use(body.json());


app.get("/", ( req, res ) => {
    res.render("real_chat");
});


app.post('/chat', function(req,res){

    socket.id = req.body.username;
	res.render('real_client');
});


server.listen( PORT, () => {
    console.log( "listening on *:8200" );
});



const botName = '채팅봇';

// 클라이언트와 연결되었을 때 작동
io.on( 'connection', socket => {
    console.log( 'New WS Connection...' );

    socket.on( 'joinRoom', ({ username, room }) => {

        const user = userJoin( socket.id, username, room );

        socket.join( user.room );

        // 채팅방에 입장했을 때 메시지 송신
        socket.emit( 'message', formatMessage( botName, '채팅앱에 오신 것을 환영합니다!' ));

        // user와 연결되었을 때 자신을 제외하고 메시지 송신
        socket.broadcast.to( user.room ).emit( 'message', formatMessage( botName, `${ user.username }님이 채팅에 참여하였습니다!` ));


        // 이용자들과 단톡방 정보 전송
        io.to( user.room ).emit( 'roomUsers', { room: user.room, users: getRoomUsers( user.room )});
    });


    //chatMessage를 전달받을 때
    socket.on( 'chatMessage', msg => {

        const user = getCurrentUser( socket.id );

        io.to( user.room ).emit( 'message', formatMessage( user.username, msg ));
    });


    // 연결이 끊어졌을 때 작동
    socket.on( 'disconnect', () => {

        const user = userLeave( socket.id );

        if ( user ) {
            io.to( user.room ).emit( 'message', formatMessage( botName, `${ user.username }님이 퇴장하였습니다!` ));

            // 이용자들과 단톡방 정보 전송
            io.to( user.room ).emit( 'roomUsers', { room: user.room, users: getRoomUsers( user.room )});
        }
    });
});