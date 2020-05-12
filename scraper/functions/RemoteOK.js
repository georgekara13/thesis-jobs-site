const webdriver = require('selenium-webdriver');
const saltedMd5 = require('salted-md5');
const salt      = '0Yy LUm@o';

module.exports =
{
    results_page: async function(ad_urls,driver)
    {
        var fetched_urls = await driver.findElements(webdriver.By.className("job"));
        for ( var i=0; i < fetched_urls.length; i++ )
        {
            ad_urls.push(await fetched_urls[i].getAttribute('data-url'));
            ad_urls[i] = ad_urls[i].replace(/^/, 'https://remoteok.io');
        }
    },

    ad_page: async function(driver,ad_url,ad_fields,conf_filter)
    {
        var currentdate = new Date();
        currentdate     = currentdate.getDate() + "/" +
                          (currentdate.getMonth()+1) + "/" +
                          currentdate.getFullYear() + " " +
                          currentdate.getHours() + ":" +
                          currentdate.getMinutes() + ":" +
                          currentdate.getSeconds();

        ad_fields =
        {
            title:"",
            description:"",
            location:"Remote",
            salary:"",
            date:currentdate,
            id:"",
            company:"",
            type:"",
            category:"it-jobs",
            url:ad_url
        };

        //Title
        var ad_title = driver.wait(
          webdriver.until.elementLocated(webdriver.By.css("#jobsboard td.position h2")),
          200000
        )
        .then(element => {
           return driver.wait(
             webdriver.until.elementIsVisible(element),
             200000
           );
        });

        //company
        var ad_company = driver.wait(
          webdriver.until.elementLocated(webdriver.By.css('.insert .bsa .default-description, #jobsboard td.company h3')),
          200000
        )
        .then(element => {
           return driver.wait(
             webdriver.until.elementIsVisible(element),
             200000
           );
        });

        //Description
        var ad_description = driver.wait(
          webdriver.until.elementLocated(webdriver.By.className('description')),
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
                ad_title        = await driver.findElement(webdriver.By.css("#jobsboard td.position h2")).getText().then(function(title){ad_fields["title"] = title;});
                ad_company      = await driver.findElement(webdriver.By.css(".insert .bsa .default-description, #jobsboard td.company h3")).getText().then(function(company){ad_fields["company"] = company;});
                ad_description  = await driver.findElement(webdriver.By.className("description")).getText().then(function(description){ad_fields["description"] = description;});
                ad_fields["id"] = saltedMd5(ad_url, salt);
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
