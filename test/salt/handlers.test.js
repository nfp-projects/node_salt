let sinon = require('sinon')

describe('Salt', () => {
  let sandbox

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('#run()', () => {
    it('should call exec')
  })
})
