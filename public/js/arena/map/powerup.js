// ===== Powerups =====

var Powerup = function(x, y, r, img) {
  Tile.call(this);
  this.x = x * TILE_WIDTH;
  this.y = y * TILE_HEIGHT;
  this.tileX = x;
  this.tileY = y;
  this.rotation = r || 0; // Rotation in degrees

  this.view = null;
  this.body = null;
  this.dead = false;
  this._type = 'tile_powerup';
};

Powerup.prototype = new Tile();
Powerup.prototype.constructor = Powerup;

Powerup.prototype.initShape = function(w, h) {
  this.img_width = w;
  this.img_height = h;

  this.view = new createjs.Bitmap(this.img);
  this.view.scaleX = TILE_WIDTH / this.img_width;
  this.view.scaleY = TILE_HEIGHT / this.img_height;
  this.view.regX = this.img_width / 2;
  this.view.regY = this.img_height / 2;
  this.view.x = this.x;
  this.view.y = this.y;

  game.stage.addChild(this.view);
};

Powerup.prototype.initBody = function() {
  var fixture = new b2FixtureDef();
  fixture.set_density(1);
  fixture.set_restitution(0.0);
  fixture.set_friction(1.0);
  
  var shape = new b2PolygonShape();
  shape.SetAsBox(TILE_WIDTH / 2 / SCALE, TILE_HEIGHT / 2 / SCALE);
  fixture.set_shape(shape);

  var bodyDef = new b2BodyDef();
  var position = new Vector2D(this.x + TILE_WIDTH / 2, this.y+TILE_HEIGHT / 2);
  bodyDef.set_type(Box2D.b2_staticBody);
  bodyDef.set_position(position.tob2Vec2(SCALE));

  var body = game.box.CreateBody(bodyDef);
  body.CreateFixture(fixture);

  this.body = body;
  this.body.actor = this;
};

Powerup.prototype.collide = function(anotherObject) {
  this.dead = true;
};

Powerup.prototype.destroy = function() {
  game.map.removeTile(this);
};

Powerup.prototype.tick = function() {
  if (this.dead) {
    this.destroy();
  }
  this.view.rotation += 1;
};


// Gun Pickup Tiles

var GunTile = function(x, y, r, gun_type) {
  Powerup.call(this);
  this.x = x * TILE_WIDTH;
  this.y = y * TILE_HEIGHT;
  this.tileX = x;
  this.tileY = y;
  this.rotation = r || 0; // Rotation in degrees

  var gun_types = _.without(GunFactory.allGunTypes(), 'flamethrower');

  this.gun_type = gun_type || _.sample(gun_types);

  this.view = null;
  this.body = null;
  this.dead = false;
  this._type = 'tile_gun';
};

GunTile.prototype = new Powerup();
GunTile.prototype.constructor = GunTile;

GunTile.prototype.initShape = function(c) {
  this.view = new createjs.Bitmap(GunFactory.gunImage(this.gun_type));
  this.view.name = "gun";
  this.view.scaleX = TILE_WIDTH  / 623.0 * 1.2;
  this.view.scaleY = TILE_HEIGHT / 200.0 * GUN_HEIGHT / GUN_WIDTH * 1.2;
  this.view.regX = 623 / 2.0;
  this.view.regY = 200 / 2.0;
  this.view.x = this.x + TILE_WIDTH / 2;
  this.view.y = this.y + TILE_HEIGHT / 2;

  game.stage.addChild(this.view);
};
GunTile.prototype.collide = function(anotherObject) {
  if (anotherObject instanceof Shield) {
    return
  }
  this.dead  = true;
};
GunTile.prototype.tick = function() {
  if (this.dead) {
    this.destroy();
  }
  this.view.rotation += 5;
};


// HealthTile

var HealthTile = function(x, y, r, img, heal) {
  Powerup.call(this);
  this.x = x * TILE_WIDTH;
  this.y = y * TILE_HEIGHT;
  this.tileX = x;
  this.tileY = y;
  this.rotation = r || 0; // Rotation in degrees
  this.img = img;

  this.heal = heal || 30;

  this.view = null;
  this.body = null;
  this.dead = false;
  this._type = 'tile_health';
};

HealthTile.prototype = new Powerup();
HealthTile.prototype.constructor = HealthTile;


// SpeedTile

var SpeedTile = function(x, y, r, img) {
  Powerup.call(this);
  this.x = x * TILE_WIDTH;
  this.y = y * TILE_HEIGHT;
  this.tileX = x;
  this.tileY = y;
  this.rotation = r || 0; // Rotation in degrees
  this.img = img;

  this.view = null;
  this.body = null;
  this.dead = false;
  this._type = 'tile_speed';
};

SpeedTile.prototype = new Powerup();
SpeedTile.prototype.constructor = SpeedTile;
SpeedTile.prototype.collide = function(anotherObject) {
  this.dead = true;
};

// NovaTile
var NovaTile = function(x, y, r, img) {
  Powerup.call(this);
  this.x = x * TILE_WIDTH;
  this.y = y * TILE_HEIGHT;
  this.tileX = x;
  this.tileY = y;
  this.rotation = r || 0; // Rotation in degrees
  this.img = img;

  this.view = null;
  this.body = null;
  this.dead = false;
  this._type = 'tile_nova';
};

NovaTile.prototype = new Powerup();
NovaTile.prototype.constructor = NovaTile;
NovaTile.prototype.collide = function(anotherObject) {
  this.dead = true;
};
