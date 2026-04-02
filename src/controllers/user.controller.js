const userService = require('../services/user.service')

async function getAll(req, res, next) {
  try {
    const users = await userService.getAll()
    res.json(users)
  } catch (err) {
    next(err)
  }
}

async function updateRole(req, res, next) {
  try {
    const { role } = req.body
    if (!role) {
      return res.status(400).json({ error: 'role is required' })
    }
    const user = await userService.updateRole({ id: req.params.id, role })
    res.json(user)
  } catch (err) {
    next(err)
  }
}

async function updateStatus(req, res, next) {
  try {
    const { status } = req.body
    if (!status) {
      return res.status(400).json({ error: 'status is required' })
    }
    const user = await userService.updateStatus({ id: req.params.id, status })
    res.json(user)
  } catch (err) {
    next(err)
  }
}

module.exports = { getAll, updateRole, updateStatus }