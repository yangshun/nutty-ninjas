var MonsterHell = {
  spriteimage: "/images/monsters/fire-spirit.png",

  // data: {position: Vector2D, player: Player, color: String}
  makeMonster: function(data) {
    if (!this.canMakeMonster(data)) return false;

    var fixture = new b2FixtureDef;
    fixture.set_density(50);
    fixture.set_restitution(0);
    fixture.set_friction(1.0);

    var shape = new b2CircleShape();
    shape.set_m_radius(MONSTER_RADIUS / SCALE);
    fixture.set_shape(shape);

    var bodyDef = new b2BodyDef;
    bodyDef.set_type(Box2D.b2_dynamicBody);
    bodyDef.set_position(data.position.tob2Vec2(SCALE));

    var body = game.box.CreateBody(bodyDef);
    body.CreateFixture(fixture);
    
    var monster = new Monster();
    monster.size = MONSTER_RADIUS;

    var view = new createjs.Container();
    view.x = data.position.x;
    view.y = data.position.y;

//    var image_name = this.spriteimage;
//    var body_view = new createjs.Bitmap(image_name);
//    body_view.name = "body";
//    body_view.scaleX = monster.size  / (600 / 2.0);
//    body_view.scaleY = monster.size  / (600 / 2.0);
//    body_view.regX = 600 / 2;
//    body_view.regY = 600 / 2;
//    view.addChild(body_view);

    var spriteData = {
      images: [this.spriteimage],
      frames: {width: 200, height:184},
      animations: {
        standing: {
          frames: [0]
        },
        walk: {
          frames: [1,2]
        },
        charge: {
          frames:  [3,4,5, 'charge'],
          speed: 15
        }
      }
    };

    var spriteSheet = new createjs.SpriteSheet(spriteData);
    var body_view = new createjs.Sprite(spriteSheet, 'standing');
    body_view.name = "body";
    body_view.scaleX = monster.size  / (200 / 2.0);
    body_view.scaleY = monster.size  / (184 / 2.0);
    body_view.regX = 200 / 2;
    body_view.regY = 184 / 2;
    view.addChild(body_view);

    var hitpoint_view = new createjs.Shape();
    hitpoint_view.name = "hitpoint";
    hitpoint_view.graphics.beginFill("orange").drawRect(-(monster.size*1), -monster.size-10, monster.size*2, 10);
    view.addChild(hitpoint_view);

    var hitpoint_frame_view = new createjs.Shape();
    hitpoint_frame_view.name = "hitpoint_frame";
    hitpoint_frame_view.graphics.setStrokeStyle(1,"round").beginStroke("orange").drawRect(-(monster.size*1), -monster.size-10, monster.size*2, 10);
    view.addChild(hitpoint_frame_view);

    monster.body = body;
    monster.body.actor = monster;
    monster.view = view;

    return monster;
  },

  canMakeMonster: function(data) {
    return true;
  }
};
