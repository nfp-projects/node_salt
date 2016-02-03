let EventEmitter = require('events');
let assert = require('assert')
let sinon = require('sinon');


describe('Deploy', () => {
  let deploy = require('../../server/deploy');
  let salt = require('../../server/salt');
  let config = require('../../config');
  let logHelper = require('./helper.logger');
  let runStub;
  let sandbox;
  let context;

  beforeEach(() => {
    config.set('projects:test:master', null);
    sandbox = sinon.sandbox.create();
    runStub = sandbox.stub(salt, 'run');
    context = {
      io: new EventEmitter(),
      socket: new EventEmitter(),
      log: logHelper.stub(sandbox)
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should be safe to call with no payload', () => {
    deploy.latest(context);
    assert.ok(!context.log.info.called);
    assert.ok(!runStub.called);
  });

  it('should log if project name is not in config', () => {
    let assertPayload = {name: 'test', branch: 'master'};
    deploy.latest(context, assertPayload);
    assert.ok(context.log.info.called);
    assert.ok(!runStub.called);
    assert.strictEqual(
      context.log.info.firstCall.args[0],
      assertPayload
    );
  });

  it('should log if project branch is not in config', () => {
    let assertPayload = {name: 'test', branch: 'some-branch'};
    config.set('projects:test:master', 'not needed');
    deploy.latest(context, assertPayload);
    assert.ok(context.log.info.called);
    assert.ok(!runStub.called);
    assert.strictEqual(
      context.log.info.firstCall.args[0],
      assertPayload
    );
  });

  it('should call salt if project name is in config', () => {
    let assertServers = 'master*';
    let assertPayload = {name: 'test', branch: 'master'};
    config.set('projects:test:master', assertServers);
    deploy.latest(context, assertPayload);
    assert.ok(runStub.called);
    assert.strictEqual(runStub.firstCall.args[1], assertServers);
  });

  it('should call salt with correct command', () => {
    const assertCommand = new RegExp(`sls\\.apply.+deploy\\.test`);
    config.set('projects:test:master', 'test');
    deploy.latest(context, {name: 'test', branch: 'master'});

    let command = runStub.firstCall.args[2];
    assert.ok(command.match(assertCommand));
  });
});
