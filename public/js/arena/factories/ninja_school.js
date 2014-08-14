var NinjaSchool = {
  colors: ['yellow', 'red', 'blue', 'orange', 'purple', 'green', 'brown', 'cyan'],
  images: {'yellow'  : '/images/players/player-yellow.png',
            'red'    : '/images/players/player-red.png',
            'green'  : '/images/players/player-green.png',
            'blue'   : '/images/players/player-blue.png'
  },
  color_hex: {
    'yellow'  : '#fed61b',
    'red'    : '#fe1b1b',
    'green'  : '#5bfe1b',
    'blue'   : '#1bd6fe'
  },
  // data: {position: Vector2D, player: Player, color: String}
  trainNinja: function(data) {
    if (!this.canTrainNinja(data.color)) return false;

    var fixture = new b2FixtureDef;
    fixture.set_density(1);
    fixture.set_restitution(0);
    fixture.set_friction(1.0);
    
    var shape = new b2CircleShape();
    shape.set_m_radius(NINJA_RADIUS / SCALE);
    fixture.set_shape(shape);

    var bodyDef = new b2BodyDef;
    bodyDef.set_type(Box2D.b2_dynamicBody);
    bodyDef.set_position(data.position.tob2Vec2(SCALE));

    var body = game.box.CreateBody(bodyDef);
    body.CreateFixture(fixture);
    
    var ninja = new Ninja(data.player, data.color);
    ninja.size = NINJA_RADIUS;

    var view = new createjs.Container();
    view.x = data.position.x;
    view.y = data.position.y;

    var image_name = this.images[data.color] || this.images['yellow'];
    var body_view = new createjs.Bitmap(image_name);
    body_view.name = "body";
    body_view.scaleX = ninja.size  / (250 / 2.0);
    body_view.scaleY = ninja.size  / (250 / 2.0);
    body_view.regX = 250 / 2;
    body_view.regY = 250 / 2;
    view.addChild(body_view);

    var hitpoint_view = new createjs.Shape();
    hitpoint_view.name = "hitpoint";
    hitpoint_view.graphics.beginFill(this.color_hex[data.color]).drawRect(-(ninja.size*1.5), -ninja.size-20, ninja.size*3, 10);
    view.addChild(hitpoint_view);

    var hitpoint_frame_view = new createjs.Shape();
    hitpoint_frame_view.name = "hitpoint_frame";
    hitpoint_frame_view.graphics.setStrokeStyle(1,"round").beginStroke(this.color_hex[data.color]).drawRect(-(ninja.size*1.5), -ninja.size-20, ninja.size*3, 10);
    view.addChild(hitpoint_frame_view);

    var name_view = new createjs.Text(data.player.name, "15px peachy-keen, Obelix", "white");
    name_view.name = "nameStroke";
    name_view.textAlign = "center";
    name_view.x = 0;
    name_view.y = - ninja.size - 45;
    name_view.outline = 1;

    var name_view2 = new createjs.Text(data.player.name, "15px peachy-keen, Obelix", "black");
    name_view2.name = "name";
    name_view2.textAlign = "center";
    name_view2.x = 0;
    name_view2.y = - ninja.size - 45;

    //var bgw = name_view.getBounds().width + 10;
    //var bgh = name_view.getBounds().height;
    // var name_bg_view = new createjs.Shape();
    // name_bg_view.name = "name_bg";
    // name_bg_view.graphics.beginFill("white").drawRect(-bgw / 2.0, -ninja.size - bgh - 24, bgw, bgh);
    // name_bg_view.alpha = 0.75;

    // view.addChild(name_bg_view);
    view.addChild(name_view2);
    view.addChild(name_view);

    ninja.body = body;
    ninja.body.actor = ninja;
    ninja.view = view;
    
    ninja.equipGun('none');

    ninja.ninja_shield = Shield.make(data.position.x - 15, data.position.y, 30, 7, ninja);

    switch (ninja.color) {
        case 'red':
            ninja.damageModifier = 1.2;
            ninja.healthModifier = 0.9;
            ninja.speedModifier = 1.1;
            ninja.shieldModifier = 1.0;
            break;
        case 'yellow':
            ninja.damageModifier = 1.1;
            ninja.healthModifier = 0.9;
            ninja.speedModifier = 1.2;
            ninja.shieldModifier = 0.9;
            break;
        case 'blue':
            ninja.damageModifier = 0.9;
            ninja.healthModifier = 1.4;
            ninja.speedModifier = 1.0;
            ninja.shieldModifier = 1.2;
            break;
        case 'green':
            ninja.damageModifier = 1.0;
            ninja.healthModifier = 1.5;
            ninja.speedModifier = 0.9;
            ninja.shieldModifier = 1.1;
            break;
        default: break;
    }

    ninja.maxHitPoint *= ninja.healthModifier;
    ninja.hitPoint = ninja.maxHitPoint;
    ninja.baseSpeed *= ninja.speedModifier;
    ninja.ninja_shield.damage *= ninja.shieldModifier;
    ninja.speed = ninja.baseSpeed;

    return ninja;
  },

  canTrainNinja: function(color) {
    if (!_.contains(this.colors, color)) return false;
    return true;
  }
}
