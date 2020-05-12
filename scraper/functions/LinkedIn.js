const webdriver   = require('selenium-webdriver');
const  {readJSON} = require('../core/Parser/readjson');
/*USED FOR ID MD5 HASHING
const saltedMd5 = require('salted-md5');
const salt      = '0Yy LUm@o';
*/

//fetch user creds from file
const {email, password} = readJSON('auth/linkedin.json');

module.exports =
{
    results_page: async function(ad_urls,driver)
    {
        //STEPS TO BE DONE BEFORE FETCHING AD_URLS

        try
        {
            //login
            console.log(`Authenticating user '${email}'...`);
            await driver.findElement(webdriver.By.xpath('/html/body/header/nav/a[3]')).click();
            await driver.findElement(webdriver.By.xpath('//*[@id="username"]')).sendKeys(email);
            await driver.findElement(webdriver.By.xpath('//*[@id="password"]')).sendKeys(password);
            await driver.findElement(webdriver.By.xpath('/html/body/div[1]/main/div/form/div[3]/button')).click();
            console.log(`User '${email}' logged in successfully`);
        }
        catch(err)
        {
            console.log(err.message);
        }

        let i = 0
        while( i < 51 )
        {
          await scrollIntoView(driver)
          await fetcher(ad_urls,driver)
          await driver.get(`https://www.linkedin.com/jobs/search/?location=United%20Kingdom&locationId=gb%3A0&originalSubdomain=uk&sortBy=DD&start=${i}`)
          i += 25
        }
    },

    ad_page: async function(driver,ad_url,ad_fields,conf_filter)
    {
      //Get date & time from browser if no date field available -TODO move to another module
      let currentdate = new Date();
      currentdate     = currentdate.getDate() + "/" +
                        (currentdate.getMonth()+1) + "/" +
                        currentdate.getFullYear() + " " +
                        currentdate.getHours() + ":" +
                        currentdate.getMinutes() + ":" +
                        currentdate.getSeconds();

        ad_fields =
        {
            title:"",
            company:"",
            location:"",
            easyapply:"",
            date:currentdate,
            url:ad_url
        };

        /*use the slowest loading DOM element
        -  or attach wait for every ad_field - OVERKILL*/
        let slowest_elem = driver.wait(
          webdriver.until.elementLocated(webdriver.By.xpath('/html/body/main/section[1]/section[1]/div/div[2]/a/span')),
          200000
        )
        .then(element => {
           return driver.wait(
             webdriver.until.elementIsVisible(element),
             200000
           );
        });

        /*3 attempts to fetch the content*/
        //for(let i = 0; i<3; i++)
        //{
            try
            {
                let ad_title        = await driver.findElement(webdriver.By.xpath('/html/body/div[6]/div[5]/div[3]/div/div[1]/div[1]/div/div[1]/div/div[2]/div[1]/h1')).getText().then(function(title){ad_fields["title"] = title;});
                //var ad_description  = await driver.findElement(webdriver.By.css("")).getText().then(function(description){ad_fields["description"] = description;});
                let ad_location     = await driver.findElement(webdriver.By.xpath("/html/body/div[6]/div[5]/div[3]/div/div[1]/div[1]/div/div[1]/div/div[2]/div[1]/h3/span[3]")).getText().then(function(location){ad_fields["location"] = location;});
                //var ad_id           = await driver.findElement(webdriver.By.xpath("")).getText().then(function(id){id = id.replace(/^.*?:\s*/, "");ad_fields["id"] = id;return id;});
                let ad_company      = await driver.findElement(webdriver.By.xpath('/html/body/div[6]/div[5]/div[3]/div/div[1]/div[1]/div/div[3]/div/article/div[1]/div[2]/a/h3')).getText().then(function(company){ad_fields["company"] = company;});
                //var ad_date         = await driver.findElement(webdriver.By.xpath('')).getText().then(function(date){ad_fields["date"] = date;});
                let ad_easyapply    = await driver.findElement(webdriver.By.xpath('/html/body/div[6]/div[5]/div[3]/div/div[1]/div[1]/div/div[1]/div/div[2]/div[2]/div[2]/div[2]/div/div/button/span')).getText().then(function(ad_easyapply){ad_fields["easyapply"] = ad_easyapply;});

                /*OR use md5 hashing for ids if not available in ad pages
                var ad_fields["id"] = saltedMd5(ad_url, salt);*/
                //break;
            }
            catch(err)
            {
                console.log(err.message);
            }
        //}

        if (conf_filter !== null)
        {
            ad_fields = await filter_ad(conf_filter, ad_fields);
        }
        driver.sleep(20000);
        return ad_fields;
    }
};

//TODO move to MainFunctions.js
async function filter_ad(filter, ad_fields)
{
    switch (filter.logic)
    {
        case "not":
          if (filter.type === "text")
          {
            if (ad_fields[filter.field.valueOf()] == filter.value)
            {
                console.log("filtering ad");
                ad_fields = null;
            }
          }
          break;
        default:
          console.log("Wrongly specified filter");
          break;
    }

    return ad_fields;
}
//USE THIS FOR MULTIPLE RESULT PAGES WITHOUT FIXED 'NEXT' BUTTON
async function fetcher(ad_urls,driver)
{
    let slowest_elem = driver.wait(
      webdriver.until.elementLocated(webdriver.By.xpath('/html/body/div[6]/div[5]/div[3]/section[1]/div[2]/div/div/div[1]/div[2]/div/ul/li[1]/div/div/ul/li/time')),
      200000
    )
    .then(element => {
       return driver.wait(
         webdriver.until.elementIsVisible(element),
         200000
       );
    });

    let fetched_urls = await driver.findElements(webdriver.By.className("js-focusable"));
    for ( var i=0; i < fetched_urls.length; i++ )
    {
        ad_urls.push(await fetched_urls[i].getAttribute('href'));
    }
}

async function scrollIntoView(driver)
{

    let slowest_elem = driver.wait(
      webdriver.until.elementLocated(webdriver.By.className('artdeco-pagination__indicator')),
      200000
    )
    .then(element => {
       return driver.wait(
         webdriver.until.elementIsVisible(element),
         200000
       )
    })

    let element = await driver.findElement(webdriver.By.className('artdeco-pagination__indicator'))
    await driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'})", element)
    await driver.sleep(4000)
}
