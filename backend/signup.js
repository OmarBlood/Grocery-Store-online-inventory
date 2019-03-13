const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const format = require('string-format');
const cookieSession = require('cookie-session');
const db = new sqlite3.Database( __dirname + '/users.db',
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
			console.log('opened users.db');
		}
	});

const app=express();
const port = process.env.PORT || 8000;

app.use(express.static( __dirname ));
app.use(bodyParser.urlencoded({extended:true}));
//Still need to figure out how to incorporate cookies
app.use(cookieSession({
	name: 'session',
	secret: 'foo'
}));

function check_blank_signup(req,res){
	if(!req.body.firstName){
		res.redirect('/signup');
		//Need to figure out how to print an error message on screen
		//Or at least point out which field isn't right
		console.log('Cannot have a blank first name!');
	}
	else if(!req.body.lastName){
		res.redirect('/signup');
		console.log('Cannot have a blank last name!');
	}
	else if(!req.body.username){
		res.redirect('/signup');
		console.log('Cannot have a blank username!');
	}
	else if(!req.body.password){
		res.redirect('/signup');
		console.log('Cannot have a blank password!');
	}
	else if(!req.body.email){
		res.redirect('/signup');
		console.log('Cannot have a blank email address!');
	}
	else if(!req.body.dob){
		res.redirect('/signup');
		console.log('Cannot have a blank date of birth!');
	}
}

function check_blank_login(req,res){
	if(req.body.username){
		if(req.body.password){
			res.redirect('/landing');
		}
		else{
			res.redirect('/login');
		}
	}
	else{
		res.redirect('/login');
	}
}

//Canned spaghetti code below...
//function check_unique(req,res) {
//	if(req.body.firstName){
//		db.run(`SELECT DISTINCT firstName FROM users`,[], function(err, fnames) {
//			if(!err){
//				for i in fnames{
//					if(req.body.firstName === fnames[i]){
//						res.redirect('/signup');
//						console.log('First name is already registered in database.');
//					}
//				}
//			}
//		}
//	}
//}

app.get('/signup', function(req,res) {
	console.log("Reached the signup page.");
	res.redirect('/signup.html');
});

app.post('/signup.html', check_blank_signup, function(req,res) {
});

app.get('/login', function(req,res) {
	console.log("Reached the login page.");
	res.redirect('/login.html');
});

app.post('/login.html', check_blank_login, function(req,res) {
});

app.listen(port, function() {
    console.log(`Listening on port ${port}!`);
});
