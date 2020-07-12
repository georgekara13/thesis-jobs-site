//script for adding sources to the source collection
const axios         = require('axios')
const { readStdin } = require('../core/Parser/readstdin')
const scraperConf   = require('../configuration/environment/scraperconf').scraperConf()

async function addSource() {
  const content = await readStdin()

  console.log(`Fetched content: ${JSON.stringify(content)}\n`)

  axios.post(`${scraperConf.HOST}/api/addsource`, content)
       .then(response => {
         console.log(`Source '${content.name}' is now scrapable!`)
         console.log(response.data)
         process.exit()
       })
       .catch(err => {
         console.log(err)
         process.exit()
       })
}

//TODO ADD checks if source already exists

addSource()
