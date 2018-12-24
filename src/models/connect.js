import database from '../config/database.json'
import mongoose from 'mongoose'

const DEFAULT_ENV = 'development'
const NODE_ENV = process.env.NODE_ENV || DEFAULT_ENV

const connect = async () => {
  const { host, port, dbName } = database[NODE_ENV]
  const uri = `${host}:${port}/${dbName}`
  await mongoose.connect(
    uri,
    { useNewUrlParser: true }
  )
}

export default connect
