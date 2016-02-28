const _ = require('lodash')

let connections = []

exports.lostConnection = (ctx) => {
  let removed = _.remove(connections, (item) =>
    item.socket === ctx.socket)

  ctx.log.info('Connection was closed')

  if (removed.length > 0) {
    ctx.io.emit('lost_connection', { ip: removed[0].ip })
  }
}

exports.newConnection = (ctx) => {
  ctx.log.info('Got new connection')

  ctx.socket.emit('all_connections', connections.map((item) => ({
    ip: item.ip,
  })))

  connections.push({
    ip: ctx.socket.request.connection.remoteAddress,
    socket: ctx.socket,
  })

  ctx.socket.broadcast.emit('new_connection', {
    ip: ctx.socket.request.connection.remoteAddress,
  })
}

exports.allConnections = (ctx) =>
  ctx.socket.emit(
    'all_connections',
    connections.map((item) => ({
      ip: item.ip,
    })))

exports.connections = connections
