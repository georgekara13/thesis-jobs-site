const webdriver = require('selenium-webdriver')
const saltedMd5 = require('salted-md5')
const salt      = '0Yy LUm@o'


module.exports =
{
  results_page: async function(ad_urls,driver)
  {
    const fetched_urls = await driver.findElements(webdriver.By.className("job"))
    for ( let i = 0; i < fetched_urls.length; i++ )
    {
      ad_urls.push(await fetched_urls[i].getAttribute('data-url'))
      ad_urls[i] = ad_urls[i].replace(/^/, 'https://remoteok.io')
    }
  },

  ad_page: async function(driver,ad_url,ad_fields,conf_filter)
  {
    ad_fields.location = "Remote"
    ad_fields.jobTag   = ["it"]
    ad_fields.url      = ad_url
    ad_fields.id       = saltedMd5(ad_url, salt)

    //Title
    driver.wait(
      webdriver.until.elementLocated(webdriver.By.css("#jobsboard td.position h2")),
      200000
    )
    .then(element => {
      return driver.wait(
        webdriver.until.elementIsVisible(element),
          200000
        )
    })

    //company
    driver.wait(
      webdriver.until.elementLocated(webdriver.By.css('.insert .bsa .default-description, #jobsboard td.company h3')),
      200000
    )
    .then(element => {
       return driver.wait(
         webdriver.until.elementIsVisible(element),
         200000
       )
    })

    //Description
    driver.wait(
      webdriver.until.elementLocated(webdriver.By.className('description')),
      200000
    )
    .then(element => {
      return driver.wait(
         webdriver.until.elementIsVisible(element),
         200000
       )
    })

    try
    {
      await driver.findElement(webdriver.By.css("#jobsboard td.position h2")).getText().then((title) => {ad_fields.title = title})
      await driver.findElement(webdriver.By.css(".insert .bsa .default-description, #jobsboard td.company h3")).getText().then((company) => {ad_fields.company = company})
      await driver.findElement(webdriver.By.className("description")).getText().then((description) => {ad_fields.description = description})
    }
    catch(err)
    {
      console.log(err.message)
    }

    return ad_fields
  }
}
