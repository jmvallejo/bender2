import User, { hashPassword, comparePassword } from './user'

describe('User model', () => {
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
