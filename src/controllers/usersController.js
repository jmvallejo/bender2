import User from '../models/user'

export const ADMIN_FIELDS = ['isAdmin', 'isApproved', 'archived']
const cleanData = data => {
  if (!data || typeof data !== 'object') {
    return {}
  }
  for (let i = 0, field; i < ADMIN_FIELDS.length; i++) {
    field = ADMIN_FIELDS[i]
    delete data[field]
  }
  return data
}

export const list = async (req, res) => {
  const users = await User.list()
  res.status(200).send(users)
}

export const view = async (req, res) => {
  const { userId } = req.params
  const user = await User.findActiveById(userId)
  if (!user) {
    return res.sendStatus(404)
  }
  res.status(200).send(user)
}

export const update = async (req, res) => {
  const { userId } = req.params
  const data = cleanData(req.body)
  const user = await User.findByIdAndUpdate(userId, { ...data }, { new: true })
  if (!user) {
    return res.sendStatus(404)
  }
  res.status(200).send(user)
}

export const archive = async (req, res) => {
  const { userId } = req.params
  const user = await User.findById(userId)
  if (!user) {
    return res.sendStatus(404)
  }
  const archivedUser = await user.archive()
  res.status(200).send(archivedUser)
}
