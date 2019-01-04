import User from '../models/user'

export const signup = (req, res) => {
  const { email, password, name } = req.body
  const user = new User({ email, password, name })
  user
    .save()
    .then(() => {
      res.sendStatus(201)
    })
    .catch(err => {
      res.status(400).send(err.message)
    })
}

export const login = async (req, res) => {
  const { email, password } = req.body
  let user = await User.findOne({ email })
  if (!user || !user.isApproved) {
    return res.sendStatus(401)
  }
  const isMatch = await user.comparePassword(password)
  if (!isMatch) {
    return res.sendStatus(401)
  }
  user = await user.generateToken()
  return res.status(200).send(user.toObject())
}
