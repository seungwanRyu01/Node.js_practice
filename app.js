// express
// Node.js를 위한 빠르고 개방적인 웹 프레임워크

const express = require( 'express' );
const app = express();
const port = 8100;


// ejs : Embedded JavaScript Templating
// <html>~~~~</html>
// ejs 문법 태그 안에서 javascript문을 사용할 수 있다.
app.set( "view engine", "ejs" ); // view engine은 
app.set( "views", __dirname + "/views" );


// node.js에서 static 이미지나 파일 쓰는 법

// /static은 폴더 이름. __dirname은 절대 경로(혹시 모를 불상사를 대비하기 위해 써줌), /aaa는 가상경로
app.use( '/aaa', express.static( __dirname + '/static' ));

const body = require( 'body-parser' );
app.use(body.urlencoded( { extended:false }));
app.use(body.json());



// post로 넘어온 값이 없을 때 들어오는 곳
app.get( '/test', ( req, res ) => {
    // web에 메시지를 띄워서 확인할 수 있음
    res.render( "test.ejs", { parameter1: 5, parameter2: "코딩온" } );
});




// post로 넘어온 값이 없을 때 들어오는 곳
app.get( '/', ( req, res ) => {
    // web에 메시지를 띄워서 확인할 수 있음
    res.send( "안녕 안녕" );
});



// post로 값이 넘어왔을 때 들어오는 곳
app.post( '/', ( req, res ) => {
    // web에 메시지를 띄워서 확인할 수 있음
    res.send( "안녕2" );
});



app.get('/form', ( req, res ) => {
    console.log( req.query.id );
    res.render('form');
});

app.post('/form22', ( req, res ) => {
    console.log( req.body.name );
    console.log("post form 들어옴");
    // 아직 웹브라우저에 응답을 보내지 않은 상태

    res.send("hi");
});




app.get('/register', ( req, res ) => {
    console.log( req.query.id );
    res.render('register');
});

app.post('/registered', ( req, res ) => {
    console.log( req.body );
    // 아직 웹브라우저에 응답을 보내지 않은 상태

    res.send("회원가입 완료");
});




app.listen( port, () => {
    // web 포트번호가 8100라면 이렇게 이렇게 해라~~
    console.log( "8100!" );
});