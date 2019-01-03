import authenticate from './authenticate'
import User from '../../models/user'

describe('Authenticate middleware', () => {
  const token = 'a-token'
  const user = {
    email: 'test@test.com',
    token
  }
  const req = { get: jest.fn(() => (token)) }
  const res = { locals: {}, sendStatus: jest.fn() }
  const next = jest.fn()

  beforeEach(() => {
    req.get.mockClear()
    res.sendStatus.mockClear()
    res.locals = {}
    next.mockClear()
    User.findByToken = jest.fn(() => (new Promise(resolve => resolve(user))))
    User.findByToken.mockClear()
  })

  it('Sets user local and calls next when getting user succeeds', async () => {
    await authenticate(req, res, next)
    expect(req.get).toHaveBeenCalledWith('apiToken')
    expect(User.findByToken).toHaveBeenCalledWith(token)
    expect(res.locals.user).toEqual(user)
    expect(next).toHaveBeenCalled()
  })

  it('Sends 401 when User.findByToken fails', async () => {
    User.findByToken = jest.fn(() => (new Promise((resolve, reject) => reject('error'))))
    await authenticate(req, res, next)
    expect(req.get).toHaveBeenCalledWith('apiToken')
    expect(User.findByToken).toHaveBeenCalledWith(token)
    expect(res.sendStatus).toHaveBeenCalledWith(401)
    expect(res.locals.user).toBeUndefined()
    expect(next).not.toHaveBeenCalled()
  })

  it('Sends 401 when User.findByToken returns null', async () => {
    User.findByToken = jest.fn(() => (new Promise(resolve => resolve(null))))
    await authenticate(req, res, next)
    expect(req.get).toHaveBeenCalledWith('apiToken')
    expect(User.findByToken).toHaveBeenCalledWith(token)
    expect(res.sendStatus).toHaveBeenCalledWith(401)
    expect(res.locals.user).toBeUndefined()
    expect(next).not.toHaveBeenCalled()
  })
})