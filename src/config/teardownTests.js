const { stopServer } = require('./mongoMemoryServerSetup')

module.exports = async () => {
  await stopServer()
}
