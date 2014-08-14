// TODO: pass parameters to constructor
var Ninja = function(player, color) {
  ControllableObject.call(this, player);
  this.hitPoint = 100;
  this.maxHitPoint = 100;
  this.color = color;
  this.team = this.color;
  this.size = NINJA_RADIUS;
  this.speed = 250.0;
  this.baseSpeed = 250.0;
  this.angle = Math.PI / 2;
  this.state = 'live';
  this.effects = [];
  this.ShurikenGun = new ShurikenGun(this);

  this.followers = [];

  this.ninja_shield = null;
  this.shielding = false;

  this.damageModifier = 0;
  this.speedModifier = 0;
  this.healthModifier = 0;

  this._type = 'ninja';
};

Ninja.prototype = new ControllableObject();
Ninja.prototype.constructor = Ninja;

Ninja.prototype.move = function(angle, speed) {
};

Ninja.prototype.shoot = function() {
  if (!this.shielding) {
    this.ShurikenGun.makeShuriken(this.angle);
  }
};

Ninja.prototype.shield = function() {
  // Might want to do effects here
  this.ninja_shield.active(true);
  this.shielding = true;
  this.slowEffect = this.slowEffect || new SpeedEffect(this, -150, 50);
};

Ninja.prototype.unshield = function() {
  this.ninja_shield.active(false);
  this.shielding = false;
  if (this.slowEffect) {
    this.slowEffect.remove();
    this.slowEffect.destroy();
    this.slowEffect = null;
  }
};

Ninja.prototype.destroy = function() {
  this.ShurikenGun.destroy();
  this.ShurikenGun = null;
  
  this.effects.map(function(e) { e.destroy(); });
  this.effects = null;

  this.followers.map(function(f) { f.destroy(); });
  this.followers = [];

  this.ninja_shield.destroy();
  this.ninja_shield = null;
  
  game.removeNinja(this);
  this.view = null;
  delete this;
};

