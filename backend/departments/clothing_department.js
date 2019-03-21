const express = require('express');
const hbs = require('express-hbs');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const format = require('string-format');
const cookieSession = require('cookie-session');

const db = new sqlite3.Database( __dirname + '/clothing_dpt.db',
	function(err){
		if(err){
			console.log(err);
		}
		else if(!err){
			db.run(`
				CREATE TABLE IF NOT EXISTS clothing(
				id TEXT PRIMARY KEY,
				name TEXT,
				description TEXT,
				material TEXT,
				style TEXT,
				size TEXT,
			)`);
			console.log('opened the clothing department database.');
		}
});

clothes = [
	[13, 'black', 'Massimo Dutti, made in Pakistan', 'Cotton', 'Casual', 'Large'],
	[14 , 'blueblouse' , ' Sadie, made in China' , 'Rayon', 'Casual', 'Large'],
	[15 , 'cap' , ' Swagster, made in Egypt' , 'Polyester and Cotton', 'Casual', 'One size'],
	['C3' , 'fanela' , ' cottonil, made in Turkey' , 'Cotton', 'Homewear', 'Small'],
	['C4' , 'greenblouse' , ' Sadie, made in china' , 'Rayon', 'casual', 'XXL'],
	['C5', 'jeans', 'Barbados, made in China', 'Cotton', 'Casual', 'Medium'],
	['C6', 'jeans2', 'Barbados, made in China', 'Cotton', 'Casua', 'Large'],
	['C7' , 'oompa' , 'Gucci, Made in loompa' , 'Cotton and thread', 'Work', 'XXXXL'],
	['C8', 'shoe', 'Tahari, made in China', 'Leather and Felt', 'Size 9']
];

for(let row of clothes){
	db.run(`INSERT INTO clothing(id, name, description, material, style, size) 
		VALUES(?,?,?,?,?,?)`, row, (err) => {
	  	if(err){
			console.log(err);
		}
		else{
			console.log('Success');
		}
	});
}
