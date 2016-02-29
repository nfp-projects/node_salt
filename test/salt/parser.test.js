const assert = require('assert-extended')

describe('Salt (Parser)', () => {
  const parser = require('../../server/salt/parser')

  describe('#parseEntry()', () => {
    it('should return false if no changes', () => {
      const testMessage = 'Bla bla bla'
      let message = parser.parseEntry(null, { comment: testMessage, changes: {} })

      assert.strictEqual(message, false)
    })

    it('should return original comment otherwise', () => {
      const assertMessage = 'Bla bla bla'
      let message = parser.parseEntry(null, { comment: assertMessage, changes: { before: {}, after: {} } })

      assert.strictEqual(message, assertMessage)
    })
  })
})