// Override collision callback
Ninja.prototype.collide = function(anotherObject) {
  if (this.state == 'invulnerable') return ;
  if (anotherObject instanceof Shuriken) {
    if (anotherObject.ninja == this) {
      // Anything we want to happen here?
    } else {
      if (anotherObject instanceof Flame || anotherObject.ninja.team !== this.team || game.friendlyFire) {
        this.hitPoint -= anotherObject.damage;
      }
    }

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

  if (anotherObject instanceof GunTile) {
    this.equipGun(anotherObject.gun_type);
  }

  if (anotherObject instanceof Shield) {
    if (anotherObject.ninja.team !== this.team || game.friendlyFire) {
      this.hitPoint -= anotherObject.ninja.ninja_shield.damage;
    }
  }

  if (anotherObject instanceof Monster) {
    this.hitPoint -= 1.0;
  }

  if (anotherObject instanceof NovaTile) {
    this.addEffect(new NovaEffect(this));
  }
  
  if (anotherObject.damageable) {
    if (this.hitPoint <= 0) { 
      this.state = 'dead'; 
      var killer;
      if (anotherObject instanceof Monster) { killer = anotherObject; }
      else if (anotherObject instanceof Flame) { killer = anotherObject.monster || anotherObject.ninja; } 
      else { killer = anotherObject.ninja; }
      PubSub.publish('ninja.death', {
        killer :killer,
        victim: this,
        weapon: anotherObject,
        weapon_type: anotherObject._type
      });
    }
  }

  this.updateHitPointBar();
};

Ninja.prototype.equipGun = function(gun_type) {
  if (this.ShurikenGun) this.ShurikenGun.destroy();

  var gun = GunFactory.makeGun({ninja: this, type: gun_type});
  this.ShurikenGun = gun;
  gun.view.x = 0;
  gun.view.y = 0;
  var numChild = this.view.getNumChildren();
  this.view.addChildAt(gun.view, numChild);
};

Ninja.prototype.updateHitPointBar = function() {
  var hpBar = this.view.getChildByName("hitpoint");
  var ratio = this.hitPoint / this.maxHitPoint;

  var width = 3*this.size*ratio/2;
  width -= 3*this.size/2;

  hpBar.scaleX = ratio;
  hpBar.x = width;
};

// Override handleInput function
Ninja.prototype.handleInput = function(input) {
  if (this.state == 'live') {
    if (input.key === 'move') {
      this.angle = input.angle;
      var vXnew = this.speed * input.length * Math.cos(input.angle);
      var vYnew = this.speed * input.length * Math.sin(input.angle);
      this.changeLinearVelocity(new Vector2D(vXnew, vYnew));
    } else if (input.key === 'stopmove') {
      this.changeLinearVelocity(new Vector2D(0, 0));
    } else if (input.key === 'shoot') {
      this.shoot();
    } else if (input.key === 'shield') {
      this.shield();
    } else if (input.key === 'unshield') {
      this.unshield();
    } else if (input.key == 'nova') {
      this.nova(4);
    }
  }

};

Ninja.prototype.changeLinearVelocity = function(v) {
    var vXold = this.body.GetLinearVelocity().get_x();
    var vYold = this.body.GetLinearVelocity().get_y();

    var mass = this.body.GetMass();
    var deltaPx = mass * (v.x / SCALE - vXold);
    var deltaPy = mass * (v.y / SCALE - vYold);

    this.body.ApplyLinearImpulse(new b2Vec2(deltaPx, deltaPy), this.body.GetPosition());
};

Ninja.prototype.addEffect = function(e) {
  this.effects.push(e);
};

Ninja.prototype.removeEffect = function(e) {
  this.effects = _.without(this.effects, e);
};

Ninja.prototype.reset = function(position) {
  this.state = 'live';
  this.hitPoint = this.maxHitPoint;
  this.angle = 0.0;
  this.speed = this.baseSpeed;
  
  this.body.SetActive(true);
  this.body.SetTransform(position.tob2Vec2(SCALE), 0.0);
  this.body.SetLinearVelocity(new b2Vec2(0, 0));
  this.body.SetAngularVelocity(0);
 
  this.updateHitPointBar();

  this.equipGun('none');
};

Ninja.prototype.die = function() {
  this.state = 'reviving';
  this.body.SetActive(false);

  this.unshield();
  _.each(this.effects, function(e) { e.destroy(); });
  this.effects = [];
}

Ninja.prototype.addFollower = function(f) {
  this.followers.push(f);
};

Ninja.prototype.removeFollower = function(f) {
  this.followers = _.without(this.followers, f);
};

Ninja.prototype.nova = function(number) {
  this.ShurikenGun.nova(number);
}

// Override tick function
Ninja.prototype.tick = function() {
  var that = this;
  if (this.state == 'live') {
    this.view.x = this.body.GetPosition().get_x() * SCALE;
    this.view.y = this.body.GetPosition().get_y() * SCALE;
    this.view.getChildByName("body").rotation = toDegree(this.angle);
    this.view.getChildByName("gun").rotation = toDegree(this.angle);

    this.ninja_shield.tick(this.view.x, this.view.y, this.angle - Math.PI / 2);
    this.effects.map(function(e) { e.tick(that); });
    this.followers.map(function(e) { e.tick(that); });
  } else if (this.state == 'dead') {
    this.die();
    game.reviveNinja(this, 1000.0);
  } else if (this.state == 'remove') {
    PubSub.publish('ninja.remove', {name: this.player.name, ninja: this });
    this.destroy();
  } else if (this.state == 'invulnerable') {
    this.view.x = this.body.GetPosition().get_x() * SCALE;
    this.view.y = this.body.GetPosition().get_y() * SCALE;
  }
};

Ninja.prototype.reskin = function(tileSet) {
  game.stage.removeChild(this.view);
  game.stage.removeChild(this.ninja_shield.view);
  var nameStroke = this.view.getChildByName('nameStroke');
  var c = nameStroke.color;
  var name = this.view.getChildByName('name');
  nameStroke.color = name.color;
  name.color = c;

  game.stage.addChild(this.view);
  game.stage.addChild(this.ninja_shield.view);
};
