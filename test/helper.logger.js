const log = require('../log')

exports.stub = (sandbox, shallow) => {
  let child = sandbox.stub(log, 'child')

  if (shallow) {
    return child
  }

  let out = {
    fatal: sandbox.stub(),
    error: sandbox.stub(),
    warn: sandbox.stub(),
    info: sandbox.stub(),
    debug: sandbox.stub(),
  }

  out.socket = {
    fatal: sandbox.stub(),
    error: sandbox.stub(),
    warn: sandbox.stub(),
    info: sandbox.stub(),
    debug: sandbox.stub(),
  }

  child.returns(out)
  return out
}
