const express = require( 'express' );
const app = express();
const port = 8100;

// app이랑 http모듈은 기능상으로는 별 차이가 없다.
const http = require( "http" ).Server( app );
const io = require( "socket.io" )( http );

app.set( "view engine", "ejs" );
app.set( "views", __dirname + "/views" );


app.get("/", ( req, res ) => {
    res.render("socket");
});



// socket을 사용을 할 것이다.
io.on( "connection", function( socket ) {
    // socket과 관련한 통신 작업을 모두 처리
    // 클라이언트가 socket이 연결되면 이 안에서 작업을 한다.
    console.log( "Socket Connected!" );

    // 보낼 때는 socket.emit
    socket.on( "a", ( a ) => {
        console.log( a );

        // 서버 입장에서 send라는 이벤트명으로 hi라는 데이터를 보낸다.
        socket.emit("send", "hi");
    });

    // 채팅방 나가기 기능
    socket.on( "disconnect", () => {
        console.log("disconnect");
    });

    // socket.on("event", ( data ) => {
    //     console.log( data );
    // });
});



http.listen( port, () => {
    // web 포트번호가 8100라면 이렇게 이렇게 해라~~
    console.log( "Listening on port *: 8100" );
});