const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  const adminHash = await bcrypt.hash('password123', 10)
  const analystHash = await bcrypt.hash('password123', 10)
  const viewerHash = await bcrypt.hash('password123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: { name: 'Admin User', email: 'admin@demo.com', passwordHash: adminHash, role: 'ADMIN' }
  })

  const analyst = await prisma.user.upsert({
    where: { email: 'analyst@demo.com' },
    update: {},
    create: { name: 'Analyst User', email: 'analyst@demo.com', passwordHash: analystHash, role: 'ANALYST' }
  })

  const viewer = await prisma.user.upsert({
    where: { email: 'viewer@demo.com' },
    update: {},
    create: { name: 'Viewer User', email: 'viewer@demo.com', passwordHash: viewerHash, role: 'VIEWER' }
  })

  const transactions = [
    { userId: admin.id, amount: 5000, type: 'INCOME', category: 'Salary', date: new Date('2026-01-01'), notes: 'January salary' },
    { userId: admin.id, amount: 1200, type: 'EXPENSE', category: 'Rent', date: new Date('2026-01-05'), notes: 'Monthly rent' },
    { userId: admin.id, amount: 300, type: 'EXPENSE', category: 'Food', date: new Date('2026-01-10'), notes: 'Groceries' },
    { userId: admin.id, amount: 5000, type: 'INCOME', category: 'Salary', date: new Date('2026-02-01'), notes: 'February salary' },
    { userId: admin.id, amount: 1200, type: 'EXPENSE', category: 'Rent', date: new Date('2026-02-05'), notes: 'Monthly rent' },
    { userId: admin.id, amount: 500, type: 'EXPENSE', category: 'Utilities', date: new Date('2026-02-10'), notes: 'Electricity bill' },
    { userId: analyst.id, amount: 3000, type: 'INCOME', category: 'Freelance', date: new Date('2026-03-01'), notes: 'Project payment' },
    { userId: analyst.id, amount: 200, type: 'EXPENSE', category: 'Food', date: new Date('2026-03-05'), notes: 'Dining out' },
    { userId: admin.id, amount: 5000, type: 'INCOME', category: 'Salary', date: new Date('2026-03-01'), notes: 'March salary' },
    { userId: admin.id, amount: 1200, type: 'EXPENSE', category: 'Rent', date: new Date('2026-03-05'), notes: 'Monthly rent' },
  ]

  for (const tx of transactions) {
    await prisma.transaction.create({ data: tx })
  }

  console.log('Done! Demo users and transactions created.')
  console.log('Admin:    admin@demo.com / password123')
  console.log('Analyst:  analyst@demo.com / password123')
  console.log('Viewer:   viewer@demo.com / password123')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())