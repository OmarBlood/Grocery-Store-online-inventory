const express = require('express');
const hbs = require('express-hbs');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const format = require('string-format');
const cookieSession = require('cookie-session');

const db = new sqlite3.Database( __dirname + '/food_dpt.db', function(err){
	if(err){
		console.log(err);
	}
	else if(!err){
		db.run(`
			CREATE TABLE IF NOT EXISTS electronics(
			id TEXT PRIMARY KEY,
			name TEXT,
			price INT,
			description TEXT,
			brand TEXT,
			type TEXT
		)`);
		console.log('opened the electronics department database.');
	}
});

electronics = [
	['E1', 'Laptop', 480, '', 'HP','computers'],
	['E2', 'TV', 278, '', 'LG', 'screens'],
	['E3', 'Headphones', 59, '', 'Beats', 'accessories'],
	['E4', 'Blender', 42, '', 'Hamilton', 'appliances'],
	['E5', 'Mixer', 31, '', 'Orca', 'appliances'],
	['E6', 'iPhone', 829, '', 'Apple', 'phones'],
	['E7', 'Android', 720, '', 'Samsung', 'phones'],
	['E8', '', '', '', '', ''],
	['E9', '', '', '', '', ''],
	['E10', '', '', '', '', ''],
	['E11', '', '', '', '', ''],
];

for(let row of electronics){
	db.run(`INSERT INTO clothing(id, name, price, description, brand, type) 
		VALUES(?,?,?,?,?,?)`, row, (err) => {
	  	if(err){
			console.log(err);
		}
		else{
			console.log('Success');
		}
	});
}
