let chai = require('chai');
let assert = chai.assert;

let server;

before(() => server = require('./helper.server'));

after(() => server.app.close());

describe('Server', () => {
  let client;

  beforeEach(() => {
    client = server.createClient();
  });

  it('client should connect successfully', () => {
    return client.connectAsync()
    .then(() => client.close());
  });

  it('should return pong to a ping event', () => {
    return client.connectAsync()
    .then(() => {
      client.emit('ping_test');
      return new Promise((resolve) => client.on('pong_test', resolve));
    })
    .then(() => client.close());
  })
});
