const webdriver = require('selenium-webdriver')
const { logger } = require('../configuration/environment/logger')

module.exports = {
  results_page: async function (ad_urls, driver) {
    //remove modal & privacy consent
    try {
      await driver
        .findElement(
          webdriver.By.id(
            'CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll'
          )
        )
        .click()
    } catch (err) {
      logger.warn(err.message)
    }
    //fetch ad urls
    for (let y = 0; y < 3; y++) {
      logger.info(`Kariera.gr pager: Page ${y + 1}`)
      let fetched_urls = await driver.findElements(
        webdriver.By.className('tGc1KEdv')
      )
      for (let i = 0; i < fetched_urls.length; i++) {
        ad_urls.push(await fetched_urls[i].getAttribute('href'))
      }

      //Navigate to the next page
      await driver
        .findElement(webdriver.By.className('ant-pagination-next'))
        .click()

      await driver.navigate().refresh()
    }
  },

  ad_page: async function (driver, ad_url, ad_fields) {
    ad_fields.jobTag = ['it']
    ad_fields.url = ad_url
    ad_fields.company = 'Kariera.gr'

    //Title
    driver
      .wait(
        webdriver.until.elementLocated(webdriver.By.className('UGhAL2CE')),
        200000
      )
      .then((element) => {
        return driver.wait(webdriver.until.elementIsVisible(element), 200000)
      })

    await driver
      .findElement(webdriver.By.className('UGhAL2CE'))
      .getText()
      .then((title) => {
        ad_fields.title = title
      })
      .catch((err) => {
        logger.warn(`title: ${err.message}`)
      })

    await driver
      .findElement(webdriver.By.className('hi8OBmAZ'))
      .getText()
      .then((description) => {
        ad_fields.description = description
      })
      .catch((err) => {
        logger.warn(`description: ${err.message}`)
      })

    await driver
      .findElement(webdriver.By.className('DllOEHb_ main-body-text'))
      .getText()
      .then((location) => {
        ad_fields.location = location
      })
      .catch((err) => {
        logger.warn(`location: ${err.message}`)
      })

    return ad_fields
  },
}
