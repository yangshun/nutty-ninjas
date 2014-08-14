// TODO: pass in parameters
var Meme = function() {
  Shuriken.call(this);
  this._type = 'Meme';
  this.width = 32;
  this.height = 40;
  this.rotation_step = 1.0/3 * 360.0;
};

Meme.prototype = new Shuriken();
Meme.prototype.constructor = Meme;

Meme.offsetX = function() {
  return 40.0;
}

Meme.randomImage = function() {
  var id = Math.floor(Math.random() * 4) + 1;
  return "/images/projectiles/meme-" + id + ".png";
}

Meme.make = function(ninja, centerVector, angle) {
  var s = new Meme();  
  s.ninja = ninja;
  s.angle = angle;

  var sView = new createjs.Bitmap(Meme.randomImage());
  sView.scaleX = s.width / 400.0;
  sView.scaleY = s.height / 519.0;
  sView.regX = 400.0 / 2;
  sView.regY = 519.0 / 2;
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