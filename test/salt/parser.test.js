const assert = require('assert-extended')

describe('Salt (Parser)', () => {
  const parser = require('../../server/salt/parser')

  describe('#parseData()', () => {
    it('should always return base keys for each host', () => {
      const assertHost = 'blabla'
      let out = parser.parseData(`{"${assertHost}": {}}`)
      assert.ok(out[assertHost])
      assert.strictEqual(out[assertHost].service, false)
      assert.strictEqual(out[assertHost].npm, false)
      assert.strictEqual(out[assertHost].startup, false)
      assert.strictEqual(out[assertHost].project, false)
      assert.strictEqual(out[assertHost].config, false)
    })

    it('should handle errors in sls', () => {
      let out = parser.parseData(`
{
    "master01.nfp.local": [
        "Pillar failed to render with the following messages:",
        "Specified SLS 'postgres' in environment 'base' is not available on the salt master"
    ]
}`)
      assert.ok(out['master01.nfp.local'].error)
      assert.match(out['master01.nfp.local'].error, /Pillar failed to/)
    })
  })

  describe('#parseEntry()', () => {
    it('should return false if no changes', () => {
      const testMessage = 'Bla bla bla'
      let message = parser.parseEntry(null, { comment: testMessage, changes: {} })

      assert.strictEqual(message, false)
    })

    it('should return old and new for project', () => {
      const assertMessage = 'Bla bla bla'
      const assertNew = 'aaaaaa'
      const assertOld = 'bbbbbb'
      let message = parser.parseEntry('project', {
        comment: assertMessage,
        changes: {
          revision: {
            new: assertNew,
            old: assertOld,
          },
        },
      })

      assert.notStrictEqual(message, assertMessage)
      assert.strictEqual(message.old, assertOld)
      assert.strictEqual(message.new, assertNew)
    })

    it('should return true for changes in service with result true', () => {
      const assertMessage = 'Bla bla bla'
      let message = parser.parseEntry('service', {
        result: true,
        comment: assertMessage,
        changes: {
          bla: 1,
        },
      })

      assert.notStrictEqual(message, assertMessage)
      assert.strictEqual(message, true)
    })

    it('should return true for changes in config file', () => {
      const assertMessage = 'Bla bla bla'
      let message = parser.parseEntry('config', {
        result: true,
        comment: assertMessage,
        changes: {
          bla: 1,
        },
      })

      assert.notStrictEqual(message, assertMessage)
      assert.strictEqual(message, true)
    })

    it('should return stderr and stdout for changes in service with result false', () => {
      const assertMessage = 'Bla bla bla'
      const assertOut = 'something'
      const assertErr = 'Hello'

      let message = parser.parseEntry('service', {
        result: false,
        comment: assertMessage,
        changes: {
          stderr: assertErr,
          stdout: assertOut,
        },
      })

      assert.notStrictEqual(message, assertMessage)
      assert.strictEqual(message.error, true)
      assert.strictEqual(message.stderr, assertErr)
      assert.strictEqual(message.stdout, assertOut)
    })

    it('should return original comment otherwise', () => {
      const assertMessage = 'Bla bla bla'
      let message = parser.parseEntry(null, { comment: assertMessage, changes: { before: {}, after: {} } })

      assert.strictEqual(message, assertMessage)
    })
  })
})
