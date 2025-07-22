const winston = require('winston')
const dailyRotateFile = require('winston-daily-rotate-file')
const path = require('path')

logPath = path.join(__dirname, '..', '..', 'logs')

const outputTransport = new dailyRotateFile({
    filename : `${logPath}/Info_%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    maxFiles: '10d',
    maxSize: '10m',
    level: 'info'
})

const errorTransport = new dailyRotateFile({
    filename : `${logPath}/Error_%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    maxFiles: '10d',
    maxSize: '10m',
    level: 'error'
})

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports:[
        errorTransport,
        outputTransport,
        new winston.transports.Console()
    ],
})

module.exports = logger