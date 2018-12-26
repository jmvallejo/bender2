const { startServer } = require('./mongoMemoryServerSetup')

module.exports = async () => {
  await startServer()
}
