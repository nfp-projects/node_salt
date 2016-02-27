let config = require('../../config')
let salt = require('../salt/run')

exports.latest = (ctx, data) => {
  if (!data) return

  let servers = config.get(`projects:${data.name}:${data.branch}`)

  if (!servers) {
    ctx.log.info(
      data,
      'Project is not being watched, ignoring'
    )
    return
  }

  salt.run(ctx, servers, `sls.apply deploy.${data.name}`)
}
