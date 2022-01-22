import winston from 'winston';
import winstonDailyRotateFile from 'winston-daily-rotate-file';


class logger{
    
    static getLogger(){
        var transport = new winston.transports.DailyRotateFile({
            filename: './logs/%DATE%.log',
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: false,
            maxSize: '20m',
            maxFiles: '14d'
        });

        transport.on('rotate', function(oldFilename, newFilename) {
            // do something fun
            newFilename = "1_"+newFilename;
        });

        var winstonLogger = winston.createLogger({
            transports: [
              new winston.transports.Console(),
              transport
            ]
        });

        return winstonLogger;
    }
}


export default logger;