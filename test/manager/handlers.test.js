const _ = require('lodash')
const EventEmitter = require('events')
const assert = require('assert-extended')
const sinon = require('sinon')

describe('Manager (Handlers)', () => {
  const handlers = require('../../server/manager/handlers')
  const logHelper = require('../helper.logger')
  const helper = require('../helper.handler')
  let sandbox
  let context

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
    context = {
      io: new EventEmitter(),
      socket: new EventEmitter(),
      log: logHelper.stub(sandbox),
    }
    context.socket.broadcast = new EventEmitter()
    context.socket.request = {
      connection: {
        remoteAddress: '10.0.0.1',
      },
    }
  })

  afterEach(() => {
    sandbox.restore()
    handlers.connections.splice(0, handlers.connections.length)
  })

  describe('#newConnection()', () => {
    it('should exist', () => {
      assert.ok(handlers.newConnection)
    })

    it('should log about new connection', () => {
      handlers.newConnection(context)
      assert.ok(context.log.info.called)
      let args = context.log.info.firstCall.args

      assert.ok(args[0])
      assert.match(args[0], /connection/)
    })

    it('should add each connection to the connections array', () => {
      const assertFirstIp = '10.10.10.10'
      const assertSecondIp = '99.99.99.99'
      const assertSecondSocket = new EventEmitter()
      let oldSocket = context.socket

      context.socket.request.connection.remoteAddress = assertFirstIp
      handlers.newConnection(context)
      assert.strictEqual(handlers.connections.length, 1)
      assert.strictEqual(handlers.connections[0].ip, assertFirstIp)
      assert.strictEqual(handlers.connections[0].socket, context.socket)

      context.socket = assertSecondSocket
      context.socket.broadcast = new EventEmitter()
      context.socket.request = {
        connection: {
          remoteAddress: assertSecondIp,
        },
      }
      handlers.newConnection(context)
      assert.strictEqual(handlers.connections.length, 2)
      assert.strictEqual(handlers.connections[1].ip, assertSecondIp)
      assert.notStrictEqual(handlers.connections[1].socket, oldSocket)
      assert.strictEqual(handlers.connections[1].socket, assertSecondSocket)
    })

    it('should notify client about all other clients', (done) => {
      const assertFirstIp = '10.10.10.10'
      const assertSecondIp = '99.99.99.99'

      context.socket.request.connection.remoteAddress = assertFirstIp
      handlers.newConnection(context)

      context.socket.request.connection.remoteAddress = assertSecondIp
      context.socket.once(
        'all_connections',
        helper.wrapDone(done, (all) => {
          assert.ok(all)
          assert.strictEqual(all.length, 1)
          assert.strictEqual(all[0].ip, assertFirstIp)
        })
      )

      handlers.newConnection(context)
    })

    it('should send notify event about new connection', (done) => {
      context.socket.broadcast.once(
        'new_connection',
        helper.wrapDone(done, (data) => {
          assert.ok(data)
          assert.strictEqual(data.ip, context.socket.request.connection.remoteAddress)
        })
      )

      handlers.newConnection(context)
    })
  })

  describe('#lostConnection()', () => {
    it('should exist', () => {
      assert.ok(handlers.lostConnection)
    })

    it('should log about lost connection', () => {
      handlers.lostConnection(context)

      assert.ok(context.log.info.called)
      assert.match(context.log.info.firstCall.args[0], /closed/)
    })

    it('should remove connection from connections list', () => {
      handlers.connections.push({ ip: '1.2.3.4', socket: context.socket })

      assert.strictEqual(handlers.connections.length, 1)
      handlers.lostConnection(context)
      assert.strictEqual(handlers.connections.length, 0)
    })

    it('should emit lost_connection event', (done) => {
      const assertIp = '1.2.3.4'
      handlers.connections.push({ ip: assertIp, socket: context.socket })

      context.io.once(
        'lost_connection',
        helper.wrapDone(done, (client) => {
          assert.ok(client)
          assert.strictEqual(client.ip, assertIp)
        })
      )

      handlers.lostConnection(context)
    })

    it('should not emit if not found', (done) => {
      context.io.once(
        'lost_connection',
        () => done(new Error('should not be called')))

      handlers.lostConnection(context)
      done()
    })
  })

  describe('#allConnections()', () => {
    it('should emit all connections', (done) => {
      const assertFirstIp = '11.22.33.44'
      const assertSecondIp = '55.66.77.88'

      handlers.connections.push({
        ip: assertFirstIp,
        socket: {},
      })
      handlers.connections.push({
        ip: assertSecondIp,
        socket: {},
      })

      context.socket.once(
        'all_connections',
        helper.wrapDone(done, (all) => {
          assert.ok(all)
          assert.strictEqual(all.length, 2)
          assert.strictEqual(all[0].ip, assertFirstIp)
          assert.strictEqual(all[1].ip, assertSecondIp)
          for (let i = 0; i < all.length; i++) {
            assert.notOk(all[i].socket)
          }
        })
      )

      handlers.allConnections(context)
    })
  })

  describe('#connections', () => {
    it('should be an array', () => {
      assert.ok(_.isArray(handlers.connections))
    })
  })
})
