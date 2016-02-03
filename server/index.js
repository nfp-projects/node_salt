let logger = require('../log');
let deploy = require('./deploy');

module.exports = (io, socket) => {
  let log = logger.child({
    ip: socket.request.connection.remoteAddress
  });

  log.info('New connection');

  socket.on('ping_test', () =>
    socket.emit('pong_test')
  );

  socket.on('disconnect', () =>
    log.info('Connection closed')
  );

  let context = {
    io: io,
    socket: socket,
    log: log
  };

  Object.keys(deploy).forEach(key => {
    socket.on(
      `deploy_${key}`,
      deploy[key].bind(this, context)
    );
  });
};
