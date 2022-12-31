// const winston = require('winston');
const { createLogger, format, transports} = require('winston');
const { combine, timestamp } = format

// const logger = winston.createLogger({
const logger = createLogger({
// module.exports = winston.createLogger({
  // level: 'info',
  format: combine( 
    // winston.format.json(),
    format.json(),
    timestamp()
  ),
  // defaultMeta: { service: 'user-service' },
  transports: [
    // new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    // new winston.transports.File({ filename: 'logs/combined.log' }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
});

// const logger = {
module.exports = {
  error( message ){
    logger.log({
      dt: new Date.now(),
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

// module.exports = new winston.transports.Console({
//   format: winston.format.simple(),
// })