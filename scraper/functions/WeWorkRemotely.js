const webdriver = require('selenium-webdriver')

module.exports =
{
  results_page: async function(ad_urls,driver)
  {
    const fetched_urls = await driver.findElements(webdriver.By.xpath("/html/body/div[3]/div/section/article/ul/li/a"))
    for ( let i = 0; i < fetched_urls.length; i++ )
    {
      ad_urls.push(await fetched_urls[i].getAttribute('href'))
    }
  },

  ad_page: async function(driver,ad_url,ad_fields)
  {
    ad_fields.location = "Remote"
    ad_fields.jobTag   = ["it"]
    ad_fields.url      = ad_url

    //Title
    driver.wait(
      webdriver.until.elementLocated(webdriver.By.css(".listing-header-container")),
      200000
    )
    .then(element => {
      return driver.wait(
        webdriver.until.elementIsVisible(element),
          200000
        )
    })

    await driver.findElement(webdriver.By.xpath("/html/body/div[3]/div/div[1]/h1")).getText()
                .then((title) => {ad_fields.title = title})
                .catch(err => {console.log(`title: ${err.message}`)})

    await driver.findElement(webdriver.By.xpath("/html/body/div[3]/div/div[2]/h2/a")).getText()
                .then((company) => {ad_fields.company = company})
                .catch(err => {console.log(`company: ${err.message}`)})

    await driver.findElement(webdriver.By.id("job-listing-show-container")).getText()
                .then((description) => {ad_fields.description = description})
                .catch(err => {console.log(`description: ${err.message}`)})

    return ad_fields
  }
}
