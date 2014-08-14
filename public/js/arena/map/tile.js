TILE_WIDTH = 30;
TILE_HEIGHT = 30;

var Tile = function(x, y, r, c) {
  CollidableObject.call(this);
  this.x = x * TILE_WIDTH;
  this.y = y * TILE_HEIGHT;
  this.tileX = x;
  this.tileY = y;
  this.rotation = r || 0; // Rotation in degrees
  this.color = c || "#ffffff";

  this.view = null;
  this.dead = false;
};

Tile.prototype = new CollidableObject();
Tile.prototype.constructor = Tile;

Tile.prototype.initShape = function(c) {
  this.color = c || this.color;

  this.view = new createjs.Shape();
  this.view.graphics.beginFill(this.color).drawRect(this.x, this.y, TILE_WIDTH, TILE_HEIGHT);
  game.stage.addChild(this.view);
};


Tile.prototype.destroy = function() {
  game.map.removeAndReplaceTile(this);
};

Tile.prototype.tick = function() {
  if (this.dead) {
    this.destroy();  
  }
};

var ObstacleTile = function(x, y, r, c) {
  Tile.call(this);
  this.x = x * TILE_WIDTH;
  this.y = y * TILE_HEIGHT;
  this.tileX = x;
  this.tileY = y;
  this.rotation = r || 0; // Rotation in degrees
  this.color = c || "#ffffff";

  this.view = null;
  this.body = null;
  this.dead = false;
  this._type = 'tile_obstacle';
};

ObstacleTile.prototype = new Tile();
ObstacleTile.prototype.constructor = ObstacleTile;

ObstacleTile.prototype.initBody = function() {
  var fixture = new b2FixtureDef();
  fixture.set_density(1);
  fixture.set_restitution(0.0);
  fixture.set_friction(1.0);
  
  var shape = new b2PolygonShape();
  shape.SetAsBox(TILE_WIDTH / 2 / SCALE, TILE_HEIGHT / 2 / SCALE);
  fixture.set_shape(shape);

  var bodyDef = new b2BodyDef();
  var position = new Vector2D(this.x + TILE_WIDTH / 2, this.y+TILE_HEIGHT / 2);
  // bodyDef.set_type(Box2D.b2_dynamicBody);
  bodyDef.set_type(Box2D.b2_staticBody);
  bodyDef.set_position(position.tob2Vec2(SCALE));

  var body = game.box.CreateBody(bodyDef);
  body.CreateFixture(fixture);

  this.body = body;
  this.body.actor = this;
};

ObstacleTile.prototype.collide = function(anotherObject) {
};

var RoundObstacleTile = function(x, y, r, c) {
  ObstacleTile.call(this);
  this.x = x * TILE_WIDTH;
  this.y = y * TILE_HEIGHT;
  this.tileX = x;
  this.tileY = y;
  this.rotation = r || 0; // Rotation in degrees
  this.color = c || "#ffffff";

  this.view = null;
  this.body = null;

  this.hitpoint = 30;
  this.dead = false;
};

RoundObstacleTile.prototype = new ObstacleTile();
RoundObstacleTile.prototype.constructor = RoundObstacleTile;

RoundObstacleTile.prototype.initShape = function(c) {
  this.color = c || this.color;

  this.view = new createjs.Shape();
  this.view.graphics.beginFill(this.color).drawCircle(this.x + TILE_WIDTH / 2, this.y + TILE_HEIGHT / 2, TILE_WIDTH / 2);
  game.stage.addChild(this.view);
};

