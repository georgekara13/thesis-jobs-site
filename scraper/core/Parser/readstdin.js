const readline      = require('readline')
const axios         = require('axios')
const getopts       = require('getopts')
const {readJSON}    = require('./readjson')
const scraperConf   = require('../../configuration/environment/scraperconf').scraperConf()

async function readStdin() {
    let content = {}

    try {
        readline.emitKeypressEvents(process.stdin)
        process.stdin.setRawMode(true)
    }
    catch (err) {
        console.log(err.message)
    }

    //getopt
    const options = getopts(process.argv.slice(2), {
        alias: {
          help: "h",
          conf: "c",
          source: "s",
          noexport: "ne"
        }
    })

    if (options.conf) {
        content = _validateConfPath(options.conf)
        //consume json conf contents
        content = readJSON(content)
    }
    else if (options.source) {
        //fetch source from source collection
        content = _fetchSource(options.source)
    }
    else if (options.help) {
        console.log('\n\nUsage: $node scraper.js --conf=configuration/conf.json\n\n' +
                    'Either use it with --conf OR --source\n' +
                    'Arguments:\n' +
                    '-conf: the json conf file containing the scraper configuration \n' +
                    '-source: The source id from the source collection\n' +
                    '--help: Show help dialog')

        process.exit()
    }
    else {
        console.log('No valid option found in the command line arguments.\nEither use it with --conf=<conf> OR --source=<id>')
        process.exit()
    }

    return content
}

const _validateConfPath = (path) => {
    if (!path || (path && !path.match(/configuration\/.*?\.json/))) {
        console.log("No json conf file found in the arguments\n")
        process.exit()
    }

    return path
}

const _fetchSource = (id) => {
    const content = axios.get(`${scraperConf.HOST}/api/getsourcebyid?id=${id}`)
                         .then(response => response.data)
    return content
}

//process read key combinations
process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c')
    {
        console.log('Exit')
        process.exit()
    }
    else
    {
        console.log("Key combination not recognized")
    }
})


process.on('exit', function(code) {
    return console.log(`\nExited with code ${code}`)
})

module.exports = {readStdin}
