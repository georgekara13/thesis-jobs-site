const readline = require('readline')
const axios    = require('axios')

const readStdin = () => {
  try
  {
      readline.emitKeypressEvents(process.stdin)
      process.stdin.setRawMode(true)
  }
  catch (err)
  {
      console.log(err.message)
  }

  let conf_path      = ''
  let source_content = {}

  for ( let i = 0; i < process.argv.length; i++ )
  {
      //Set opts here
      process.argv[i].match(/-conf/)      ?  conf_path      = _validateConfPath(process.argv[i+1]) :
      process.argv[i].match(/-source/)    ?  source_content = _fetchSource(process.argv[i+1]) :
      process.argv[i].match(/-noexport/)  ?  console.log('Not supported yet') : {}

      //Help dialog
      if (process.argv[i].match(/-help/))
      {
          console.log('\n\nUsage: $node scraper.js -conf configuration/conf.json\n\n' +
                      'Arguments:\n' +
                      '-conf: the json conf file containing the scraper configuration - Mandatory\n' +
                      '-noexport: Do not export json file with scraped data - Optional\n'
                     )
          return process.exit()
      }
  }

  return {conf_path, source_content}
}

const _validateConfPath = (path) => {
    if (!path || (path && !path.match(/configuration\/.*?\.json/)))
    {
        console.log("No json conf file found in the arguments\n")
        process.exit()
    }

    return path
}

//FIXME
const _fetchSource = (id) => {
    return axios.get(`http://localhost:3001/api/getsourcebyid?id=${id}`)
                .then((response) => {return response.data})
}

//process read key combinations
process.stdin.on('keypress', (str, key) =>
{
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


process.on('exit', function(code)
{
    return console.log(`\nExited with code ${code}`)
})

module.exports = {readStdin}
