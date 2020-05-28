const ldap     = require('ldapjs')
const {logger} = require('../configuration/logger')

const server = ldap.createServer()
const port   = process.env.PORT || 3002

server.search('o=example', (req, res, next) => {
  var obj = {
    dn: req.dn.toString(),
    attributes: {
      objectclass: ['organization', 'top'],
      o: 'example',
      mail: 'dummyuser@gmail.com'
    }
  }

  if (req.filter.matches(obj.attributes)) res.send(obj)

  res.end()
})

server.listen(port, () => {
  console.log(`ldapjs listening at ${server.url}`)
  logger.info(`ldapjs listening at ${server.url}`)
})
