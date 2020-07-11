const {exportJSON} = require('../../Parser/readjson')
const {Date}       = require('../date')
const axios        = require('axios')

class Scrape {
  constructor(Conf, Driver){
    this._conf         = Conf
    this._driver       = Driver
    this._totalads     = 0
    this._scrapetime   = 0
    this._adstatistics = {}
    this._adurls       = []
    this._adfields     = {
      title:"",
      description:"",
      location:"",
      salaryMin:"",
      salaryMax:"",
      id:"",
      company:"",
      jobTag:[],
      contactPhone:"",
      contactEmail:"",
      url:""
    }
  }

  getConf(){
    return this._conf
  }

  getDriver(){
    return this._driver
  }

  getTotalAds(){
    return this._totalads
  }
  setTotalAds(totalads){
    this._totalads = totalads
  }

  getScrapeTime(){
    return this._scrapetime
  }
  setScrapeTime(scrapetime){
    this._scrapetime = scrapetime
  }

  getAdUrls(){
    return this._adurls
  }
  setAdUrls(adurls){
    this._adurls = adurls
  }

  getAdStatistics(){
    return this._adstatistics
  }
  setAdStatistics(adstatistics){
    this._adstatistics = adstatistics
  }

  getAdFields(){
    return this._adfields
  }

  indexAd(ads){
    axios.post('http://localhost:3001/api/addjobs', ads)
         .then(response => {console.log(response.data)})
  }

  //scraper methods
  //TODO refactor to es6
  async start(){

    /*use module functions defined in json
    fix path and require it
    */
    let redirect_module = this.getConf().getScraperModule()
    redirect_module     = redirect_module.replace(/^\.\//, '../../../')
    const opt_module    = require(redirect_module)

    let {site_url, filter, total_ads} = this.getConf().getScraperConf()

    const driver    = this.getDriver()
    let ad_urls     = this.getAdUrls()
    let export_json = []

    if ( !site_url[0] )
    {
        console.log("No URL parameter found");
        process.exit()
    }
    for (let x = 0; x < site_url.length; x++)
    {
        console.log("\nVisiting URL " + site_url[x])
        try
        {
            await driver.get(site_url[x])
            await opt_module.results_page(ad_urls,driver)
        }
        catch(err)
        {
            console.log(err.message)
            await driver.quit()
            process.exit()
        }
        console.log(`\nTotal ad urls found:|${ad_urls.length}|\n=====================================\n`)

        let s = 1
        ad_urls.forEach((ad, s) => {
          console.log(`Ad url ${s + 1} : ${ad}`)
          s++
        })

        if (total_ads && typeof total_ads !== 'number' )
        {
            console.log('\nError - total_ads is not a number')
            await driver.quit()
            process.exit()
        }
        else
        {
            if ( total_ads > ad_urls.length ) total_ads = ad_urls.length
        }

        for (let i = 0; i < total_ads; i++)
        {
            console.log(`\nvisiting url: ${ad_urls[i]}`)
            await driver.get(ad_urls[i])

            //deep clone ad fields
            let adfields = {...this.getAdFields()}

            //fetch filter values
            console.log(`\n=========================\nAd ${i + 1} \n\nFetching ad fields:`)
            let ad_fields_mut = await opt_module.ad_page(driver, ad_urls[i], adfields, filter)

            if (ad_fields_mut !== null)
            {
                export_json.push(ad_fields_mut)
                console.log(ad_fields_mut)
            }
            else
            {
                console.log(`\nAd Got filtered for value "${filter.value}" in ad field "${filter.field}"\n`)
            }
            console.log("\n=========================\n")
        }

        //we empty the ad_urls array to refill it with the ads of the next site_url
        ad_urls = []
    }

    //export data to json file
    let conf_path = this.getConf().getConfPath()
    const dateNow = new Date('YYYYMMDDHHSS')
    conf_path     = conf_path.replace(".json", `-${dateNow.getDateTimeNow()}.json`)
    exportJSON(`./exports${conf_path.match(/\/.*?\.json/)}`, export_json)

    //index ads to mongodb job collection
    this.indexAd(export_json)

    await driver.quit()
    process.exit()
  }
}

module.exports = { Scrape }
