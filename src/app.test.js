import request from 'supertest'
import app from './app'

describe('App root path', () => {
  it('should respond to GET method', () => {
    return request(app)
      .get('/')
      .then(response => {
        expect(response.statusCode).toBe(200)
      })
  })
})
