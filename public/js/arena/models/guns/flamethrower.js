var Flamethrower = function(ninja, view) {
  ShurikenGun.call(this, ninja, view);
  this.shuriken = Flame;
  this.angleRange = 0.02;
  this.delay = 450;
}

Flamethrower.prototype = new ShurikenGun();
Flamethrower.prototype.constructor = Flamethrower;

Flamethrower.prototype.makeOneShuriken = function(angle, offsetY) {
  var sign = Math.random() > 0.5 ? 1.0 : -1.0;
  angle = angle + sign * Math.random() * this.angleRange;
  
  var cX = this.shuriken.offsetX() * Math.cos(-angle) + (this.ninja.size + offsetY) * Math.sin(-angle);
  var cY = this.shuriken.offsetX() * -Math.sin(-angle) + (this.ninja.size + offsetY) * Math.cos(-angle);
  var centerVector = new Vector2D(this.ninja.view.x + cX, this.ninja.view.y + cY);

  var s = this.shuriken.make(this.ninja, centerVector, angle);
  game.addShuriken(s);
  s.shoot();
}

Flamethrower.prototype.makeShuriken = function(angle) {
  if (!this.checkDelay()) return false;

  this.makeOneShuriken(angle, 30);
  this.makeOneShuriken(angle, 0);
  this.makeOneShuriken(angle, -30);
}

