var KBConfig = {
  width: 120,
  height: 40,

  ninja_part_width: 50,
  ninja_part_height: 50,

  weapon_part_width: 40,
  weapon_part_height: 20,

  disappearDelay: 100,
  appearDelay: 100,
  moveDelay: 100,
  stayDelay: 3000,

  paddingTop: 50,
  namePaddingY: -10
};

function Kill(data, x, y) {
  var ShurikenImages = {
    'shield' : {img: '/images/katana.png', w: 1969, h: 206},
    'shuriken': {img: '/images/projectiles/shuriken.png', w: 344, h: 344},
    'laser': {img: '/images/projectiles/laser.png', w: 320, h: 417},
    'banana': {img: '/images/projectiles/banana.png', w: 300, h: 218},
    'plasma': {img: '/images/projectiles/plasma.png', w: 240, h: 113},
    'rocket': {img: '/images/projectiles/rocket.png', w: 240, h: 86},
    'hulk_fist': {img: '/images/projectiles/hulk-fist.png', w: 300, h: 142},
    'snowflake': {img: '/images/projectiles/snowflake.png', w: 160, h: 160},
    'Meme': {img: '/images/projectiles/meme-1.png', w: 400, h: 519},
    'monster': {img: '/images/monster.png', w: 600, h: 600},
    'Flame': {img: '/images/projectiles/flame.png', w: 417, h:320}
  };

  var NinjaImages = {
    'red': {img: '/images/ninjas/ninja-red.png', w: 600, h: 538},
    'yellow': {img: '/images/ninjas/ninja-yellow.png', w: 600, h: 538},
    'green': {img: '/images/ninjas/ninja-green.png', w: 600, h: 538},
    'blue': {img: '/images/ninjas/ninja-blue.png', w: 600, h: 538}
  };

  var getNinjaNameView = function(name) {
    var c = 'white';
    if (game.map.tileSet == 'snow') {
      c = 'black';
    }
    var view = new createjs.Text(name, '20px "peachy-keen", Obelix', c);
    view.textAlign = 'center';
    name.x = 0;
    name.y = 0;
    return view;
  };

  var getNinjaView = function(color) {
    var image =  NinjaImages[color];
    if (!image) return false;

    var ninjaview = new createjs.Bitmap(image.img);
    ninjaview.scaleX = KBConfig.ninja_part_width / image.w;
    ninjaview.scaleY = KBConfig.ninja_part_height / image.h;
    ninjaview.regX = image.w / 2;
    ninjaview.regY = image.h / 2;
    return  ninjaview;
  };

  var getMonsterView = function() {
    var img = MonsterHell.image;
    if (!img) return false;

    var monsterview = new createjs.Bitmap(img);
    monsterview.scaleX = KBConfig.ninja_part_width / 600;
    monsterview.scaleY = KBConfig.ninja_part_height / 600;
    monsterview.regX = 600/2;
    monsterview.regY = 600/2;
    return  monsterview;
  };

  var getWeaponView = function(type) {
    var weapon = ShurikenImages[type];
    var img = weapon.img;
    var weaponview = new createjs.Bitmap(img);
    weaponview.scaleX = KBConfig.weapon_part_width / weapon.w;
    weaponview.scaleY = KBConfig.weapon_part_height / weapon.h;
    weaponview.regX = weapon.w / 2;
    weaponview.regY = weapon.h / 2;
    return weaponview;
  };

  var view = new createjs.Container();
  view.x = x || 0;
  view.y = y || 0;

  var bgview = new createjs.Shape();
  bgview.graphics.beginFill('#ffffff').drawRect(-KBConfig.ninja_part_width/2,-KBConfig.ninja_part_height/2,KBConfig.width, KBConfig.height);
  bgview.alpha = 0.0;

  var killerview;
  if (data.killer._type == 'monster') {
    killerview = getMonsterView();
  } else {
    killerview = getNinjaView(data.killer.color);
  }
  killerview.x = 0;
  killerview.y = 0;

  var killername = getNinjaNameView(data.killer.player.name);
  killername.x = -killername.getBounds().width - 10;
  killername.y = KBConfig.namePaddingY;

  var victimview;
  if (data.victim._type == 'Monster') {
    victimview = getMonsterView();
  } else {
    victimview = getNinjaView(data.victim.color);
  }
  victimview.x = 100;
  victimview.y = 0;

  var victimname = getNinjaNameView(data.victim.player.name);
  victimname.x = KBConfig.width + victimname.getBounds().width/2 + 5;
  victimname.y = KBConfig.namePaddingY;

  var weaponview = getWeaponView(data.weapon_type);
  weaponview.x = 50;
  weaponview.y = 0;

  view.addChild(bgview);
  view.addChild(killerview);
  view.addChild(killername);
  view.addChild(victimview);
  view.addChild(victimname);
  view.addChild(weaponview);

  this.view = view;

  this.width = KBConfig.height;
  this.height = KBConfig.width;
}


var KillBoard = (function() {
  var x = (window.innerWidth - ArenaConfig.scoreBoardWidth) / 2.0 - KBConfig.width / 2;
  var kill_list = [];

  var push = function (data) {
    // Figure out where to add this
    var last_y = KBConfig.paddingTop;
    if (kill_list.length > 0) {
      pop();
      // last_y += kill_list[kill_list.length-1].view.y + KBConfig.height;
    }

    // Add this last kill onto the list
    var k = new Kill(data, x, last_y);
    k.view.x = - KBConfig.width;
    k.view.y = last_y;
    k.view.alpha = 0;
    kill_list.push(k);
    createjs.Tween.get(k.view, {override:true}).to({alpha: 1, x: x}, KBConfig.appearDelay);

    game.stage.addChild(k.view);
    setTimeout(pop, KBConfig.stayDelay);
  };

  var pop = function() {
    // Move everyone up
    kill_list.map(function(l) {
      var target_x = game.canvas.width;
      var tween = createjs.Tween.get(l.view, {override:true})
                    .to({x:target_x, alpha:0}, KBConfig.moveDelay);
    });
    kill_list.shift();
  };

  return {push: push, pop: pop};

})();

PubSub.subscribe('ninja.death', function(msg, data) {
  if (data.killer._type !== 'monster' && data.victim._type !== 'monster') {
    KillBoard.push(data);
  }
});

var makekill = function() {
  data = {killer: new Ninja(), victim: new Ninja(), weapon_type: 'shuriken'};
  data.killer.player = {name: 'p1'};
  data.victim.player = {name: 'p2'};
  console.log(data);
  KillBoard.push(data);
};
