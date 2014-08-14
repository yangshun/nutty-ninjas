var HulkGun = function(ninja, view) {
  ShurikenGun.call(this, ninja, view);
  this.delay = 500;
  this.shuriken = HulkFist;
}

HulkGun.prototype = new ShurikenGun();
HulkGun.prototype.constructor = HulkGun;