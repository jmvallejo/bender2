const { MongoMemoryServer } = require('mongodb-memory-server')
const mongoose = require('mongoose')

const mongod = new MongoMemoryServer({
  autoStart: false
})

module.exports.startAndConnectToServer = async () => {
  if (!mongod.isRunning) {
    await mongod.start()
  }
  const mongoUri = await mongod.getConnectionString()
  await mongoose.connect(
    mongoUri,
    { useNewUrlParser: true }
    )
}

module.exports.stopServer = async () => {
  await mongoose.disconnect()
  await mongod.stop()
}
