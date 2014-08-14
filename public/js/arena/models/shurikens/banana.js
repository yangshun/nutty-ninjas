var Banana = function() {
  Shuriken.call(this);
  this._type = 'banana';
  this.width = 24;
  this.height = 16;
  this.turn = 1;
};

Banana.prototype = new Shuriken();
Banana.prototype.constructor = Banana;

Banana.prototype.tick = function() {
  // Angle is 0 at 12 o'clock and clockwise
  var x = this.body.GetLinearVelocity().get_x();
  var y = this.body.GetLinearVelocity().get_y();
  var angle = Math.atan(Math.abs(y) / Math.abs(x));
  if (y < 0) {
    if (x > 0) {
      angle = Math.PI / 2 - angle;
    } else {
      angle = Math.PI * 2 - (Math.PI / 2 - angle);
    }
  } else {
    if (x > 0) {
      angle = Math.PI / 2 + angle;
    } else {
      angle = Math.PI + (Math.PI / 2 - angle);
    }
  }

  var mag = 0.003 * Math.sqrt(x*x + y*y);

  var newX = mag * this.turn * Math.cos(angle);
  var newY = mag * this.turn * Math.sin(angle);

  this.body.ApplyLinearImpulse(new b2Vec2(newX, newY), this.body.GetPosition());
  this.view.x = this.body.GetPosition().get_x() * SCALE;
  this.view.y = this.body.GetPosition().get_y() * SCALE;
  this.view.rotation = toDegree(this.body.GetAngle());
  if (this.dead || outside(this.view.x, this.view.y)) {
    this.destroy();
  }
};

Banana.offsetX = function() {
  return 30.0;
}

Banana.make = function(ninja, centerVector, angle, turn, scale) {
  if (!scale) scale = 1;

  var s = new Banana(); 
  s.width *= scale; 
  s.height *= scale;
  
  s.ninja = ninja;
  s.angle = angle;

  var sView = new createjs.Bitmap("/images/projectiles/banana.png");
  sView.scaleX = s.width  / 300.0;
  sView.scaleY = s.height / 218.0;
  sView.regX = 300.0 / 2;
  sView.regY = 218.0 / 2;
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
  s.turn = turn;

  s.damage *= s.ninja.damageModifier;

  return s;
}
