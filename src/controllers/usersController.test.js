import request from 'supertest'
import app from '../app'
import User from '../models/user'

jest.mock('../routes/middleware/authenticate', () => (req, res, next) => next())

describe('usersController', () => {
  const _id = 'some-id'
  const email = 'email@somewhere.com'
  const password = 'password'
  const name = 'some-guy'
  const user = {
    _id,
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

  describe('get /user/:userId', () => {
    beforeEach(() => {
      User.findActiveById = jest.fn(() => new Promise(resolve => resolve(user)))
    })

    it('should get a user', () => {
      return request(app)
        .get(`/user/${_id}`)
        .expect(200)
        .then(({ body }) => {
          expect(User.findActiveById).toHaveBeenCalledWith(_id)
          expect(body).toEqual(user)
        })
    })

    it('should return 404 when user is not found', () => {
      User.findActiveById = jest.fn(() => new Promise(resolve => resolve(null)))
      return request(app)
        .get(`/user/${_id}`)
        .expect(404)
    })
  })

  describe('post /user/:userId', () => {
    beforeEach(() => {
      User.findByIdAndUpdate = jest.fn(() => new Promise(resolve => resolve(user)))
    })

    it('should update a user', () => {
      return request(app)
        .put(`/user/${_id}`)
        .send(user)
        .expect(200)
        .then(({ body }) => {
          expect(User.findByIdAndUpdate).toHaveBeenCalledWith(_id, user, { new: true })
          expect(body).toEqual(user)
        })
    })

    it('should return 404 when user is not found', () => {
      User.findByIdAndUpdate = jest.fn(() => new Promise(resolve => resolve(null)))
      return request(app)
        .get(`/user/${_id}`)
        .expect(404)
    })
  })

  describe('delete /user/:userId', () => {
    beforeEach(() => {
      User.findById = jest.fn(() => new Promise(resolve => resolve(user)))
      user.archive = jest.fn(() => new Promise(resolve => resolve(user)))
    })

    it('should archive a user', () => {
      return request(app)
        .delete(`/user/${_id}`)
        .expect(200)
        .then(() => {
          expect(User.findById).toHaveBeenCalledWith(_id)
          expect(user.archive).toHaveBeenCalledWith()
        })
    })

    // it('should return 404 when user is not found', () => {
    //   User.findByIdAndUpdate = jest.fn(() => new Promise(resolve => resolve(null)))
    //   return request(app)
    //     .get(`/user/${_id}`)
    //     .expect(404)
    // })
  })
})
