const { createLogger, format, transports} = require('winston');
const { combine, timestamp, printf } = format

const logger = createLogger({
  format: combine( 
    timestamp(),
    printf(({ level, message, label, timestamp }) => {
      return `[ ${timestamp.replace(/([T,Z])/g, " ")}]: ${message}`;
    })
  ),
  transports: [
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/info.log', level: 'info' }),
  ],
});

module.exports = {
  error( message ){
    logger.log({
      level: 'error',
      message
    })    
  },
  info( message ){
    logger.log({
      level: 'info',
      message
    })
  },
  log( message ){
    logger.log({
      level: 'debug',
      message
    })
  },
}