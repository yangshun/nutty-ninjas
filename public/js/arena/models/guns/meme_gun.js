var MemeGun = function(ninja, view) {
  ShurikenGun.call(this, ninja, view);
  this.delay = 400;
  this.shuriken = Meme;
}

MemeGun.prototype = new ShurikenGun();
MemeGun.prototype.constructor = MemeGun;