// Add fastclick to controllers
window.addEventListener('load', function() {
  FastClick.attach(document.body);
}, false);

var controller_is_portrait = true;
// Socket Registration code

var path = window.location.pathname.slice(1).split('/');
var myroom = 'lobby'; // default room
if (path.length === 2 && path[1] !== '') {
	// We have a room id
	myroom = path[1];
}


var loadNinja = function() {
  // Check if there is a name in local storage
  var name = window.localStorage.getItem('ninja-name');
  if (name) {
    $('#playername').val(name);
  }

  // Figure out what is checked and his name 
  $('.join-button').on('click', function() {
    var myname = $('#playername').val();
    if (myname) {
      window.localStorage.setItem('ninja-name', myname);

      var ninja_color;
      switch(mySwiper.activeIndex) {
        case 1:
        default:
          ninja_color = 'red';
          break;
        case 2:
          ninja_color = 'green';
          break;
        case 3:
          ninja_color = 'blue';
          break;
        case 4:
        case 0:
          ninja_color = 'yellow';
          break;
      }
      $('html').addClass('game-mode');
      UnaController.register(myroom, {name: myname, ninja: ninja_color}, function(res) {
        if (res.success) {
          loadJoysticks();
        }
      });
    } else {
      alert('Please enter a name!');
    }
  });
};

var loadJoysticks = function() {
  // Re-display the joystick divs
  // $('.joystick').css('display', 'block');
  leftJoystick  = new VirtualJoystick({
    container : document.getElementById('controller-stick'),
    mouseSupport  : true
  });

  $('#shoot-button').on('touchstart', function() {
    if ("vibrate" in window.navigator) {
      window.navigator.vibrate(200); 
    }
    UnaController.sendToScreen('input', { key: 'shoot', shoot: 1});
  });

  $('#block-button').on('touchstart', function() {
    UnaController.sendToScreen('input', { key: 'shield'});
  });

  $('#block-button').on('touchend', function() {
    UnaController.sendToScreen('input', { key: 'unshield'});
  });
  // rightJoystick  = new VirtualJoystick({
  //   container : document.getElementById('rightContainer'),
  //   mouseSupport  : true
  // });

  // Move Event
  var isMoving = false;
  var previousAngle = null;
  var threshold = 1; // threshold in degrees
  setInterval(function() {
    var x = leftJoystick.deltaX();
    var y = leftJoystick.deltaY();
    // console.log(delta)
    if (x === 0 && y === 0) {
      if (isMoving) {
        isMoving = false;
        UnaController.sendToScreen('input', { key: 'stopmove'});
      }
    }
    else {
      var delta = Math.atan2(y, x);
      if (controller_is_portrait) {
        delta -= Math.PI/2;
      }
      var deltaDeg = Math.round(delta * 180 / Math.PI);

      if (!previousAngle || Math.abs(deltaDeg - previousAngle) > threshold) {
        //console.log("firing " + previousAngle + " " + deltaDeg);
        previousAngle = deltaDeg;

        var l = Math.min(Math.sqrt(x * x + y * y) / 50.0, 1.0);
        isMoving = true;
        UnaController.sendToScreen('input', {key: 'move', angle: delta, length: l});

      }
    }

  }, 1000 / 30);

  var handle_shake = function(event_data) {
    var a = event_data.accelerationIncludingGravity;
    if (Math.abs(a.x) + Math.abs(a.y) + Math.abs(a.z) > 30) {
      UnaController.sendToScreen('input', {key: 'nova'});
    }
  };
  window.addEventListener('devicemotion', handle_shake, false);
};


// Socket Events
// 1. Choose your ninja
// 2. client-register
// 3. Arena replies ok and you're good to go
// socket.emit('client-register', { type: 'controller', room: myroom, name: myname, ninja: 'fat ninja'});
$(function() { 
  loadNinja();
  var handleOrientationChange = function(e) {
    //console.log($(window).width(), $(window).height())
    if ($(window).width() > $(window).height()) {
      //console.log('landscape');
      $('.controller-inner-container').removeClass('controller-inner-container-portrait');
      $('.controller-inner-container').addClass('controller-inner-container-landscape');
      controller_is_portrait = false;
    } else {
      //console.log('portrait');
      $('.controller-inner-container').removeClass('controller-inner-container-landscape');
      $('.controller-inner-container').addClass('controller-inner-container-portrait');
      controller_is_portrait = true;
    }
  };
  handleOrientationChange();
  // Orientation check
  // window.addEventListener('orientationchange', handleOrientationChange);
  window.addEventListener('resize', handleOrientationChange);
});