RoundObstacleTile.prototype.initBody = function() {
  var fixture = new b2FixtureDef();
  fixture.set_density(1);
  fixture.set_restitution(0.0);
  fixture.set_friction(1.0);
  
  var shape = new b2CircleShape();
  shape.set_m_radius(TILE_WIDTH / 2 / SCALE);
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

RoundObstacleTile.prototype.collide = function(other) {
  if (other instanceof Shuriken) {
    this.hitpoint -= other.damage;
    this.view.alpha = this.hitpoint / 30 * 0.50 + 0.50;
  }

  if (this.hitpoint <= 0) {
    this.dead = true;
  }
};


var TexturedObstacleTile = function(x, y, r, img, data) {
  RoundObstacleTile.call(this);
  this.x = x * TILE_WIDTH;
  this.y = y * TILE_HEIGHT;
  this.tileX = x;
  this.tileY = y;
  this.tileW = data.tileW || 1;
  this.tileH = data.tileH || 1;
  this.rotation = r || 0; // Rotation in degrees
  this.img = img;

  this.view = null;
  this.body = null;

  this.hitpoint = 30;
  this.respawn_time = 15000 + Math.random() * 10000;
  this.dead = false;
};

TexturedObstacleTile.prototype = new RoundObstacleTile();
TexturedObstacleTile.prototype.constructor = TexturedObstacleTile;

TexturedObstacleTile.prototype.initShape = function(w, h) {
  this.img = this.img || img;
  this.img_width = w;
  this.img_height = h;
  this.view = new createjs.Bitmap(this.img);

  var canvasWidth = this.tileW * TILE_WIDTH;
  var canvasHeight = this.tileH * TILE_HEIGHT;

  var scaleX = canvasWidth / this.img_width;
  var scaleY = canvasHeight / this.img_height;
  this.view.scaleX = scaleX;
  this.view.scaleY = scaleY;
  
  this.view.regX = w / 2;
  this.view.regY = h / 2;
  this.view.x = this.x + canvasWidth / 2;
  this.view.y = this.y + canvasHeight / 2;
  this.view.rotation = this.rotation;

  game.stage.addChild(this.view);
};

TexturedObstacleTile.prototype.reskin = function(path, data) {
  var alpha = this.view.alpha;
  game.stage.removeChild(this.view);

  this.img = path;
  this.img_width = data.w;
  this.img_height = data.h;
  this.view = new createjs.Bitmap(path);

  var canvasWidth = this.tileW * TILE_WIDTH;
  var canvasHeight = this.tileH * TILE_HEIGHT;

  var scaleX = canvasWidth / this.img_width;
  var scaleY = canvasHeight / this.img_height;
  this.view.scaleX = scaleX;
  this.view.scaleY = scaleY;
  
  this.view.regX = data.w / 2;
  this.view.regY = data.h / 2;
  this.view.x = this.x + canvasWidth / 2;
  this.view.y = this.y + canvasHeight / 2;
  this.view.rotation = this.rotation;
  this.view.alpha = alpha;
  game.stage.addChild(this.view);
};

TexturedObstacleTile.prototype.initBody = function() {
  var fixture = new b2FixtureDef();
  fixture.set_density(1);
  fixture.set_restitution(0.0);
  fixture.set_friction(1.0);
  
  var shape = new b2PolygonShape();
  shape.SetAsBox(this.tileW*TILE_WIDTH/SCALE/2, this.tileH*TILE_HEIGHT/SCALE/2);
  fixture.set_shape(shape);

  var bodyDef = new b2BodyDef();
  var position = new Vector2D(this.x + (this.tileW * TILE_WIDTH) / 2, this.y+(this.tileH * TILE_HEIGHT) / 2);
  bodyDef.set_type(Box2D.b2_staticBody);
  bodyDef.set_position(position.tob2Vec2(SCALE));

  var body = game.box.CreateBody(bodyDef);
  body.CreateFixture(fixture);

  this.body = body;
  this.body.actor = this;
};

TexturedObstacleTile.prototype.destroy = function() {
  // game.map.removeAndReplaceTile(this);
  this.view.alpha = 0;
  this.body.SetActive(false);
  this.dead = false;
  this.hitpoint = 30;

  var that = this;

  TimedEventManager.addEvent(this.respawn_time, function() {
    that.view.alpha = 1;
    that.body.SetActive(true);
  });
};

TexturedObstacleTile.prototype.collide = function(other) {
  if (!(other instanceof Ninja || other instanceof Tile)) {
    // this.hitpoint -= other.damage;
    // this.view.alpha = this.hitpoint / 3 * 0.25 + 0.75;
    this.hitpoint = 0;
  }

  if (other instanceof Monster) {
    this.hitpoint = 0;
  }

  if (this.hitpoint <= 0) {
    this.dead = true;
  }
};
