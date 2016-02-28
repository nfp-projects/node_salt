const assert = require('assert-extended')
const sinon = require('sinon')
const server = require('../helper.server')

describe('Manager (Server)', () => {
  const helper = require('../helper.handler')
  let client
  let secondClient
  let sandbox

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
  })

  afterEach(() => {
    sandbox.restore()
    return Promise.all([
      client && client.closeAsync(),
      secondClient && secondClient.closeAsync(),
    ])
  })

  describe('(on new connection)', () => {
    it('should notify everyone of new connection', (done) => {
      client = server.createClient()

      client.connectAsync()
      .then(() => server.delay(20))
      .then(() => {
        secondClient = server.createClient()
        secondClient.on('new_connection', () => done(new Error('should not be called for itself')))
        secondClient.on('connect', () => done())
        return secondClient.connectAsync()
      })
    })
  })

  describe('all_connections', () => {
    it('should send all currently connected sockets', () => {
      client = server.createClient()

      return client.connectAsync()
      .then(() => helper.sendEventAsync(client, 'manager.all_connections', 'all_connections'))
      .then((all) => {
        assert.strictEqual(all.length, 1)
      })
    })
  })
})
