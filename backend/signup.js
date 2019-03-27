const express = require('express');
const hbs = require('express-hbs');
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
				dob DATE,
				administration BOOLEAN,
				recent_items VARCHAR
			)`);
			console.log('opened userbase.db');
		}
	});

//admin = [['admin', '1', 'admin1', 'admin1', 'admin@mun', 2019-01-01, true]];

const app=express();
const port = process.env.PORT || 8000;

app.use(express.static( __dirname + '/frontend'));
app.use(bodyParser.urlencoded({extended:true}));

app.set('views', __dirname);
app.engine('hbs', hbs.express4({
	partialsDir: __dirname,
	defaultLayout: __dirname +'/page.hbs'
}));
app.set('view engine', 'hbs');

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
					db.run(`INSERT INTO users(firstName,lastName,username,password,email,dob,administration) VALUES(?,?,?,?,?,?,?)`,
						[req.body.firstName, req.body.lastName, req.body.username, req.body.password, req.body.email, req.body.dob, false]);
						res.redirect('/login');
						console.log('Both username and password are unique. You may pass!');
				}
			}
		});
	}
	
}

app.get('/', function(req,res) {
	res.redirect('/landing.html');
});

app.get('/signup', function(req,res) {

//	for(let row of admin){
//		db.run(`INSERT INTO users(firstName,lastName,username,password,email,dob,administration) 
//			VALUES(?,?,?,?,?,?,?)`, row, (err) => {
//	       		if(err){
//				console.log(err);
//			}
 //			else{
//				console.log('inserted admin');
//			}
//		});
//	}

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
		db.get(`SELECT firstName, lastName, username, password, email, dob, administration FROM users where username = ? AND password = ?`,[req.body.username, req.body.password], function(err, row) {
			if(err){
				console.log(err);
				res.redirect('/login');
			}
			else{
				if(row){
					console.log('Entry found; credentials check');
					req.session.auth = true;
					req.session.firstName = row.firstName;
					req.session.lastName = row.lastName;
					req.session.username = req.body.username;
					req.session.password = req.body.password;
					req.session.email = row.email;
					req.session.dob = row.dob;
					req.session.administration = row.administration;
					if(req.session.administration === 1){
						console.log('Login successful. Welcome admin!');
						//console.log(req.session);
						res.redirect('/admin.html');
					}
					else{
						console.log('Login successful. Welcome!');
						console.log(req.session);
						res.redirect('/page');
					}
				}
				else{
					req.session.auth = false;
					console.log('No such username or password exists');
					res.redirect('/login');
				}
			}
		});
	}
});

app.get('/landing', function(req,res) {
	console.log('Reached the landing page.');
	res.redirect('/landing.html');
});

app.get('/page', function(req,res) {
	res.type('.html');
	res.render('page', {
		sess : req.session,
		title : 'User page'
	});
});

app.post('/page', function(req,res) {
	res.type('.html');
	if(req.body.op === 'update'){
		db.run(`UPDATE users SET username=?, password=?, email=?, dob=? WHERE firstName=? AND lastName=?`,
	       		[req.body.username, req.body.password, req.body.email, req.body.dob, req.session.firstName, req.session.lastName], function(err){
			if(!err){ res.redirect('/login');}
		});
	}
	else if(req.body.op === 'logout'){
		if(req.session.administration === 1){
			req.session.firstName = 'admin';
			req.session.lastName = '1';
			req.session.username = 'admin1';
			req.session.password = 'admin1';
			req.session.email = 'admin@mun';
			req.session.dob = 2019-01-01;
			console.log(req.session);
			res.redirect('/admin.html');	
		}
		else{	
			req.session = null;
			console.log(req.session);
			res.redirect('/login');
		}
	}
});

app.get('/admin.html', function(req,res){
});

app.post('/admin.html', function(req,res){
	if(req.body.op === 'modify'){
		db.get(`SELECT firstName, lastName, username, password, email, dob, administration FROM users where username = ?`,[req.body.username], function(err, row) {
			if(err){
				console.log(err);
				res.redirect('/admin.html');
			}
			else{
				if(row){
					console.log('User found; redirecting to user page for modification.');
					req.session.firstName = row.firstName;
					req.session.lastName = row.lastName;
					req.session.username = req.body.username;
					req.session.password = row.password;
					req.session.email = row.email;
					req.session.dob = row.dob;
					console.log(req.session);
					res.redirect('/page');
				}
				
			}
		});
	}
	else if(req.body.op === 'delete'){
		db.run(`DELETE FROM users WHERE username=?`, [req.body.username], function(err){
			if(err){
				console.log(err);
				res.redirect('/admin.html');
			}
			else{
				console.log('Delete successful. User no longer exists!');
				res.redirect('/admin.html');
			}
		});
	}
	else if(req.body.op === 'logout'){
		req.session = null;
		res.redirect('/login');
	}
});

app.listen(port, function() {
    console.log(`Listening on port ${port}!`);
});
