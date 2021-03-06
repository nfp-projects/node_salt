const _ = require('lodash')

exports.parseData = (data) => {
  let parsed
  let out = {}

  try {
    parsed = JSON.parse(data)
  } catch (error) {
    console.log(JSON.stringify(error.toString()))
    return out
  }

  for (let host of Object.keys(parsed)) {
    out[host] = {
      service: false,
      npm: false,
      startup: false,
      project: false,
      config: false,
    }

    if (_.isArray(parsed[host])) {
      out[host].error = parsed[host].join(' ')
    } else if (_.isString(parsed[host])) {
      out[host].error = parsed[host]
    } else {
      for (let command of Object.keys(parsed[host])) {
        let name = command.match(/\|-([^_]+)_\|/)[1]
        out[host][name] = exports.parseEntry(name, parsed[host][command])
      }
    }
  }

  return out
}

exports.parseEntry = (name, data) => {
  if (Object.keys(data.changes).length === 0) {
    return false
  }
  if (name === 'config') {
    return true
  }
  if (name === 'project') {
    return data.changes.revision
  }
  if (name === 'service') {
    if (data.result) {
      return true
    }
    return {
      error: true,
      stderr: data.changes.stderr,
      stdout: data.changes.stdout,
    }
  }
  return data.comment
}
