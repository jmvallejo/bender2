import { Schema, model } from 'mongoose'

const userSchema = new Schema({
  username: { type: String, required: true, index: { unique: true } },
  name: { type: String, required: true },
  password: { type: String, required: true }
})

export default model('User', userSchema)
