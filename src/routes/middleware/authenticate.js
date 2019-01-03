import User from '../../models/user'

const authenticate = async (req, res, next) => {
  try {
    const token = req.get('apiToken')
    const user = await User.findByToken(token)
    if (!user) {
      return res.sendStatus(401)
    }
    res.locals.user = user
    return next()
  } catch (err) {
    return res.sendStatus(401)
  }
}

export default authenticate