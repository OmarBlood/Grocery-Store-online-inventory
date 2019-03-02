const express = require('express');
const format = require('string-format');

const app = express();
app.use(express.static(__dirname));
const port = 8000;

const page = `\
<html>
<head>
	<meta charset = "utf-8">
</head>
<body>
	<h1><a href="hello.html">Click here</a></h1>
</body>
</html>
`

app.get('/', function(req,res){
	console.log( `method: $(req.method) url: $(req.url)` );
	res.type('.html');
	res.send(
		format(page, req.method, req.url));
});

app.listen(port, () => console.log(`Listening on port ${port}!`));

