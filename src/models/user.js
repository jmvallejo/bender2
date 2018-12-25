import { Schema, model } from 'mongoose'
import bcrypt from 'bcryptjs'

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
    isApproved: { type: Boolean, required: true, default: false }
  },
  {
    timestamps: true
  }
)

userSchema.pre('save', function (next) {
  // only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next()

  hashPassword(this.password)
    .then(hashedPassword => {
      this.password = hashedPassword
      next()
    })
    .catch(err => next(err))
})

userSchema.methods.comparePassword = function (candidatePassword) {
  return comparePassword(candidatePassword, this.password)
}

export default model('User', userSchema)
