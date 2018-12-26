import User from '../models/user'

export const signup = (req, res) => {
  const { email, password, name } = req.body
  const user = new User({ email, password, name })
  user.save(err => {
    if (err) {
      res.status(400).send(err)
      return
    }
    res.sendStatus(200)
  })
}
