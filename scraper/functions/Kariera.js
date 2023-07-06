const webdriver = require('selenium-webdriver')
const { logger } = require('../configuration/environment/logger')

module.exports = {
  results_page: async function (ad_urls, driver) {
    //remove modal & privacy consent
    try {
      await driver.wait(
        webdriver.until.elementLocated(webdriver.By.id('CybotCookiebotDialog')),
        200000
      )

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
        webdriver.By.className('h4 JobCard_text__2DNt5')
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
    await driver
      .wait(
        webdriver.until.elementLocated(
          webdriver.By.className('h4 JobTitle_title__irhyN')
        ),
        200000
      )
      .then((element) => {
        return driver.wait(webdriver.until.elementIsVisible(element), 200000)
      })

    await driver
      .findElement(webdriver.By.className('h4 JobTitle_title__irhyN'))
      .getText()
      .then((title) => {
        ad_fields.title = title
      })
      .catch((err) => {
        logger.warn(`title: ${err.message}`)
      })

    await driver
      .findElement(
        webdriver.By.className(
          'HtmlRenderer_renderer__mr82C JobPost_mainBody__HP1vq'
        )
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
          '/html/body/div[2]/section/section[1]/section/main/section/div[2]/div[1]/div[2]/div[1]/div[1]/a'
        )
      )
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
