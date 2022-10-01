const { emitter } = require('./core/Classes/Broadcaster')
const { logger } = require('./configuration/environment/logger')

logger.info('Starting scraper scheduler')

// for now the scraper scheduler will emit a scheduleScrapes event every 15 mins
const interval = setInterval(() => {
  emitter.emit('scheduleScrapes')
}, 900000)

process.on('SIGINT', () => {
  logger.info('Received exit signal')
  clearInterval(interval)
  process.exit()
})

// consider using this signal - TODO audit current codebase
// a single uncaught exception will exit the whole scraper process
/*process.on('uncaughtException', () => {
  logger.error('Uncaught exception exit signal')
  clearInterval(interval)
  process.exit()
})*/
