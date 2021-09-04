const dbconf = () => {
  //MONGODB_URI will be a dockerfile env variable
  return process.env.NODE_ENV === 'production'
    ? {
        DATABASE: `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@mongodb:27017/jobsite?authSource=admin`,
        MODE: 'production',
        SSO: 'ldap://<host:port>',
        SECRET: process.env.SECRET,
      }
    : {
        DATABASE: 'mongodb://mongodb:27017/jobsite',
        MODE: 'dev',
        SSO: 'ldap://localhost:3002',
        SECRET: 'dev_env_testpass123',
      }
}

module.exports = { dbconf }
