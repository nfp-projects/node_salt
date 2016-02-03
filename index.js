let http = require('http');
let socket = require('socket.io');
let config = require('./config');
let server = require('./server');

let srv = http.createServer();
var io = socket(srv);

io.on('connection', server.bind(this, io));

srv.listen(config.get('server:port'));

module.exports = {
  io: io,
  app: srv
}
