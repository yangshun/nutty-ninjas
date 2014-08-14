var CollidableObject = function(body, bitmapView) {
  GameObject.call(this);
  this.body = body;
  // this.body.SetUserData(this); // Set reference of this to body, useful in colison callback
  this.view = bitmapView;
  this.dead = false;
  this._type = 'collidable';
}

CollidableObject.prototype = new GameObject(); // Inheritance
CollidableObject.prototype.constructor = CollidableObject; // Overide constructor

// Collide callback, to be overide by subclasses
CollidableObject.prototype.collide = function(anotherObject) {
}

// Render function, update the view acoording to the body
CollidableObject.prototype.tick = function() {
}