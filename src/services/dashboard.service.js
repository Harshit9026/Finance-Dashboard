const prisma = require('../prisma')

async function getSummary() {
  const transactions = await prisma.transaction.findMany({
    where: { deletedAt: null }
  })

  const totalIncome = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0)

  const netBalance = totalIncome - totalExpenses

  const categoryTotals = transactions.reduce((acc, t) => {
    if (!acc[t.category]) acc[t.category] = { INCOME: 0, EXPENSE: 0 }
    acc[t.category][t.type] += t.amount
    return acc
  }, {})

  const recent = await prisma.transaction.findMany({
    where: { deletedAt: null },
    orderBy: { date: 'desc' },
    take: 5
  })

  return { totalIncome, totalExpenses, netBalance, categoryTotals, recentActivity: recent }
}

async function getTrends() {
  const transactions = await prisma.transaction.findMany({
    where: { deletedAt: null },
    orderBy: { date: 'asc' }
  })

  const monthly = transactions.reduce((acc, t) => {
    const month = t.date.toISOString().slice(0, 7)
    if (!acc[month]) acc[month] = { INCOME: 0, EXPENSE: 0 }
    acc[month][t.type] += t.amount
    return acc
  }, {})

  return { monthly }
}

module.exports = { getSummary, getTrends }