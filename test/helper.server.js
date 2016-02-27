let socket = require('socket.io-client')
let config = require('../config')
let logHelper = require('./helper.logger')
let server = require('../index')

after(() => server.app.close())

exports.createClient = () => {
  let client = socket(
    `http://localhost:${config.get('server:port')}`,
    { reconnection: false })

  client.connectAsync = () =>
    new Promise((resolve, reject) => {
      client.on('connect_error', reject)
      client.on('connect', resolve)
    })

  client.closeAsync = () =>
    new Promise((resolve, reject) => {
      if (client.disconnected) return resolve()
      client.on('disconnect', resolve)
      client.close()
    })

  return client
}

exports.stubLogger = logHelper.stub

exports.delay = (time) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, time)
  })


exports.io = server.io
exports.app = server.app
