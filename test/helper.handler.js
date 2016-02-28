
exports.wrapDone = (done, tests) =>
  (data) => {
    try {
      tests(data)
      done()
    } catch (error) {
      done(error)
    }
  }

exports.sendEventAsync = (client, sendName, listenName, data) =>
  new Promise((resolve, reject) => {
    client.once(listenName, (payload) => resolve(payload))
    client.emit(sendName, data)
  })
