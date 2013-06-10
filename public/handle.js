
$(document).ready(function() {
	var serv = io.connect('http://localhost:8080');
	var nickname;

	serv.on('chat', function(data){
		updateMessages(data, false);
	});

	serv.on('connect', function(data){
		nickname = prompt("Quel est ton nom dresseur?");
		serv.emit('join', nickname);
	});

	$('#chat_form').submit(function(e){
		var message = $('#message').val();
		serv.emit('messages', message);
		updateMessages(message, true);
		return false; //Pour stopper l'envoi, inutile
	});

	function updateMessages(data, local){
		if(local)
		{
			console.log(data);
			$(".chatwindow").append("<div class=\"message\"><p><b>"+nickname+"</b><br/>"+data+"</p></div>");
		}
		else{
			console.log(data);
			$(".chatwindow").append("<div class=\"message\"><p><b>"+data.pseudo+"</b><br/>"+data.message+"</p></div>");
		}

	};

});