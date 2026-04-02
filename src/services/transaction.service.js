const prisma = require('../prisma')

async function getAll({ type, category, startDate, endDate, page, limit, search  }) {
  const where = { deletedAt: null }

  if (type) where.type = type
  if (category) where.category = category
  if (search) where.notes = { contains: search }

  if (startDate || endDate) {
    where.date = {}
    if (startDate) where.date.gte = new Date(startDate)
    if (endDate) where.date.lte = new Date(endDate)
  }

  const take = parseInt(limit) || 10
  const skip = ((parseInt(page) || 1) - 1) * take

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: { date: 'desc' },
      take,
      skip
    }),
    prisma.transaction.count({ where })
  ])

  return { transactions, total, page: parseInt(page) || 1, limit: take }
}

async function create({ userId, amount, type, category, date, notes }) {
  if (!amount || !type || !category || !date) {
    const error = new Error('amount, type, category and date are required')
    error.status = 400
    throw error
  }

  if (!['INCOME', 'EXPENSE'].includes(type)) {
    const error = new Error('type must be INCOME or EXPENSE')
    error.status = 400
    throw error
  }

  const transaction = await prisma.transaction.create({
    data: {
      userId,
      amount: parseFloat(amount),
      type,
      category,
      date: new Date(date),
      notes
    }
  })

  return transaction
}

async function update({ id, userId, role, amount, type, category, date, notes }) {
  const transaction = await prisma.transaction.findFirst({
    where: { id, deletedAt: null }
  })

  if (!transaction) {
    const error = new Error('Transaction not found')
    error.status = 404
    throw error
  }

  if (role !== 'ADMIN' && transaction.userId !== userId) {
    const error = new Error('You can only edit your own transactions')
    error.status = 403
    throw error
  }

  const updated = await prisma.transaction.update({
    where: { id },
    data: {
      ...(amount && { amount: parseFloat(amount) }),
      ...(type && { type }),
      ...(category && { category }),
      ...(date && { date: new Date(date) }),
      ...(notes !== undefined && { notes })
    }
  })

  return updated
}

async function remove({ id, userId, role }) {
  const transaction = await prisma.transaction.findFirst({
    where: { id, deletedAt: null }
  })

  if (!transaction) {
    const error = new Error('Transaction not found')
    error.status = 404
    throw error
  }

  await prisma.transaction.update({
    where: { id },
    data: { deletedAt: new Date() }
  })

  return { message: 'Transaction deleted' }
}

module.exports = { getAll, create, update, remove }