import request from 'supertest'
import app from '../app'
import User from '../models/user'

jest.mock('../routes/middleware/authenticate', () => (req, res, next) => next())

describe('usersController', () => {
  const email = 'email@somewhere.com'
  const password = 'password'
  const name = 'some-guy'
  const user = {
    email,
    password,
    name
  }
  const users = [user]
  describe('get /user', () => {
    beforeEach(() => {
      User.list = jest.fn(() => new Promise(resolve => resolve(users)))
    })

    it('should list all users', () => {
      return request(app)
        .get('/user')
        .expect(200)
        .then(({ body }) => {
          expect(User.list).toHaveBeenCalled()
          expect(body).toEqual(users)
        })
    })
  })
})
