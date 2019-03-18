const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const format = require('string-format');
const cookieSession = require('cookie-session');
const db = new sqlite3.Database( __dirname + '/userbase.db',
	function(err){
		if(!err){
			db.run(`
				CREATE TABLE IF NOT EXISTS users (
				id INTEGER PRIMARY KEY,
				firstName TEXT,
				lastName TEXT,
				username TEXT,
				password TEXT,
				email TEXT,
				dob DATE
			)`);
			console.log('opened userbase.db');
		}
	});

//admin = [['admin', '1', 'admin1', 'admin1', 'admin@mun', 2019-01-01]];
const app=express();
const port = process.env.PORT || 8000;

app.use(express.static( __dirname ));
app.use(bodyParser.urlencoded({extended:true}));
//Still need to figure out how to incorporate cookies
app.use(cookieSession({
	name: 'session',
	secret: 'foo'
}));

function reg_check(req,res){
	let user = '';
	let pass = '';
//Check for blanks
	if(!req.body.firstName){
		res.redirect('/signup');
		//Can't print the messages on screen still.
		console.log('Cannot have a blank first name!');
	}
	if(!req.body.lastName){
		res.redirect('/signup');
		console.log('Cannot have a blank last name!');
	}
	if(!req.body.username){
		res.redirect('/signup');
		console.log('Cannot have a blank username!');
	}
	if(!req.body.password){
		res.redirect('/signup');
		console.log('Cannot have a blank password!');
	}
	if(!req.body.email){
		res.redirect('/signup');
		console.log('Cannot have a blank email address!');
	}
	if(!req.body.dob){
		res.redirect('/signup');
		console.log('Cannot have a blank date of birth!');
	}
//Check for unique username and password
	if(req.body.username && req.body.password){
		console.log('Checking database for entries');
		db.all(`SELECT DISTINCT username, password FROM users`,[], function(err, rows) {
			if(err){
				console.log(err);
				res.redirect('/signup');
			}
			else{
				console.log('Going through database entries');
				for(let n of rows){
					if(n.username === req.body.username && n.password === req.body.password){
						user = n.username;
						pass = n.password;
						break;
					}
					else if(n.username === req.body.username){
						user = n.username;
						break;
					}
					else if(n.password === req.body.password){
						pass = n.password;
						break;
					}
				}
				if(req.body.username === user && req.body.password === pass){
					console.log('Both usernames and passwords already exist!');
					res.redirect('/signup');
				}
				else if(req.body.username === user){
					console.log('This username already exists!');
					res.redirect('/signup');
				}
				else if(req.body.password === pass){
					console.log('This password already exists!');
					res.redirect('/signup');
				}
				else{
					db.run(`INSERT INTO users(firstName,lastName,username,password,email,dob) VALUES(?,?,?,?,?,?)`,
						[req.body.firstName, req.body.lastName, req.body.username, req.body.password, req.body.email, req.body.dob]);
						res.redirect('/login');
						console.log('Both username and password are unique. You may pass!');
				}
			}
		});
	}
	
}

app.get('/signup', function(req,res) {

//	for(let row of admin){
//		db.run(`INSERT INTO users(firstName,lastName,username,password,email,dob) 
//			VALUES(?,?,?,?,?,?)`, row, (err) => {
//	       		if(err){
//				console.log(err);
//			}
 //			else{
//				console.log('inserted admin');
//			}
//		});
//	}
//
	console.log('Reached the signup page.');
	res.redirect('/signup.html');	

});
	

app.post('/signup.html', reg_check, function(req,res) {
});

app.get('/login', function(req,res) {
	console.log('Reached the login page.');
	res.redirect('/login.html');
});

app.post('/login.html', function(req,res) {
//Check for blanks
	if(!req.body.username){
		console.log('Please enter a username.');
		res.redirect('/login');
	}
	if(!req.body.password){
		console.log('Please enter a password.');
		res.redirect('/login');
	}
//Check for username and password
	if(req.body.username && req.body.password){
		console.log('Checking database for entries');
		db.get(`SELECT password FROM users where username = ?`,[req.body.username], function(err, row) {
			if(err){
				console.log(err);
				res.redirect('/login');
			}
			else{
				if(row){
					if(row.password === req.body.password){
						req.session.auth = true;
						req.session.username = req.body.username;
						req.session.password = req.body.password;
						res.redirect('/landing');//double check this when you get back
					}
					else{
						req.session.auth = false;
						console.log('That password is not associated with the username; either register a new account or try a different username.');
						res.redirect('/login');
					}
				}
				else{
					req.session.auth = false;
					console.log('No such user exists');
					res.redirect('/login');
				}
			}
		});
	}
});

app.listen(port, function() {
    console.log(`Listening on port ${port}!`);
});
