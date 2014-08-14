function LeaderboardController($scope) {
  var player_stats = function(name) {
    this.name = name;
    this.kills = 0;
    this.deaths = 0;
  };

  $scope.player_list = [];

  $scope.addPlayer = function(msg, data) {
    var person = {'name': data.name, 'kills': 0, 'deaths': 0};
    $scope.player_list.push(person);
    $scope.$parent.game_message = data.name + ' has joined the game!';
    $scope.$apply();
  };
  
  $scope.updatePlayer = function(msg, data) {
    var killer_name;
    if (data.killer.player) {
      var killer =_.findWhere($scope.player_list, {name : data.killer.player.name});
      killer.kills += 1;
      killer_name = data.killer.player.name;
    } else {
      killer_name = "Monster"
    }
    var victim = _.findWhere($scope.player_list, {name : data.victim.player.name});
    victim.deaths += 1;

    $scope.$parent.game_message = killer_name + ' just pwned ' + data.victim.player.name + '!';
    $scope.$apply();
  };

  $scope.removePlayer = function(msg, data) {
    $scope.player_list = _.filter($scope.player_list, function(p) {
      return p.name != data.name;
    });
    $scope.$parent.game_message = data.name + ' has left the game.';
    $scope.$apply();
  }

  $scope.resetScore = function(msg, data) {
    _.each($scope.player_list, function(p) {
      p.kills = 0;
      p.deaths = 0;
    });
    $scope.$apply();
  }

  // Subscribe to the PubSub bros!
  PubSub.subscribe('ninja.death', $scope.updatePlayer);
  PubSub.subscribe('ninja.create', $scope.addPlayer);
  PubSub.subscribe('ninja.remove', $scope.removePlayer);
  PubSub.subscribe('game.restart', $scope.resetScore);
};
