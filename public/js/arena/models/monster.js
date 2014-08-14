// TODO: pass parameters to constructor
var Monster = function() {
  ControllableObject.call(this);
  this.hitPoint = 500;
  this.maxHitPoint = 500;
  this.size = MONSTER_RADIUS;
  this.speed = 400.0;
  this.angle = - Math.PI / 2;
  this.tickCount = 0;
  this.state = 'live';
  this.effects = [];
  this.damageable = true;
  this.damageModifier = 1.5;
  this._type = 'monster';
};

Monster.prototype = new ControllableObject();
Monster.prototype.constructor = Monster;

Monster.prototype.destroy = function() {
  _.each(this.effects, function(e) { e.destroy() });
  this.effects = null;
  game.removeMonster(this);
  this.view = null;
  delete this;
};

// Override collision callback
Monster.prototype.collide = function(anotherObject) {
  if (anotherObject instanceof Shuriken && anotherObject.ninja) {
    this.hitPoint -= anotherObject.damage;
  }

  if (anotherObject instanceof HealthTile) {
    this.hitPoint = Math.min(anotherObject.heal + this.hitPoint, this.maxHitPoint);
  }

  if (anotherObject instanceof SpeedTile) {
    this.addEffect(new SpeedEffect(this, 100, 50, 3000));
  }

  if ((anotherObject instanceof SnowFlake)){
    this.addEffect(new SpeedEffect(this, -50, 50, 3000));
  }

  if (anotherObject instanceof Shield) {
    this.hitPoint -= 0.5;
  }

  this.updateHitPointBar();
  
  if (anotherObject.damageable) {
    if (this.hitPoint <= 0) { 
      this.state = 'dead'; 
      var deathEffect = new DeathEffect(this);
      PubSub.publish('monster.death', {
        killer: anotherObject.ninja,
        victim: this,
        x: this.view.x,
        y: this.view.y
      });
    }
  }
};

Monster.prototype.updateHitPointBar = function() {
  var hpBar = this.view.getChildByName("hitpoint");
  var ratio = this.hitPoint / this.maxHitPoint;

  var width = 2*this.size*ratio/2;
  width -= 2*this.size/2;

  hpBar.scaleX = ratio;
  hpBar.x = width;
};

Monster.prototype.changeLinearVelocity = function(v) {
    var vXold = this.body.GetLinearVelocity().get_x();
    var vYold = this.body.GetLinearVelocity().get_y();

    var mass = this.body.GetMass();
    var deltaPx = mass * (v.x / SCALE - vXold);
    var deltaPy = mass * (v.y / SCALE - vYold);

    this.body.ApplyLinearImpulse(new b2Vec2(deltaPx, deltaPy), this.body.GetPosition());
};

Monster.prototype.addEffect = function(e) {
  this.effects.push(e);
};

Monster.prototype.removeEffect = function(e) {
  this.effects = _.without(this.effects, e);
};

Monster.prototype.move = function() {
  this.tickCount++;
  if (this.tickCount >= 150) {
    var sign = Math.round(Math.random() * 2 - 1);
    this.angle += sign * (Math.max(Math.random() * Math.PI, Math.PI / 4));
    var vXnew = this.speed * Math.cos(this.angle);
    var vYnew = this.speed * Math.sin(this.angle);
    this.changeLinearVelocity(new Vector2D(vXnew, vYnew));
    this.view.getChildByName('body').gotoAndStop('charge');
    this.tickCount = 0;
  } else if (this.tickCount > 60) {
    // Rest
    this.changeLinearVelocity(new Vector2D(0, 0));
    this.view.getChildByName('body').gotoAndStop('standing');
  } else if (this.tickCount > 0) {
    // Keep the same speed
    if (this.tickCount % 5 === 0) {
      this.view.getChildByName('body').advance();
    }
  }
};

// Override tick function
Monster.prototype.tick = function() {
  var that = this;
  if (this.state == 'live') {
    this.view.x = this.body.GetPosition().get_x() * SCALE;
    this.view.y = this.body.GetPosition().get_y() * SCALE;
    this.view.getChildByName("body").rotation = toDegree(this.angle+Math.PI/2);
    _.each(this.effects, function(e) { e.tick(that); });
    this.move();

    var prob = 0.008;
    if (this.hitPoint < this.maxHitPoint / 2.0) prob = 0.012;
    if (Math.random() < prob) this.nova(8);
  } else if (this.state === 'dead') {
    this.destroy();
  }
};

Monster.prototype.makeFlameNoDelay = function(angle) {
  var cX = Flame.offsetX() * Math.cos(-angle) + this.size * Math.sin(-angle);
  var cY = Flame.offsetX() * -Math.sin(-angle) + this.size * Math.cos(-angle);
  var centerVector = new Vector2D(this.view.x + cX, this.view.y + cY);

  var s = Flame.make(this, centerVector, angle, "monster");
  game.addShuriken(s);
  s.shoot();
}

Monster.prototype.checkNovaDelay = function() {
  return true;
}


Monster.prototype.nova = function(number) {
  if (!this.checkNovaDelay()) return false;
  var random_offset = Math.round(Math.random()*360);
  for (var i = 0; i < number; i++) {
    var angle = toRadian(360.0 / number * i + random_offset);
    this.makeFlameNoDelay(angle);
  }
}
