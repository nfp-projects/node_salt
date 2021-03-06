const assert = require('assert-extended')
const sinon = require('sinon')
const server = require('../helper.server')

describe('Deploy (Server)', () => {
  const handlers = require('../../server/deploy/handlers')
  let client
  let sandbox

  beforeEach(() => {
    client = server.createClient()
    sandbox = sinon.sandbox.create()
  })

  afterEach(() => {
    sandbox.restore()
    return client.closeAsync()
  })

  let map = {
    'deploy.latest': 'latest',
    'deploy.items': 'list',
  }

  Object.keys(map).forEach(key => {
    it(`emit ${key} should call deploy.${map[key]}`, () => {
      let stub = sandbox.stub(handlers, map[key])
      let assertPayload = { a: 1 }

      return client.connectAsync()
      .then(() => client.emit(key, assertPayload))
      .then(() => server.delay(20))
      .then(() => {
        assert.ok(stub.called)
        assert.deepEqual(stub.firstCall.args[1], assertPayload)
        let context = stub.firstCall.args[0]
        assert.ok(context.io)
        assert.ok(context.socket)
        assert.ok(context.log)
      })
    })
  })
})
