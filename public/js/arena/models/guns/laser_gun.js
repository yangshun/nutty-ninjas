var LaserGun = function(ninja, view) {
  ShurikenGun.call(this, ninja, view);
  this.delay = 400;
  this.shuriken = Laser;
}

LaserGun.prototype = new ShurikenGun();
LaserGun.prototype.constructor = LaserGun;