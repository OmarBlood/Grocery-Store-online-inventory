const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const format = require('string-format');
const cookieSession = require('cookie-session');

const app=express();
const port = process.env.PORT || 8000;

app.use(express.static( __dirname ));
app.use(bodyParser.urlencoded({extended:true}));
//Still need to figure out how to incorporate cookies
app.use(cookieSession({
	name: 'session'
	secret: 'foo'
}));

app.post('/signup.html', function(req,res) {
	//Right now, this only checks if the input fields aren't blank
	//When we have a database, we can just change the condition to...
	//...check whether the input matches existing database info.
	if(!req.body.firstName){
		res.redirect('/signup.html');
		//Need to figure out how to print an error message on screen
		//Or at least point out which field isn't right
		console.log('Cannot have a blank first name!');
	}
	else if(!req.body.lastName){
		res.redirect('/signup.html');
		console.log('Cannot have a blank last name!');
	}
	else if(!req.body.username){
		res.redirect('/signup.html');
		console.log('Cannot have a blank username!');
	}
	else if(!req.body.password){
		res.redirect('/signup.html');
		console.log('Cannot have a blank password!');
	}
	else if(!req.body.email){
		res.redirect('/signup.html');
		console.log('Cannot have a blank email address!');
	}
	else if(!req.body.dob){
		res.redirect('/signup.html');
		console.log('Cannot have a blank date of birth!');
	}
	else{
		res.redirect('/login.html');
	}
});

app.post('/login.html', function(req,res) {
	//Same issue as the above: only checks blank fields, nothing else.
	if(req.body.username && req.body.password){
		res.redirect('/landing.html');
	}
	else{
		res.redirect('/login.html');
	}
});
