const dbconf = () => {
  //MONGODB_URI will be a dockerfile env variable
  return process.env.MONGODB_URI ? {
                                     DATABASE: process.env.MONGODB_URI,
                                     MODE: 'production'
                                   }
                                 : {
                                     DATABASE: 'mongodb://localhost:27017/jobsite',
                                     MODE: 'dev'
                                   }
}

module.exports = { dbconf }
