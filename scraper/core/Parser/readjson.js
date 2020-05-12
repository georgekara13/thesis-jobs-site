const jsonlint = require("jsonlint")
const  fs      = require('fs')

const readJSON = (filepath) => {

  if (!fs.existsSync(filepath)){
    console.log(`File ${filepath} does not exist`)
    return process.exit()
  }

  try{
    const content = jsonlint.parse(fs.readFileSync(filepath, 'utf8'))
    return content
  }
  catch(err){
    console.log(err)
    return process.exit()
  }
}

const exportJSON = (filepath, data) => {
    fs.writeFileSync(filepath, JSON.stringify(data))
    console.log(`\nExported json file sucessfully: ${filepath}`)
}

module.exports = { readJSON, exportJSON }
