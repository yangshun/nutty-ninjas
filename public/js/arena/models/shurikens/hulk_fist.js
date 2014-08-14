var HulkFist = function() {
  Shuriken.call(this);
  this._type = 'hulk_fist';
  this.width = 60;
  this.height = 35;
  this.density = 1;
  this.damage = 30;
  this.rotation_step = 0;
};

HulkFist.prototype = new Shuriken();
HulkFist.prototype.constructor = HulkFist;

HulkFist.offsetX = function() {
  return 55.0;
}

HulkFist.make = function(ninja, centerVector, angle) {
  var s = new HulkFist();  
  s.ninja = ninja;
  s.angle = angle;

  var sView = new createjs.Bitmap("/images/projectiles/hulk-fist.png");
  sView.scaleX = s.width / 300.0;
  sView.scaleY = s.height / 142.0;
  sView.regX = 300.0 / 2;
  sView.regY = 142.0 / 2;
  sView.x = centerVector.x;
  sView.y = centerVector.y;

  // Make the Box2D body
  var fixture = new b2FixtureDef;
  fixture.set_density(s.density);
  fixture.set_restitution(0);
    
  var shape = new b2PolygonShape;
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
