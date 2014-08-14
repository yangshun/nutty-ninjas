var ShurikenGun = function(ninja, view) {
  GameObject.call(this);

  this.ninja = ninja;
  this.view = view;
  this.angleRange = 0.05; // In radian
  this.delay = 300;
  this.lastShoot = 0;
  this.novaDelay = 1000;
  this.lastNova = 0;
  var color = null;
  if (this.ninja) { color = this.ninja.color; }
  
  this.shuriken = Shuriken;
}

ShurikenGun.prototype = new GameObject();

ShurikenGun.prototype.constructor = ShurikenGun;

ShurikenGun.prototype.checkDelay = function() {
  var now = (new Date()).getTime();
  if (this.lastShoot + this.delay > now) return false;
  this.lastShoot = now;
  return true;
}

ShurikenGun.prototype.makeShuriken = function(angle) {
  if (!this.checkDelay()) return false;
  this.makeShurikenNoDelay(angle);
}

ShurikenGun.prototype.makeShurikenNoDelay = function(angle) {
  var sign = Math.random() > 0.5 ? 1.0 : -1.0;
  angle = angle + sign * Math.random() * this.angleRange;
  
  var cX = this.shuriken.offsetX() * Math.cos(-angle) + this.ninja.size * Math.sin(-angle);
  var cY = this.shuriken.offsetX() * -Math.sin(-angle) + this.ninja.size * Math.cos(-angle);
  var centerVector = new Vector2D(this.ninja.view.x + cX, this.ninja.view.y + cY);

  var s = this.shuriken.make(this.ninja, centerVector, angle);
  game.addShuriken(s);
  s.shoot();
}

ShurikenGun.prototype.checkNovaDelay = function() {
  var now = (new Date()).getTime();
  if (this.lastNova + this.novaDelay > now) return false;
  this.lastNova = now;
  return true;
}


ShurikenGun.prototype.nova = function(number) {
  if (!this.checkNovaDelay()) return false;
  var random_offset = Math.round(Math.random()*360);
  for (var i = 0; i < number; i++) {
    var angle = toRadian(360.0 / number * i + random_offset);
    this.makeShurikenNoDelay(angle);
  }
}

ShurikenGun.prototype.destroy = function() {
  this.ninja.view.removeChild(this.view);
  this.ninja = null;
  this.view = null;
  delete this;
}