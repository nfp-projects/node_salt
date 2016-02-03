
module.exports = (io, socket) => {
  socket.on('ping_test', () => socket.emit('pong_test'));

  socket.on('disconnect', () => {
  })
};
