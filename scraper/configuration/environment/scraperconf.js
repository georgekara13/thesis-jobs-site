const scraperConf = () => {
  //MONGODB_URI will be a dockerfile env variable
  return process.env.MODE == 'production' ? {
                                              HOST: process.env.HOST,
                                              SECRET: process.env.SECRET
                                            }
                                          : {
                                              HOST: 'http://localhost:3001',
                                              SECRET: 'dev_env_testpass123'
                                            }
}

module.exports = { scraperConf }
