import User, { hashPassword, comparePassword } from './user'
import {
  connectMongoose,
  disconnectMongoose,
  startServer,
  stopServer
} from '../config/mongoMemoryServerSetup'

describe('User model', () => {
  beforeAll(async () => {
    await startServer()
    await connectMongoose()
  })

  afterAll(async () => {
    await disconnectMongoose()
    await stopServer()
  })

  describe('validations', () => {
    describe('email', () => {
      it('should be invalid if email is empty', done => {
        const user = new User()
        user.validate(err => {
          expect(err.errors.email).toBeDefined()
          done()
        })
      })
    })

    describe('password', () => {
      it('should be invalid if password is empty', done => {
        const user = new User()
        user.validate(err => {
          expect(err.errors.password).toBeDefined()
          done()
        })
      })
    })

    describe('name', () => {
      it('should be invalid if name is empty', done => {
        const user = new User()
        user.validate(err => {
          expect(err.errors.name).toBeDefined()
          done()
        })
      })
    })

    describe('isAdmin', () => {
      it('should be automatically assigned to false', done => {
        const user = new User()
        user.validate(err => {
          expect(err.errors.isAdmin).not.toBeDefined()
          expect(user.isAdmin).toEqual(false)
          done()
        })
      })
    })

    describe('isApproved', () => {
      it('should be automatically assigned to false', done => {
        const user = new User()
        user.validate(err => {
          expect(err.errors.isApproved).not.toBeDefined()
          expect(user.isApproved).toEqual(false)
          done()
        })
      })
    })
  })

  describe('saving a user', () => {
    const email = 'email@somewhere.com'
    const password = 'password'
    const name = 'some-guy'

    beforeEach(done => {
      User.remove({}, () => done())
    })

    it('saves the user correctly', () => {
      const user = new User({
        email,
        password,
        name
      })

      return expect(user.save()).resolves.toBeTruthy()
    })

    it('fails to save a user with the same email', async () => {
      const user = new User({
        email,
        password,
        name
      })

      const user2 = new User({
        email,
        password,
        name
      })

      const result1 = await user.save()
      expect(result1).toBeTruthy()
      return expect(user2.save()).rejects.toBeTruthy()
    })

    it('generates a token correctly', async () => {
      const user = new User({
        email,
        password,
        name
      })

      const savedUser = await user.generateToken()
      expect(savedUser.token).toBeTruthy()
      expect(savedUser.tokenExpiryDate).toBeTruthy()
    })
  })

  describe('helper functions', () => {
    const plaintext = 'some-password'

    describe('hashPassword', () => {
      it('successfully hashes password', () => {
        return hashPassword(plaintext).then(hash => {
          expect(hash).toBeDefined()
          expect(hash).not.toEqual(plaintext)
        })
      })
    })

    describe('comparePassword', () => {
      it('resolves to true when password matches', () => {
        return hashPassword(plaintext)
          .then(hashedPassword => {
            return comparePassword(plaintext, hashedPassword)
          })
          .then(isMatch => {
            expect(isMatch).toEqual(true)
          })
      })
    })
  })
})
