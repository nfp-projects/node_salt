const EventEmitter = require('events')
const assert = require('assert-extended')
const sinon = require('sinon')

describe('Deploy (Handlers)', () => {
  const handlers = require('../../server/deploy/handlers')
  const salt = require('../../server/salt/run')
  const config = require('../../config')
  const logHelper = require('../helper.logger')
  let runStub
  let sandbox
  let context

  beforeEach(() => {
    config.set('projects:test:master', null)
    sandbox = sinon.sandbox.create()
    runStub = sandbox.stub(salt, 'run')
    context = {
      io: new EventEmitter(),
      socket: new EventEmitter(),
      log: logHelper.stub(sandbox),
    }
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('#latest()', () => {
    it('should be safe to call with no payload', () => {
      handlers.latest(context)
      assert.ok(!context.log.info.called)
      assert.ok(!runStub.called)
    })

    it('should log if project name is not in config', () => {
      let assertPayload = { name: 'test', branch: 'master' }
      handlers.latest(context, assertPayload)
      assert.ok(context.log.info.called)
      assert.ok(context.log.socket.info.called)

      assert.ok(!runStub.called)
      assert.strictEqual(
        context.log.info.firstCall.args[0],
        assertPayload
      )
      assert.match(context.log.socket.info.firstCall.args[0], new RegExp(assertPayload.name))
      assert.match(context.log.socket.info.firstCall.args[0], /ignor/)
    })

    it('should log if project branch is not in config', () => {
      let assertPayload = { name: 'test', branch: 'some-branch' }
      config.set('projects:test:master', 'not needed')
      handlers.latest(context, assertPayload)
      assert.ok(context.log.info.called)
      assert.ok(!runStub.called)
      assert.strictEqual(
        context.log.info.firstCall.args[0],
        assertPayload
      )
    })

    it('should call salt if project name is in config', () => {
      let assertServers = 'master*'
      let assertPayload = { name: 'test', branch: 'master' }
      config.set('projects:test:master', assertServers)
      handlers.latest(context, assertPayload)
      assert.ok(runStub.called)
      assert.strictEqual(runStub.firstCall.args[1], assertServers)
      assert.strictEqual(runStub.firstCall.args[0], context)
    })

    it('should call salt with correct command', () => {
      const assertCommand = new RegExp('state\\.apply.+deploy\\.test')
      config.set('projects:test:master', 'test')
      handlers.latest(context, { name: 'test', branch: 'master' })

      let command = runStub.firstCall.args[2]
      assert.ok(command.match(assertCommand))
    })
  })

  describe('#list()', () => {
    let beforeConfig

    before(() => {
      beforeConfig = config.get('projects')
    })

    after(() => {
      config.set('projects', beforeConfig)
    })

    it('should return everything in projects', () => {
      let assertData = {
        host1: { master: 'test' },
        host2: { master: 'test' },
      }
      config.set('projects', assertData)

      return new Promise((resolve) => {
        context.socket.once('deploy_list', resolve)

        handlers.list(context)
      })
      .then(payload => {
        assert.deepEqual(payload, assertData)
      })
    })
  })
})
