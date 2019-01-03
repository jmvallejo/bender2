import CustomBearerStrategy from 'passport-http-custom-bearer'
import User from '../models/user'

const strategy = new CustomBearerStrategy(
  { headerName: 'apiToken', bodyName: 'apiToken', queryName: 'apiToken' },
  async function (token, done) {
    console.error('ESO MAGOLA')
    try {
      const user = await User.findByToken(token)
      if (!user) {
        return done(null, false)
      }
      return done(null, user, { scope: 'all' })
    } catch (err) {
      return done(err)
    }
  }
)

export default strategy
