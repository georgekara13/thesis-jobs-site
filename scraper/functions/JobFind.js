const webdriver = require('selenium-webdriver')
const { logger } = require('../configuration/environment/logger')

module.exports = {
  results_page: async function (ad_urls, driver) {
    let fetched_urls = await driver.findElements(
      webdriver.By.xpath(
        '/html/body/form/div[4]/div/div[2]/div[1]/div/div[1]/div/div[1]/h3/a'
      )
    )
    for (let i = 0; i < fetched_urls.length; i++) {
      ad_urls.push(await fetched_urls[i].getAttribute('href'))
    }
  },

  ad_page: async function (driver, ad_url, ad_fields) {
    ad_fields.location = 'Athens'
    ad_fields.jobTag = ['unknown']
    ad_fields.url = ad_url

    //Title
    driver
      .wait(
        webdriver.until.elementLocated(webdriver.By.className('title')),
        200000
      )
      .then((element) => {
        return driver.wait(webdriver.until.elementIsVisible(element), 200000)
      })

    await driver
      .findElement(
        webdriver.By.xpath(
          '/html/body/form/div[4]/div/div[2]/div[2]/div/div/h1'
        )
      )
      .getText()
      .then((title) => {
        ad_fields.title = title
      })
      .catch((err) => {
        logger.warn(`title: ${err.message}`)
      })

    await driver
      .findElement(webdriver.By.xpath('/html/body/div[3]/div/div[2]/h2/a'))
      .getText()
      .then((company) => {
        ad_fields.company = company
      })
      .catch((err) => {
        logger.warn(`company: ${err.message}`)
      })

    await driver
      .findElement(webdriver.By.id('jobadview'))
      .getText()
      .then((description) => {
        ad_fields.description = description
      })
      .catch((err) => {
        logger.warn(`description: ${err.message}`)
      })

    return ad_fields
  },
}
