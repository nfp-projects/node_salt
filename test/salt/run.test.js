const EventEmitter = require('events')
const assert = require('assert-extended')
const sinon = require('sinon')
require('sinon-as-promised')

describe('Salt (Run)', () => {
  const logHelper = require('../helper.logger')
  const salt = require('../../server/salt/run')
  const shell = require('../../server/shell/run')
  const constant = require('./const')
  const parser = require('../../server/salt/parser')
  let sandbox
  let context
  let stubExec
  let stubParser
  let testServers
  let testCommand

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
    stubExec = sandbox.stub(shell, 'exec')
    stubParser = sandbox.stub(parser, 'parseData')
    testServers = 'db01,db02'
    testCommand = 'test.ping'
    context = {
      io: new EventEmitter(),
      socket: new EventEmitter(),
      log: logHelper.stub(sandbox),
    }
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('#run()', () => {
    it('should send salt_run to all on start', () => {
      const assertCommand = 'sls.something bla'
      const assertHosts = 'www1,www1'
      stubExec.resolves({})

      return new Promise((resolve) => {
        context.io.once('salt_run', resolve)

        salt.run(context, assertHosts, assertCommand)
      })
      .then((message) => {
        assert.ok(message)
        assert.strictEqual(message.command, assertCommand)
        assert.strictEqual(message.servers, assertHosts)
      })
    })

    it('should call shell.exec correctly and log it', () => {
      const assertCommand = new RegExp(`salt ${testServers} ${testCommand} --out json --static`)
      stubExec.resolves({})

      return salt.run(context, testServers, testCommand)
      .then(() => {
        assert.ok(stubExec.called)
        assert.ok(context.log.info.called)
        assert.match(context.log.info.firstCall.args[1], assertCommand)
        assert.match(stubExec.firstCall.args[0], assertCommand)
        assert.deepEqual(context.log.info.firstCall.args[0], {
          servers: testServers,
          command: testCommand,
        })
      })
    })

    it('should send salt_success if success and log result', () => {
      const assertResult = { a: 1 }
      stubExec.resolves(assertResult)

      return new Promise((resolve) => {
        context.io.once('salt_success', resolve)

        salt.run(context, testServers, testCommand)
      })
      .then(() => {
        assert.strictEqual(context.log.info.callCount, 2)
        assert.strictEqual(context.log.info.secondCall.args[0], assertResult)
      })
    })

    it('should send salt_failed if failed and log result', () => {
      const assertErrorMessage = 'hello test'
      const assertResult = { error: new Error(assertErrorMessage) }
      stubExec.rejects(assertResult)

      return new Promise((resolve) => {
        context.io.once('salt_failed', resolve)

        salt.run(context, testServers, testCommand)
      })
      .then((payload) => {
        assert.strictEqual(payload.message, assertErrorMessage)
        assert.ok(context.log.error.called)
        assert.strictEqual(context.log.error.firstCall.args[0], assertResult)
      })
    })

    it('should call parser and send it in salt_success', () => {
      const assertOut = 'bla bla'
      const assertOutput = { a: 1 }
      stubExec.resolves({ out: assertOut })
      stubParser.returns(assertOutput)

      return new Promise((resolve) => {
        context.io.once('salt_success', resolve)

        salt.run(context, testServers, testCommand)
      })
      .then((data) => {
        assert.ok(data)
        assert.ok(stubParser.called)
        assert.strictEqual(data, assertOutput)
        assert.strictEqual(stubParser.firstCall.args[0], assertOut)
      })
    })
  })
})
