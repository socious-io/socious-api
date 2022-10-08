import Config from '../config.js'
import winston from 'winston'

import newrelicFormatter from '@newrelic/winston-enricher'

const newrelicWinstonFormatter = newrelicFormatter(winston)



const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.label({label: 'test'}),
    newrelicWinstonFormatter()
  ),
  transports: [
    new winston.transports.Console()
  ],
});



export const koaLogger = async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;

    let logLevel;
    if (ctx.status >= 500) {
      logLevel = 'error';
    }
    if (ctx.status >= 400) {
      logLevel = 'warn';
    }
    if (ctx.status >= 100) {
      logLevel = 'info';
    }

    let msg = (`${ctx.method} | ${ctx.originalUrl} | ${ctx.status} | ${ms}ms`);

    logger.log(logLevel, msg);
};


export default logger
