const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize, json } = format;
const dailyRotateFile = require('winston-daily-rotate-file')
const path = require('path')

logPath = path.join(__dirname, '..', '..', 'logs')

// Define format for console output
const consoleFormat = combine(
  colorize(),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
);

// Define format for file output
const fileFormat = combine(
  timestamp(),
  json()
);

// Create transports
const outputTransport = new dailyRotateFile({
  filename: `${logPath}/Info_%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  maxFiles: '10d',
  maxSize: '10m',
  level: 'info',
  format: fileFormat, // Apply file format
});

const errorTransport = new dailyRotateFile({
  filename: `${logPath}/Error_%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  maxFiles: '10d',
  maxSize: '10m',
  level: 'error',
  format: fileFormat, // Apply file format
});

const consoleTransport = new transports.Console({
  format: consoleFormat, // Apply console format
});

// Create the logger
const logger = createLogger({
  level: 'info', // Minimum level to log
  transports: [
    errorTransport,
    outputTransport,
    consoleTransport,
  ],
});

module.exports = logger