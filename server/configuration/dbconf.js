const dbconf = () => {
  //MONGODB_URI will be a dockerfile env variable
  return process.env.MONGODB_URI ? {
                                     DATABASE: process.env.MONGODB_URI,
                                     MODE: 'production',
                                     LDAP: 'ldap://<host:port>',
                                     SECRET: process.env.SECRET
                                   }
                                 : {
                                     DATABASE: 'mongodb://localhost:27017/jobsite',
                                     MODE: 'dev',
                                     LDAP: 'ldap://localhost:3002',
                                     SECRET: 'dev_env_testpass123'
                                   }
}

module.exports = { dbconf }
