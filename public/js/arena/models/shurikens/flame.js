var Flame = function() {
  Shuriken.call(this);
  this._type = 'Flame';
  this.width = 30;
  this.height = 24;
  this.damage = 20;
  this.rotation_step = 0;
  this.speed = 600;
};

Flame.prototype = new Shuriken();
Flame.prototype.constructor = Flame;

Flame.prototype.collide = function(anotherObject) {
  if ((anotherObject instanceof Shuriken) && (this.ninja === anotherObject.ninja)) return;
  this.view.alpha = 0.5;
  this.dead = true;
  PubSub.publish('shuriken.'+this._type+'.death', {shuriken: this});
};

Flame.offsetX = function() {
  return 60.0;
}

Flame.make = function(owner, centerVector, angle, ownerType) {
  var s = new Flame();  
  if (ownerType === "monster") { s.monster = owner; }
  else { s.ninja = owner; }
  s.angle = angle;

  var sView = new createjs.Bitmap("/images/projectiles/flame.png");
  sView.scaleX = s.width / 417.0;
  sView.scaleY = s.height / 320.0;
  sView.regX = 417.0 / 2;
  sView.regY = 320.0 / 2;
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

  if (s.ninja) { s.damage *= s.ninja.damageModifier; }
  else s.damage *= s.monster.damageModifier;

  return s;
}
