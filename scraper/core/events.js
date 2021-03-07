const webdriver = require('selenium-webdriver') //By,Builder,Key,promise,until
const { promisify } = require('util')
const { driverBuilder } = require('./Builder/driverbuilder')
const { scrapeBuilder } = require('./Builder/scrapebuilder')
const { Conf } = require('./Classes/conf')
const { logger } = require('../configuration/environment/logger')

/* Register emittable scraper events*/

const scrapeSource = (conf) => {
  //Disable promise manager use Node's native async/await
  webdriver.USE_PROMISE_MANAGER = false

  logger.debug(
    `Broadcasted a scrapeSource event for source ${conf.name} - id ${conf._id}`
  )

  const confFile = new Conf(conf)

  const { browser, mode } = conf

  //Instantiate Browser object & build driver
  const browserDriver = driverBuilder(browser, mode)
  const driver = browserDriver.getDriver()

  logger.debug(
    `Source id ${
      conf._id
    } - Browser: ${browserDriver.getName()} \nMode: ${browserDriver.getMode()}`
  )

  //instantiate scrape object
  const scrape = scrapeBuilder(confFile, driver)

  scrape.start()
}

module.exports = { scrapeSource }
