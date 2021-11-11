const express = require( 'express' );
const multer = require( 'multer' );
const app = express();
const port = 8100;
const path = require( 'path' ); // 내장모듈 http와 같은

// // upload한 파일을 uploads폴더로 보낸다.
// var upload_multer = multer ({ 
//     dest: "uploads/"
// });

var multer_storage = multer.diskStorage ({
    destination: ( req, file, cb ) => {
        // cb : 콜백함수
        cb( null, "uploads" );
    },
    filename: ( req, file, cb ) => {

        if ( file.mimetype != "image/png" ) {
            return false;
        }
        // path라는 모듈을 사용해서 이 파일의 확장자를 가져올 수 있다.
        // extname 이라는 함수를 사용하면 .확장자 가 나온다.
        // ex) path.extname( "1.txt" );   -->   .txt
        // basename 이름 추출 1.txt에서 1 추출
        // Date.now() 1970년 01월 01일 00시 00분 00초부터 지금까지 경과된 밀리 초
        var extname = path.extname( file.originalname );
        // var newname = "1.png";
        cb( null, Date.now() + extname );
    }
});

var upload_multer = multer({ storage: multer_storage, limits: { mimetype: "image/png" }});


app.set( "view engine", "ejs" );
app.set( "views", __dirname + "/views" );


app.use(express.static( path.join( __dirname, 'uploads' )));


app.get('/', ( req, res ) => {
    res.render( 'upload' );
});


app.post( '/upload', upload_multer.single( "userfile" ), ( req, res ) => {
    // upload_multer.single : 단일 파일 처리
    // upload_multer.array : multiple 속성을 적용할 경우, 다중 파일 처리
    // upload_multer.field
    console.log( req.file );
    res.send("success"); 
});


app.post( '/upload-multiple', upload_multer.array( "userfile" ), ( req, res ) => {
    console.log( req.files );
    res.send("success");
});


app.listen( port, () => {
    // web 포트번호가 8100라면 이렇게 이렇게 해라~~
    console.log( "Listening on port *: 8100" );
});