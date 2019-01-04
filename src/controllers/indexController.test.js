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

  describe('login', () => {
    const token = 'a-token'
    const email = 'test@test.com'
    const password = 'a-password'
    const name = 'a-name'
    const data = {
      email,
      password
    }
    
    it('should respond with 200 and a token when email and password are correct and user is approved', () => {
      const user = new User({ ...data, name, token, isApproved: true })
      User.findOne = jest.fn(() => new Promise(resolve => resolve(user)))
      User.prototype.comparePassword = jest.fn(() => new Promise(resolve => resolve(true)))
      User.prototype.generateToken = jest.fn(() => new Promise(resolve => resolve(user)))
      return request(app)
        .post('/login')
        .send(data)
        .expect(200)
        .then(response => {
          const { body: { token: returnedToken } } = response
          expect(returnedToken).toEqual(token)
          expect(User.findOne).toHaveBeenCalledWith({ email })
          expect(User.prototype.comparePassword).toHaveBeenCalledWith(password)
          expect(User.prototype.generateToken).toHaveBeenCalled()
        })
    })

    it('should respond with 401 when user is not approved', () => {
      const user = new User({ ...data, name, token, isApproved: false })
      User.findOne = jest.fn(() => new Promise(resolve => resolve(user)))
      User.prototype.comparePassword = jest.fn(() => new Promise(resolve => resolve(true)))
      User.prototype.generateToken = jest.fn(() => new Promise(resolve => resolve(user)))
      return request(app)
        .post('/login')
        .send(data)
        .expect(401)
        .then(() => {
          expect(User.findOne).toHaveBeenCalledWith({ email })
          expect(User.prototype.comparePassword).not.toHaveBeenCalledWith(password)
          expect(User.prototype.generateToken).not.toHaveBeenCalled()
        })
    })

    it('should respond with 401 when password is not correct and user is approved', () => {
      const user = new User({ ...data, name, token, isApproved: true })
      User.findOne = jest.fn(() => new Promise(resolve => resolve(user)))
      User.prototype.comparePassword = jest.fn(() => new Promise(resolve => resolve(false)))
      User.prototype.generateToken = jest.fn(() => new Promise(resolve => resolve(user)))
      return request(app)
        .post('/login')
        .send(data)
        .expect(401)
        .then(() => {
          expect(User.findOne).toHaveBeenCalledWith({ email })
          expect(User.prototype.comparePassword).toHaveBeenCalledWith(password)
          expect(User.prototype.generateToken).not.toHaveBeenCalled()
        })
    })

    it('should respond with 401 when email does not exist', () => {
      const user = new User({ ...data, name, token })
      User.findOne = jest.fn(() => new Promise(resolve => resolve(null)))
      return request(app)
        .post('/login')
        .send(data)
        .expect(401)
        .then(() => {
          expect(User.findOne).toHaveBeenCalledWith({ email })
        })
    })
  })
})
