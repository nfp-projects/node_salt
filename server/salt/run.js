const shell = require('../shell/run')
const parser = require('./parser')

exports.run = (ctx, servers, command) => {
  let saltCommand = `salt ${servers} ${command} --out json --static`

  ctx.log.info({ servers, command }, `Running: ${saltCommand}`)
  ctx.io.emit('salt_run', { servers, command })

  return shell.exec(saltCommand)
    .then((result) => {
      ctx.log.info(result)
      ctx.io.emit('salt_success', parser.parseData(result))
    })
    .catch((err) => {
      ctx.log.error(err)
      ctx.io.emit('salt_failed', { message: err.error.message })
    })
}
