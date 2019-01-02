import request from 'supertest'
import app from '../app'
import User from '../models/user'

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

    describe('saving user succeeds', () => {
      it('should respond with 200', () => {
        User.prototype.save = jest.fn(() => new Promise(resolve => resolve({ ...data })))
        return request(app)
          .post('/signup')
          .send(data)
          .expect(201)
      })
    })

    describe('saving user fails', () => {
      const err = new Error('an-error')
      it('should respond with 400', () => {
        User.prototype.save = jest.fn(() => new Promise((resolve, reject) => reject(err)))
        return request(app)
          .post('/signup')
          .send(data)
          .expect(400)
          .then(response => {
            const { text } = response
            expect(text).toEqual(err.message)
          })
      })
    })
  })
})
