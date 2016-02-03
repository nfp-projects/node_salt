let assert = require('assert')
let sinon = require('sinon');

let server;

before(() => server = require('./helper.server'));

after(() => server.app.close());

describe('Server', () => {
  let log = require('../log');
  let client;
  let sandbox;
  let logStubs;

  afterEach(() => {
    sandbox.restore();
    return client.closeAsync();
  });

  beforeEach(() => {
    client = server.createClient();
    sandbox = sinon.sandbox.create();
  });

  it('client should connect successfully', () => {
    return client.connectAsync();
  });

  it('should return pong to a ping event', () => {
    return client.connectAsync()
    .then(() => {
      client.emit('ping_test');
      return new Promise((resolve) => client.on('pong_test', resolve));
    });
  });

  it('should call logger about new connection with ip', () => {
    let child = server.stubLogger(sandbox, true);
    let infoStub = sandbox.stub();
    child.returns({info: infoStub});


    return client.connectAsync()
    .then(() => {
      assert.ok(child.called);

      let args = child.firstCall.args[0];
      assert.ok(args.ip.match(/127\.0\.0\.1/));
    });
  });

  it('should call logger on disconnect', () => {
    logStubs = server.stubLogger(sandbox);

    return client.connectAsync()
    .then(() => client.closeAsync())
    .then(() => server.delay(10))
    .then(() => {
      let args = logStubs.info.lastCall.args[0];
      assert.ok(args.match(/[Cc]losed/));
    });
  });
});
