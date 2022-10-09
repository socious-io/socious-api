import winston from 'winston';
import newrelicFormatter from '@newrelic/winston-enricher';

const newrelicWinstonFormatter = newrelicFormatter(winston);

const logger = winston.createLogger({
  level: 'info',
  format: newrelicWinstonFormatter(),
  transports: [new winston.transports.Console()],
});

export const koaLogger = async (ctx, next) => {
  const start = new Date();

  ctx.logger = logger;

  await next();

  const ms = new Date() - start;

  let msg = `${ctx.method} | ${ctx.originalUrl} | ${ctx.status} | ${ms}ms`;

  let logLevel;
  if (ctx.status >= 500) {
    msg += ` | ${JSON.stringify(ctx.body)}`;
    logLevel = 'error';
  }
  if (ctx.status >= 400) {
    msg += ` | ${JSON.stringify(ctx.body)}`;
    logLevel = 'warn';
  }
  if (ctx.status >= 100) {
    logLevel = 'info';
  }

  logger.log(logLevel, msg);
};

export default logger;
