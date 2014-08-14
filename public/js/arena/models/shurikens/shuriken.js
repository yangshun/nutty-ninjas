// TODO: pass in parameters
var Shuriken = function(data) {
  CollidableObject.call(this);
  this.color = null;
  this.ninja = null;
  this.speed = 350;
  this.width = 20;
  this.height = 20;
  this.damage = 10;
  this.duration = 0;
  this.angle = 0;
  this.density = 0.1;
  // Angular velocity of shuriken, in degree / sec
  this.rotation_step = 3 * 360.0;
  this._type = 'shuriken';

  this.damageable = true;
};

Shuriken.prototype = new CollidableObject();

Shuriken.prototype.constructor = Shuriken;

Shuriken.prototype.destroy = function() {
    game.removeShuriken(this);
    this.ninja = null;
    this.view = null;
    delete this;
};

Shuriken.prototype.shoot = function() {
  PubSub.publish('shuriken.' + this._type + '.shoot', {shuriken: this} );
  this.changeLinearVelocity(new Vector2D(this.speed * Math.cos(this.angle),
                                         this.speed * Math.sin(this.angle)));
};

Shuriken.prototype.changeLinearVelocity = function(v) {
    var vXold = this.body.GetLinearVelocity().get_x();
    var vYold = this.body.GetLinearVelocity().get_y();

    var mass = this.body.GetMass();
    var deltaPx = mass * (v.x / SCALE - vXold);
    var deltaPy = mass * (v.y / SCALE - vYold);

    this.body.ApplyLinearImpulse(new b2Vec2(deltaPx, deltaPy), this.body.GetPosition());
};

// Override collision callback
Shuriken.prototype.collide = function(anotherObject) {
  // Our shuriken are like paper, and it goes away with with any collision
  // var that = this;
  // TimedEventManager.addEvent(100, function() {
  //   that.dead = true;
  // });
  if ((anotherObject instanceof Shuriken) && (this.ninja === anotherObject.ninja)) return;
  this.view.alpha = 0.5;
  this.dead = true;
  PubSub.publish('shuriken.'+this._type+'.death', {shuriken: this});
};

Shuriken.prototype.tick = function() {
	this.view.x = this.body.GetPosition().get_x() * SCALE;
	this.view.y = this.body.GetPosition().get_y() * SCALE;
  this.view.rotation = toDegree(this.body.GetAngle());
  if (this.dead || outside(this.view.x, this.view.y)) {
    this.destroy();
  }
};

Shuriken.offsetX = function() {
  return 30.0;
}

Shuriken.make = function(ninja, centerVector, angle) {
  var s = new Shuriken();  
  s.ninja = ninja;
  s.angle = angle;

  var sView = new createjs.Bitmap("/images/projectiles/shuriken.png");
  sView.scaleX = s.width / 344.0;
  sView.scaleY = s.height / 344.0;
  sView.regX = 344.0 / 2;
  sView.regY = 344.0 / 2;
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
