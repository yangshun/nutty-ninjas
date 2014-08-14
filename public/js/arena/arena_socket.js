// Socket registration code
var path = window.location.pathname.slice(1).split('/');
var myroom = 'lobby'; // default
if (path.length === 2 && path[1] !== '') {
	// We have a room id
	myroom = path[1];
}

UnaScreen.register(myroom, {'screen': myroom}, function(res) {
	if (res.success) {
		$(function() {Arena.init();});
	}
	else {
		console.log(res.error);
	}
});

UnaScreen.onControllerJoin(function(res) {
	if (Arena.controller_join(res.una.id, res.una.user_data)) {
		return true;
	}
	return false;
});

UnaScreen.onControllerLeave(function(res) {
	Arena.controller_leave(res.una.id, res.una.user_data);
});

UnaScreen.onControllerInput('input', function(res) {
	Arena.controller_input(res.una.id, res.payload);
});

// Socket Events
socket.on('controller-input', function(data) {
	Arena.controller_input(data);
});