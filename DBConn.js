var express = require('express');
const logger = require('morgan');
const child_process = require('child_process');
const { Client } = require('pg');
var fs = require('fs');
var app = express();

app.post('/signup', function(req, res){
    console.log('POST /');
    console.dir(req.body);
    res.cookie('user' , req.body.user);
    res.cookie('pass' , req.body.pass).send('Cookie is set');
    insertRow(res.cookie('user'),'');
    insertPass(res.cookie('ps'));
});

//log in to postgreSQL info
const client = new Client({
	user: 'projuser',
	host: '',
	database:'',
	password: '',
	port: 3211,
})
client.connect()

client.query('SELECT NOW()', (err,res)=>{
	client.end()
})

userExist(usr) {
		const text = 'SELECT username FROM persons WHERE id = ' + usr + ';';
		client.query(text, (err, res) => {
			if (err) {
				// res.status(403).send("bad");
				return false
			}
			else {
				// res.status(200).send("good");
				return res
			}
		})
}

//adds password BROKEN
insertPass(ps) {
	const holder = userExist(usr)
	let pword = holder.password
	adding = 'INSERT INTO ' + pword + 'VALUE ('+ps+');';
}

//code to add new users!
insertRow(usr, col) {
	const data = userExist(usr);
	if (data != false) {
		// get row of user, look at points in each column, increment value in col by 1
		var column = 0;
		if (col == "garbage")
			column = 2
		else if (col == "organic")
			column = 3
		else if (col == "recycle")
			column = 4

		var val = data[column];
		val++;

		var update = 'UPDATE persons SET' + col + '= ' + val + ' WHERE user = ' + usr ';';

		client.query(update, (err,res) => {
			if(err) {
				throw err
			} else {
				console.log("updated")
			}
		})

	}
	else {
		const text = 'INSERT INTO persons (username, password, garbage, organic, recycle) VALUE(' + usr + ',' + pass + ', 0 , 0, 0);';
		client.query(text,values,(err, res)=> {
			if(err) {
				throw err
			} else {
				console.log("Row created")
			}})
	}
}