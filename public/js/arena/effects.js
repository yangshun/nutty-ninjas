var Effect = function() {
  GameObject.call(this);
  this.view = null;
  this._type = 'effect';

  this.dead = false;
};

Effect.prototype = new GameObject();
Effect.prototype.constructor = Effect;

Effect.prototype.tick = function () {
};



// Heal Effect
var HealEffect = function(ninja) {
  Effect.call(this);
  this.ninja = ninja;

  var image = new Image();
  image.src = 'images/flame5x36x64.png';

  var spriteSheet = new createjs.SpriteSheet({
    // image to use
    images: [image],
    frames: { width: 36, height: 64, regX: 18, regY: 32},
    animations: {
      heal: [0,4, 'heal', 2]
    }
  });
  spriteSheet.framerate = 10;
  
  this.view = new createjs.Sprite(spriteSheet, 'heal');
  this.view.regX = 0;
  this.view.regY = 0;

  this.view.x = ninja.view.x;
  this.view.y = ninja.view.y;

  game.stage.addChild(this.view);
};

HealEffect.prototype = new Effect();
HealEffect.prototype.constructor = HealEffect;
HealEffect.prototype.tick = function (ninja) {
  this.view.x = ninja.view.x;
  this.view.y = ninja.view.y;
  this.view.alpha -= 0.01;
};
HealEffect.prototype.destroy = function() {
  this.ninja.removeEffect(this);
  game.stage.removeChild(this.view);
  delete this;
};


// GameEndEffect Effect
var GameEndEffect = function(cooldown_time) {
  Effect.call(this);

  this.bg_cover = new createjs.Shape();  
  this.bg_cover.graphics.beginFill("black").drawRect(0, 0, game.canvas.width, game.canvas.height);
  this.bg_cover.alpha = 0.5;

  game.stage.addChild(this.bg_cover);

  this.view = new createjs.Text("Game Over", "30px peachy-keen, Obelix", "#fed61b");
  this.view.textAlign = "center";
  this.view.x = game.canvas.width/2.0;
  this.view.y = game.canvas.height/2.0 - this.view.getBounds().height - 50;
  game.stage.addChild(this.view);

  this.timeleft = cooldown_time;
};

GameEndEffect.prototype = new Effect();
GameEndEffect.prototype.constructor = GameEndEffect;
GameEndEffect.prototype.destroy = function() {
  game.stage.removeChild(this.bg_cover);
  game.stage.removeChild(this.view);
  this.view = null;
  delete this;
};
GameEndEffect.prototype.tick = function(delta_time) {
  this.timeleft -= delta_time;

  if (this.timeleft < 0) {
    this.view.text = "";
  }
  else {
    this.view.text = "Restarting in " + Math.floor(this.timeleft) + " seconds...";
  }
}

// Blink effect
var BlinkEffect = function(ninja) {
  Effect.call(this);
  this.ninja = ninja;
  this.interval = 100;
  ninja.state = 'invulnerable';

  var that = this;
  var BlinkEvent = function () {
    if (!that.ninja || !that.ninja.view) return;
    that.interval *= 0.9;
    that.ninja.view.alpha = 1 - that.ninja.view.alpha;

    if (that.interval > 1) {
      TimedEventManager.addEvent(that.interval, BlinkEvent);
    } else {
      that.ninja.removeEffect(that);
      that.ninja.view.alpha = 1;
      ninja.state = 'live';
      that.destroy();
    }
  };
  BlinkEvent();
};

BlinkEffect.prototype = new Effect();
BlinkEffect.prototype.constructor = BlinkEffect;
BlinkEffect.prototype.tick = function (ninja) {
//  this.ninja.view.alpha = 1 - this.ninja.view.alpha;
};

BlinkEffect.prototype.destroy = function() {
  this.ninja.removeEffect(this);
  game.stage.removeChild(this.view);
  delete this;
};

