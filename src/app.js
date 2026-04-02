require('dotenv').config()
const express = require('express')
const app = express()

app.use(express.json())

app.use('/auth', require('./routes/auth.routes'))
app.use('/transactions', require('./routes/transaction.routes'))
app.use('/dashboard', require('./routes/dashboard.routes'))
app.use('/users', require('./routes/user.routes'))

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))