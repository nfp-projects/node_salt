const shell = require('../shell/run')

exports.run = (ctx, servers, command) => {
  let saltCommand = `salt ${servers} ${command}`

  ctx.log.info({ servers, command }, `Running: ${saltCommand}`)
  ctx.io.emit('salt_run', { servers, command })

  return shell.exec(saltCommand)
    .then((result) => {
      ctx.log.info(result)
      ctx.io.emit('salt_success')
    })
    .catch((err) => {
      ctx.log.error(err)
      ctx.io.emit('salt_failed')
    })
}
