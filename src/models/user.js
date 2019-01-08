import { Schema, model, Types } from 'mongoose'
import bcrypt from 'bcryptjs'
import uuidv4 from 'uuid/v4'
import moment from 'moment'

const SALT_WORK_FACTOR = 10

/**
 * Function that uses bcrypt to hash password
 *
 * @param {String} plaintext
 * @returns {Promise}
 */
export const hashPassword = plaintext => {
  return new Promise((resolve, reject) => {
    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
      if (err) {
        reject(err)
        return
      }

      // hash the password using our new salt
      bcrypt.hash(plaintext, salt, (err, hash) => {
        if (err) {
          reject(err)
          return
        }

        resolve(hash)
      })
    })
  })
}

/**
 * Function that uses bcrypt to compare against a hased password
 *
 * @param {String} candidatePassword
 * @param {String} hashedPassword
 * @returns {Promise}
 */
export const comparePassword = (candidatePassword, hashedPassword) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, hashedPassword, (err, isMatch) => {
      if (err) {
        reject(err)
        return
      }
      resolve(isMatch)
    })
  })
}

const userSchema = new Schema(
  {
    email: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    name: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    isApproved: { type: Boolean, required: true, default: false },
    token: String,
    tokenExpiryDate: Date,
    archived: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
)

userSchema.pre('save', function(next) {
  // only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next()

  hashPassword(this.password)
    .then(hashedPassword => {
      this.password = hashedPassword
      next()
    })
    .catch(err => next(err))
})

userSchema.methods.comparePassword = function(candidatePassword) {
  return comparePassword(candidatePassword, this.password)
}

userSchema.statics.findByToken = async function(token) {
  const user = await this.findOne({ token, archived: false })
  if (!user) {
    return null
  }
  // Compare date to check if token is still valid
  const { tokenExpiryDate } = user
  if (moment(tokenExpiryDate) < moment()) {
    return null
  }
  return user
}

userSchema.statics.findActiveById = async function(_id) {
  if (!Types.ObjectId.isValid(_id)) {
    return null
  }
  const user = await this.findOne({ _id, archived: false })
  if (!user) {
    return null
  }
  return user
}

userSchema.statics.list = function() {
  return this.find({ archived: false })
}

userSchema.methods.generateToken = function() {
  if (!this.token) {
    this.token = uuidv4()
  }
  this.tokenExpiryDate = moment()
    .add(30, 'days')
    .toDate()
  return this.save()
}

userSchema.methods.archive = function() {
  this.archived = true
  return this.save()
}

export default model('User', userSchema)
