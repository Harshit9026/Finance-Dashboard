const dashboardService = require('../services/dashboard.service')

async function getSummary(req, res, next) {
  try {
    const summary = await dashboardService.getSummary()
    res.json(summary)
  } catch (err) {
    next(err)
  }
}

async function getTrends(req, res, next) {
  try {
    const trends = await dashboardService.getTrends()
    res.json(trends)
  } catch (err) {
    next(err)
  }
}

module.exports = { getSummary, getTrends }