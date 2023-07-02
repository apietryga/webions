const { createLogger, transports, format } = require('winston')
const { combine, timestamp, printf } = format

const loggers = [
  'error',
  'player',
  'log',
]

const logger = (level:string) => {
  return createLogger({
    format: combine( 
      timestamp(),
      printf(({ message, timestamp }: any) => {
        return `[ ${timestamp.replace(/([T,Z])/g, " ")}]: ${message}`;
      })
    ),
    transports: [
      new transports.File({ filename: 'logs/'+ level +'.log', level: 'info' }),
    ],
  })
}

const configLoggers:any = {}
loggers.forEach( level => {
  configLoggers[level] = (message: string) => {
    logger(level).log({ level: 'info', message })
  }
})

// module.exports = configLoggers

export default configLoggers