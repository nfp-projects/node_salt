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

    it('should return original comment otherwise', () => {
      const assertMessage = 'Bla bla bla'
      let message = parser.parseEntry(null, { comment: assertMessage, changes: { before: {}, after: {} } })

      assert.strictEqual(message, assertMessage)
    })
  })
})