// Death effect
var DeathEffect = function(object) {
  Effect.call(this);
  if (!object) return;
  this.view = object.view.getChildByName('body').clone();
  this.view.x = object.view.x;
  this.view.y = object.view.y;
  game.stage.addChild(this.view);
  
  this.interval = 100; 
  this.numCalled = 0;
  this.numFrame = 60;

  // var sign = Math.random() > 0.5 ? 1 : -1;
  // this.deltaX = Math.random() * 20.0 * sign;
  // sign = Math.random() > 0.5 ? 1 : -1;
  // this.deltaY = Math.random() * 20.0 * sign;
  this.deltaX = 0;
  this.deltaY = -10;

  var that = this;
  var DeathEvent = function () {
    that.view.rotation += 10;
    that.view.alpha -= 0.05;
    that.view.rotation += 10;
    that.view.scaleX *= 1.1;
    that.view.scaleY *= 1.1;
    that.view.y += that.deltaY;
    that.view.x += that.deltaX;
    TimedEventManager.addEvent(1.0/that.numFrame, DeathEvent);
    that.numCalled++;
    if (that.numCalled >= that.numFrame) { that.destroy(); }
  };
  DeathEvent();
};

DeathEffect.prototype = new Effect();
DeathEffect.prototype.constructor = DeathEffect;
DeathEffect.prototype.destroy = function() {
  game.stage.removeChild(this.view);
  delete this;
};

// Killer effect
var KillerEffect = function(ninja) {
  Effect.call(this);

  var text = KillerEffect.randomMessage();
  this.view = new createjs.Text(text,'15px peachy-keen, Obelix','red');

  this.view.textAlign = 'center';
  this.deltaY = -2;

  this.view.x = ninja.view.x;
  this.view.y = ninja.view.y + this.deltaY;
  game.stage.addChild(this.view);
  
  this.interval = 100; 
  this.numCalled = 0;
  this.numFrame = 60 * 1.5;


  var that = this;
  var KillerEvent = function () {
    that.view.scaleX *= 1.01;
    that.view.scaleY *= 1.01;

    that.view.y = that.view.y + that.deltaY;

    TimedEventManager.addEvent(1.5/that.numFrame, KillerEvent);
    that.numCalled++;
    if (that.numCalled >= that.numFrame) {
      that.destroy();
    }
  };
  KillerEvent();
};

KillerEffect.randomMessage = function() {
  var msg = ["That's what she said", "You suck", "Call me maybe",
             "I kicked your ass", "This is NINJA!",
             "Come back next year", "I am your father",
             "Argh be bach",
             "Who's your Daddy?", "!@#$", "Me Gusta",
             "Die noob!", "RAMPAGE!", "PWNED"];
  return _.sample(msg);
}
KillerEffect.prototype = new Effect();
KillerEffect.prototype.constructor = KillerEffect;
KillerEffect.prototype.destroy = function() {
  game.stage.removeChild(this.view);
  delete this;
};

// Speed Effect
var SpeedEffect = function(ninja, change, minimum, duration) {
  Effect.call(this);
  this.ninja = ninja;
  this.start = (new Date()).getTime();
  this.duration = duration || Infinity;

  var old = ninja.speed;
  ninja.speed = Math.max(minimum, ninja.speed + change);
  this.real_change = old - ninja.speed;
};

SpeedEffect.prototype = new Effect();
SpeedEffect.prototype.constructor = SpeedEffect;
SpeedEffect.prototype.tick = function (ninja) {
  if ((new Date()).getTime() - this.start > this.duration) {
    this.remove();
    this.destroy();
  }
};

SpeedEffect.prototype.remove = function() {
  this.ninja.speed += this.real_change;
};

SpeedEffect.prototype.destroy = function() {
  this.ninja.removeEffect(this);
  delete this;
};

var NovaEffect = function(ninja) {
  this.ninja = ninja;
  this.tickedCount = 0;
}
NovaEffect.prototype.tick = function () {
  this.tickedCount++;
  if (this.tickedCount == 2) { 
    this.ninja.nova(8); 
    this.destroy();
  }
}
NovaEffect.prototype.destroy = function() {
  this.ninja.removeEffect(this);
  this.ninja = null;
  delete this;
}
