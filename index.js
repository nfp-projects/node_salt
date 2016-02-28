'use strict'
require('use-strict')

const http = require('http')
const socket = require('socket.io')
const config = require('./config')
const server = require('./server')
const log = require('./log')

let srv = http.createServer()
let io = socket(srv)

io.on('connection', server.bind(this, io))

srv.listen(config.get('server:port'))

log.info(`Server is running on port ${config.get('server:port')}`)

module.exports = { io, app: srv }
