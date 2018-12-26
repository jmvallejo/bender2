const { MongoMemoryServer } = require('mongodb-memory-server')
const mongoose = require('mongoose')

const mongod = new MongoMemoryServer({
  autoStart: false
})

let mongoUri = null

module.exports.startServer = async () => {
  if (!mongod.isRunning) {
    await mongod.start()
  }
  mongoUri = await mongod.getConnectionString()
}

module.exports.stopServer = async () => {
  await mongod.stop()
}

module.exports.connectMongoose = async () => {
  mongoose.Promise = Promise
  await mongoose.connect(
    mongoUri,
    { useNewUrlParser: true }
  )
}

module.exports.disconnectMongoose = async () => {
  await mongoose.disconnect()
}