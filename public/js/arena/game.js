var Game = function() {
  this.map = null;
  this.ninjas = [];
  this.shurikens = [];
  this.monsters = [];
  this.stage = null;
  this.state = "LOADING";
  this.timePassed = 0;
  // In seconds
  this.roundTime = 300;
  this.cooldownTime = 5;
  this.score = {};
  this.friendlyFire = true;

  this.box = new b2World(new b2Vec2(0, 0), true);
  var listener = new b2ContactListener();

  Box2D.customizeVTable(listener, [{
      original: Box2D.b2ContactListener.prototype.PostSolve,
      replacement:
          function (thsPtr, contactPtr) {
              var contact = Box2D.wrapPointer( contactPtr, b2Contact );
              var bodyA = contact.GetFixtureA().GetBody().actor;
              var bodyB = contact.GetFixtureB().GetBody().actor;

              CollisionManager.collision(bodyA, bodyB);
          }
  }]);
  this.box.SetContactListener(listener);

  // Initialize pubsub stuff
  var blinkOn = function(msg, data) {
    data.ninja.addEffect(new BlinkEffect(data.ninja));
  };

  PubSub.subscribe('ninja.create', blinkOn);
  PubSub.subscribe('ninja.revive', blinkOn);

  var that = this;
  PubSub.subscribe('ninja.death', function(msg, data) {
    that.onNinjaDeath(msg, data);
  });

  createjs.Ticker.addEventListener('tick', _.bind(this.handleTick, this));
}

Game.prototype.restart = function() {
  _.each(this.shurikens, function(shuriken) { 
    shuriken.destroy(); 
  });
  _.each(this.ninjas, function(ninja) {
    ninja.die();
    game.reviveNinja(ninja, 0);
  });
  _.each(this.monsters, function(monster) {
    monster.destroy();
  });
  this.score = {};
  this.timePassed = 0;
  createjs.Ticker.setFPS(60);
  this.map.respawnMap();
  this.start();
  PubSub.publish('game.restart', {});

  if (this.gameEndEffect) { this.gameEndEffect.destroy(); }
}

Game.prototype.start = function() {
  createjs.Ticker.setPaused(false);
  this.state = "PLAYING";
  PubSub.publish('game.start', {});
}

Game.prototype.pause = function() {
  if (this.state === 'PAUSED') {
    this.start();
  } else if (this.state === 'PLAYING') {
    this.state = "PAUSED";
    PubSub.publish('game.pause', {});
  }
}

Game.prototype.end = function() {
  this.state = "END";
  this.gameEndEffect = new GameEndEffect(this.cooldownTime);
  PubSub.publish('game.end', {});
}

Game.prototype.handleTick = function(ticker_data) {
  var timestep = Math.min(ticker_data.delta, 34) / 1000.0;
  if (this.state === "PLAYING") {
    this.box.Step(timestep, 8.0, 3.0);
    this.box.ClearForces();

    this.ninjas.map(function(s){s.tick();});
    this.monsters.map(function(m){m.tick();});
    if (Math.random() < 0.005 && this.monsters.length === 0) { this.addMonster(); }
    this.shurikens.map(function(s){s.tick();});
    this.map.tick();
    TimedEventManager.tick();

    this.timePassed += timestep;
    if (this.timePassed >= this.roundTime) { this.end(); }
  }

  if (this.state == "END") {
    if (this.gameEndEffect) {
      this.gameEndEffect.tick(timestep);
    }
  }
  this.stage.update();
}

Game.prototype.addNinja = function(id, data) {
  if (!NinjaSchool.canTrainNinja(data.ninja)) return false;

  var player = new Player(id, data);
  var position = this.map.getRandomBlankPosition();

  var ninja = NinjaSchool.trainNinja({
    player: player,
    position: position,
    color: data.ninja
  });

  this.ninjas.push(ninja);
  this.stage.addChild(ninja.view);
  PubSub.publish('ninja.create', { name: ninja.player.name, ninja: ninja });

  this.score[ninja.team] = this.score[ninja.team] || 0;

  return true;
}

//Game.prototype.updateScore = function(player_kill, player_die) {
  // Leaderboard.updatePlayer(player_kill, {kill: 1});
//}

Game.prototype.reviveNinja = function(ninja, time) {
  this.stage.removeChild(ninja.view);
  setTimeout(function() {
    var position = game.map.getRandomBlankPosition();
    if (ninja && ninja.state !== 'remove') {
      ninja.reset(position);
      game.stage.addChild(ninja.view);
      PubSub.publish('ninja.revive', {name: ninja.player.name, ninja: ninja});
    }
  }, time);
}

Game.prototype.onNinjaDeath = function(msg, data) {
  var deathEffect = new DeathEffect(data.victim);
  var killerEffect = new KillerEffect(data.killer);

  var team = data.killer.team;
  if (this.score[team]) {
    this.score[team] += 1;
  } else {
    this.score[team] = 1;
  }

  PubSub.publish("game.score.changed", this.score);
}

Game.prototype.removeNinja = function(s) {
  this.stage.removeChild(s.view);
  this.ninjas = _.without(this.ninjas, s);
  this.box.DestroyBody(s.body);
}

Game.prototype.removeShield = function(s) {
  this.stage.removeChild(s.view);
  this.box.DestroyBody(s.body);
}

Game.prototype.addShuriken = function(s) {
  this.shurikens.push(s);
  this.stage.addChild(s.view);
}

Game.prototype.removeShuriken = function(s) {
  this.stage.removeChild(s.view);
  this.shurikens = _.without(this.shurikens, s);
  this.box.DestroyBody(s.body);
}

Game.prototype.addMonster = function() {
  var position = this.map.getRandomBlankPosition();

  var data = {position: position};
  if (!MonsterHell.canMakeMonster(data)) return false;

  var monster = MonsterHell.makeMonster(data);

  this.monsters.push(monster);
  this.stage.addChild(monster.view);
  PubSub.publish('monster.create', monster);

  return true;
}

Game.prototype.removeMonster = function(m) {
  this.stage.removeChild(m.view);
  this.monsters = _.without(this.monsters, m);
  this.box.DestroyBody(m.body);
}
