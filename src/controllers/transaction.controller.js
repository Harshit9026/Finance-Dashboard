const transactionService = require('../services/transaction.service')

async function getAll(req, res, next) {
  try {
    const { type, category, startDate, endDate, page, limit , search} = req.query
    const result = await transactionService.getAll({ type, category, startDate, endDate, page, limit ,search })
    res.json(result)
  } catch (err) {
    next(err)
  }
}

async function create(req, res, next) {
  try {
    const { amount, type, category, date, notes } = req.body
    const transaction = await transactionService.create({
      userId: req.user.userId,
      amount,
      type,
      category,
      date,
      notes
    })
    res.status(201).json(transaction)
  } catch (err) {
    next(err)
  }
}

async function update(req, res, next) {
  try {
    const { amount, type, category, date, notes } = req.body
    const transaction = await transactionService.update({
      id: req.params.id,
      userId: req.user.userId,
      role: req.user.role,
      amount,
      type,
      category,
      date,
      notes
    })
    res.json(transaction)
  } catch (err) {
    next(err)
  }
}

async function remove(req, res, next) {
  try {
    const result = await transactionService.remove({
      id: req.params.id,
      userId: req.user.userId,
      role: req.user.role
    })
    res.json(result)
  } catch (err) {
    next(err)
  }
}

module.exports = { getAll, create, update, remove }