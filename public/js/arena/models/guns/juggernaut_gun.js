var JuggernautGun = function(ninja, view) {
  ShurikenGun.call(this, ninja, view);
  this.shuriken = Rocket;
}

JuggernautGun.prototype = new ShurikenGun();
JuggernautGun.prototype.constructor = JuggernautGun;

JuggernautGun.prototype.makeOneShuriken = function(angle) {
  var sign = Math.random() > 0.5 ? 1.0 : -1.0;
  angle = angle + sign * Math.random() * this.angleRange;
  
  var cX = this.shuriken.offsetX() * Math.cos(-angle) + this.ninja.size * Math.sin(-angle);
  var cY = this.shuriken.offsetX() * -Math.sin(-angle) + this.ninja.size * Math.cos(-angle);
  var centerVector = new Vector2D(this.ninja.view.x + cX, this.ninja.view.y + cY);

  var s = this.shuriken.make(this.ninja, centerVector, angle);
  game.addShuriken(s);
  s.shoot();
}

JuggernautGun.prototype.makeShuriken = function(angle) {
  if (!this.checkDelay()) return false;

  this.makeOneShuriken(angle - Math.PI / 5);
  this.makeOneShuriken(angle);
  this.makeOneShuriken(angle + Math.PI / 5);
}

