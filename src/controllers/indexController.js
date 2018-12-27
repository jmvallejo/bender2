import User from '../models/user'

export const signup = (req, res) => {
  const { email, password, name } = req.body
  const user = new User({ email, password, name })
  user.save()
    .then(() => {
      res.sendStatus(201)
    })
    .catch(err => {
      res.status(400).send(err.message)
    })
}
