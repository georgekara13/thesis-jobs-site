const axios = require('axios')
const moment = require('moment')
const { emitter } = require('./core/Classes/Broadcaster')
const { logger } = require('./configuration/environment/logger')
const scraperConf = require('./configuration/environment/scraperconf').scraperConf()

function scheduleScrapes() {
  logger.info('Starting scraper scheduler')

  axios
    .get(`${scraperConf.HOST}/api/getsources`)
    .then((response) => {
      if (response.data.results == 0) {
        logger.warn(`No sources found, will not emit scrape events`)
      } else {
        response.data.sources.forEach((source) => {
          // calculate the minutes difference between now & last scrape
          let calculateMinutes = Math.floor(
            moment
              .duration(moment(Date.now()).diff(moment(source.lastRun)))
              .asMinutes()
          )

          // only scrape active sources & it's time for them to scrape
          if (
            source.scrapeFrequency > 0 &&
            calculateMinutes >= source.scrapeFrequency
          ) {
            logger.info(
              `Will broadcast a scrapeSource event for source '${source.name}' id: ${source._id}`
            )
            emitter.emit('scrapeSource', source)
          } else {
            logger.info(
              `Difference now->lastRun: ${calculateMinutes} , Source frequency: ${source.scrapeFrequency}. Skipping scrape`
            )
          }
        })
      }
    })
    .catch((e) => logger.error(e))
}

// for now the scraper scheduler will run every 15 mins
// TODO setup npm script & run it on docker container up
const interval = setInterval(scheduleScrapes, 900000)

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
