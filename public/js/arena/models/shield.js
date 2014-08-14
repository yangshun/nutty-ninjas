var Shield = function(x, y, body, bitmapView) {
  CollidableObject.call(this);
  this.body = body;
  // this.body.SetUserData(this); // Set reference of this to body, useful in colison callback
  this.view = bitmapView;
  this.width = 20;
  this.height = 5;
  this.ninja = null;

  this.dist = 30;

  this.activated = false;
  this._type = 'shield';

  this.damageable = true;
  this.damage = 0.5;
};

Shield.prototype = new CollidableObject();
Shield.prototype.constructor = Shield;
Shield.prototype.active = function(activate, x, y) {
  this.activated = activate;
  this.body.SetActive(activate);
  this.view.alpha = activate ? 1 : 0;

};

Shield.prototype.collide = function(anotherObject) {
  // Shield is indestructible
};

Shield.prototype.destroy = function() {
  game.removeShield(this);
  this.ninja = null;
  this.view = null;
  delete this;
}

Shield.prototype.tick = function(x, y, angle) {
  if (this.activated) {
    var cX = this.dist * - Math.sin(angle);
    var cY = this.dist * Math.cos(angle);
    var centerVector = new Vector2D(x + cX, y + cY);
    this.body.SetTransform(centerVector.tob2Vec2(SCALE), angle);

    this.view.x = this.body.GetPosition().get_x() * SCALE;
    this.view.y = this.body.GetPosition().get_y() * SCALE;
    this.view.rotation = toDegree(this.body.GetAngle());
  }
};

Shield.make = function(x, y, width, height, ninja) {
  var fixture = new b2FixtureDef();
  fixture.set_density(10);
  fixture.set_restitution(1.0);
  fixture.set_friction(1.0);

  var shape = new b2PolygonShape();
  shape.SetAsBox(width/SCALE, height/SCALE);
  fixture.set_shape(shape);

  var bodyDef = new b2BodyDef();
  var position = new Vector2D(x/SCALE,y/SCALE);
  bodyDef.set_type(Box2D.b2_dynamicBody);
  bodyDef.set_position(position.tob2Vec2(SCALE));

  var body = game.box.CreateBody(bodyDef);
  body.CreateFixture(fixture);
  body.SetActive(false);

  var view = new createjs.Bitmap('/images/katana.png');
  view.name = "body";
  view.scaleX = width / (1969 / 2.0);
  view.scaleY = height / (206 / 2.0);
  view.regX = 1969 / 2.0;
  view.regY = 206 / 2.0;
  view.x = x;
  view.y = y;
  view.alpha = 0;

  game.stage.addChild(view);

  var s = new Shield(x, y, body, view);
  s.ninja = ninja;
  body.actor = s;
  return s;
};
