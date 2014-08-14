
/**
 * Module dependencies.
 */

var una = require('una');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = una.app;
var express = una.express;

// all environments
app.set('port', process.env.PORT || 3216);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// For routing
app.post('/choose', routes.choose);
app.get('/', routes.index);
app.get('/landing', routes.landing);
app.get('/play', routes.arena);
app.get('/play/*', routes.arenaWithRoom);
app.get('/join', routes.controller);
app.get('/join/*', routes.controllerWithRoom);
app.get('/bot', routes.botcontrollerWithRoom);
app.get('/bot/*', routes.botcontrollerWithRoom);


app.get('/trololol/kick/:id', function(req, res) {
  // only allow access to this page if the una header is set properly (by the proxy server)
  if (req.headers['una'] && req.headers['una'] == 'uunnaa') {
    var socket = una.io.sockets.socket(req.params.id);
    if (socket) {
      socket.disconnect();
    }
    return res.redirect('/trololol');
  }
  res.send(404);
});

app.get('/trololol', function(req, res) {
  // only allow access to this page if the una header is set properly (by the proxy server)
  if (req.headers['una'] && req.headers['una'] == 'uunnaa') {
    var out = {};
    for (var room_id in una.io.sockets.manager.rooms) {
      if (room_id == '') {
        continue;
      }
      var sockets = una.io.sockets.clients(room_id.substring(1));
      var clients = [];
      for (var i=0;i<sockets.length;i++) {
        clients.push(sockets[i].una);
      }
      out[room_id] = clients;
    }

    return res.render('admin', {clients: JSON.stringify(out)});
  }
  res.send(404);
});

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Accept, Origin, Referer, User-Agent, Content-Type, Authorization, X-Mindflash-SessionID');
    
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    } else {
      next();
    }
};
 
app.configure(function() {
    app.use(allowCrossDomain);
});

// Set http constants to allow infinite # of sockets
http.globalAgent.maxSockets = Infinity;

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

una.listen(server);