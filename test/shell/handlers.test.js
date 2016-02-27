const assert = require('assert')
const sinon = require('sinon')
require('assert-extended')

describe('Shell', () => {
  const child = require('child_process')
  const shell = require('../../server/shell/run')
  let sandbox
  let execStub

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
    execStub = sandbox.stub(child, 'exec')
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('#exec()', () => {
    it('should return a promise', () => {
      let promised = shell.exec('')
      assert.ok(promised.then)
      assert.ok(promised.catch)
    })

    it('should call child.exec', () => {
      execStub.yields()
      return shell.exec('')
        .then(() => assert.ok(execStub.called))
    })

    it('child exec erroring should reject with ctx', () => {
      const assertStdOut = 'this is out'
      const assertStdErr = 'this is err'

      execStub.yields(
        new Error('message'),
        assertStdOut,
        assertStdErr
      )

      return assert.isRejected(shell.exec(''))
        .then((err) => {
          assert.strictEqual()
        })
    })
  })
})
