const { startAndConnectToServer } = require('./mongoMemoryServerSetup')

module.exports = async () => {
  await startAndConnectToServer()
}
