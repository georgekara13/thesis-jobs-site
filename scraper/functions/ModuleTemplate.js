const webdriver = require('selenium-webdriver')
/*USED FOR ID MD5 HASHING
const saltedMd5 = require('salted-md5');
const salt      = '0Yy LUm@o';
*/

module.exports = {
  results_page: async function (ad_urls, driver) {
    //STEPS TO BE DONE BEFORE FETCHING AD_URLS
    try {
      await driver.findElement(webdriver.By.xpath('')).click()
      await driver.findElement(webdriver.By.css('')).sendKeys('test')
      await driver
        .findElement(webdriver.By.className(''))
        .sendKeys(webdriver.Keys.ENTER)
    } catch (err) {
      console.log(err.message)
    }
    //FETCH AD URLS
    let fetched_urls = await driver.findElements(webdriver.By.className(''))
    for (let i = 0; i < fetched_urls.length; i++) {
      ad_urls.push(await fetched_urls[i].getAttribute('href'))
      //ad_urls[i] = ad_urls[i].replace(/^/, 'https://baseurl.com');
    }

    /*OR USE THIS FOR NON FIXED NEXT BUTTON
        await fetcher(ad_urls,driver);
        await driver.findElement(webdriver.By.xpath('/html/body/div[1]/div[9]/div[2]/div[1]/div[2]/div[2]/div/ul/a[2]')).click();
        await driver.navigate().refresh();
        await fetcher(ad_urls,driver);*/
  },

  ad_page: async function (driver, ad_url, ad_fields, conf_filter) {
    /*Get date & time from browser if no date field available -TODO move to another module
      let currentdate = new Date();
      currentdate     = currentdate.getDate() + "/" +
                        (currentdate.getMonth()+1) + "/" +
                        currentdate.getFullYear() + " " +
                        currentdate.getHours() + ":" +
                        currentdate.getMinutes() + ":" +
                        currentdate.getSeconds();
        */
    ad_fields = {
      title: '',
      description: '',
      location: '',
      salary: '',
      date: currentdate,
      id: '',
      company: '',
      type: '',
      category: 'unknown',
      url: ad_url,
    }

    /*use the slowest loading DOM element
        -  or attach wait for every ad_field - OVERKILL*/
    let slowest_elem = driver
      .wait(
        webdriver.until.elementLocated(
          webdriver.By.xpath('/html/body/div[1]/div[7]/div/div[2]/div[2]/div')
        ),
        200000
      )
      .then((element) => {
        return driver.wait(webdriver.until.elementIsVisible(element), 200000)
      })

    /*3 attempts to fetch the content*/
    for (let i = 0; i < 3; i++) {
      try {
        let ad_title = await driver
          .findElement(webdriver.By.xpath(''))
          .getText()
          .then(function (title) {
            ad_fields['title'] = title
          })
        let ad_description = await driver
          .findElement(webdriver.By.css(''))
          .getText()
          .then(function (description) {
            ad_fields['description'] = description
          })
        let ad_location = await driver
          .findElement(webdriver.By.className(''))
          .getText()
          .then(function (location) {
            ad_fields['location'] = location
          })
        let ad_id = await driver
          .findElement(webdriver.By.xpath(''))
          .getText()
          .then(function (id) {
            id = id.replace(/^.*?:\s*/, '')
            ad_fields['id'] = id
            return id
          })
        let ad_company = await driver
          .findElement(webdriver.By.xpath(''))
          .getText()
          .then(function (company) {
            ad_fields['company'] = company
          })
        let ad_date = await driver
          .findElement(webdriver.By.xpath(''))
          .getText()
          .then(function (date) {
            ad_fields['date'] = date
          })
        let ad_type = await driver
          .findElement(webdriver.By.xpath(''))
          .getText()
          .then(function (type) {
            ad_fields['type'] = type
          })

        /*OR use md5 hashing for ids if not available in ad pages
                let ad_fields["id"] = saltedMd5(ad_url, salt);*/
        break
      } catch (err) {
        console.log(err.message)
      }
    }

    return ad_fields
  },
}

//USE THIS FOR MULTIPLE RESULT PAGES WITHOUT FIXED 'NEXT' BUTTON
/*async function fetcher(ad_urls,driver)
{
    let fetched_urls = driver.wait(
      webdriver.until.elementLocated(webdriver.By.xpath("/html/body/div[1]/div[9]/div[2]/div[1]/div[2]/div[3]/div/div[20]/div/div[1]/div[1]/div[1]/div/a")),
      20000000
    )
    .then(element => {
       return driver.wait(
         webdriver.until.elementIsVisible(element),
         20000000
       );
    });
    fetched_urls = await driver.findElements(webdriver.By.xpath("/html/body/div[1]/div[9]/div[2]/div[1]/div[2]/div[3]/div/div/div/div[1]/div[1]/div[2]/div[2]/a"));
    for ( let i=0; i < fetched_urls.length; i++ )
    {
        ad_urls.push(await fetched_urls[i].getAttribute('href'));
    }
}*/
