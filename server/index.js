const logger = require('../log')
const deploy = require('./deploy/handlers')
const manager = require('./manager/handlers')

function register(context, name, method) {
  context.socket.on(name, (data) => {
    context.log.info(`got event ${name}`)
    method(context, data)
  })
}

function logSocket(level, socket, message) {
  socket.emit('server_log', {
    level,
    message,
  })
}

module.exports = (io, socket) => {
  let log = logger.child({
    ip: socket.request.connection.remoteAddress,
    id: socket.id,
  })

  log.socket = {
    trace: logSocket.bind(null, 10, socket),
    debug: logSocket.bind(null, 20, socket),
    info: logSocket.bind(null, 30, socket),
    warn: logSocket.bind(null, 40, socket),
    error: logSocket.bind(null, 50, socket),
    fatal: logSocket.bind(null, 60, socket),
  }

  socket.on('ping_test', () =>
    log.socket.info('pong')
  )

  let context = { io, socket, log }

  manager.newConnection(context)

  socket.on('disconnect', () =>
    manager.lostConnection(context)
  )

  register(context, 'manager.all_connections', manager.allConnections)
  register(context, 'deploy.latest', deploy.latest)
  register(context, 'deploy.items', deploy.list)
}
