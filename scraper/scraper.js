const webdriver     = require('selenium-webdriver')  //By,Builder,Key,promise,until
const { promisify } = require('util')

const {driverBuilder}   = require('./core/Builder/driverbuilder')
const {scrapeBuilder}   = require('./core/Builder/scrapebuilder')
const {readStdin}       = require('./core/Parser/readstdin')
const {readJSON}        = require('./core/Parser/readjson')
const {showMenu}        = require('./core/Stdout/showmenu')
const {Conf}            = require('./core/Classes/conf')

//Disable promise manager use Node's native async/await
webdriver.USE_PROMISE_MANAGER = false;

console.log("\n--Running js scraper module--\n");

//readstdin
const {conf_path, source_content} = readStdin()

let content = conf_path ? readJSON(conf_path)
                        : source_content

//instantiate conf object
const confFile = new Conf(content)

const {browser, mode} = content

console.log (`Using conf: '${confFile.getName()}'`)

//Instantiate Browser object & build driver
const browserDriver = driverBuilder(browser, mode)
const driver        = browserDriver.getDriver()

console.log(`Browser: ${browserDriver.getName()} \nMode: ${browserDriver.getMode()}`)

showMenu()

//instantiate scrape object
const scrape = scrapeBuilder(confFile, driver)

scrape.start()
