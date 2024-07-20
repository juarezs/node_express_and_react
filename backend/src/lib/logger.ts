import winston from 'winston';

const transports = [];
if (process.env.NODE_ENV === 'production') {
  transports.push(...[
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'info.log' }),
  ]);
} else {
  transports.push(...[
    new winston.transports.Console()
  ]);
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'sp-backend' },
  transports: transports,
});


export const logDebug = logger.debug.bind(logger);

export const logInfo = logger.info.bind(logger);

export const logError = logger.error.bind(logger);

export const logWarn = logger.warn.bind(logger);
