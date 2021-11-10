var express = require('express');
var app = express();
var mysql = require( 'mysql' );
var session = require( 'express-session' );
var cookie = require( 'cookie-parser' );

var conn = mysql.createConnection({
	user: 'root',
	password: 'ssac()',
	database: 'SSAC'
});


// app.listen( 8100, function () {
// 	console.log( conn.state );
//     console.log( "Listening on *:3000" );
// });


app.listen( 8100, function () {
	conn.connect( ( err ) => {
		if ( err ) console.log( err );
		else console.log( "DB connected successfully!" );
	});


	// insert 예제
	var sql = "INSERT INTO member VALUES('david', '데이빗', '2021-10-21');"
	
	conn.query(sql, function(err) {
        if( err ){
			console.log( 'failed!! : ' + err );
		}
		else {
			console.log( "data inserted!" );
		}
    });

	// select 예제
	var sql = "SELECT * FROM member;"

	conn.query( sql, function( err, results ) {
		for ( var i = 0; i < results.length; i++) {
			console.log ( "아이디 : " + results[i]["ID"] );
			console.log ( "이름 : " + results[i]["name"] );
		}
	} );
});
