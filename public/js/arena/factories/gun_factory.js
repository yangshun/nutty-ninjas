var GunFactory = {
  images: { 'banana': '/images/cannons/banana.png',
            'frost': '/images/cannons/frost.png',
            'hulk': '/images/cannons/hulk.png',
            'juggernaut': '/images/cannons/juggernaut.png',
            'laser': '/images/cannons/laser.png',
            'plasma': '/images/cannons/plasma.png',
            'meme': '/images/cannons/meme.png',
            'flamethrower': '/images/cannons/flamethrower.png'},

  // data: {position: Vector2D, player: Player, color: String}
  makeGun: function(data) {
    var gun_view;
    if (data.type == 'none') {
      gun_view = new createjs.Shape();
      gun_view.name = "gun";
    } else {
      var gun_url = this.images[data.type] || this.images['frost'];
      gun_view = new createjs.Bitmap(gun_url);
      gun_view.name = "gun";
      gun_view.scaleX = GUN_WIDTH  / 623.0;
      gun_view.scaleY = GUN_HEIGHT  / 200.0;
      gun_view.regX = 623 / 2.0;
      gun_view.regY = -(data.ninja.size - GUN_HEIGHT) / gun_view.scaleY;
    }

    var gun; 
    switch (data.type) {
      case 'banana':
        gun = new BananaGun(data.ninja, gun_view);
        break;
      case 'hulk':
        gun = new HulkGun(data.ninja, gun_view);
        break;
      case 'juggernaut':
        gun = new JuggernautGun(data.ninja, gun_view);
        break;
      case 'laser':
        gun = new LaserGun(data.ninja, gun_view);
        break;
      case 'frost':
        gun = new FrostGun(data.ninja, gun_view);
        break;
      case 'plasma':
        gun = new PlasmaGun(data.ninja, gun_view);
        break;
      case 'meme':
        gun = new MemeGun(data.ninja, gun_view);
        break;
      case 'flamethrower':
        gun = new Flamethrower(data.ninja, gun_view);
        break;
      default:
        gun = new ShurikenGun(data.ninja, gun_view);
    }
    return gun;
  },

  allGunTypes: function() {
    return _.keys(this.images);
  },

  gunImage: function(gun_type) {
    return this.images[gun_type];
  }
};
