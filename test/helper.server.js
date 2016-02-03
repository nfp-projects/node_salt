let socket = require('socket.io-client')
let config = require('../config');
let server = require('../index');
let log = require('../log');

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

  client.closeAsync = () => {
    return new Promise((resolve, reject) => {
      if (client.disconnected) return resolve();
      client.on('disconnect', resolve);
      client.close();
    });
  }

  return client;
}

exports.stubLogger = (sandbox, shallow) => {
  let child = sandbox.stub(log, 'child');

  if (shallow) {
    return child;
  }

  let out = {
    error: sandbox.stub(),
    warn: sandbox.stub(),
    info: sandbox.stub(),
    debug: sandbox.stub()
  }

  child.returns(out);
  return out;
}


exports.delay = (time) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}


exports.io = server.io;
exports.app = server.app;
