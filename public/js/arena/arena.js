var ArenaConfig = {
  scoreBoardWidth: 240
}

var Arena = (function() {
  var init = function() {
    var gameCanvas = document.getElementById('gameCanvas');
    gameCanvas.width = window.innerWidth-ArenaConfig.scoreBoardWidth;
    gameCanvas.height = (window.innerHeight-50);

    var stage = new createjs.Stage(gameCanvas);

    game = new Game();
    game.canvas = gameCanvas;
    game.stage = stage;
    game.map = new Map();

    queue = new createjs.LoadQueue();
    queue.installPlugin(createjs.Sound);
    queue.loadManifest(SoundManager.sounds);
    queue.addEventListener("complete", function() {
      game.map.clearMap();
      game.map.generateMap('altMap','round', 2.25, 0.9);
      game.restart();
    });

    PubSub.subscribe('game.end', function() {
      setTimeout(function() {
        game.restart();
      }, game.cooldownTime*1000);
    });
  };

  var controller_input = function(id, data) {
    if (game.state === "PLAYING") {
      var ninjaToHandle = _.find(game.ninjas, function(ninja) {
        return ninja.identifier === id;
      });

      if (ninjaToHandle != null) {
        ninjaToHandle.handleInput(data);
      }
    }
  };

  var controller_join = function(id, data) {
    if (game.addNinja(id, data)) {
      console.log("New ninja added " + data.name);
      return true
    }
    else {
      console.log("Cannot add more ninja");
      return false
    }
  };

  var controller_leave = function(id, data) {
    var ninjaToHandle = _.find(game.ninjas, function(ninja) {
      return ninja.identifier === id;
    });

    if (ninjaToHandle != null) {
      ninjaToHandle.state = 'remove'; 
    }
  };

  return {init: init,
      controller_input: controller_input,
      controller_join: controller_join,
      controller_leave: controller_leave
    };
})();

// Resize code

function resize() {
  var height = window.innerHeight - 50;
  var width = window.innerWidth-ArenaConfig.scoreBoardWidth;

  var ratio = game.canvas.width / game.canvas.height;

  if (height * ratio > width) {
    game.canvas.style.width = width +'px';
    game.canvas.style.height = (width / ratio) +'px';
  } else {
    game.canvas.style.height = height +'px';
    game.canvas.style.width = (height * ratio) +'px';
  }
  console.log('resize call');

  //game.canvas.style.width = window.innerWidth-ArenaConfig.scoreBoardWidth +'px';
  //game.canvas.style.height = (window.innerHeight-50) +'px';
}

window.addEventListener("resize", resize, false);

function toggleFullScreen() {
  if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.cancelFullScreen) {
      document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }
  }
}

document.addEventListener("keydown", function(e) {
  if (e.keyCode == 13) {
    toggleFullScreen();
    setTimeout(resize, 1000);
  }
}, false);
