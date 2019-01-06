import moment from 'moment'
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

  describe('methods', () => {
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

    it('archives correctly', async () => {
      const user = new User({
        email,
        password,
        name
      })

      const archivedUser = await user.archive()
      expect(archivedUser.archived).toBeTruthy()
    })
  })

  describe('statics', () => {
    const email = 'email@somewhere.com'
    const password = 'password'
    const name = 'some-guy'
    const token = 'some-token'
    const oldDate = moment().subtract(1, 'days').toDate()

    beforeEach(done => {
      User.remove({}, () => done())
    })

    describe('findByToken', () => {
      it('returns a user with a matching token and valid expiry date', async () => {
        const user = await User.create({
          email,
          password,
          name
        })
        await user.generateToken()
        expect(user.token).toBeTruthy()
        const foundUser = await User.findByToken(user.token)
        expect(foundUser).toBeTruthy()
      })

      it('returns null with a matching token and past expiry date', async () => {
        const user = await User.create({
          email,
          password,
          name,
          token,
          tokenExpiryDate: oldDate
        })
        expect(user.token).toBeTruthy()
        expect(user.tokenExpiryDate).toBeTruthy()
        const foundUser = await User.findByToken(user.token)
        expect(foundUser).toBeNull()
      })

      it('returns null when user is archived', async () => {
        const user = await User.create({
          email,
          password,
          name
        })
        await user.generateToken()
        expect(user.token).toBeTruthy()
        await user.archive()
        expect(user.archived).toBeTruthy()
        const foundUser = await User.findByToken(user.token)
        expect(foundUser).toBeNull()
      })

      it('returns null when token does not exist', async () => {
        const user = await User.create({
          email,
          password,
          name
        })
        expect(user.token).toBeFalsy()
        expect(user.tokenExpiryDate).toBeFalsy()
        const foundUser = await User.findByToken(token)
        expect(foundUser).toBeNull()
      })
    })

    describe('findActiveById', () => {
      it('returns a user with a matching id', async () => {
        const user = await User.create({
          email,
          password,
          name
        })
        const foundUser = await User.findActiveById(user._id)
        expect(foundUser).toBeTruthy()
        expect(foundUser._id).toEqual(user._id)
      })

      it('returns null when user is archived', async () => {
        const user = await User.create({
          email,
          password,
          name
        })
        await user.archive()
        const foundUser = await User.findActiveById(user._id)
        expect(foundUser).toBeNull()
      })
    })

    describe('list', () => {
      it('lists all unarchived users', async () => {
        const user1 = await User.create({
          email: 1 + email,
          password,
          name
        })
        const user2 = await User.create({
          email: 2 + email,
          password,
          name
        })
        const user3 = await User.create({
          email: 3 + email,
          password,
          name
        })
        await user1.archive()
        expect(user1.archived).toBeTruthy()
        const expectedUsers = [user2.toObject(), user3.toObject()]
        const users = await User.list()
        expect(users).toMatchObject(expectedUsers)
      })
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
