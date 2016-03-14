const config = require('../../config')
const salt = require('../salt/run')

exports.latest = (ctx, data) => {
  if (!data) return

  let servers = config.get(`projects:${data.name}:${data.branch}`)

  if (!servers) {
    ctx.log.info(
      data,
      'Project is not being watched, ignoring'
    )
    ctx.log.socket.info(`Could not find project '${data.name}', ignoring request.`)

    return
  }

  salt.run(ctx, servers, `state.apply deploy.${data.name}`)
}

exports.list = (ctx) => {
  ctx.socket.emit('deploy_list', config.get('projects'))
}
