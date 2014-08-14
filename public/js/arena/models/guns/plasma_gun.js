var PlasmaGun = function(ninja, view) {
  ShurikenGun.call(this, ninja, view);
  this.shuriken = Plasma;
}

PlasmaGun.prototype = new ShurikenGun();
PlasmaGun.prototype.constructor = PlasmaGun;