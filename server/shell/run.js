const child = require('child_process')

exports.exec = (command, options) =>
  new Promise((resolve, reject) =>
    child.exec(command, options, (error, out, err) => {
      if (error) {
        return reject({ out, err })
      }
      resolve({ out, err })
    })
  )
