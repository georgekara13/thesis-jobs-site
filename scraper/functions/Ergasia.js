const webdriver = require('selenium-webdriver')
const { logger } = require('../configuration/environment/logger')

module.exports = {
  results_page: async function (ad_urls, driver) {
    //remove modal & privacy consent
    try {
      await driver
        .findElement(webdriver.By.id('onesignal-slidedown-cancel-button'))
        .click()
    } catch (err) {
      logger.warn(err.message)
    }
    //fetch ad urls
    for (let y = 0; y < 22; y++) {
      logger.info(`Ergasia.gr pager: Page ${y + 1}`)
      let fetched_urls = await driver.findElements(
        webdriver.By.xpath(
          '/html/body/section[2]/div/div/div/div/div[2]/div/div[5]/div/div/div[2]/ul/li[1]/h4/a'
        )
      )
      for (let i = 0; i < fetched_urls.length; i++) {
        ad_urls.push(await fetched_urls[i].getAttribute('href'))
      }

      //Navigate to the next page
      await driver.findElement(webdriver.By.className('next')).click()

      await driver.navigate().refresh()
    }
  },

  ad_page: async function (driver, ad_url, ad_fields) {
    ad_fields.jobTag = ['it']
    ad_fields.url = ad_url

    //Title
    driver
      .wait(
        webdriver.until.elementLocated(
          webdriver.By.xpath('/html/body/section[2]/div/div/div[1]/div/h1')
        ),
        200000
      )
      .then((element) => {
        return driver.wait(webdriver.until.elementIsVisible(element), 200000)
      })

    await driver
      .findElement(
        webdriver.By.xpath('/html/body/section[2]/div/div/div[1]/div/h1')
      )
      .getText()
      .then((title) => {
        ad_fields.title = title
      })
      .catch((err) => {
        logger.warn(`title: ${err.message}`)
      })

    await driver
      .findElement(
        webdriver.By.xpath('/html/body/section[3]/div/div/div[1]/div[2]')
      )
      .getText()
      .then((description) => {
        ad_fields.description = description
      })
      .catch((err) => {
        logger.warn(`description: ${err.message}`)
      })

    await driver
      .findElement(
        webdriver.By.xpath(
          '/html/body/section[2]/div/div/div[1]/div/ul/li[4]/a'
        )
      )
      .getText()
      .then((location) => {
        ad_fields.location = location
      })
      .catch((err) => {
        logger.warn(`location: ${err.message}`)
      })

    await driver
      .findElement(
        webdriver.By.xpath(
          '/html/body/section[3]/div/div/div[2]/aside/div[6]/ul/a'
        )
      )
      .getText()
      .then((company) => {
        ad_fields.company = company.replace(/#/, '')
      })
      .catch((err) => {
        logger.warn(`company: ${err.message}`)
      })

    return ad_fields
  },
}
