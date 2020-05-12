const webdriver = require('selenium-webdriver');

module.exports =
{
    results_page: async function(ad_urls,driver)
    {
        try
        {
            await driver.findElement(webdriver.By.xpath('//*[@id="cookie-accept"]')).click();
            await driver.findElement(webdriver.By.xpath('//*[@id="cookie-button"]')).click();
        }
        catch(err)
        {
            console.log(err.message);
        }

        await fetcher(ad_urls,driver);
        //browse to result page 2,refresh document -we need to do this for dynamic urls- then fetch ads
        await driver.findElement(webdriver.By.xpath('/html/body/div[1]/div[9]/div[2]/div[1]/div[2]/div[2]/div/ul/a[2]')).click();
        await driver.navigate().refresh();
        await fetcher(ad_urls,driver);

        await driver.findElement(webdriver.By.xpath('/html/body/div[1]/div[9]/div[2]/div[1]/div[2]/div[2]/div/ul/a[3]')).click();
        await driver.navigate().refresh();
        await fetcher(ad_urls,driver);
    },

    ad_page: async function(driver,ad_url,ad_fields,conf_filter)
    {
        ad_fields =
        {
            title:"",
            description:"",
            location:"",
            salary:"",
            date:"",
            id:"",
            company:"",
            type:"",
            category:"it-jobs",
            url:ad_url
        };

        //Description
        var ad_description = driver.wait(
          webdriver.until.elementLocated(webdriver.By.xpath('/html/body/div[1]/div[7]/div/div[2]/div[2]/div')),
          200000
        )
        .then(element => {
           return driver.wait(
             webdriver.until.elementIsVisible(element),
             200000
           );
        });

        /*3 attempts to fetch the content*/
        for(var i = 0; i<3; i++)
        {
            try
            {
                var ad_title    = await driver.findElement(webdriver.By.xpath('//*[@id="aggelia-title"]')).getText().then(function(title){ad_fields["title"] = title;});
                ad_description  = await driver.findElement(webdriver.By.xpath("/html/body/div[1]/div[7]/div/div[2]/div[2]/div")).getText().then(function(description){ad_fields["description"] = description;});
                var ad_location = await driver.findElement(webdriver.By.xpath("/html/body/div[1]/div[7]/div/div[1]/div[3]/div/div/div/div[2]/span/span")).getText().then(function(location){ad_fields["location"] = location;});
                var ad_id       = await driver.findElement(webdriver.By.xpath("/html/body/div[1]/div[7]/div/div[1]/div[2]/div/div/div/div[4]")).getText().then(function(id){id = id.replace(/^.*?:\s*/, "");ad_fields["id"] = id;return id;});
                var ad_company  = await driver.findElement(webdriver.By.xpath('/html/body/div[1]/div[7]/div/div[1]/div[2]/div/div/div/div[1]/span/span')).getText().then(function(company){ad_fields["company"] = company;});
                var ad_date     = await driver.findElement(webdriver.By.xpath('/html/body/div[1]/div[7]/div/div[1]/div[2]/div/div/div/div[2]/span')).getText().then(function(date){ad_fields["date"] = date;});
                var ad_type     = await driver.findElement(webdriver.By.xpath('/html/body/div[1]/div[7]/div/div[1]/div[2]/div/div/div/div[3]/span')).getText().then(function(type){ad_fields["type"] = type;});
                break;
            }
            catch(err)
            {
                console.log(err.message);
            }
        }

        return ad_fields;
    }
};


async function fetcher(ad_urls,driver)
{
    var fetched_urls = driver.wait(
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
    for ( var i=0; i < fetched_urls.length; i++ )
    {
        ad_urls.push(await fetched_urls[i].getAttribute('href'));
    }
}
