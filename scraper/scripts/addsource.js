//script for adding sources to the source collection
const axios         = require('axios')
const { readStdin } = require('../core/Parser/readstdin')
const { Conf }      = require('../core/Classes/conf')

const {conf_path} = readStdin()
const confFile    = new Conf(conf_path)

const content = confFile.getContent()

console.log(`Fetched content from '${conf_path}': ${JSON.stringify(content)}\n`)

axios.post('http://localhost:3001/api/addsource', content)
     .then(response => {
       console.log(`Source '${content.name}' is now scrapable!`)
       console.log(response.data)
       process.exit()
     })
     .catch(err => {
       console.log(err)
       process.exit()
     })
