const { readStdin } = require('./core/Parser/readstdin')
const { emitter } = require('./core/Classes/Broadcaster')

async function run() {
  console.log('\n--Started source scraper--\n')

  //readstdin
  const content = await readStdin()

  console.log(`Scraping source: '${content.name}'`)
  emitter.emit('scrapeSource', content)
}

run()
