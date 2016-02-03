let socket = require('socket.io-client')
let config = require('../config');

let server = require('../index');

exports.createClient = () => {
  let client = socket(
    `http://localhost:${config.get('server:port')}`,
    { reconnection: false });

  client.connectAsync = () => {
    return new Promise((resolve, reject) => {
      client.on('connect_error', reject);
      client.on('connect', resolve);
    })
  }

  return client;
}

exports.io = server.io;
exports.app = server.app;
