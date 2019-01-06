import User from '../models/user'

export const list = async (req, res) => {
  const users = await User.list()
  res.status(200).send(users)
}
