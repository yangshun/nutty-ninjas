
/*
 * GET home page.
 */

module.exports = {
  index: function(req, res) {
    res.render('index', { title: 'Nutty Ninjas' });
  },

  choose: function(req, res) {
    var room = req.body.room;
    var type = req.body.type;
    console.log('type: '+type);
    console.log('room: '+room);
    res.redirect('/'+type+'/'+room);
  },

  arena: function(req, res) {
    res.render('arena', { title: 'Nutty Ninjas Arena' });
  },

  landing: function(req, res) {
    res.render('landing', { title: 'Nutty Ninjas' });
  },

  arenaWithRoom: function(req, res) {
    res.render('arena', { title: 'Nutty Ninjas Arena' });
  },

  controller: function(req, res) {
    res.render('controller', { title: 'Nutty Ninjas' });
  },

  controllerWithRoom: function(req, res) {
    res.render('controller', { title: 'Nutty Ninjas' });
  },
  
  botcontrollerWithRoom: function(req, res) {
    res.render('bot_controller', { title: 'Nutty Ninjas' });
  }
};
