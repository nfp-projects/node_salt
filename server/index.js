let logger = require('../log');

module.exports = (io, socket) => {
  let log = logger.child({
    ip: socket.request.connection.remoteAddress
  });

  log.info('New connection');

  socket.on('ping_test', () => socket.emit('pong_test'));

  socket.on('disconnect', () => {
    log.info('Connection closed');
  });
};
