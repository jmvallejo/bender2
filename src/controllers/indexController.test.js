import mockingoose from 'mockingoose'
import request from 'supertest'
import app from '../app'

describe('indexController', () => {
  describe('signup', () => {
    const email = 'test@test.com'
    const password = 'a-password'
    const name = 'a-name'
    const data = {
      email,
      password,
      name
    }

    beforeEach(() => {
      mockingoose.resetAll()
    })

    describe('saving user succeeds', () => {
      it('should respond with 200', () => {
        mockingoose.User.toReturn({ ...data }, 'save')
        return request(app)
          .post('/signup')
          .send(data)
          .expect(201)
      })
    })

    describe('saving user fails', () => {
      const err = new Error('an-error')
      it('should respond with 400', () => {
        mockingoose.User.toReturn(new Error(err), 'save')
        return request(app)
          .post('/signup')
          .send(data)
          .expect(400)
          .then(response => {
            const { text } = response
            expect(text).toEqual(err.toString())
          })
      })
    })
  })
})
