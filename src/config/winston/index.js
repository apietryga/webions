const winston = require('winston');
// const logger = winston.createLogger({
module.exports = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
  // log( val ){
  //   new winston.transports.Console({
  //     format: winston.format.simple(),
  //   })
  // }
});

// module.exports = new winston.transports.Console({
//   format: winston.format.simple(),
// })