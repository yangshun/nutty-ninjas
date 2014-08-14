// TODO: pass in parameters
var SnowFlake = function() {
  Shuriken.call(this);
  this._type = 'snowflake';
  this.width = 30;
  this.height = 30;
  this.rotation_step = 0;
};

SnowFlake.prototype = new Shuriken();
SnowFlake.prototype.constructor = SnowFlake;

SnowFlake.offsetX = function() {
  return 35.0;
}

SnowFlake.make = function(ninja, centerVector, angle) {
  var s = new SnowFlake();  
  s.ninja = ninja;
  s.angle = angle;

  var sView = new createjs.Bitmap("/images/projectiles/snowflake.png");
  sView.scaleX = s.width / 160.0;
  sView.scaleY = s.height / 160.0;
  sView.regX = 160.0 / 2;
  sView.regY = 160.0 / 2;
  sView.x = centerVector.x;
  sView.y = centerVector.y;

  // Make the Box2D body
  var fixture = new b2FixtureDef;
  fixture.set_density(s.density);
  fixture.set_restitution(0);
    
  var shape = new b2PolygonShape();
  shape.SetAsBox(s.width / SCALE / 2, s.height / SCALE / 2);
  fixture.set_shape(shape);

  var bodyDef = new b2BodyDef;
  bodyDef.set_type(Box2D.b2_dynamicBody);
  bodyDef.set_position(centerVector.tob2Vec2(SCALE));
  bodyDef.set_angle(angle);

  var body = game.box.CreateBody(bodyDef);
  body.CreateFixture(fixture);  
  body.SetAngularVelocity(toRadian(s.rotation_step));

  s.body = body;
  s.body.actor = s;
  s.view = sView;

  s.damage *= s.ninja.damageModifier;

  return s;
}