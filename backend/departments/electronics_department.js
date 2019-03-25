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
	['E1', 'Laptop', 480, 'Intel Core i3, 4GB RAM, 500GB Storage.', 'HP','computers'],
	['E2', 'TV', 278, '55-inch Screen with a 4K UltraHD display. Multiple HDMI and USB inputs.', 'LG', 'screens'],
	['E3', 'Headphones', 59, 'Bluetooth, NFC Fucntionality, internal battery supports upto 30 hours of use.', 'Beats', 'accessories'],
	['E4', 'Blender', 42, '800 Watts, two-speeds control, 5 blades.', 'Hamilton', 'appliances'],
	['E5', 'Mixer', 31, '150 Watts, three-speeds control, additional accessories included.', 'Orca', 'appliances'],
	['E6', 'iPhone', 829, '128GB, Silver, Unlocked 5.3-inch display, face recognition, 8MP Camera.', 'Apple', 'phones'],
	['E7', 'Android', 720, '128GB, Gold, 4GB RAM, 5-inch display, 8MP Camera, Fingerprint scanner.', 'Samsung', 'phones'],
	['E8', 'Microwave', '60', '700 Watts, 10 power levels, child safety lock, weight and time defrost.', 'Danby', 'appliances'],
	['E9', 'Coffee Machine', 138, '14 oz water reservoir, single capacity, packages and ground coffee compatible.', 'Nespresso', '']
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
