const winston = require('winston')
const { combine, timestamp, label, printf } = winston.format

const logformat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`
})

/*keep ALL errors in the debug.log(non fatal + fatal) file
fatal errors in the error.log file, for easier inspection & debug
*/
const logger = winston.createLogger({
  level: 'info',
  format: combine(
            label({ label: 'Scraper' }),
            timestamp(),
            logformat
          ),
  defaultMeta: { service: 'Scraper' },
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
