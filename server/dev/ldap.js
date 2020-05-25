const ldap     = require('ldapjs')
const {logger} = require('../configuration/logger')

const server = ldap.createServer()
const port   = process.env.PORT || 3002

server.search('dc=example', function(req, res, next) {
  const obj = {
    dn: req.dn.toString(),
    attributes: {
      objectclass: ['organization', 'top'],
      o: 'example'
    }
  }

  if (req.filter.matches(obj.attributes))
  res.send(obj)

  res.end()
})

server.bind('cn=root', function(req, res, next) {
  if (req.dn.toString() !== 'cn=root' || req.credentials !== 'secret')
    return next(new ldap.InvalidCredentialsError())

  res.end()
  return next()
})

function authorize(req, res, next) {
  if (!req.connection.ldap.bindDN.equals('cn=root'))
    return next(new ldap.InsufficientAccessRightsError())

  return next()
}

server.listen(port, () => {
  console.log(`ldapjs listening at ${server.url}`)
  logger.info(`ldapjs listening at ${server.url}`)
})
