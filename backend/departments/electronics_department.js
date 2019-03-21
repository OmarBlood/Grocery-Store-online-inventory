const express = require('express');
const hbs = require('express-hbs');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const format = require('string-format');
const cookieSession = require('cookie-session');

const db = new sqlite3.Database( __dirname + '/food_dpt.db',
	function(err){
		if(err){
			console.log(err);
		}
		else if(!err){
			db.run(`
				CREATE TABLE IF NOT EXISTS electronics(
				id TEXT PRIMARY KEY,
				name TEXT,
				description TEXT,
				brand TEXT,
				type TEXT
			)`);
			console.log('opened the electronics department database.');
		}
});
