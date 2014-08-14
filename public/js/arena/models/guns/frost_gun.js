var FrostGun = function(ninja, view) {
  ShurikenGun.call(this, ninja, view);
  this.delay = 200;
  this.shuriken = SnowFlake;
}

FrostGun.prototype = new ShurikenGun();
FrostGun.prototype.constructor = FrostGun;