bindings = {};
bindings['D'] = function() { Arena.controller_input("kb1", {key:"move", length: 0.75, angle: Math.PI*0}); }
bindings['C'] = function() { Arena.controller_input("kb1", {key:"move", length: 0.75, angle: Math.PI*0.25}); }
bindings['S'] = function() { Arena.controller_input("kb1", {key:"move", length: 0.75, angle: Math.PI*0.5}); }
bindings['Z'] = function() { Arena.controller_input("kb1", {key:"move", length: 0.75, angle: Math.PI*0.75}); }
bindings['A'] = function() { Arena.controller_input("kb1", {key:"move", length: 0.75, angle: Math.PI*1.0}); }
bindings['Q'] = function() { Arena.controller_input("kb1", {key:"move", length: 0.75, angle: Math.PI*1.25}); }
bindings['W'] = function() { Arena.controller_input("kb1", {key:"move", length: 0.75, angle: Math.PI*1.5}); }
bindings['E'] = function() { Arena.controller_input("kb1", {key:"move", length: 0.75, angle: Math.PI*1.75}); }



var keyDown = [];
var playerJoined = false;
$(window).keydown(function(e) {
    var key = String.fromCharCode(e.keyCode);

    if (key != 'F' && key != 'J' && keyDown.indexOf(key) < 0 && (key in bindings)) {
        keyDown.push(key);
    } else if (key == 'L') {
        Arena.controller_input("kb1", {key:"shield"});
    }
});

$(window).keyup(function(e) {
    var key = String.fromCharCode(e.keyCode);

    if (key == 'J' && !playerJoined) {
        playerJoined = true;
        Arena.controller_join("kb1", {name:"KB1", ninja:"yellow"});
    } else if (key == 'M') {
        Arena.controller_leave("kb1", {name:"KB1", ninja:"yellow"});
        playerJoined = false;
    } else if (key == 'K') {
        Arena.controller_input("kb1", {key:"shoot", shoot: 1});
    } else if (key == 'L') {
        Arena.controller_input("kb1", {key:"unshield"});
    }
    else {
        var idx = keyDown.indexOf(key);
        keyDown.splice(idx, 1);
        if (keyDown.length == 0) {
            Arena.controller_input("kb1", {key:"stopmove"});
        }
    }
});

setInterval(function() {
    for (var i=0;i<keyDown.length;i++) {
        bindings[keyDown[i]]();
    }
},1000 / 30);
