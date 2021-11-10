const express = require( 'express' );
const mysql = require( 'mysql' );
const session = require( 'express-session' );
const cookie = require( 'cookie-parser' );
const expressLayouts = require( 'express-ejs-layouts' );
const path = require( 'path' );
const app = express();
const port = 8100;

var conn = mysql.createConnection({
	user: 'root',
	password: 'ssac()',
	database: 'SSAC'
});


// ejs : Embedded JavaScript Templating
// <html>~~~~</html>
// ejs 문법 태그 안에서 javascript문을 사용할 수 있다.
app.set( "view engine", "ejs" );
app.set( "views", __dirname + "/views" );


// node.js에서 static 이미지나 파일 쓰는 법
// /public은 폴더 이름. __dirname은 절대 경로(혹시 모를 불상사를 대비하기 위해 써줌)
app.use(express.static( path.join( __dirname, 'public' )));


// form 전송을 원활하게 만들어 주는 것이 body-parser이다.
const body = require( 'body-parser' );
app.use(body.urlencoded( { extended:false } ));
app.use(body.json());



// session 사용 옵션들
app.use(session({
    secret: 'ssac',        // 필수항목으로 cookie-parser의 비밀키와 같은 역할을 한다.
    resave: false,         // 요청이 있을 때 세션에 수정사항이 생기지 않더라도 세션을 다시 저장할 지에 대한 설정
    saveUninalized: true   // 세션에 저장할 내역이 없더라도 세션을 저장할 지에 대한 결정
}));

app.use(cookie());

app.use(expressLayouts);

app.listen( port, () => {
    // web 포트번호가 8100라면 이렇게 이렇게 해라~~
    console.log( "Listening on port *: 8100" );
});

// // 아래 내용들은 다 튜토리얼 내용들이다!! 무시하셈

// // post로 넘어온 값이 없을 때 들어오는 곳
// app.get( '/test', ( req, res ) => {
//     // web에 메시지를 띄워서 확인할 수 있음
//     // req : 클라이언트에서 요청한 사항을 가지고 있는 object, res : 클라이언트로 응답을 보낼 때 쓰는 object
//     res.render( "test.ejs", { parameter1: 5, parameter2: "코딩온" });
// });

// // post로 넘어온 값이 없을 때 들어오는 곳
// app.get('/form', ( req, res ) => {
//     console.log( req.query.id );
//     res.render('form');
// });

// // post로 값이 넘어왔을 때 들어오는 곳
// app.post('/form22', ( req, res ) => {
//     // req.body.[앞에서 지정한 이름] 값을 이렇게 가져온다 Node.js에서는!!
//     console.log( req.body.name );
//     console.log("post form 들어옴");
//     // 아직 웹브라우저에 응답을 보내지 않은 상태
//     // web에 메시지를 띄워서 확인할 수 있음
//     res.send("hi");
// });



// 메인 홈페이지
app.get( '/main', ( req, res ) => {
    console.log( "client connected" );

    console.log( req.cookies );

    var message = "";

    if (req.session.id == null) message = "";
    else message = req.session.id + "님, 어서오세요!"

    res.render( 'main', { message : message });
});




// 회원가입
app.get('/register', ( req, res ) => {
    res.render('register');
});

// 회원가입 완료
app.post('/registered', ( req, res ) => {
    var sql = "INSERT INTO nodejs_practice(userid, password, name, phone, gender) VALUES('" + req.body.id + "','" + req.body.pw + "','" + req.body.name + "','" + req.body.pnum + "', '" + req.body.gender + "');"

	conn.query(sql, function(err,result) {
        if( err ){
			console.log( 'failed!! : ' + err );
		}
		else {
			console.log( "data inserted!" );
		}
        
        var sql_selected = "SELECT * FROM nodejs_practice WHERE id = '" + result.insertId + "'";
        conn.query( sql_selected, function( err, results ){
            res.render( 'registered', { results : results } );
        });
    });
    console.log( req.body );

    // // 정석대로 회원가입 완료 작성했을 시 소스 코드
    // var body = req.body;
    // console.log(body);

    // var sql = "INSERT INTO nodejs_practice(userid, password, name, phone, gender) VALUES( ?, ?, ?, ?, ? )"
    // var param = [body.id, body.pw, body.name, body.pnum, body.gender]

    // conn.query(sql, param, function(err) {
    //     if(err) console.log('query is not excuted. inser fail...\n' + err);
    //     else res.render('registered');
    // });
});




// 로그인 화면
app.get('/login', ( req, res ) => {
    var message = "";

    res.render('login', { message : message, cookie: req.cookies["userid"] });
});

// 로그인 완료
app.post('/logined', ( req, res ) => {
    var body = req.body;

    if (body.saveId != null) {
        res.cookie("userid", body.id, {maxAge: 300000});
    }

    console.log( req.cookies["userid"] );

    var sql = 'SELECT * FROM nodejs_practice WHERE userid=? AND password=?'
    var param = [body.id, body.pw]

    conn.query( sql, param, function( err, rows ) {
        if ( err ) console.log('query is not excuted. insert fail...\n' + err);
        else {
            if ( rows.length > 0 ) {
                // res.session.세션키 = 세션값;
                req.session.id = rows[0].userid;
                // res.cookie( "쿠키 아이디", 쿠키값, { 각종 옵션(선택값) } )
                res.cookie( 'userid', rows[0].userid );
                console.log( "userid" + rows[0].userid );

                // 세션 저장 완료
                req.session.save ( function ( err ) {
                    console.log( err );
                    
                console.log( req.session );
                    // res.redirect('/main');
                    res.render('logined');
                });
            }
            else {
                var message = "로그인 실패! 아이디 혹은 비밀번호를 다시 확인하세요!";

                res.render('login', { message : message, cookie : req.cookies["userid"]});
            }
        }
    }); 
});

// 로그아웃
app.get('/logout', ( req, res ) => {
    // 세션 날려버리는 기능
    req.session.destroy();
    // res.redirect('/main');
    res.redirect('/login');
});




// 비밀번호 변경
app.get('/changepw', ( req, res ) => {
    console.log( req.cookies["userid"] );
    console.log( res.session );
    res.render('changepw')
});

// 비밀번호 변경 완료
app.post('/changepwsuccess', ( req, res ) => {

    var sql = "UPDATE nodejs_practice SET password = '" + req.body.new_pw + "' WHERE userid = '" + req.cookies["userid"] + "'";

    conn.query(sql, function( err, res ) {
        if ( err ) {
            console.log( 'failed!! : ' + err );
        }
        else {
            console.log( "password changed!" );
        }
    });
    res.redirect("/login");
});




// 회원탈퇴
app.get('/delete', ( req, res ) => {
    res.render('delete');
});

// 회원탈퇴 완료
app.post('/deletesuccess', ( req, res ) => {

    var sql = "DELETE FROM nodejs_practice WHERE userid = '" + req.cookies["userid"] + "'";

    conn.query(sql, function(err, res) {
        if( err ){
			console.log( 'failed!! : ' + err );
		}
		else {
			console.log( "data deleted!" );
		}
    });
    res.redirect("/login");
});