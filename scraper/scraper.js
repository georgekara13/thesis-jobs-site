const webdriver     = require('selenium-webdriver')  //By,Builder,Key,promise,until
const { promisify } = require('util')

const {driverBuilder}   = require('./core/Builder/driverbuilder')
const {scrapeBuilder}   = require('./core/Builder/scrapebuilder')
const {readStdin}       = require('./core/Parser/readstdin')
const {showMenu}        = require('./core/Stdout/showmenu')
const {Conf}            = require('./core/Classes/conf')

//Disable promise manager use Node's native async/await
webdriver.USE_PROMISE_MANAGER = false;

console.log("\n--Running js scraper module--\n");

//readstdin
const {conf_path} = readStdin()

//instantiate conf object
const confFile = new Conf(conf_path)

const {browser, mode} = confFile.getContent()

console.log (`Using conf: '${conf_path}'`)

//Instantiate Browser object & build driver
const browserDriver = driverBuilder(browser, mode)
const driver        = browserDriver.getDriver()

console.log(`Browser: ${browserDriver.getName()} \nMode: ${browserDriver.getMode()}`)

showMenu()

//instantiate scrape object
const scrape = scrapeBuilder(confFile, driver)

scrape.start()
