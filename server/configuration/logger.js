const winston = require('winston')
const { combine, timestamp, label, printf } = winston.format

const logformat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`
})

const logger = winston.createLogger({
  level: 'info',
  format: combine(
            label({ label: 'Express' }),
            timestamp(),
            logformat
          ),
  defaultMeta: { service: 'Express' },
  transports: [
    new winston.transports.File({ filename: './log/error.log', level: 'error' }),
    new winston.transports.File({ filename: './log/debug.log' })
  ]
})

/*format: winston.format.json() would make sense if we wanted to consume the logs in e.g kibana
this would enable us to properly search the logs by using
filtering (log level, message keyword search, service etc)
*/

module.exports = { logger }
