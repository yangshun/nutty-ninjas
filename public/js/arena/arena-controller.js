function ArenaController($scope, $timeout, $location) {

	$scope.time_left = '';
	$scope.current_url = window.location.origin.split(':').slice(0,2).join(':')+'/';
  var terrains = ['jungle', 'snow'];
  $scope.terrain_index = 0;
  var window_path = window.location.pathname;
  if (window_path[window_path.length-1] != '/') {
    window_path += '/';
  }
  var path_array = window_path.split('/')
  if(path_array.length <= 3){
    $scope.current_room = '';
  } else {
    $scope.current_room = path_array[path_array.length-2];
  }
	$scope.radiant_score = 0;
	$scope.dire_score = 0;

	function seconds_to_string(sec) {
		function less_than_ten(value) {
			return value < 10 ? '0' + value.toString() : value.toString();
		}
		return less_than_ten(Math.floor(sec/60)) + ':' + less_than_ten(sec%60);
	}

	function decrement() {
    if (typeof game !== 'undefined') {
		  $scope.time_left = seconds_to_string(Math.max(0, Math.floor(game.roundTime - game.timePassed)));
    }
    $timeout(decrement, 1000);
	}

  $scope.toggleSound = function() {
    $scope.sound_on = !$scope.sound_on;
    if ($scope.sound_on) {
      PubSub.publish('game.mute', {});
    } else {
      PubSub.publish('game.unmute', {});
    }
  };

  $scope.pauseGame = function() {
    $scope.game_paused = !$scope.game_paused;
    game.pause();
  };

  $scope.changeTerrain = function() {
    $scope.terrain_index += 1;
    $scope.terrain_index %= terrains.length;
    game.map.reskin(terrains[$scope.terrain_index]);
  }

  PubSub.subscribe('game.score.changed', function (msg, score) {
    $scope.radiant_score = score["red"] || 0;
    $scope.dire_score = score["yellow"] || 0;
  });

  PubSub.subscribe('game.restart', function() {
    $scope.radiant_score = 0;
    $scope.dire_score = 0;
  });

  decrement();
}

