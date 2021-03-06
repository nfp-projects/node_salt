const assert = require('assert-extended')
const sinon = require('sinon')

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
      const assertError = new Error('message')

      execStub.yields(
        assertError,
        assertStdOut,
        assertStdErr
      )

      return assert.isRejected(shell.exec(''))
        .then((err) => {
          assert.strictEqual(err.error, assertError)
          assert.strictEqual(err.out, assertStdOut)
          assert.strictEqual(err.err, assertStdErr)
        })
    })

    it('child exec success should return all data', () => {
      const assertStdOut = 'this is out'
      const assertStdErr = 'this is err'

      execStub.yields(
        null,
        assertStdOut,
        assertStdErr
      )

      return assert.isFulfilled(shell.exec(''))
        .then((data) => {
          assert.strictEqual(data.out, assertStdOut)
          assert.strictEqual(data.err, assertStdErr)
        })
    })
  })
})
