const express      = require('express')
const mongoose     = require('mongoose')
const dbconf       = require('./configuration/dbconf').dbconf()
const bodyParser   = require('body-parser')
const cookieParser = require('cookie-parser')

mongoose.Promise = global.Promise
mongoose.connect(dbconf.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true })

const port = process.env.PORT || 3001
const app  = express()

app.use(bodyParser.json())
app.use(cookieParser())


app.listen(port, () => {
  console.log(`API is up in port ${port}, running in ${dbconf.MODE} mode`)
})
