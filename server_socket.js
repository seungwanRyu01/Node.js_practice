let express = require( "express" );
let app = express();
let http = require( "http" ).Server( app );
// 이거 하나만으로도 socket이 발동이 된다.
let io = require( "socket.io" )( http );
const { Socket } = require("dgram");

app.use(express.static(__dirname + '/public'));

app.set( "view engine", "ejs" );
app.set( "views", __dirname + "/views" );

app.get("/", ( req, res ) => {
    res.render("client_socket");
});


// io는 이 서버가 소켓 통신을 하기 위한 전체적인 정보다. 
// socket은 웹페이지를 발동시키는 장본인
// socket 정보는 io가 모두 갖고 있다.
// io에 emit을 때려버리면 전체로 방송된다.
// io.emit하면 정보 다보냄
// Socket.emit하면 전체한테 메세지 다 보냄

// 서버에서 모두에게 보내는거
// io.emit( "이벤트명", "내용" );

// // 클라이언트에서 받는거
// socket.on( "이벤트명", ( data ) => {
// 				console.log( data );
// 			});

// nick array 안에 있는 거 하나하나 socket에 넣어서 

// io.on( "connection", function( socket ))
// 서버에서 발동된 모든 정보를 받아온다.

// socket.on 이벤트가 발동되면은 socket.id는 변하지 않지만 socket.emit 송신을 받는 사람한테 보내짐

// socket.emit 송신을 받는 사람한테 보내짐


function getTime() {
    const now = new Date();
    const hours = now.getHours() < 10 ? "0" + now.getHours() : now.getHours();
    const minutes = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
    const seconds = now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds();
    return `${hours}:${minutes}:${seconds}`;
}

var userList = [];

io.sockets.on( "connection", function ( socket ) {  
    console.log( "Socket Connected!" );

    socket.emit('usercount', io.engine.clientsCount);

    // 새로운 유저가 들어왔을 때 알려주는 기능
    socket.on( 'newUser', function( name ) {

        console.log( name + "님이 접속하셨습니다!" );

        // 소켓에 이름 저장
        socket.name = name;
        userList.push( socket.name );

        // 모든 소켓에게 전송
        io.sockets.emit( "update", { type:'connect', name:'SERVER', message: socket.name + '님이 접속하셨습니다!', userList: userList });

    });


    // 전송한 메세지 받기
    socket.on( 'message', ( data ) => {

        // 받은 데이터에 누가 보냈는 지 이름 추가
        data.name = socket.name

        console.log(data);

        // 보낸 사람을 제외한 나머지 유저에게 메시지 전송
        socket.broadcast.emit( 'update', data );
    });




    // 접속 종료
    socket.on( "disconnect", function () {
        console.log( socket.name + "님이 퇴장하셨습니다!" );

        var i = userList.indexOf( socket.name );
        userList.splice( i, 1 );

        // 나간 사람을 제외한 나머지에게 메시지 전송
        socket.broadcast.emit( 'update', { type:'disconnect', name:'SERVER', message: socket.name + '님이 퇴장하셨습니다!', userList: userList });
    });
});










http.listen( 8300, () => {
    console.log( "listening on *:8300" );
});