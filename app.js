var express = require('express');
var app = express.createServer()
var io = require('socket.io').listen(app);

var messages = [];
var dresseurs = [];

var storeMessage = function (nickname, message){
	messages.push({pseudo: nickname, data: message});
	if(messages.length > 10){
		messages.shift();
	}
}

app.get("/", function(req, res) {
  res.redirect("/index.html");
});

app.use(express.static(__dirname + '/public'));

app.listen(8080);

io.sockets.on('connection', function (client) {
	console.log('Connection d\'un dresseur');

	client.on('messages', function(data){
		console.log(data);
		client.get('nickname', function(err, name){
			console.log(name);
			client.broadcast.emit("chat", {pseudo: name, message: data});
			storeMessage(name, data);
		});

	});

	client.on('join', function(name){
		client.set('nickname', name);
		dresseurs.push(name);
		client.broadcast.emit("dresseur", name)
		messages.forEach(function(message){
			client.emit("chat", {pseudo: message.pseudo, message: message.data});
		});
		dresseurs.forEach(function(dresseur){
			client.emit("dresseur", dresseur);
		});
	});


	client.on('disconnect', function(name){
		client.get('nickname', function(err, name){
			client.broadcast.emit("remove", name);
			var index = dresseurs.indexOf(name);
			dresseurs.splice(index, 1);
		});
	});
});
