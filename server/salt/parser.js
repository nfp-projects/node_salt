
exports.parseData = (data) => {
  let parsed
  let out = {}

  try {
    parsed = JSON.parse(data.out)
  } catch (error) {
    return out
  }

  for (let host of Object.keys(parsed)) {
    out[host] = {}

    for (let command of Object.keys(parsed[host])) {
      let name = command.match(/\|-([^_]+)_\|/)[1]
      out[host][name] = exports.parseEntry(name, parsed[host][command])
    }
  }

  return out
}

exports.parseEntry = (name, data) => {
  if (Object.keys(data.changes).length === 0) {
    return false
  }
  return data.comment
}
