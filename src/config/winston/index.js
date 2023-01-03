const { createLogger, transports, format } = require('winston')
const { combine, timestamp, printf } = format

const loggers = [
  'error',
  'player',
]

const logger = level => {
  return createLogger({
    format: combine( 
      timestamp(),
      printf(({ message, timestamp }) => {
        return `[ ${timestamp.replace(/([T,Z])/g, " ")}]: ${message}`;
      })
    ),
    transports: [
      new transports.File({ filename: 'logs/'+ level +'.log', level }),
    ],
  })
}

const configLoggers = {}
loggers.forEach( level => {
  configLoggers[level] = message => {
    logger(level).log({ level, message })
  }
})

module.exports = configLoggers