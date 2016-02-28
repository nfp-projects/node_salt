const logger = require('../log')
const deploy = require('./deploy/handlers')
const manager = require('./manager/handlers')

function register(context, name, method) {
  context.socket.on(name, (data) => {
    context.log.info(`got event ${name}`)
    method(context, data)
  })
}

module.exports = (io, socket) => {
  let log = logger.child({
    ip: socket.request.connection.remoteAddress,
    id: socket.id,
  })

  socket.on('ping_test', () =>
    socket.emit('pong_test')
  )

  let context = { io, socket, log }

  manager.newConnection(context)

  socket.on('disconnect', () =>
    manager.lostConnection(context)
  )

  register(context, 'manager.all_connections', manager.allConnections)
  register(context, 'deploy.latest', deploy.latest)
}
