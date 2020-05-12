const  fs = require('fs')

const moduleValidator = (modulepath) => {
  if ( !modulepath || !modulepath.match(/\.\/functions\/.*?\.js$/) )
  {
      console.log('Module to be used not defined properly in json file\n' +
                  'Make sure you use this declaration: ./functions/FileName.js\n')
      return process.exit()
  }
  else if(!fs.existsSync(modulepath))
  {
    console.log(`Module  '${modulepath}' does not exist`)
    return process.exit()
  }
  else
  {
    console.log(`Using module: '${modulepath}'`)
    return modulepath
  }
}

module.exports = {moduleValidator}
